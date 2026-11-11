// prod-pipeline-a4: build the strip and trace mocks from data/*.trace.json, inject the strip into saved live pages, screenshot.
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const A='/home/user/SGit-AI__Website__Web-Summit/people/angelo/pipeline/prod-pipeline-a4', S=process.argv[2];
const LIVE={'district-909':'https://lisbontechfringe.com/e/2026-11-11-district-909-back-where-it-all-started/','storm-summit':'https://lisbontechfringe.com/e/2026-11-11-storm-summit-stormsummit-app/','me':'https://lisbontechfringe.com/me/','tip':'https://lisbontechfringe.com/tip/'};
const ONE={ // the proposed one-sentence form
 'district-909':`A research agent read the organisers' Luma page at 17:49 and added this event at 17:50, after a team member passed on the link. Live as v0.1.422.`,
 'storm-summit':`A research agent read the organiser's page at 13:37 and added this event a minute later; a second pass at 14:01 set its cost and audience. Live as v0.1.227.`,
 'me':`Dinis asked for it at 11:50; the lead wrote the task, a dev agent built it at 11:58 and checked it at 12:03. Live as v0.1.65.`,
 'tip':`Dinis asked for it at 13:36; the lead wrote the task, a dev agent built it at 13:39, then two agents linked it from every event page by 14:55. Live as v0.1.291.`};
