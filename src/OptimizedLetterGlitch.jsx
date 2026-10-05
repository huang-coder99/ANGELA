import React,{useEffect,useRef} from 'react';
export default function LetterGlitch({glitchColors=['#18344c','#000000','#61b3dc'],className='',glitchSpeed=80,centerVignette=false,outerVignette=true,smooth=true,characters='ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'}){
 const canvasRef=useRef(null),paletteKey=glitchColors.join(',');
 useEffect(()=>{
  const canvas=canvasRef.current,ctx=canvas.getContext('2d',{alpha:false});
  const colors=paletteKey.split(',').map(hex=>{const n=parseInt(hex.replace('#',''),16);return [(n>>16)&255,(n>>8)&255,n&255]});
  const chars=Array.from(characters),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let cells=[],pending=new Set(),columns=0,width=0,height=0,frame=0,last=0,lastGlitch=0,visible=false;
  const randomColor=()=>colors[Math.floor(Math.random()*colors.length)];
  const randomChar=()=>chars[Math.floor(Math.random()*chars.length)];
  const paintCell=i=>{const c=cells[i],x=i%columns*12,y=Math.floor(i/columns)*22;ctx.fillStyle='#000';ctx.fillRect(x,y,12,22);ctx.fillStyle=`rgb(${c.rgb.join(',')})`;ctx.fillText(c.char,x,y)};
  const resize=()=>{width=canvas.parentElement.clientWidth;height=canvas.parentElement.clientHeight;const dpr=Math.min(devicePixelRatio||1,innerWidth<700?1:1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.font='16px monospace';ctx.textBaseline='top';ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);columns=Math.ceil(width/12);cells=Array.from({length:columns*Math.ceil(height/22)},()=>({char:randomChar(),rgb:randomColor(),from:null,to:null,progress:1}));pending.clear();cells.forEach((_,i)=>paintCell(i))};
  const tick=now=>{frame=0;if(!visible||document.hidden||reduced.matches)return;if(now-last>=33){last=now;if(now-lastGlitch>=glitchSpeed){lastGlitch=now;for(let n=0;n<Math.max(1,cells.length*.035);n++){const i=Math.floor(Math.random()*cells.length),c=cells[i];c.char=randomChar();c.from=c.rgb;c.to=randomColor();c.progress=smooth?0:1;if(!smooth)c.rgb=c.to;pending.add(i)}}for(const i of pending){const c=cells[i];if(c.progress<1){c.progress=Math.min(1,c.progress+.1);c.rgb=c.from.map((v,n)=>Math.round(v+(c.to[n]-v)*c.progress))}paintCell(i);if(c.progress>=1)pending.delete(i)}}frame=requestAnimationFrame(tick)};
  const sync=()=>{cancelAnimationFrame(frame);frame=0;if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick)};
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()});observer.observe(canvas);
  const sizeObserver=new ResizeObserver(()=>{resize();sync()});sizeObserver.observe(canvas.parentElement);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);resize();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();sizeObserver.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync)};
 },[paletteKey,glitchSpeed,smooth,characters]);
 const vignette=center=>({position:'absolute',inset:0,pointerEvents:'none',background:center?'radial-gradient(circle,#000c,transparent 60%)':'radial-gradient(circle,transparent 60%,#000 100%)'});
 return <div className={className} style={{position:'relative',width:'100%',height:'100%',background:'#000',overflow:'hidden'}}><canvas ref={canvasRef} style={{display:'block',width:'100%',height:'100%'}}/>{outerVignette&&<div style={vignette(false)}/ >}{centerVignette&&<div style={vignette(true)}/>}</div>;
}
