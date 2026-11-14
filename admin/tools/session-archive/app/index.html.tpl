<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sessions Explorer</title>
<style>
:root{--bg:#f7f6f2;--panel:#fff;--ink:#1b1d22;--muted:#6b6f78;--line:#e3e1da;--accent:#1f4fd1;--accent-ink:#fff;--chip:#eef1fb;--person:#fff6dd;--agent:#f3f6ff;--tool:#f4f4f4;--code:#f2f1ec;--bar:#1f4fd1;--warn:#a5520b}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#111317;--panel:#1a1d23;--ink:#e8e9ec;--muted:#9aa0aa;--line:#2b2f37;--accent:#7aa2ff;--accent-ink:#0b1020;--chip:#222a3d;--person:#2e2a1b;--agent:#1c2233;--tool:#20232a;--code:#15171c;--bar:#7aa2ff;--warn:#f0a35e}}
:root[data-theme="dark"]{--bg:#111317;--panel:#1a1d23;--ink:#e8e9ec;--muted:#9aa0aa;--line:#2b2f37;--accent:#7aa2ff;--accent-ink:#0b1020;--chip:#222a3d;--person:#2e2a1b;--agent:#1c2233;--tool:#20232a;--code:#15171c;--bar:#7aa2ff;--warn:#f0a35e}
*{box-sizing:border-box}html,body{margin:0;height:100%}
body{background:var(--bg);color:var(--ink);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;flex-direction:column}
header{display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--line);background:var(--panel);flex-wrap:wrap}
header h1{font-size:16px;margin:0;font-weight:700}
header .stat{color:var(--muted);font-size:12px}
nav.tabs{display:flex;gap:4px;margin-left:auto;flex-wrap:wrap}
nav.tabs button,.btn{border:1px solid var(--line);background:var(--panel);color:var(--ink);padding:6px 11px;border-radius:7px;cursor:pointer;font:inherit}
nav.tabs button[aria-selected=true],.btn.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
main{flex:1;display:flex;min-height:0}
aside{width:330px;max-width:42vw;border-right:1px solid var(--line);display:flex;flex-direction:column;background:var(--panel);min-height:0}
aside .filters{padding:10px;display:flex;flex-direction:column;gap:6px;border-bottom:1px solid var(--line)}
input[type=search],select,textarea{width:100%;padding:7px 9px;border:1px solid var(--line);border-radius:7px;background:var(--bg);color:var(--ink);font:inherit}
#list{overflow:auto;flex:1}
.item{padding:8px 12px;border-bottom:1px solid var(--line);cursor:pointer}
.item:hover{background:var(--chip)}.item.sel{background:var(--chip);border-left:3px solid var(--accent);padding-left:9px}
.item b{display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.item small{color:var(--muted)}
section.view{flex:1;overflow:auto;padding:16px 20px;min-width:0}
.hidden{display:none!important}
.vaults{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}
.card h3{margin:0 0 4px;font-size:15px}.card p{margin:2px 0;color:var(--muted);font-size:12px}
.card .row{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.chip{display:inline-block;background:var(--chip);border-radius:20px;padding:1px 8px;font-size:11px;margin:1px}
.msg{border:1px solid var(--line);border-radius:9px;padding:9px 12px;margin:8px 0;background:var(--agent);white-space:pre-wrap;word-break:break-word}
.msg.person{background:var(--person)}.msg.tool_use,.msg.tool_result{background:var(--tool);font-family:ui-monospace,Menlo,monospace;font-size:12px}
.msg .h{font-size:11px;color:var(--muted);margin-bottom:4px;font-family:system-ui,sans-serif}
.msg.collapsed .b{max-height:6.2em;overflow:hidden}
pre,code{font-family:ui-monospace,Menlo,monospace;font-size:12px}
pre.json{background:var(--code);padding:10px;border-radius:8px;overflow:auto;max-height:70vh}
.tree{font-family:ui-monospace,Menlo,monospace;font-size:12px}.tree details{margin-left:14px}.tree summary{cursor:pointer}
.k{color:var(--accent)}.s{color:#2e7d32}.n{color:var(--warn)}
table{border-collapse:collapse;width:100%;font-size:12px}th,td{border-bottom:1px solid var(--line);padding:5px 7px;text-align:left;vertical-align:top}
th{position:sticky;top:0;background:var(--panel);cursor:pointer}td{max-width:520px;overflow:hidden;text-overflow:ellipsis}
.sqlbox{display:flex;flex-direction:column;gap:8px}.sqlbox textarea{min-height:110px;font-family:ui-monospace,Menlo,monospace}
.presets{display:flex;gap:6px;flex-wrap:wrap}
.bars .bar{display:flex;align-items:center;gap:8px;margin:3px 0;font-size:12px}.bars .bar span:first-child{width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bars .bar i{display:block;height:12px;background:var(--bar);border-radius:3px}
.charts{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px}
mark{background:#ffe27a;color:#111}
.note{color:var(--muted);font-size:12px}.err{color:#c62828}
.loader{padding:30px;color:var(--muted)}
.sub-tabs{display:flex;gap:6px;margin:10px 0}
@media (max-width:760px){main{flex-direction:column}aside{width:100%;max-width:none;max-height:40vh;border-right:0;border-bottom:1px solid var(--line)}section.view{padding:12px 16px}}
</style>
</head>
<body>
<header>
  <h1>Sessions Explorer</h1>
  <span class="stat" id="stat">loading…</span>
  <nav class="tabs" id="tabs">
    <button data-v="vaults" aria-selected="true">Vaults</button>
    <button data-v="session">Session</button>
    <button data-v="search">Search</button>
    <button data-v="sql">SQL</button>
    <button data-v="charts">Stats</button>
    <button data-v="abp">ABP</button>
    <button data-v="json">JSON</button>
  </nav>
</header>
<main>
  <aside>
    <div class="filters">
      <input type="search" id="q" placeholder="Filter sessions by title or id">
      <select id="fv"><option value="">All loaded vaults</option></select>
      <select id="sort"><option value="created_desc">Newest first</option><option value="created_asc">Oldest first</option><option value="events_desc">Most events</option><option value="title">Title</option></select>
    </div>
    <div id="list"></div>
  </aside>
  <section class="view" id="v-vaults"></section>
  <section class="view hidden" id="v-session"><p class="note">Pick a session on the left.</p></section>
  <section class="view hidden" id="v-search">
    <input type="search" id="fq" placeholder="Search every loaded message (full text: words, &quot;phrases&quot;, prefix*)">
    <p class="note" id="fqn"></p><div id="fqr"></div>
  </section>
  <section class="view hidden" id="v-sql">
    <div class="sqlbox">
      <div class="presets" id="presets"></div>
      <textarea id="sql" spellcheck="false">select vault, count(*) sessions, sum(events) events, sum(messages) messages from sessions group by vault order by sessions desc;</textarea>
      <div><button class="btn primary" id="run">Run (Ctrl+Enter)</button> <button class="btn" id="csv">Download CSV</button> <span class="note">Tables: <code>vaults</code>, <code>sessions</code>, <code>messages</code>, <code>fts</code> (full text over messages.text). SQLite with JSON functions, in your browser.</span></div>
      <div id="sqlr"></div>
    </div>
  </section>
  <section class="view hidden" id="v-charts"></section>
  <section class="view hidden" id="v-abp"></section>
  <section class="view hidden" id="v-json"><div class="sub-tabs" id="jsrc"></div><div id="jview"></div></section>
</main>
<script>
(function(){
'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dec=new TextDecoder();
const S={catalog:null,vaults:[],sessions:[],loaded:new Set(),db:null,SQL:null,sel:null,lastRows:null,master:null,childReaders:{}};

// ---------- reading files: inside the vault host (window.sg), from a vault by key (SGVaultEmbed.Reader), or over plain http ----------
const inVault=()=>!!(window.sg&&window.sg.vfs);
const params=new URLSearchParams(location.hash.slice(1));
async function toBytes(x){ if(x==null) throw new Error('empty'); if(x instanceof Uint8Array) return x; if(x instanceof ArrayBuffer) return new Uint8Array(x);
  if(x.buffer instanceof ArrayBuffer) return new Uint8Array(x.buffer); if(typeof Blob!=='undefined'&&x instanceof Blob) return new Uint8Array(await x.arrayBuffer());
  if(typeof x==='string'){ const b=atob(x),o=new Uint8Array(b.length); for(let i=0;i<b.length;i++)o[i]=b.charCodeAt(i); return o } if(x.data) return toBytes(x.data); throw new Error('unknown bytes') }
async function readBytes(path){
  if(S.master) return S.master.readBytes(path);
  if(inVault()) return toBytes(await window.sg.vfs.read(path));
  const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error('HTTP '+r.status+' '+path); return new Uint8Array(await r.arrayBuffer());
}
async function gunzip(bytes){ if(bytes[0]!==0x1f||bytes[1]!==0x8b) return bytes; const ds=new DecompressionStream('gzip'); const s=new Blob([bytes]).stream().pipeThrough(ds); return new Uint8Array(await new Response(s).arrayBuffer()) }
async function readJSON(p){ return JSON.parse(dec.decode(await gunzip(await readBytes(p)))) }
async function readLines(p){ return dec.decode(await gunzip(await readBytes(p))).split('\n').filter(Boolean).map(l=>{try{return JSON.parse(l)}catch(e){return null}}).filter(Boolean) }
async function loadScriptFromVault(path){ const src=dec.decode(await readBytes(path)); (0,eval)(src) }
async function openByKey(cfg){ if(!window.SGVaultEmbed) await loadScriptFromVault('lib/vault-embed.js');
  const R=await new window.SGVaultEmbed.Reader({endpoint:cfg.endpoint||'https://dev.send.sgraph.ai',vault_id:cfg.vault_id,read_key:String(cfg.read_key).replace(/^sgit_public_read_/,'')}).init();
  R.walk=async function(treeId,prefix){const tree=await this.objJson(treeId);await Promise.all((tree.entries||[]).map(async e=>{const name=await this.decB64(e.name_enc),full=prefix?prefix+'/'+name:name;if(e.tree_id)await this.walk(e.tree_id,full);else this.files[full]=e.blob_id}))};
  await R.open(); return R }
// raw events live in the project vaults: read through the link (vaults/<name>/...) or, failing that, open the child by its key
// a pack is a zip of whole sessions (few files to push); read it once, keep it in memory, take members out
async function zipMember(zb,name){ const dv=new DataView(zb.buffer,zb.byteOffset,zb.byteLength); let e=zb.length-22; while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--; if(e<0) throw new Error('not a zip');
  const n=dv.getUint16(e+10,true); let p=dv.getUint32(e+16,true);
  for(let i=0;i<n;i++){ const meth=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),fl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true); const nm=dec.decode(zb.subarray(p+46,p+46+fl));
    if(nm===name){ const lfl=dv.getUint16(off+26,true),lxl=dv.getUint16(off+28,true),d=zb.subarray(off+30+lfl+lxl,off+30+lfl+lxl+csz);
      if(meth===0) return d; const s=new Blob([d]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return new Uint8Array(await new Response(s).arrayBuffer()) }
    p+=46+fl+xl+cl }
  throw new Error('not in pack: '+name) }
async function readChildFile(vault,path){
  const viaLink='vaults/'+vault+'/'+path;
  if(inVault()&&!S.master){ try{ return await readBytes(viaLink) }catch(e){} }
  if(!S.childReaders[vault]){ const k=await readJSON('keys/'+vault+'.json'); S.childReaders[vault]=openByKey(k) }
  const R=await S.childReaders[vault]; return R.readBytes(path) }
async function readChild(vault,path,s){
  const pm=s&&s.pack_map&&s.pack_map[path.split('/').pop()];
  if(pm){ S.packs=S.packs||{}; const key=vault+'/'+pm[0]; if(!S.packs[key]) S.packs[key]=readChildFile(vault,pm[0]).then(toBytes); return gunzip(await zipMember(await S.packs[key],pm[1])) }
  const viaLink='vaults/'+vault+'/'+path;
  if(inVault()&&!S.master){ try{ return await gunzip(await readBytes(viaLink)) }catch(e){} }
  if(!S.childReaders[vault]){ const k=await readJSON('keys/'+vault+'.json'); S.childReaders[vault]=openByKey(k) }
  const R=await S.childReaders[vault]; return gunzip(await R.readBytes(path));
}

// ---------- SQLite in the browser ----------
async function initDB(){
  if(!window.initSqlJs){ try{ await loadScriptFromVault('lib/sql-wasm.js') }catch(e){ await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)}) } }
  let wasmBinary; try{ wasmBinary=await readBytes('lib/sql-wasm.wasm') }catch(e){}
  S.SQL=await window.initSqlJs(wasmBinary?{wasmBinary}:{locateFile:f=>'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/'+f});
  S.db=new S.SQL.Database();
  S.db.run(`create table vaults(name text primary key,label text,vault_id text,sessions int,events int,messages int,first text,last text,description text);
    create table sessions(id text primary key,vault text,title text,status text,origin text,created text,updated text,first_event text,last_event text,events int,messages int,person_messages int,subagents int,redactions int,parent text,tags text,tools text,folder text,meta text);
    create table messages(rowid integer primary key,session text,vault text,t text,role text,agent text,tool text,text text);
    create virtual table fts using fts4(text,tokenize=unicode61);
    create table actions(session text,vault text,t text,tool text,cat text,target text,repo text,hosts text,flags text,agent text,result_chars int,error int);
    create table findings(session text,vault text,t text,kind text,severity text,rule text,tool text,repo text,evidence text,agent text,source text,quote text);
    create table stats(session text primary key,vault text,cost_usd real,tokens_out int,tokens_cache_read int,api_hours real,active_hours int,turns int,tool_calls int,tool_errors int,denials int,raw_bytes int,person_avg int,agent_avg int,tool_result_avg int,tool_result_max int);`);
}
function addVaultRow(v){ S.db.run('insert or replace into vaults values (?,?,?,?,?,?,?,?,?)',[v.name,v.label,v.vault_id,v.sessions,v.events,v.messages,v.first,v.last,v.description||'']) }
async function loadVault(name){
  if(S.loaded.has(name)) return; const v=S.vaults.find(x=>x.name===name); setStat('loading '+(v.label||name)+'…');
  const ss=await readJSON('catalog/'+name+'/sessions.json');
  const ins=S.db.prepare('insert or replace into sessions values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for(const m of ss){ m.vault=name; S.sessions.push(m); ins.run([m.id,name,m.title,m.session_status,m.origin,m.created_at,m.updated_at,m.first_event,m.last_event,m.events|0,m.messages|0,m.person_messages|0,m.subagents|0,m.redactions|0,m.parent_session_id,JSON.stringify(m.tags||[]),JSON.stringify(m.tools||{}),m.folder,JSON.stringify(m)]) }
  ins.free();
  const mi=S.db.prepare('insert into messages(session,vault,t,role,agent,tool,text) values (?,?,?,?,?,?,?)'), fi=S.db.prepare('insert into fts(rowid,text) values (last_insert_rowid(),?)');
  S.db.run('begin');
  for(const part of (v.parts||[])){ const rows=await readLines('catalog/'+name+'/'+part); for(const r of rows){ mi.run([r.session,name,r.t,r.role,r.agent||null,r.tool||null,r.text||'']); fi.run([r.text||'']) } setStat('loading '+(v.label||name)+' · '+part) }
  S.db.run('commit'); mi.free(); fi.free();
  const st=S.db.prepare('insert or replace into stats values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for(const m of ss){ const x=m.stats||{}, g=(k,f)=>((x.msg||{})[k]||{})[f]||0; st.run([m.id,name,x.cost_usd||0,x.tokens_out||0,x.tokens_cache_read||0,x.api_hours||0,x.active_hours||0,x.turns||0,x.tool_calls||0,x.tool_errors||0,x.denials||0,x.raw_bytes_gz||0,g('person','avg'),g('agent','avg'),g('tool_result','avg'),g('tool_result','max')]) }
  st.free();
  try{ const fs=await readJSON('catalog/'+name+'/findings.json'); const fp=S.db.prepare('insert into findings values (?,?,?,?,?,?,?,?,?,?,?,?)'); S.db.run('begin'); for(const f of fs) fp.run([f.session,name,f.t||'',f.kind,f.severity,f.rule||'',f.tool||'',f.repo||'',f.evidence||'',f.agent||null,f.source||'rule',f.quote||'']); S.db.run('commit'); fp.free() }catch(e){ console.warn('findings',e) }
  for(const part of (v.action_parts||[])){ const rows=await readLines('catalog/'+name+'/'+part); const ap=S.db.prepare('insert into actions values (?,?,?,?,?,?,?,?,?,?,?,?)'); S.db.run('begin'); for(const a of rows) ap.run([a.session,name,a.t,a.tool,a.cat,a.target,a.repo||'',JSON.stringify(a.hosts||[]),JSON.stringify(a.flags||[]),a.agent||null,a.result_chars||0,a.error?1:0]); S.db.run('commit'); ap.free(); setStat('loading '+(v.label||name)+' · '+part) }
  S.loaded.add(name); renderVaults(); renderList(); refreshFilters(); setStat();
}
function q(sql,args){ const r=S.db.exec(sql,args||[]); return r[0]||{columns:[],values:[]} }

// ---------- views ----------
function setStat(t){ $('#stat').textContent=t||`${S.vaults.length} vaults · ${S.loaded.size} loaded · ${S.sessions.length} sessions · ${q('select count(*) from messages').values[0][0]} messages`+(S.master?' · opened by key':inVault()?' · in vault':'') }
function show(v){ document.querySelectorAll('section.view').forEach(s=>s.classList.toggle('hidden',s.id!=='v-'+v)); document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===v)); if(v==='charts')renderCharts(); if(v==='abp')renderABP(); if(v==='json')renderJSONTab(); if(v==='sql'&&!S.lastRows)runSQL() }
$('#tabs').onclick=e=>{ if(e.target.dataset.v) show(e.target.dataset.v) };
function fmt(n){ return (n||0).toLocaleString('en-GB') }
function renderVaults(){
  const el=$('#v-vaults'), c=S.catalog;
  el.innerHTML=`<p class="note">${esc(c.title||'Archive of Claude Code sessions')} · generated ${esc((c.generated||'').slice(0,16).replace('T',' '))} UTC. Load a vault to browse, search and query its sessions; the full raw record of each session stays in its own vault.</p>
  <p><button class="btn primary" id="loadall">Load every vault</button></p><div class="vaults">${S.vaults.map(v=>`<div class="card"><h3>${esc(v.label||v.name)}</h3>
  <p>${esc(v.description||'')}</p><p>${fmt(v.sessions)} sessions · ${fmt(v.events)} events · ${fmt(v.messages)} messages</p><p>${esc((v.first||'').slice(0,10))} → ${esc((v.last||'').slice(0,10))}</p>
  <p><code>${esc(v.vault_id||'')}</code></p><div class="row">${S.loaded.has(v.name)?'<span class="chip">loaded</span>':`<button class="btn" data-load="${esc(v.name)}">Load</button>`}</div></div>`).join('')}</div>`;
  el.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>loadVault(b.dataset.load).catch(err));
  $('#loadall').onclick=async()=>{ for(const v of S.vaults) await loadVault(v.name).catch(err) };
}
function refreshFilters(){ const fv=$('#fv'), cur=fv.value; fv.innerHTML='<option value="">All loaded vaults</option>'+[...S.loaded].map(n=>`<option value="${esc(n)}">${esc((S.vaults.find(v=>v.name===n)||{}).label||n)}</option>`).join(''); fv.value=cur }
function renderList(){
  const term=$('#q').value.toLowerCase(), fv=$('#fv').value, so=$('#sort').value;
  let L=S.sessions.filter(s=>(!fv||s.vault===fv)&&(!term||(s.title||'').toLowerCase().includes(term)||s.id.includes(term)));
  const by={created_desc:(a,b)=>(b.created_at||'').localeCompare(a.created_at||''),created_asc:(a,b)=>(a.created_at||'').localeCompare(b.created_at||''),events_desc:(a,b)=>(b.events|0)-(a.events|0),title:(a,b)=>(a.title||'').localeCompare(b.title||'')}[so];
  L.sort(by);
  $('#list').innerHTML=L.length?L.slice(0,2000).map(s=>`<div class="item${S.sel===s.id?' sel':''}" data-id="${esc(s.id)}"><b>${esc(s.title||s.id)}</b><small>${esc((s.created_at||'').slice(0,10))} · ${fmt(s.events)} events · ${fmt(s.person_messages)} from you · ${esc(s.vault)}</small></div>`).join(''):'<p class="note" style="padding:12px">Load a vault to list its sessions.</p>';
}
['#q','#fv','#sort'].forEach(s=>$(s).addEventListener('input',renderList));
$('#list').onclick=e=>{ const it=e.target.closest('.item'); if(it) openSession(it.dataset.id) };
function msgHTML(r,hl){ const role=r.role, who=role==='person'?'You':role==='tool_use'?('tool · '+(r.tool||'')):role==='tool_result'?'tool result':(r.agent?'sub-agent '+r.agent.slice(0,8):'agent');
  let t=esc(r.text); if(hl){ for(const w of hl) if(w.length>1) t=t.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>') }
  const long=(r.text||'').length>600&&role!=='person';
  return `<div class="msg ${esc(role)}${long?' collapsed':''}"><div class="h">${esc(who)} · ${esc((r.t||'').slice(0,19).replace('T',' '))}${long?' · <a href="#" data-x>expand</a>':''}</div><div class="b">${t}</div></div>` }
document.addEventListener('click',e=>{ if(e.target.matches('[data-x]')){ e.preventDefault(); const m=e.target.closest('.msg'); m.classList.toggle('collapsed'); e.target.textContent=m.classList.contains('collapsed')?'expand':'collapse' } });
function openSession(id,focus){
  S.sel=id; renderList(); const s=S.sessions.find(x=>x.id===id); if(!s) return;
  const rows=q('select t,role,agent,tool,text from messages where session=? order by t,rowid',[id]).values.map(v=>({t:v[0],role:v[1],agent:v[2],tool:v[3],text:v[4]}));
  const roles=$('#v-session').dataset.roles||'person,assistant,tool_use,tool_result';
  const want=new Set(roles.split(','));
  const el=$('#v-session');
  el.innerHTML=`<h2 style="margin:0 0 4px">${esc(s.title||id)}</h2><p class="note"><code>${esc(id)}</code> · ${esc(s.vault)} · ${esc(s.session_status||'')} · created ${esc((s.created_at||'').slice(0,16).replace('T',' '))} · ${fmt(s.events)} events · ${fmt(s.messages)} messages · ${fmt(s.subagents)} sub-agents${s.parent_session_id?` · started by <a href="#" data-open="${esc(s.parent_session_id)}">${esc(s.parent_session_id)}</a>`:''}</p>
  <p>${Object.entries(s.tools||{}).slice(0,14).map(([k,v])=>`<span class="chip">${esc(k)} ${v}</span>`).join('')}</p>
  <div class="sub-tabs">${[['person','You'],['assistant','Agent'],['tool_use','Tool calls'],['tool_result','Tool results']].map(([k,l])=>`<label><input type="checkbox" data-role="${k}" ${want.has(k)?'checked':''}> ${l}</label>`).join(' ')}
  <button class="btn" id="rawev">Raw events (from its vault)</button> <button class="btn" id="metaj">meta.json</button> <button class="btn" id="toabp">ABP &amp; findings</button> <button class="btn" id="dlmd">Download transcript</button></div>
  <div id="msgs">${rows.filter(r=>want.has(r.role)).map(r=>msgHTML(r)).join('')||'<p class="note">No messages of these kinds.</p>'}</div>`;
  el.querySelectorAll('[data-role]').forEach(c=>c.onchange=()=>{ el.dataset.roles=[...el.querySelectorAll('[data-role]:checked')].map(x=>x.dataset.role).join(','); openSession(id) });
  el.querySelectorAll('[data-open]').forEach(a=>a.onclick=ev=>{ev.preventDefault(); if(S.sessions.find(x=>x.id===a.dataset.open)) openSession(a.dataset.open); else alert('That session is in a vault that is not loaded (or not archived here).')});
  $('#toabp').onclick=()=>{ $('#v-abp').dataset.only='1'; show('abp') };
  $('#metaj').onclick=()=>{ S.jsonDoc={label:'meta · '+(s.title||id),data:s}; show('json') };
  $('#rawev').onclick=async()=>{ $('#rawev').textContent='loading…'; try{ const parts=s.event_parts&&s.event_parts.length?s.event_parts:['events.jsonl.gz']; const evs=[]; for(let i=0;i<parts.length;i++){ $('#rawev').textContent='loading part '+(i+1)+' of '+parts.length+'…'; const b=await readChild(s.vault,'sessions/'+s.folder+'/'+parts[i],s); for(const l of dec.decode(b).split('\n')) if(l) evs.push(JSON.parse(l)) } $('#rawev').textContent='Raw events (from its vault)'; S.jsonDoc={label:'events · '+(s.title||id)+' ('+evs.length+')',data:evs}; show('json') }catch(e){ $('#rawev').textContent='Raw events: '+e.message } };
  $('#dlmd').onclick=()=>{ const md=rows.map(r=>`## ${r.role} · ${r.t}\n\n${r.text}\n`).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([`# ${s.title}\n\n`+md],{type:'text/markdown'})); a.download=(s.folder||id)+'.md'; a.click() };
  show('session'); if(focus){ const m=[...document.querySelectorAll('#msgs .msg')].find(x=>x.textContent.includes(focus)); if(m){ m.classList.remove('collapsed'); m.scrollIntoView({block:'center'}) } }
}
// full-text search
let ft; $('#fq').addEventListener('input',()=>{ clearTimeout(ft); ft=setTimeout(doSearch,250) });
function doSearch(){ const term=$('#fq').value.trim(); if(!term){ $('#fqr').innerHTML=''; $('#fqn').textContent=''; return }
  let res; try{ res=q(`select m.session,m.vault,m.t,m.role,m.agent,m.tool,snippet(fts,'<mark>','</mark>','…',-1,24) from fts join messages m on m.rowid=fts.rowid where fts match ? order by m.t desc limit 300`,[term]) }catch(e){ $('#fqn').innerHTML='<span class="err">'+esc(e.message)+'</span>'; return }
  $('#fqn').textContent=`${res.values.length}${res.values.length===300?'+':''} matches in ${S.loaded.size} loaded vault(s)`;
  const ttl=id=>(S.sessions.find(s=>s.id===id)||{}).title||id;
  $('#fqr').innerHTML=res.values.map(v=>`<div class="msg ${esc(v[3])}" style="cursor:pointer" data-s="${esc(v[0])}"><div class="h">${esc(ttl(v[0]))} · ${esc(v[3])}${v[5]?' · '+esc(v[5]):''} · ${esc((v[2]||'').slice(0,16).replace('T',' '))} · ${esc(v[1])}</div><div class="b">${String(v[6]).replace(/<(?!\/?mark>)/g,'&lt;')}</div></div>`).join('');
}
$('#fqr').onclick=e=>{ const m=e.target.closest('[data-s]'); if(m) openSession(m.dataset.s,(m.querySelector('mark')||{}).textContent) };
// SQL
const PRESETS=[
 ['Sessions per vault','select vault, count(*) sessions, sum(events) events, sum(messages) messages, sum(person_messages) from_you from sessions group by vault order by sessions desc;'],
 ['Busiest sessions','select title, vault, events, messages, subagents, created from sessions order by events desc limit 50;'],
 ['Your messages','select s.title, m.t, substr(m.text,1,300) text from messages m join sessions s on s.id=m.session where m.role=\'person\' order by m.t desc limit 200;'],
 ['Tools used','select j.key tool, sum(j.value) calls from sessions, json_each(sessions.tools) j group by j.key order by calls desc limit 40;'],
 ['Sessions per day','select substr(created,1,10) day, count(*) sessions from sessions group by day order by day;'],
 ['Who started whom','select p.title parent, s.title child, s.created from sessions s join sessions p on p.id=s.parent order by s.created;'],
 ['API list-price equivalent per session','select s.title, st.cost_usd, st.tokens_out, st.active_hours, st.tool_calls from stats st join sessions s on s.id=st.session order by st.cost_usd desc;'],
 ['Findings by kind','select severity, kind, count(*) n, count(distinct session) sessions from findings group by severity, kind order by case severity when \'critical\' then 0 when \'high\' then 1 when \'medium\' then 2 when \'low\' then 3 else 4 end, n desc;'],
 ['Refused actions','select s.title, f.t, f.evidence from findings f join sessions s on s.id=f.session where f.kind=\'denied\' order by f.t;'],
 ['Repos written','select repo, count(*) writes, count(distinct session) sessions from actions where cat in (\'file-write\',\'git-commit\',\'git-push\') and repo<>\'\' group by repo order by writes desc;'],
 ['Hosts contacted','select j.value host, count(*) n from actions, json_each(actions.hosts) j group by host order by n desc limit 40;'],
 ['Full text: "HOLD"','select s.title, m.role, m.t, snippet(fts) from fts join messages m on m.rowid=fts.rowid join sessions s on s.id=m.session where fts match \'HOLD\' limit 100;'],
];
$('#presets').innerHTML=PRESETS.map((p,i)=>`<button class="btn" data-p="${i}">${esc(p[0])}</button>`).join('');
$('#presets').onclick=e=>{ if(e.target.dataset.p){ $('#sql').value=PRESETS[e.target.dataset.p][1]; runSQL() } };
$('#run').onclick=runSQL; $('#sql').addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='Enter') runSQL() });
function runSQL(){ const t0=performance.now(); try{ const r=S.db.exec($('#sql').value); const last=r[r.length-1]||{columns:[],values:[]}; S.lastRows=last;
  $('#sqlr').innerHTML=`<p class="note">${last.values.length} rows · ${(performance.now()-t0).toFixed(0)} ms</p>`+table(last) }catch(e){ $('#sqlr').innerHTML='<p class="err">'+esc(e.message)+'</p>' } }
function table(r){ return `<div style="overflow:auto;max-height:65vh"><table><thead><tr>${r.columns.map((c,i)=>`<th data-c="${i}">${esc(c)}</th>`).join('')}</tr></thead><tbody>${r.values.slice(0,5000).map(v=>`<tr>${v.map(x=>`<td title="${esc(String(x).slice(0,500))}">${esc(String(x==null?'':x).slice(0,400))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` }
$('#sqlr').addEventListener('click',e=>{ const th=e.target.closest('th'); if(!th||!S.lastRows) return; const i=+th.dataset.c, d=th.dataset.d==='1'?-1:1; S.lastRows.values.sort((a,b)=>(a[i]>b[i]?1:a[i]<b[i]?-1:0)*d); $('#sqlr').innerHTML=table(S.lastRows); $('#sqlr').querySelector(`th[data-c="${i}"]`).dataset.d=d===1?'1':'0' });
$('#csv').onclick=()=>{ const r=S.lastRows; if(!r) return; const c=x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"'; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([[r.columns.map(c).join(','),...r.values.map(v=>v.map(c).join(','))].join('\n')],{type:'text/csv'})); a.download='query.csv'; a.click() };
// charts
function bars(title,rows){ const max=Math.max(1,...rows.map(r=>r[1])); return `<div class="card bars"><h3>${esc(title)}</h3>${rows.map(r=>`<div class="bar"><span title="${esc(r[0])}">${esc(r[0])}</span><i style="width:${Math.max(2,Math.round(r[1]/max*260))}px"></i><span>${fmt(r[1])}</span></div>`).join('')||'<p class="note">Load a vault first.</p>'}</div>` }
function hist(title,vals,unit){ // log2 buckets
  if(!vals.length) return `<div class="card"><h3>${esc(title)}</h3><p class="note">No data.</p></div>`;
  const b=new Map(); for(const v of vals){ const k=v<=0?0:Math.floor(Math.log2(v)); b.set(k,(b.get(k)||0)+1) }
  const ks=[...b.keys()].sort((a,c)=>a-c), lab=k=>{const n=2**k; return n>=1048576?(n/1048576).toFixed(0)+'M':n>=1024?(n/1024).toFixed(0)+'K':String(n)};
  return bars(title,ks.map(k=>['≥ '+lab(k)+(unit||''),b.get(k)]))+'' }
function scatter(title,pts,xl,yl){ if(!pts.length) return '';
  const W=520,H=260,P=38, xs=pts.map(p=>Math.log10(Math.max(1,p[0]))), ys=pts.map(p=>Math.log10(Math.max(1,p[1])));
  const x0=Math.min(...xs),x1=Math.max(...xs)||1,y0=Math.min(...ys),y1=Math.max(...ys)||1, sx=v=>P+(v-x0)/((x1-x0)||1)*(W-P-10), sy=v=>H-P-(v-y0)/((y1-y0)||1)*(H-P-10);
  return `<div class="card"><h3>${esc(title)}</h3><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title)}"><line x1="${P}" y1="${H-P}" x2="${W}" y2="${H-P}" stroke="currentColor" opacity=".3"/><line x1="${P}" y1="0" x2="${P}" y2="${H-P}" stroke="currentColor" opacity=".3"/>
  ${pts.map((p,i)=>`<circle cx="${sx(xs[i]).toFixed(1)}" cy="${sy(ys[i]).toFixed(1)}" r="4" fill="var(--bar)" opacity=".75"><title>${esc(p[2])}: ${fmt(p[0])} ${esc(xl)}, ${fmt(p[1])} ${esc(yl)}</title></circle>`).join('')}
  <text x="${W/2}" y="${H-6}" font-size="11" fill="currentColor" text-anchor="middle">${esc(xl)} (log)</text><text x="12" y="${H/2}" font-size="11" fill="currentColor" transform="rotate(-90 12 ${H/2})" text-anchor="middle">${esc(yl)} (log)</text></svg></div>` }
function heat(title){ const H={}; let max=1; for(const s of S.sessions){ for(const [h,n] of Object.entries((s.stats||{}).hours||{})){ const d=h.slice(0,10), hr=+h.slice(11,13); (H[d]=H[d]||Array(24).fill(0))[hr]+=n; max=Math.max(max,H[d][hr]) } }
  const days=Object.keys(H).sort().slice(-21); if(!days.length) return '';
  return `<div class="card" style="grid-column:1/-1"><h3>${esc(title)}</h3><div style="overflow:auto"><table style="font-size:10px"><tr><th></th>${[...Array(24).keys()].map(h=>`<th style="position:static">${h}</th>`).join('')}</tr>${days.map(d=>`<tr><td>${d}</td>${H[d].map(n=>`<td title="${d} ${n} events" style="background:color-mix(in srgb,var(--bar) ${Math.round(Math.sqrt(n/max)*100)}%,transparent);min-width:18px"></td>`).join('')}</tr>`).join('')}</table></div><p class="note">Events per hour (UTC) across every loaded session, last 21 days with activity.</p></div>` }
function renderCharts(){
  const day=q("select substr(created,1,10) d,count(*) from sessions group by d order by d desc limit 40").values.reverse();
  const m=q("select role, length(text) from messages").values, by=r=>m.filter(x=>x[0]===r).map(x=>x[1]);
  const cost=q('select s.title, st.cost_usd from stats st join sessions s on s.id=st.session order by 2 desc limit 20').values.map(r=>[r[0],Math.round(r[1])]);
  const pts=q('select s.events, st.raw_bytes, s.title from sessions s join stats st on st.session=s.id').values;
  const pts2=q('select st.tool_calls, st.cost_usd*100, s.title from sessions s join stats st on st.session=s.id').values;
  const tot=q('select round(sum(cost_usd)), sum(tokens_out), sum(tokens_cache_read), round(sum(api_hours),1), sum(active_hours), sum(tool_calls), sum(denials), sum(raw_bytes) from stats').values[0]||[];
  $('#v-charts').innerHTML=`<div class="vaults" style="margin-bottom:14px">${[['API list-price equivalent (USD)',tot[0]],['Output tokens',tot[1]],['Cache-read tokens',tot[2]],['Model time (hours)',tot[3]],['Active session-hours',tot[4]],['Tool calls',tot[5]],['Refused actions',tot[6]],['Raw archive (MB)',Math.round((tot[7]||0)/1048576)]].map(([l,v])=>`<div class="card"><p>${esc(l)}</p><h3 style="font-size:22px">${fmt(v)}</h3></div>`).join('')}</div>
  <div class="charts">${heat('When the agents worked')}
  ${bars('API list-price equivalent per session (USD)',cost)}
  ${bars('Sessions per vault',q('select vault,count(*) from sessions group by vault order by 2 desc').values)}
  ${scatter('Session size: events vs raw archive bytes',pts,'events','bytes')}
  ${scatter('Tool calls vs API list-price equivalent (US cents)',pts2,'tool calls','cents')}
  ${hist('Your message length (characters)',by('person'))}
  ${hist('Agent reply length (characters)',by('assistant'))}
  ${hist('Tool result size (characters, trimmed at 4,000 in the catalogue)',q('select result_chars from actions where result_chars>0').values.map(r=>r[0]))}
  ${bars('Action categories',q('select cat,count(*) from actions group by cat order by 2 desc').values)}
  ${bars('Repositories written (file writes, commits, pushes)',q("select repo,count(*) from actions where cat in ('file-write','git-commit','git-push') and repo<>'' group by repo order by 2 desc limit 15").values)}
  ${bars('Hosts contacted',q('select j.value,count(*) from actions, json_each(actions.hosts) j group by j.value order by 2 desc limit 20').values)}
  ${bars('Top tools',q('select tool,count(*) from actions group by tool order by 2 desc limit 20').values)}
  ${bars('Pushes per session',q("select s.title,count(*) from actions a join sessions s on s.id=a.session where a.cat='git-push' group by a.session order by 2 desc limit 15").values)}
  ${bars('Busiest sessions (events)',q('select title,events from sessions order by events desc limit 20').values)}
  ${bars('Sessions created per day (last 40 days with sessions)',day)}
  ${bars('Messages by role',q('select role,count(*) from messages group by role order by 2 desc').values)}</div>`;
}
// ---------- ABP: observed policy per session, findings, a stronger policy ----------
const SEVO={critical:0,high:1,medium:2,low:3,info:4};
function renderABP(){
  const el=$('#v-abp'), sel=S.sessions.find(s=>s.id===S.sel);
  const sevs=q("select severity,count(*) from findings group by severity").values.sort((a,b)=>SEVO[a[0]]-SEVO[b[0]]);
  const kinds=q("select kind,severity,count(*) n,count(distinct session) s, max(rule) from findings group by kind,severity").values.sort((a,b)=>SEVO[a[1]]-SEVO[b[1]]||b[2]-a[2]);
  const fsev=el.dataset.sev||'', fkind=el.dataset.kind||'', only=el.dataset.only==='1'&&sel, fsrc=el.dataset.src||'';
  let where=[],args=[]; if(fsev){where.push('f.severity=?');args.push(fsev)} if(fkind){where.push('f.kind=?');args.push(fkind)} if(only){where.push('f.session=?');args.push(sel.id)} if(fsrc){where.push('f.source=?');args.push(fsrc)}
  const rows=q(`select f.severity,f.kind,s.title,f.t,f.evidence,f.session,f.rule,f.source,f.quote from findings f join sessions s on s.id=f.session ${where.length?'where '+where.join(' and '):''} order by case f.severity when 'critical' then 0 when 'high' then 1 when 'medium' then 2 when 'low' then 3 else 4 end, f.t limit 500`,args).values;
  let card='';
  if(sel&&sel.abp){ const a=sel.abp, x=sel.stats||{}, kinds_s=q('select distinct kind,severity,rule from findings where session=?',[sel.id]).values;
    const pol={agent:sel.title,session:sel.id,default:'deny',allow:{tools:Object.keys(a.tools||{}),repos_write:a.repos_written,repos_read:a.repos_read,hosts:Object.keys(a.hosts||{}),git:{push_branches:['dev'],force:false},sessions:{spawn:a.sessions.spawned>0,message:a.sessions.messaged>0,schedules:a.sessions.schedules_created>0}},deny:kinds_s.filter(k=>k[1]!=='info'&&k[1]!=='low').map(k=>({kind:k[0],rule:k[2]})),observed:{cost_usd:x.cost_usd,tool_calls:x.tool_calls,denials:a.denials.length}};
    card=`<div class="card" style="margin-bottom:14px"><h3>Observed ABP · ${esc(sel.title)}</h3><p class="note">What this session actually did, written as the deny-by-default policy that would allow exactly it, plus a deny rule for each finding.</p>${sel.review_summary?`<p><b>Reviewer's summary</b> ${esc(sel.review_summary)}</p>`:''}
    <p><b>Tools</b> ${Object.entries(a.tools||{}).map(([k,v])=>`<span class="chip">${esc(k)} ${v}</span>`).join('')}</p>
    <p><b>Writes to</b> ${(a.repos_written||[]).map(r=>`<span class="chip">${esc(r)}</span>`).join('')||'<span class="note">no repository</span>'} &nbsp; <b>reads</b> ${(a.repos_read||[]).map(r=>`<span class="chip">${esc(r)}</span>`).join('')}</p>
    <p><b>Hosts</b> ${Object.entries(a.hosts||{}).slice(0,25).map(([k,v])=>`<span class="chip">${esc(k)} ${v}</span>`).join('')||'<span class="note">none</span>'}</p>
    <p><b>Git</b> ${a.git.commits} commits · ${a.git.pushes} pushes · ${a.git.push_main} to main · ${a.git.force} forced &nbsp; <b>Sessions</b> ${a.sessions.spawned} started · ${a.sessions.messaged} messages · ${a.sessions.schedules_created} schedules created · ${a.sessions.schedules_enabled} re-enabled · ${a.sessions.stopped_or_deleted} stopped &nbsp; <b>Vaults</b> ${a.vaults_created} created &nbsp; <b>Secrets handled</b> ${a.secrets_touched}</p>
    <p><b>Mandate</b> (repositories its first instruction names): ${(a.mandate_repos_named||[]).map(r=>`<span class="chip">${esc(r)}</span>`).join('')||'<span class="note">none named</span>'}</p>
    ${a.denials.length?`<p><b>Refused by the harness</b> (${a.denials.length})</p>${a.denials.slice(0,8).map(d=>`<div class="msg tool_use"><div class="h">${esc(d.tool)} · ${esc((d.t||'').slice(0,16).replace('T',' '))}</div><div class="b">${esc(d.input)}</div></div>`).join('')}`:''}
    <p><b>A stronger policy would add</b></p><ul>${kinds_s.filter(k=>k[1]!=='info').map(k=>`<li><span class="chip">${esc(k[1])}</span> ${esc(k[2])} <span class="note">(${esc(k[0])})</span></li>`).join('')||'<li class="note">Nothing found beyond what the observed policy allows.</li>'}</ul>
    <button class="btn" id="dlpol">Download this policy (JSON)</button> <button class="btn" id="viewpol">View as JSON</button></div>`;
    S._pol=pol }
  el.innerHTML=`${card}<div class="vaults" style="margin-bottom:12px">${sevs.map(([s,n])=>`<div class="card" style="cursor:pointer" data-sev="${esc(s)}"><p>${esc(s)}</p><h3 style="font-size:22px">${fmt(n)}</h3></div>`).join('')||'<p class="note">Load a vault first.</p>'}</div>
  <div class="card" style="margin-bottom:12px"><h3>Findings by kind</h3><p class="note">Behaviour a stricter agent behaviour policy (ABP) would have denied or flagged. Click a row to filter.</p>${`<table><tr><th>Severity</th><th>Kind</th><th>Findings</th><th>Sessions</th><th>The rule that would prevent it</th></tr>${kinds.map(k=>`<tr data-kind="${esc(k[0])}" style="cursor:pointer"><td>${esc(k[1])}</td><td>${esc(k[0])}</td><td>${fmt(k[2])}</td><td>${fmt(k[3])}</td><td>${esc(k[4])}</td></tr>`).join('')}</table>`}</div>
  <p>${fsev||fkind||only?`Filtered: ${esc(fsev)} ${esc(fkind)} ${only?'· this session':''} <button class="btn" id="clrf">Clear</button>`:''} ${sel?`<label><input type="checkbox" id="onlysel" ${only?'checked':''}> only ${esc(sel.title)}</label>`:''} <select id="fsrc" style="width:auto"><option value="">rules and reviews</option><option value="review" ${fsrc==='review'?'selected':''}>reviews only (judgement)</option><option value="rule" ${fsrc==='rule'?'selected':''}>rules only</option></select> <span class="note">${rows.length}${rows.length===500?'+':''} findings</span></p>
  ${rows.map(r=>`<div class="msg ${r[0]==='critical'||r[0]==='high'?'person':'tool_use'}" style="cursor:pointer" data-s="${esc(r[5])}" data-t="${esc(r[3])}"><div class="h"><b>${esc(r[0])}</b> · ${r[7]==='review'?'<span class="chip">review</span>':'<span class="chip">rule</span>'} ${esc(r[1])} · ${esc(r[2])} · ${esc((r[3]||'').slice(0,16).replace('T',' '))}</div><div class="b">${esc(r[4])}${r[6]&&r[7]==='review'?`\n<i>Rule: ${esc(r[6])}</i>`:''}${r[8]?`\n<span class="note">Evidence: ${esc(r[8])}</span>`:''}</div></div>`).join('')}`;
  el.querySelectorAll('[data-sev]').forEach(c=>c.onclick=()=>{el.dataset.sev=el.dataset.sev===c.dataset.sev?'':c.dataset.sev;renderABP()});
  el.querySelectorAll('[data-kind]').forEach(c=>c.onclick=()=>{el.dataset.kind=el.dataset.kind===c.dataset.kind?'':c.dataset.kind;renderABP()});
  const cl=$('#clrf'); if(cl) cl.onclick=()=>{el.dataset.sev='';el.dataset.kind='';el.dataset.only='';renderABP()};
  const fs2=$('#fsrc'); if(fs2) fs2.onchange=()=>{el.dataset.src=fs2.value;renderABP()};
  const os=$('#onlysel'); if(os) os.onchange=()=>{el.dataset.only=os.checked?'1':'';renderABP()};
  const dl=$('#dlpol'); if(dl) dl.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S._pol,null,1)],{type:'application/json'}));a.download='abp-'+(sel.title||sel.id).replace(/[^\w@.-]+/g,'_')+'.json';a.click()};
  const vp=$('#viewpol'); if(vp) vp.onclick=()=>{S.jsonDoc={label:'ABP · '+sel.title,data:S._pol};S.jsonCur='doc';show('json')};
  el.querySelectorAll('.msg[data-s]').forEach(m=>m.onclick=()=>{const s=m.dataset.s; openSession(s); });
}
// JSON viewer
function jtree(v,k,depth){ const key=k!=null?`<span class="k">${esc(k)}</span>: `:'';
  if(v===null||typeof v!=='object'){ const cls=typeof v==='string'?'s':'n'; let t=JSON.stringify(v); if(t&&t.length>300)t=t.slice(0,300)+'…"'; return `<div>${key}<span class="${cls}">${esc(t)}</span></div>` }
  const isA=Array.isArray(v), ks=isA?v.map((_,i)=>i):Object.keys(v), n=ks.length;
  const inner=()=>ks.slice(0,500).map(i=>jtree(v[i],i,depth+1)).join('')+(n>500?`<div class="note">… ${n-500} more</div>`:'');
  return `<details ${depth<1?'open':''}><summary>${key}${isA?'['+n+']':'{'+n+'}'}</summary>${depth<1?inner():'<i data-lazy></i>'}</details>` }
function renderJSONTab(){
  const docs=[['catalog',{label:'catalog/index.json',data:S.catalog}]]; if(S.jsonDoc) docs.unshift(['doc',S.jsonDoc]);
  const cur=S.jsonCur&&docs.find(d=>d[0]===S.jsonCur)?S.jsonCur:docs[0][0]; S.jsonCur=cur;
  $('#jsrc').innerHTML=docs.map(([id,d])=>`<button class="btn ${id===cur?'primary':''}" data-j="${id}">${esc(d.label)}</button>`).join('')+` <label><input type="checkbox" id="jraw"> raw text</label>`;
  const d=docs.find(x=>x[0]===cur)[1];
  const draw=()=>{ $('#jview').innerHTML=$('#jraw').checked?`<pre class="json">${esc(JSON.stringify(d.data,null,1).slice(0,3e6))}</pre>`:`<div class="tree">${jtree(d.data,null,0)}</div>`; wireLazy(d.data) };
  $('#jsrc').querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{ S.jsonCur=b.dataset.j; renderJSONTab() }); $('#jraw').onchange=draw; draw();
}
function wireLazy(root){ $('#jview').querySelectorAll('details').forEach(det=>det.addEventListener('toggle',()=>{ const lz=det.querySelector(':scope > [data-lazy]'); if(!lz) return;
  const path=[]; let n=det; while(n&&n.matches&&n.matches('details')){ const k=n.querySelector(':scope > summary > .k'); if(k) path.unshift(k.textContent); n=n.parentElement.closest('details') }
  let v=root; for(const p of path) v=v[p]; const ks=Array.isArray(v)?v.map((_,i)=>i):Object.keys(v); lz.outerHTML=ks.slice(0,500).map(i=>jtree(v[i],i,2)).join('')+(ks.length>500?`<div class="note">… ${ks.length-500} more</div>`:''); wireLazy(root) },{once:true})) }
function err(e){ console.error(e); setStat('error: '+(e&&e.message||e)) }

// ---------- start ----------
async function start(){
  if(!inVault()&&params.get('vault')){ // standalone: open the master vault by its key (#vault=<vault_id>&key=<read key>&endpoint=…)
    S.master=await openByKey({vault_id:params.get('vault'),read_key:params.get('key'),endpoint:params.get('endpoint')||'https://dev.send.sgraph.ai'}) }
  await initDB();
  S.catalog=await readJSON('catalog/index.json'); S.vaults=S.catalog.vaults||[]; S.vaults.forEach(addVaultRow);
  renderVaults(); renderList(); setStat();
  if(params.get('load')==='all') for(const v of S.vaults) await loadVault(v.name).catch(err);
  try{ window.parent&&window.parent.postMessage({type:'sg-app-ready'},'*') }catch(e){}
}
start().catch(e=>{ err(e); $('#v-vaults').innerHTML='<p class="err">Could not open the archive: '+esc(e.message)+'</p>'; try{ window.parent&&window.parent.postMessage({type:'sg-app-ready'},'*') }catch(x){} });
})();
</script>
</body>
</html>
