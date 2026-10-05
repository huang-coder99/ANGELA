const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/64177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  for(const [width,height] of [[360,640],[390,844],[430,932],[360,480]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:true});page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:5175/#home');await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
   const check=()=>page.evaluate(()=>{
    const v=document.querySelector('video'),hero=document.querySelector('.hero'),canvas=document.querySelector('.audio-line');
    const r=v.getBoundingClientRect(),h=hero.getBoundingClientRect(),c=canvas.getBoundingClientRect();
    const fit=Math.min(r.width/v.videoWidth,r.height/v.videoHeight),picture={top:r.top+(r.height-v.videoHeight*fit)/2,bottom:r.top+(r.height+v.videoHeight*fit)/2};
    return {heroHeight:h.height,fit:getComputedStyle(v).objectFit,transform:getComputedStyle(v).transform,picture,canvasTop:c.top,overflow:document.documentElement.scrollWidth>innerWidth,
     controls:[...document.querySelectorAll('.media-controls button')].map(b=>{const r=b.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}}),navBottom:document.querySelector('header').getBoundingClientRect().bottom};
   });
   const result=await check();assert.equal(result.heroHeight,height);assert.equal(result.fit,'contain');assert.equal(result.transform,'none');assert(!result.overflow);
   assert(result.picture.top>=result.navBottom&&result.picture.bottom<=result.canvasTop);
   for(const r of result.controls)assert(r.bottom<=height&&r.left>=0&&r.right<=width);
   await page.getByRole('button',{name:'切换导航'}).click();assert(await page.getByRole('link',{name:'关于我',exact:true}).isVisible());await page.getByRole('button',{name:'切换导航'}).click();
   await page.getByRole('button',{name:'开启音乐'}).click();await page.locator('video').evaluate(v=>{v.currentTime=40});await page.waitForTimeout(400);
   assert(await page.locator('video').evaluate(v=>!v.muted&&!v.paused));
   if(width===390)await page.screenshot({path:'.video-work/mobile-full-video.png'});
   await page.locator('video').evaluate(v=>{v.currentTime=v.duration-.1});await page.getByRole('button',{name:'再播放一次'}).waitFor();await page.waitForTimeout(900);
   const message=await page.locator('.hero-end-message').boundingBox();assert(message.y>=result.navBottom&&message.y+message.height<=result.canvasTop);
   await page.getByRole('button',{name:'再播放一次'}).click();assert(await page.locator('video').evaluate(v=>v.currentTime<2&&!v.muted&&!v.paused));
   await page.setViewportSize({width:844,height:390});assert.equal(await page.locator('video').evaluate(v=>getComputedStyle(v).objectFit),'cover');assert.equal(await page.locator('.hero').evaluate(h=>h.getBoundingClientRect().height),390);
   await page.setViewportSize({width,height});assert.equal((await check()).fit,'contain');console.log({width,height,result});await page.close();
  }
  const opening=await browser.newPage({viewport:{width:390,height:844}});await opening.goto('http://127.0.0.1:5175/');await opening.waitForTimeout(3100);
  assert.equal(await opening.locator('.hero-media').evaluate(e=>getComputedStyle(e).transform),'none');await opening.close();assert.deepEqual(errors,[]);console.log('Mobile checks passed; no runtime errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