const hm=(t)=>t&&t!=='unknown'?t.slice(11,16):null;
const LANES=['People','Source','Research','Lead','Build','CI'];
function stripHTML(T,k,href,mode){
  const steps=T.steps, kick=mode==='running'?'How this page is being made (simulated)':'How this page was made';
  if(mode==='one') return `<section class="fs fs-one" data-flow="strip" aria-labelledby="fs-h-${k}">\n <p class="fs-k" id="fs-h-${k}">How this page was made</p>\n <p class="fs-s">${ONE[k]}</p>\n <p class="fs-f"><a href="${href}">See all ${T.totals.steps} steps</a> · from the git record</p>\n</section>`;
  let li=T.stations.map(s=>{const st=steps[s.n-1]; const c=[];
    if(st.kind==='human') c.push(st.t==='unknown'?'s-ask':'s-person');
    if(st.kind==='source-read') c.push('s-read');
    if(s.label==='Live'&&st.kind==='deploy') c.push('s-live'); if(s.label==='Now') c.push('s-now');
    if(st.folded) c.push('quiet'); if(s.lvl>1) c.push('lv'+s.lvl);
    const tm=st.version&&s.label!=='Now'?st.version.replace('v0.1.','v.'):st.version&&s.label==='Now'?hm(st.t):(hm(st.t)||'no time');
    return `  <li class="${c.join(' ')}"><a href="${href}#s-${s.n}"><span class="fs-d"></span><span data-flow-label>${s.label}</span><span class="fs-t">${tm}</span></a></li>`});
  let head=`${T.headline} <span>· ${T.headline_sub}</span>`, foot=`<a href="${href}">See every step</a> · from the git record · taken ${hm(T.traced_at)}`;
  if(mode==='running'){ li=li.filter(x=>!/s-now|quiet/.test(x)); li.push(`  <li class="s-run"><a href="${href}#s-run"><span class="fs-d"></span><span data-flow-label>Re-read</span><span class="fs-t">19:20 &rarr;</span></a></li>`);
    head='Working now: research, since 19:20 <span>· simulated: no run was going</span>'; foot=`<a href="${href}">See every step</a> · running: simulated for A4`; }
  return `<section class="fs" data-flow="strip" aria-labelledby="fs-h-${k}">\n <p class="fs-k">${kick}</p>\n <h2 class="fs-h" id="fs-h-${k}">${head}</h2>\n <ol class="fs-line">\n${li.join('\n')}\n </ol>\n <p class="fs-f">${foot}</p>\n</section>`;
}
const tpl=fs.readFileSync(path.join(S,'a3/trace.htm'),'utf8');
function tracePage(T,k){
  const S2=T.steps.map(s=>{const t=hm(s.t)||hm(s.after)||hm(s.before);return [s.n,LANES.indexOf(s.lane),t,s.kind,s.t==='unknown'?1:0]});
  const lanes=new Set(S2.map(s=>s[1])).size, ts=S2.map(s=>s[2]).sort();
  let h=tpl.replace(/<title>[^<]*<\/title>/,`<title>A4 sim: how ${T.page.replace('https://lisbontechfringe.com','')} was made</title>`)
   .replace(/<!--[\s\S]*?-->/,`<!-- juliett.large.worker@PrompTugal.angelo, prod-pipeline-a4 (simulation, static, not live). A3's trace page (pool/prod-pipeline-a3, 8193766, mock/trace.htm) unchanged except its data:\n     the strip and the steps come from data/${k}.trace.json, built from the Fringe's git record only. -->`)
   .replace(/<p class="dek">[^<]*<\/p>/,`<p class="dek">Every step behind ${T.page.replace('https://lisbontechfringe.com','')} on the Tech Fringe, from the git record (an A4 simulation).</p>`)
   .replace(/<section class="fs"[\s\S]*?<\/section>/,stripHTML(T,k,'','line').replace(/href="#s-/g,'href="#s-').replace('<a href="">See every step','<a href="#fp-h">See every step'))
   .replace(/77 steps, 6 lanes, 10:24 to 12:03/,`${T.steps.length} steps, ${lanes} lanes, ${ts[0]} to ${ts[ts.length-1]}`)
   .replace(/const S=\[[^\n]*\];/,'const S='+JSON.stringify(S2)+';')
   .replace(/const STN=new Set\(\[[^\]]*\]\);/,'const STN=new Set('+JSON.stringify(T.stations.map(s=>s.n))+');');
  return h;
}
(async()=>{
 const b=await chromium.launch(); const meas={};
 for(const k of Object.keys(LIVE)){
  const T=JSON.parse(fs.readFileSync(`${A}/data/${k}.trace.json`,'utf8'));
  fs.writeFileSync(`${A}/mock/trace-${k}.htm`,tracePage(T,k));
  const css=fs.readFileSync(`${A}/mock/inject.css`,'utf8'), live=fs.readFileSync(`${S}/live/${k}.html`,'utf8');
  for(const mode of k==='district-909'?['line','running','one']:['line','one']){
   const frag=stripHTML(T,k,`trace-${k}.htm`,mode);
   fs.writeFileSync(`${A}/mock/strip-${k}${mode==='line'?'':'-'+mode}.htm`,`<!-- prod-pipeline-a4: the fragment injected before </main> of ${LIVE[k]} (live HTML saved ${hm(T.traced_at)} UTC), styled by inject.css. -->\n${frag}\n`);
   const sim=live.replace(/<head>/i,`<head><base href="${LIVE[k]}">`).replace(/<\/head>/i,`<style>${css}</style></head>`).replace(/<\/main>/i,frag.replace(/href="trace-/g,`href="file://${A}/mock/trace-`)+'</main>');
   const f=`${S}/sim/${k}-${mode}.html`; fs.mkdirSync(`${S}/sim`,{recursive:true}); fs.writeFileSync(f,sim);
   const views=mode==='line'?[[320,640],[390,844],[1280,800]].concat(k==='district-909'?[[740,360]]:[]):[[390,844]];
   for(const [w,h] of views){ for(const dsf of (w===390&&['district-909','me'].includes(k)?[1,2]:[1])){
    const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:dsf,isMobile:w<760,hasTouch:w<1000}); const p=await ctx.newPage();
    await p.goto('file://'+f,{waitUntil:'load',timeout:60000}).catch(e=>console.log('goto',k,e.message)); await p.waitForTimeout(800);
    const m=await p.evaluate(()=>{const s=document.querySelector('[data-flow="strip"]'),r=s.getBoundingClientRect(),mn=document.querySelector('main');
      s.scrollIntoView({block:'center'}); return {strip:Math.round(r.height),page:document.documentElement.scrollHeight,main:mn.scrollHeight,vh:innerHeight,shownStations:[...s.querySelectorAll('.fs-line li')].filter(l=>getComputedStyle(l).display!=='none').length}});
    m.shareScreen=+(m.strip/m.vh).toFixed(2); m.sharePage=+(m.strip/m.page).toFixed(2); m.shareMain=+(m.strip/(m.main)).toFixed(2);
    meas[`${k}-${mode}-${w}x${h}`]=m; await p.waitForTimeout(200);
    const fn=`${A}/shots/${k}-${mode}-${w}${h===360?'x360':''}${dsf===2?'-x2':''}.png`;
    await p.screenshot({path:fn,fullPage:(k==='me'&&w===390)});
    await ctx.close(); }}
  }
  for(const [w,h,open] of [[390,844,0],[390,844,1],[1280,800,1]].concat(k==='district-909'?[[320,640,1]]:[])){
    const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:w<760,hasTouch:w<1000}); const p=await ctx.newPage();
    await p.goto(`file://${A}/mock/trace-${k}.htm${open?'#open':''}`); await p.waitForTimeout(300);
    await p.screenshot({path:`${A}/shots/trace-${k}-${open?'open':'closed'}-${w}.png`}); await ctx.close();
  }
 }
 fs.writeFileSync(`${S}/meas.json`,JSON.stringify(meas,null,1)); console.log(JSON.stringify(meas));
 await b.close();})();
