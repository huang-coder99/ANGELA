const fs=require('node:fs'),{spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const sharp=require('C:/Users/64177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const exe='node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe';
const files=['../【2024月亮计划新春会单品】时间舞步 feat.星尘infinity.mp4','public/assets/hero-desktop.mp4','public/assets/hero-mobile.mp4'];
function run(args){const r=spawnSync(exe,['-hide_banner','-loglevel','error',...args]);assert.equal(r.status,0,r.stderr.toString());return r.stdout}
(async()=>{
 const hashes=files.map(file=>run(['-i',file,'-map','0:a:0','-c:a','copy','-f','md5','-']).toString().trim());assert.equal(new Set(hashes).size,1);console.log('Audio bitstream identical:',hashes[0]);
 for(const file of files.slice(1)){const buf=fs.readFileSync(file);let at=0,atoms=[];while(at<buf.length){const size=buf.readUInt32BE(at),type=buf.toString('ascii',at+4,at+8);atoms.push(type);if(size<8)break;at+=size}assert(atoms.indexOf('moov')<atoms.indexOf('mdat'));console.log(file,atoms)}
 const shots=[];for(let row=0;row<3;row++)for(let col=0;col<3;col++){
  const img=run(['-ss',String([4,40,190][row]),'-i',files[col],'-frames:v','1','-vf','scale=384:216','-f','image2pipe','-c:v','mjpeg','-']);shots.push({input:img,left:col*384,top:row*216});
 }
 await sharp({create:{width:1152,height:648,channels:3,background:'#000'}}).composite(shots).jpeg({quality:90}).toFile('.video-work/frame-comparison.jpg');
})().catch(e=>{console.error(e);process.exitCode=1});
