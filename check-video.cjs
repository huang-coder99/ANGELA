const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/64177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),results=[];
 try {
  for(const file of ['hero.mp4','hero-desktop.mp4','hero-mobile.mp4'].filter(file=>fs.existsSync('public/assets/'+file))){
   const context=await browser.newContext(),page=await context.newPage();
   await page.goto('http://127.0.0.1:5177/');await page.setContent('<body></body>');
   const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:80,downloadThroughput:625000,uploadThroughput:625000});
   const result=await page.evaluate(async file=>{
    const v=document.createElement('video');v.muted=true;v.preload='auto';v.playsInline=true;let waits=0,waitMs=0,waitingAt=0,started=false;
    v.addEventListener('waiting',()=>{if(started){waits++;waitingAt=performance.now()}});v.addEventListener('playing',()=>{if(waitingAt){waitMs+=performance.now()-waitingAt;waitingAt=0}});
    const begin=performance.now();v.src='/assets/'+file;document.body.append(v);
    await new Promise((resolve,reject)=>{v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',()=>reject(Error('Video error')),{once:true});setTimeout(()=>reject(Error('First frame timeout')),25000)});
    const firstFrameMs=performance.now()-begin;await v.play();started=true;await new Promise(r=>setTimeout(r,8000));
    const q=v.getVideoPlaybackQuality();if(waitingAt)waitMs+=performance.now()-waitingAt;
    return {file,firstFrameMs:Math.round(firstFrameMs),width:v.videoWidth,height:v.videoHeight,duration:v.duration,waits,waitMs:Math.round(waitMs),frames:q.totalVideoFrames,dropped:q.droppedVideoFrames};
   },file);results.push(result);console.log(result);await context.close();
  }
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:960}}),requested=[];page.on('request',r=>{if(r.url().endsWith('.mp4'))requested.push(r.url())});
   await page.goto('http://127.0.0.1:5177/#home');await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
   const expected=width<=700?'hero-mobile.mp4':'hero-desktop.mp4';assert(requested.every(url=>url.endsWith(expected)));
   await page.setViewportSize({width:width===390?1440:390,height:960});assert((await page.locator('video').evaluate(v=>v.currentSrc)).endsWith(expected));
   const range=await page.request.get('http://127.0.0.1:5177/assets/'+expected,{headers:{Range:'bytes=0-1023'}});assert.equal(range.status(),206);assert.equal((await range.body()).length,1024);
   console.log({width,expected,range:range.status(),stableOnResize:true});await page.close();
  }
  fs.writeFileSync('.video-work/benchmark.json',JSON.stringify(results,null,2));
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
