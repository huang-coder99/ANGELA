import React, {useEffect,useRef,useState} from 'react';
import {Renderer,Program,Mesh,Triangle} from 'ogl';
import {vertex,fragment,prepColors,hexToRGB} from './LightfallShader';
const COLORS=['#A6C8FF','#328BFF','#45C2F0'];
export default function Lightfall({interactionRef,paused=false}){
 const host=useRef(null),pauseRef=useRef(paused),wakeRef=useRef(()=>{}); const [fallback,setFallback]=useState(false);
 useEffect(()=>{pauseRef.current=paused;wakeRef.current();},[paused]);
 useEffect(()=>{
  const container=host.current,owner=interactionRef?.current||container;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),pointer=matchMedia('(hover:hover) and (pointer:fine)');
  let renderer,program,geometry,raf=0,visible=false,last=0,elapsed=0,rendered=0,disposed=false,failed=false;
  let ro,io,gl,canvas; const target=[0,0];
  const stop=()=>{cancelAnimationFrame(raf);raf=0;last=0;};
  const fail=()=>{failed=true;stop();setFallback(true);};
  const eligible=()=>!disposed&&!failed&&visible&&!document.hidden&&!pauseRef.current;
  let uniforms,mesh;
  const frame=t=>{raf=0;if(!eligible())return;if(!last)last=t;const dt=Math.min((t-last)/1000,.1);if(t-last<1000/30-1){raf=requestAnimationFrame(frame);return;}last=t;elapsed+=dt;uniforms.iTime.value=elapsed;const f=1-Math.exp(-dt/.15);for(let i=0;i<2;i++)uniforms.iMouse.value[i]+=(target[i]-uniforms.iMouse.value[i])*f;
   try{renderer.render({scene:mesh});container.dataset.frames=String(++rendered);}catch{fail();return;}
   if(!reduced.matches)raf=requestAnimationFrame(frame);
  };
  const wake=()=>{if(!eligible()){stop();return;}if(!raf&&(!reduced.matches||!rendered))raf=requestAnimationFrame(frame);};wakeRef.current=wake;
  const onLost=e=>{e.preventDefault();fail();};
  const move=e=>{if(!pointer.matches||reduced.matches)return;const r=container.getBoundingClientRect();target[0]=(e.clientX-r.left)*renderer.dpr;target[1]=(r.height-e.clientY+r.top)*renderer.dpr;};
  const change=()=>{if(uniforms)uniforms.uMouseEnabled.value=pointer.matches&&!reduced.matches?1:0;if(reduced.matches){stop();rendered=0;}wake();};
  try{
   renderer=new Renderer({dpr:Math.min(devicePixelRatio||1,innerWidth<=700?1:1.5),alpha:true,antialias:false});gl=renderer.gl;canvas=gl.canvas;container.appendChild(canvas);
   const {arr,count,avg}=prepColors(COLORS);
   uniforms={iResolution:{value:[1,1,1]},iMouse:{value:[0,0]},iTime:{value:0},uColorCount:{value:count},uBgColor:{value:hexToRGB('#efc339')},uMouseColor:{value:avg}};
   arr.forEach((c,i)=>uniforms['uColor'+i]={value:c});
   Object.entries({uSpeed:.7,uStreakCount:1,uStreakWidth:1,uStreakLength:1,uGlow:1,uDensity:.4,uTwinkle:.6,uZoom:2,uBgGlow:2.9,uOpacity:1,uMouseEnabled:pointer.matches&&!reduced.matches?1:0,uMouseStrength:.9,uMouseRadius:2,uLightMode:0}).forEach(([k,v])=>uniforms[k]={value:v});
   program=new Program(gl,{vertex,fragment,uniforms});geometry=new Triangle(gl);mesh=new Mesh(gl,{geometry,program});
   if(!gl.getProgramParameter(program.program,gl.LINK_STATUS))throw Error('Lightfall shader unavailable');
   const resize=()=>{renderer.dpr=Math.min(devicePixelRatio||1,innerWidth<=700?1:1.5);const r=container.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height));uniforms.iResolution.value=[gl.drawingBufferWidth,gl.drawingBufferHeight,1];if(reduced.matches)rendered=0;wake();};
   ro=new ResizeObserver(resize);ro.observe(container);resize();
   io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();});io.observe(owner);
   canvas.addEventListener('webglcontextlost',onLost);owner.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',wake);reduced.addEventListener('change',change);pointer.addEventListener('change',change);
  }catch{fail();}
  return()=>{disposed=true;stop();wakeRef.current=()=>{};ro?.disconnect();io?.disconnect();document.removeEventListener('visibilitychange',wake);reduced.removeEventListener('change',change);pointer.removeEventListener('change',change);owner.removeEventListener('pointermove',move);canvas?.removeEventListener('webglcontextlost',onLost);program?.remove();geometry?.remove();gl?.getExtension('WEBGL_lose_context')?.loseContext();canvas?.remove();};
 },[interactionRef]);
 return <div ref={host} className="lightfall-background" data-fallback={fallback?'true':undefined} aria-hidden="true"/>;
}
