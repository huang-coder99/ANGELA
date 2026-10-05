const assert = require('node:assert/strict');
const {chromium} = require('C:/Users/64177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:960}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.spectrumDraws=0;
   const fill=CanvasRenderingContext2D.prototype.fillRect;
   CanvasRenderingContext2D.prototype.fillRect=function(...args){if(this.canvas.classList.contains('audio-line'))window.spectrumDraws++;return fill.apply(this,args)};
  });
  await page.goto(process.env.PREVIEW_URL||'http://127.0.0.1:5175/');
  await page.waitForTimeout(5200);
  const inspect=()=>page.locator('.audio-line').evaluate(c=>{
   const r=c.getBoundingClientRect(),controls=c.parentElement.getBoundingClientRect();
   const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
   let top=c.height,bottom=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>160){top=Math.min(top,y);bottom=Math.max(bottom,y)}
   return {height:r.height,pixelHeight:bottom-top,clearOfControls:r.bottom<=controls.top,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  const idle=await inspect();assert.equal(idle.height,90);assert(idle.clearOfControls&&!idle.overflow);
  await page.getByRole('button',{name:'开启音乐'}).click();
  await page.locator('video').evaluate(v=>{v.currentTime=40});await page.waitForTimeout(1000);
  const playing=await inspect();assert(playing.pixelHeight>idle.pixelHeight+5);
  const count=await page.evaluate(()=>window.spectrumDraws);await page.waitForTimeout(300);assert(await page.evaluate(()=>window.spectrumDraws)>count);
  await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForTimeout(600);
  const offscreen=await page.evaluate(()=>window.spectrumDraws);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.spectrumDraws),offscreen);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(250);
  await page.getByRole('button',{name:'暂停背景视频'}).click();await page.waitForTimeout(150);
  const paused=await inspect();assert(paused.pixelHeight<10);
  const stopped=await page.evaluate(()=>window.spectrumDraws);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.spectrumDraws),stopped);
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);
  const mobile=await inspect();assert.equal(mobile.height,56);assert(mobile.clearOfControls&&!mobile.overflow);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
  assert((await inspect()).pixelHeight<10);assert.deepEqual(errors,[]);
  console.log({idle,playing,paused,mobile,errors});
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
