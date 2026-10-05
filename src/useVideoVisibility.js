import {useEffect} from 'react';
export default function useVideoVisibility(video){
 useEffect(()=>{
  const player=video.current;
  let visible=true,autoPaused=false;
  const sync=()=>{
   const shouldPause=document.hidden||(!visible&&player.muted);
   if(shouldPause&&!player.paused){autoPaused=true;player.pause()}
   else if(!shouldPause&&autoPaused&&!player.ended){autoPaused=false;player.play().catch(()=>{})}
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});observer.observe(document.getElementById('home'));
  document.addEventListener('visibilitychange',sync);player.addEventListener('volumechange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);player.removeEventListener('volumechange',sync)};
 },[video]);
}
