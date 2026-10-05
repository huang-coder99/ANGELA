const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path');
const ffmpeg=path.resolve('node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const source=path.resolve('../【2024月亮计划新春会单品】时间舞步 feat.星尘infinity.mp4');
fs.mkdirSync('.video-work',{recursive:true});
function run(args){const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr||'ffmpeg failed')}
for(const [name,size,rate] of [['desktop','1280:720','900k'],['mobile','960:540','450k']]){
 if(process.argv.includes('--mobile')&&name!=='mobile')continue;
 const filter=`scale=${size}:flags=lanczos`+(name==='mobile'?',delogo=x=14:y=14:w=160:h=42':'');
 const common=['-i',source,'-map','0:v:0','-vf',filter,'-r','30','-c:v','libx264','-preset','fast','-threads','4','-pix_fmt','yuv420p','-b:v',rate,'-g','60','-keyint_min','60','-sc_threshold','0','-passlogfile',path.resolve('.video-work',name)];
 console.log(`${name}: first pass`);run([...common,'-pass','1','-an','-f','null','NUL']);
 console.log(`${name}: second pass`);run([...common,'-map','0:a:0','-pass','2','-c:a','copy','-movflags','+faststart',`public/assets/hero-${name}.mp4`]);
 console.log(`${name}: ${fs.statSync(`public/assets/hero-${name}.mp4`).size} bytes`);
}
run(['-i',source,'-frames:v','1','-vf','scale=1280:720','-q:v','4','public/assets/hero-poster.jpg']);
run(['-i',source,'-frames:v','1','-vf','scale=960:540,delogo=x=14:y=14:w=160:h=42','-q:v','4','public/assets/hero-mobile-poster.jpg']);
