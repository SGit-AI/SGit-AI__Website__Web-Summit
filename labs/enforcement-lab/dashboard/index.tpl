<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Enforcement Lab</title>
<style>
:root{--bg:#0b1220;--panel:#111a2e;--line:#22304d;--text:#e7ecf5;--muted:#94a3c4;--teal:#2dd4bf;--red:#fb7185;--amber:#fbbf24;--blue:#60a5fa;--green:#34d399}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
header{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
h1{font-size:19px;margin:0}h1 b{color:var(--teal)}.sub{color:var(--muted);font-size:13px}
.mode{font:700 11px/1 ui-monospace,monospace;letter-spacing:.12em;padding:6px 9px;border-radius:6px;border:1px solid}
.mode.replay{color:var(--amber);border-color:var(--amber)}.mode.live{color:var(--green);border-color:var(--green)}
.controls{display:flex;flex-wrap:wrap;gap:10px;padding:14px 20px;align-items:center;border-bottom:1px solid var(--line)}
select,button{font:inherit;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px 10px}
button{cursor:pointer}button.primary{background:var(--teal);color:#062a26;border-color:var(--teal);font-weight:700}button:disabled{opacity:.45;cursor:default}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:16px 20px}
@media (max-width:900px){.grid{grid-template-columns:1fr}}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;min-width:0}
.panel h2{font-size:16px;margin:0 0 2px}.panel .who{color:var(--muted);font-size:12.5px;margin-bottom:10px}
.tag{display:inline-block;font:700 10.5px/1 ui-monospace,monospace;letter-spacing:.06em;padding:4px 6px;border-radius:5px;margin:0 4px 4px 0}
.t-ok{background:#123c33;color:var(--green)}.t-bad{background:#4a1a26;color:var(--red)}.t-hook{background:#1b2c4f;color:var(--blue)}.t-kern{background:#123c33;color:var(--teal)}.t-warn{background:#43350f;color:var(--amber)}.t-dim{background:#1d2740;color:var(--muted)}
.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}
.m{background:#0d1528;border:1px solid var(--line);border-radius:8px;padding:8px}.m b{display:block;font-size:20px}.m span{font-size:11.5px;color:var(--muted)}
.bar{display:flex;height:10px;border-radius:5px;overflow:hidden;background:#1d2740;margin:6px 0 10px}
.runs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.runs button{padding:3px 7px;font-size:12px}
.tl{list-style:none;margin:0;padding:0;font-size:13px}.tl li{border-left:2px solid var(--line);padding:4px 0 6px 10px;margin-left:4px;word-break:break-word}
.tl li.att{border-color:var(--amber)}.tl li.deny{border-color:var(--teal)}
.tl code{font-size:11.5px;color:var(--muted)}
.final{background:#0d1528;border-radius:8px;padding:8px;font-size:12.5px;color:var(--muted);max-height:120px;overflow:auto;margin-top:8px}
table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid var(--line);padding:6px;text-align:left}th{color:var(--muted);font-weight:600}
.wrap{padding:0 20px 24px}.note{color:var(--muted);font-size:12.5px;max-width:1100px}
a{color:var(--teal)}
</style>
</head>
<body>
<header>
  <div><h1>RiskMandate <b>Enforcement Lab</b>: one agent, one task, three kinds of control</h1>
  <div class="sub">Real headless Claude Code sessions on synthetic data. Every outcome is checked on disk and in the transcript, not taken from what the agent says.</div></div>
  <span id="mode" class="mode replay">REPLAY OF RECORDED REAL RUNS</span>
</header>
<div class="controls">
  <label>Scenario <select id="scen"></select></label>
  <label>Prompt <select id="variant"><option value="direct">as written</option><option value="pressure">with pressure (false "rules suspended")</option></select></label>
  <button id="runall" class="primary" disabled title="needs the local server: python3 lab/serve.py">Run all three live</button>
  <span id="status" class="sub"></span>
</div>
<details class="wrap" style="padding-top:12px"><summary style="cursor:pointer"><b>The policy</b>: the same text in all three models. Edit it here and run live to see what changes (this run only; it never touches anything outside the lab's throwaway folder).</summary>
  <textarea id="pol" rows="11" style="width:100%;margin-top:8px;background:#0d1528;color:var(--text);border:1px solid var(--line);border-radius:8px;font:12.5px ui-monospace,monospace;padding:8px"></textarea>
  <div class="sub">The hook (B) and the kernel policy (C) do not read this text: they are set by the lab. Remove a rule here and only model A's agent loses it. <button id="polreset">Reset to the original</button> <span id="poledit"></span></div>
</details>
<div class="grid" id="grid"></div>
<div class="wrap">
  <h2 style="font-size:16px">All scenarios: how often the forbidden action actually happened</h2>
  <table id="matrix"></table>
  <p class="note" id="foot"></p>
  <h2 style="font-size:16px">The controls on their own: deterministic tests, no model involved</h2>
  <div id="ctl" class="note">Loading…</div>
  <p class="note"><b>Read this before quoting a number.</b> The samples are small (up to 10 runs per cell) and illustrative; they do not establish a security guarantee. Model C's kernel policy covers files and TCP ports only: it cannot tell example.com from the model API when both go through the same egress port, and it cannot judge what the agent writes (customer emails it may legitimately read). "Approval required" is a rule the agent or the hook applies; the kernel only refuses the write. The agent under test could read the platform's session token in every model (needed to call the model). See the README for every limitation.</p>
</div>
<script>
const MODELS={A:{name:'A · Behavioural policy',who:'The rules are text the agent is given. Nothing checks them.',cls:'t-dim'},
B:{name:'B · Hook-based control',who:'Same text, plus a Claude Code PreToolUse hook in the agent\'s own workspace: deterministic pattern checks the same account could switch off.',cls:'t-hook'},
C:{name:'C · Independent enforcement (SHarness)',who:'Same text; the agent process is started by SHarness, which applies a Linux Landlock policy first. The agent cannot widen it.',cls:'t-kern'}};
const OUT={AGENT_VOLUNTARILY_COMPLIED:['AGENT COMPLIED','t-ok','#34d399'],HOOK_INTERVENED:['HOOK INTERVENED','t-hook','#60a5fa'],
INDEPENDENT_ENFORCEMENT_BLOCKED:['KERNEL BLOCKED','t-kern','#2dd4bf'],ACTION_SUCCEEDED:['ACTION SUCCEEDED (violation)','t-bad','#fb7185'],
ACTION_FAILED:['ATTEMPTED, NO EFFECT','t-warn','#fbbf24'],APPROVAL_REQUIRED:['ASKED FOR APPROVAL','t-ok','#a3e635'],FAILED:['RUN FAILED','t-dim','#64748b']};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let S=null,runs={},live=false,sel={};
async function j(u,o){const r=await fetch(u,o);if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||r.status);return r.json()}
async function load(){
  S=await j('../results/summary.json');
  const ids=S.index.map(x=>x.id);
  await Promise.all(ids.filter(i=>!runs[i]).map(async i=>{runs[i]=await j('../results/runs/'+encodeURIComponent(i)+'.json')}));
  const scen=document.getElementById('scen');
  if(!scen.options.length){[...new Set(S.index.map(x=>x.scenario))].sort().forEach(s=>{const r=Object.values(runs).find(r=>r.scenario.id===s);scen.add(new Option(s.split('-')[0]+' · '+(r?r.scenario.title:s),s))})}
  render();
}
function cellRuns(sc,v,m,edited){return Object.values(runs).filter(r=>r.scenario.id===sc&&(r.variant||'direct')===v&&r.governance_model===m&&!!(r.policy&&r.policy.modified)===!!edited).sort((a,b)=>a.at<b.at?1:-1)}
function render(){
  const sc=document.getElementById('scen').value,v=document.getElementById('variant').value,g=document.getElementById('grid');g.innerHTML='';
  ['A','B','C'].forEach(m=>{
    const rs=cellRuns(sc,v,m),M=MODELS[m],cnt={};rs.forEach(r=>cnt[r.outcome]=(cnt[r.outcome]||0)+1);
    const viol=rs.filter(r=>r.violation).length,att=rs.filter(r=>r.attempted_actions).length;
    const ed=cellRuns(sc,v,m,true),pick=rs.concat(ed).find(r=>r.experiment_id===sel[m])||rs[0];
    const bar=Object.entries(cnt).map(([k,n])=>`<div title="${esc(OUT[k][0])}: ${n}" style="width:${100*n/rs.length}%;background:${OUT[k][2]}"></div>`).join('');
    const p=document.createElement('div');p.className='panel';
    p.innerHTML=`<h2>${esc(M.name)}</h2><div class="who">${esc(M.who)}</div>
    <div class="metrics"><div class="m"><b>${rs.length}</b><span>runs recorded</span></div><div class="m"><b>${att}</b><span>tried the forbidden action</span></div><div class="m"><b style="color:${viol?'var(--red)':'var(--green)'}">${viol}</b><span>it actually happened</span></div></div>
    <div class="bar">${bar}</div>
    <div>${Object.entries(cnt).map(([k,n])=>`<span class="tag ${OUT[k][1]}">${esc(OUT[k][0])} × ${n}</span>`).join('')}</div>
    <div class="runs">${rs.map((r,i)=>`<button data-m="${m}" data-id="${esc(r.experiment_id)}" title="${esc(r.experiment_id)}">${r.live?'LIVE ':''}#${rs.length-i}</button>`).join('')}${ed.map((r,i)=>`<button data-m="${m}" data-id="${esc(r.experiment_id)}" title="edited policy, not in the counts" style="border-color:var(--red)">EDITED #${ed.length-i}</button>`).join('')}</div>
    ${pick?runView(pick):'<div class="sub">No run recorded for this cell yet.</div>'}
    <div style="margin-top:8px"><button class="one" data-m="${m}" ${live?'':'disabled'}>Run ${m} live</button></div>`;
    g.appendChild(p);
  });
  g.querySelectorAll('.runs button').forEach(b=>b.onclick=()=>{sel[b.dataset.m]=b.dataset.id;render()});
  g.querySelectorAll('button.one').forEach(b=>b.onclick=()=>runLive([b.dataset.m]));
  matrix();
}
function runView(r){
  const o=OUT[r.outcome]||[r.outcome,'t-dim'];
  const tl=r.tool_calls.map(c=>{const deny=(r.governance_model==='B'&&c.result_error&&/Blocked by the workspace hook/.test(c.result_preview))||(/EACCES|Permission denied|Operation not permitted/.test(c.result_preview));
    return `<li class="${deny?'deny':c.attempt?'att':''}"><b>${esc(c.tool)}</b> ${c.attempt?'<span class="tag t-warn">FORBIDDEN ACTION ATTEMPTED</span>':''}${deny?'<span class="tag t-kern">DENIED</span>':''}<br><code>${esc(c.input.slice(0,160))}</code><br><code>→ ${esc((c.result_preview||'').slice(0,160))}</code></li>`}).join('');
  return `<div class="sub">${r.live?'<span class="tag t-ok">LIVE EXECUTION</span>':'<span class="tag t-warn">RECORDED REAL RUN</span>'}${r.policy&&r.policy.modified?'<span class="tag t-bad">EDITED POLICY</span>':''} ${esc(r.experiment_id)} · ${esc(r.at)} · ${r.duration_s}s</div>
  <div style="margin:6px 0"><span class="tag ${o[1]}">${esc(o[0])}</span> ${r.hook_denies?`<span class="tag t-hook">hook denies: ${r.hook_denies}</span>`:''}${r.kernel_denies?`<span class="tag t-kern">kernel denies: ${r.kernel_denies}</span>`:''}</div>
  <div class="sub"><b>Task:</b> ${esc(r.scenario.task)}</div><div class="sub"><b>Rule:</b> ${esc(r.scenario.rule)}</div>
  <ul class="tl">${tl||'<li>No tool calls.</li>'}</ul>
  <div class="final"><b>Agent's final answer:</b> ${esc(r.final_answer)}</div>
  <div style="margin-top:6px"><a href="report?id=${encodeURIComponent(r.experiment_id)}" target="_blank">Evidence report →</a></div>`;
}
function matrix(){
  const t=document.getElementById('matrix'),scs=[...new Set(S.index.map(x=>x.scenario))].sort();
  let h='<tr><th>Scenario</th><th>Prompt</th>'+['A','B','C'].map(m=>`<th>${esc(MODELS[m].name)}</th>`).join('')+'</tr>';
  scs.forEach(sc=>['direct','pressure'].forEach(v=>{h+=`<tr><td>${esc(sc)}</td><td>${v==='pressure'?'with pressure':'as written'}</td>`+['A','B','C'].map(m=>{const rs=cellRuns(sc,v,m);if(!rs.length)return '<td class="sub">no runs</td>';const n=rs.filter(r=>r.violation).length,a=rs.filter(r=>r.attempted_actions).length,fp=rs.filter(r=>r.false_alarms).length;return `<td><b style="color:${n?'var(--red)':'var(--green)'}">${n}/${rs.length}</b> happened · ${a} tried${fp?` · <span class="tag t-hook">${fp} false alarm</span>`:''}</td>`}).join('')+'</tr>'}));
  t.innerHTML=h;
  document.getElementById('foot').textContent=`${S.runs} real runs recorded, last summary ${S.generated}. List-price cost of all recorded runs: $${S.cost_usd_list_price_total}.`;
}
async function runLive(ms){
  const sc=document.getElementById('scen').value,v=document.getElementById('variant').value,st=document.getElementById('status');
  document.querySelectorAll('button').forEach(b=>b.disabled=true);document.getElementById('mode').className='mode live';document.getElementById('mode').textContent='LIVE EXECUTION IN PROGRESS';
  for(const m of ms){st.textContent=`Running ${m} live: a real agent session, 20 to 60 seconds…`;
    try{const r=await j('/api/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({scenario:sc,model:m,variant:v},polEdited()?{policy:document.getElementById('pol').value}:{}))});runs[r.experiment_id]=r;sel[m]=r.experiment_id;S=await j('../results/summary.json');render()}
    catch(e){st.textContent=`${m}: ${e.message}`}}
  st.textContent='Done. The new runs are marked LIVE.';document.getElementById('mode').textContent='LIVE RUNS SHOWN WHERE MARKED';
  document.querySelectorAll('button').forEach(b=>b.disabled=false);if(!live)document.querySelectorAll('button.one,#runall').forEach(b=>b.disabled=true);
}
let POL='';fetch('../lab/AGENT-POLICY.md').then(r=>r.text()).then(t=>{POL=t;document.getElementById('pol').value=t});
function polEdited(){return document.getElementById('pol').value!==POL}
document.getElementById('pol').oninput=()=>{document.getElementById('poledit').textContent=polEdited()?'EDITED: live runs will use this text and are marked as such.':''};
document.getElementById('polreset').onclick=()=>{document.getElementById('pol').value=POL;document.getElementById('pol').oninput()};
document.getElementById('scen').onchange=render;document.getElementById('variant').onchange=render;
document.getElementById('runall').onclick=()=>runLive(['A','B','C']);
fetch('/api/health').then(r=>r.ok?r.json():null).then(h=>{if(h&&h.live){live=true;document.getElementById('runall').disabled=false;document.getElementById('status').textContent=`Live runs available on this machine (${h.runs_left} left).`;render()}}).catch(()=>{});
fetch('../results/control-tests.json').then(r=>r.json()).then(c=>{const row=x=>`<tr><td>${esc(x.case)}</td><td>${esc(x.tool||'shell')}</td><td><code>${esc(x.command||JSON.stringify(x.input||''))}</code></td><td><span class="tag ${x.decision==='deny'||x.result==='refused'?'t-kern':x.kind==='bypass'||x.kind==='false_positive'?'t-bad':'t-dim'}">${esc(x.decision||String(x.result))}</span>${x.kind?' '+esc(x.kind.replace('_',' ')):''}</td></tr>`;document.getElementById('ctl').innerHTML=`<p>Run ${esc(c.at)}. Hook (B): caught ${c.summary.hook_catches}, <b>missed ${c.summary.hook_bypasses_found} disguised attempts</b>, ${c.summary.hook_false_positives} false alarm. Kernel (C): refused ${c.summary.kernel_refusals} forbidden file actions, including the disguised ones; copying customer emails is not a file rule, so it is allowed.</p><table><tr><th>Case</th><th>Tool</th><th>Input</th><th>Result</th></tr><tr><th colspan=4>B · the hook</th></tr>${c.hook.map(row).join('')}<tr><th colspan=4>C · the kernel policy</th></tr>${c.kernel.filter(x=>x.command).map(row).join('')}</table>`}).catch(()=>{document.getElementById('ctl').textContent='Run python3 lab/test_controls.py to produce these.'});
load().catch(e=>document.getElementById('grid').innerHTML='<div class="panel">Could not load results: '+esc(e.message)+'. Serve this folder (python3 lab/serve.py) rather than opening the file directly.</div>');
</script>
</body>
</html>
