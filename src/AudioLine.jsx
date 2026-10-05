import React,{useEffect,useRef} from 'react';

export function prepareAudio(player, audio){
 if(!audio.current){
  const Context=window.AudioContext||window.webkitAudioContext;
  if(!Context)return;
  const context=new Context();
  const source=context.createMediaElementSource(player);
  const analyser=context.createAnalyser();
  analyser.fftSize=2048;
  source.connect(analyser);analyser.connect(context.destination);
  audio.current={context,analyser};
 }
 if(audio.current.context.state==='suspended')audio.current.context.resume().then(()=>player.dispatchEvent(new Event('audio-ready'))).catch(()=>{});
}

export default function AudioLine({video,audio}){
 const canvas=useRef(null);
 useEffect(()=>{
  const el=canvas.current,ctx=el.getContext('2d');
  let width=0,height=90,frame,last=0,visible=false,levels=new Float32Array(0),gradient;
  const data=new Uint8Array(1024);
  const resize=()=>{
   width=el.clientWidth;height=el.clientHeight;
   const ratio=Math.min(window.devicePixelRatio||1,1.5);
   el.width=Math.round(width*ratio);el.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
   levels=new Float32Array(Math.max(1,Math.min(width<=700?64:160,Math.floor(width/8))));
   gradient=ctx.createLinearGradient(0,height,0,0);gradient.addColorStop(0,'#409fff');gradient.addColorStop(.55,'#65d6e5');gradient.addColorStop(1,'#b0f4ee');sync();
  };
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const isActive=()=>visible&&!document.hidden&&audio.current?.context.state==='running'&&video.current&&!video.current.paused&&!video.current.muted&&!video.current.ended&&!reduced.matches;
  const draw=(now=0)=>{
   frame=0;if(isActive()&&now-last<33){frame=requestAnimationFrame(draw);return}last=now;
   ctx.clearRect(0,0,width,height);
   const active=isActive();
   if(active)audio.current.analyser.getByteFrequencyData(data);
   const baseline=height-4,step=width/levels.length,barWidth=Math.max(1,step*.52);
   const binHz=(audio.current?.context.sampleRate||48000)/2048;
   const maxHz=Math.min(16000,binHz*(data.length-1));
   ctx.fillStyle=gradient;ctx.shadowColor='#58c8ed';ctx.shadowBlur=active?5:2;
   for(let i=0;i<levels.length;i++){
    let target=0;
    if(active){
     const band=Math.floor(Math.abs(i-(levels.length-1)/2)),bandCount=Math.ceil(levels.length/2);
     const low=40*Math.pow(maxHz/40,band/bandCount),high=40*Math.pow(maxHz/40,(band+1)/bandCount);
     const start=Math.max(1,Math.floor(low/binHz)),end=Math.min(data.length,Math.max(start+1,Math.ceil(high/binHz)));
     let peak=0,sum=0;for(let bin=start;bin<end;bin++){sum+=data[bin];peak=Math.max(peak,data[bin])}
     const envelope=Math.pow(Math.max(0,1-Math.abs(2*i/Math.max(1,levels.length-1)-1)),.7);
     target=Math.pow((peak*.6+sum/(end-start)*.4)/255,1.65)*(.08+.92*envelope);
    }
    const smoothing=target>levels[i] ? .72 : .16;
    levels[i]=active ? levels[i]+(target-levels[i])*smoothing : 0;
    const barHeight=3+levels[i]*((height-9)/2-3);
    ctx.fillRect(i*step+(step-barWidth)/2,baseline-barHeight,barWidth,barHeight);
   }
   ctx.shadowBlur=0;
   if(active)frame=requestAnimationFrame(draw);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;draw(performance.now())};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});visibility.observe(el);
  const player=video.current,events=['play','pause','ended','volumechange','seeked','audio-ready'];events.forEach(event=>player.addEventListener(event,sync));
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  draw();return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();events.forEach(event=>player.removeEventListener(event,sync));document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync)};
 },[video,audio]);
 return <canvas ref={canvas} className="audio-line" aria-hidden="true"/>;
}
