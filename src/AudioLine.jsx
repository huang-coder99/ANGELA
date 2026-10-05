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
  let width=0,height=48,frame,last=0,visible=false;
  const data=new Uint8Array(2048);
  const resize=()=>{width=el.clientWidth;const ratio=Math.min(window.devicePixelRatio||1,1.5);el.width=width*ratio;el.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);sync()};
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const isActive=()=>visible&&!document.hidden&&audio.current?.context.state==='running'&&video.current&&!video.current.paused&&!video.current.muted&&!video.current.ended&&!reduced.matches;
  const draw=(now=0)=>{
   frame=0;if(isActive()&&now-last<33){frame=requestAnimationFrame(draw);return}last=now;
   ctx.clearRect(0,0,width,height);
   const active=isActive();
   if(active)audio.current.analyser.getByteTimeDomainData(data);
   ctx.beginPath();
   for(let i=0;i<=400;i++){
    const x=i/400*width;
    const sample=active?(data[Math.floor(i/400*(data.length-1))]-128)/128:0;
    const envelope=Math.sin(Math.PI*i/400);
    const y=height/2+sample*height*.46*envelope;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   }
   ctx.strokeStyle='#64b5ff';ctx.lineWidth=1.5;ctx.shadowColor='#409fff';ctx.shadowBlur=active?8:3;ctx.stroke();ctx.shadowBlur=0;
   if(active)frame=requestAnimationFrame(draw);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;draw()};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});visibility.observe(el);
  const player=video.current,events=['play','pause','ended','volumechange','seeked','audio-ready'];events.forEach(event=>player.addEventListener(event,sync));
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  draw();return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();events.forEach(event=>player.removeEventListener(event,sync));document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync)};
 },[video,audio]);
 return <canvas ref={canvas} className="audio-line" aria-hidden="true"/>;
}
