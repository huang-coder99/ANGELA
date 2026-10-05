const sharp=require('C:/Users/64177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const path=require('path');
(async()=>{for(const [name,max] of [['angela-portrait',900],['central-cover',1700],['library-cover',1700]]){const ext=name==='library-cover'?'.png':'.jpg';await sharp(path.join('public/assets',name+ext)).resize({width:max,withoutEnlargement:true}).webp({quality:82,effort:5}).toFile(path.join('public/assets',name+'.webp'));console.log(name)}})();
