const {chromium}=require('playwright');const fs=require('fs');
const [repo,out]=process.argv.slice(2);const ids=['dinis','nimay','angelo','jose','vicky','silvio','indi'];
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1200,height:900}});
const ppm=12; // px per mm: card trim 85x55 -> 1020x660
for(const id of ids)for(const side of ['front','back']){
 let svg=fs.readFileSync(`${repo}/team/designer/print/files/${id}/${id}-card-${side}.svg`,'utf8');
 svg=svg.replace(/width="91.00mm" height="61.00mm" viewBox="0 0 91.00 61.00"/,`width="${85*ppm}" height="${55*ppm}" viewBox="3 3 85 55"`);
 await p.setContent(`<html><body style="margin:0">${svg}</body></html>`);
 await (await p.$('svg')).screenshot({path:`${out}/card-${id}-${side}.png`});}
const m=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true});
for(const id of ids){await m.goto(`https://web-summit.sgit.ai/meet/${id}/`,{waitUntil:'networkidle'});
 await m.screenshot({path:`${out}/meet-${id}-phone.png`});
 await m.screenshot({path:`${out}/meet-${id}-phone-full.png`,fullPage:true});}
await b.close();})();
