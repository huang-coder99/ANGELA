import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import './image-gallery.css';
const CircularCarousel = lazy(()=>import('./CircularCarousel'));
const Lightfall = lazy(()=>import('./Lightfall'));
const items=Array.from({length:10},(_,i)=>({src:`/assets/gallery/image-${String(i+1).padStart(2,'0')}.webp`,alt:`图片档案 ${i+1}`,title:`视觉档案 / ${String(i+1).padStart(2,'0')}`}));
export default function ImageGallery(){
 const host=useRef(null); const [ready,setReady]=useState(false); const [cardWidth,setCardWidth]=useState(()=>Math.min(560,window.innerWidth-48));
 useEffect(()=>{const resize=()=>setCardWidth(Math.min(560,window.innerWidth-48));window.addEventListener('resize',resize,{passive:true});return()=>window.removeEventListener('resize',resize);},[]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setReady(true);observer.disconnect();}},{rootMargin:'300px'});observer.observe(host.current);return()=>observer.disconnect();},[]);
 return <section id="gallery" className="image-gallery section" ref={host}>
  {ready&&<Suspense fallback={null}><Lightfall interactionRef={host}/></Suspense>}
  <div className="container"><div className="section-label"><span>05 / VISUAL ARCHIVE</span><span>图片档案</span></div><div className="motion-title" aria-label="VISUAL ARCHIVE">{Array.from('VISUAL ARCHIVE').map((c,i)=><span key={i} aria-hidden="true">{c}</span>)}</div><p className="gallery-hint">顺时针连续轮播 · 图片档案</p></div>
  <div className="gallery-stage">{ready&&<Suspense fallback={<p className="gallery-loading">图片载入中…</p>}><CircularCarousel items={items} preset="panorama" intro="none" cardWidth={cardWidth} aspectRatio={16/9} gap={0} speed={6} direction="right" captions tilt={0} perspective={1800} draggable={false} focusOnClick={false} pauseOnHover={false} momentum={0} snap={false} parallax={0} stretch={0} depthFade={0} innerShade={0} fadeColor="#0b0d10" cornerRadius={0}/></Suspense>}</div>
 </section>;
}
