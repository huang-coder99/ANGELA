import {useLayoutEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './motion.css';
gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion(){
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const opening=document.querySelector('.opening');
   if(window.scrollY>80||location.hash){gsap.set(opening,{display:'none'})}
   else{
    const openingTimeline=gsap.timeline({defaults:{ease:'power4.inOut'},onComplete:()=>gsap.set(opening,{display:'none'})})
     .fromTo('.opening-letter',{yPercent:125,scaleX:.48,scaleY:1.4,rotation:5},{yPercent:0,scaleX:1,scaleY:1,rotation:0,duration:1.65,stagger:.09},.12)
     .fromTo('.opening-caption',{y:28,opacity:0},{y:0,opacity:1,duration:.8},.9)
     .to('.opening-letter',{yPercent:-125,duration:1.2,stagger:.045},2.4)
     .to('.opening',{clipPath:'inset(0 0 100% 0)',duration:1.7},2.6)
     .fromTo('.nav:not(.nav-floating) .brand,.nav:not(.nav-floating) .nav-links>a',{y:-34,opacity:0},{y:0,opacity:1,duration:1,stagger:.1,clearProps:'transform,opacity'},3)
     .fromTo('.hero-bottom',{y:45,opacity:0},{y:0,opacity:1,duration:1.2,clearProps:'transform,opacity'},3.3);
    if(!window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches){
     openingTimeline.fromTo('.hero-media',{scale:1.12},{scale:1,duration:2.3,ease:'power3.out',clearProps:'transform'},2.6);
    }
   }
   const reveal=(target,trigger,delay=0)=>gsap.fromTo(target,{y:95,scale:.96,clipPath:'inset(0 0 100% 0)'},{y:0,scale:1,clipPath:'inset(0 0 0% 0)',duration:1.55,delay,ease:'power4.out',clearProps:'transform,clipPath',scrollTrigger:{trigger,start:'top 88%',once:true}});
   document.querySelectorAll('.post-hero > section').forEach(section=>{
    const title=section.querySelector('.motion-title');
    gsap.fromTo(title.querySelectorAll('span'),{yPercent:115,x:-60,scaleX:.65,rotation:3},{yPercent:0,x:0,scaleX:1,rotation:0,duration:1.65,stagger:.055,ease:'power4.out',scrollTrigger:{trigger:title,start:'top 88%',once:true}});
    const heading=section.querySelector('.section-heading')||section.querySelector('.about-copy h2');
    if(heading)reveal(heading,heading,.15);
   });
   reveal('.portrait-glow','.portrait-glow',.3);
   reveal('.about-tech-title','.about-tech-title',.15);
   gsap.from('.about-copy>p,.stats>div,.timeline>article',{y:55,duration:1.3,stagger:.17,ease:'power3.out',scrollTrigger:{trigger:'.about-copy h2',start:'top 85%',once:true},clearProps:'transform'});
   document.querySelectorAll('.project').forEach(project=>{
    reveal(project.querySelector('.project-glow'),project,.12);
    gsap.from(project.querySelectorAll('.project-info>div'),{y:45,duration:1.2,stagger:.15,ease:'power3.out',scrollTrigger:{trigger:project,start:'top 75%',once:true},clearProps:'transform'});
   });
   gsap.fromTo('.capability-glow',{y:110,scale:.92,clipPath:'inset(0 0 100% 0)'},{y:0,scale:1,clipPath:'inset(0 0 0% 0)',duration:1.5,stagger:.2,ease:'power4.out',clearProps:'transform,clipPath',scrollTrigger:{trigger:'.capabilities',start:'top 85%',once:true}});
   reveal('.contact-body h2','.contact-body h2',.18);
   reveal('.contact-details','.contact-body h2',.5);
   const parallax=gsap.matchMedia();
   parallax.add('(min-width: 900px)',()=>{
    document.querySelectorAll('.project-image img,.portrait-image').forEach(img=>{
     gsap.fromTo(img,{yPercent:-4,scale:1.12},{yPercent:4,scale:1.12,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1.4}});
    });
   });
   let alive=true;
   const refresh=()=>{if(alive)ScrollTrigger.refresh()};document.fonts?.ready.then(refresh);window.addEventListener('load',refresh);
   return()=>{alive=false;parallax.revert();window.removeEventListener('load',refresh)};
  });
  return()=>media.revert();
 },[]);
}

export function titleLetters(text){return Array.from(text)}
