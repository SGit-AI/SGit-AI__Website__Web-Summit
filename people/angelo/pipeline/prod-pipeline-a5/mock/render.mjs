#!/usr/bin/env node
// prod-pipeline-a5: render A3's strip and trace page (pool/prod-pipeline-a3, 8193766) from one trace file, as drawn ("asis")
// and with the rules proposed in ../sim.md ("rules"). kilo.large.worker@PrompTugal.angelo (design), 11 November 2026.
//   node render.mjs <trace.json> <id> <out-dir>    writes <out-dir>/trace-<id>.htm, trace-<id>-rules.htm, strip-<id>.json
// The markup and classes are A3's (mock/flow.css, copied unchanged); only the data and the rules are new.
import { readFileSync, writeFileSync } from 'node:fs';
const [file, id, dir] = process.argv.slice(2);
const T = JSON.parse(readFileSync(file, 'utf8'));
const steps = T.steps.filter((s) => s.t && s.t !== 'unknown');
const hm = (t) => t.slice(11, 16), min = (t) => Date.parse(t) / 60000;
const dur = (m) => { m = Math.round(m); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`; };
const short = (w) => w.replace(/\.fringe@PrompTugal\.(\w+)$/, ' ($1)').replace(/@PrompTugal\.(\w+)$/, ' ($1)').replace(/^an agent \(no name.*/, 'unnamed');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// A3's lanes (by kind of actor), mapped from git: the trace's kind first, then the agent's role in its name.
const LANES = ['People', 'Source', 'Research', 'Lead', 'Build', 'CI'];
const lane = (s) => s.kind === 'human' ? 0 : s.kind === 'source-read' ? 1 : (s.kind === 'ci' || s.kind === 'deploy') ? 5
  : (s.data && /^changed data\/[^ ,]+: /.test(s.what)) ? 1 : /researcher|capture|social/.test(s.who) ? 2
  : /conductor|architect|lead|fable|advisor/.test(s.who) ? 3 : 4;
const kindOf = (s) => (s.kind === 'ci' ? 'ci' : s.kind === 'deploy' ? 'deploy' : s.kind);
const agents = [...new Set(steps.map((s) => s.who))];
const people = new Set(steps.filter((s) => s.kind === 'human').map((s) => s.who)).size;
const first = steps[0], last = steps.at(-1), last0 = last;

// ---- the rules (sim.md): window = the last change (a burst ends after IDLE minutes with no step) ----
const IDLE = 30, WMAX = 60, LANE_CAP = 7;   // a change ends after 30 idle minutes; the window is at most the last 60 minutes
let w0 = steps.length - 1; while (w0 > 0 && min(steps[w0].t) - min(steps[w0 - 1].t) < IDLE && min(last0.t) - min(steps[w0 - 1].t) <= WMAX) w0--;
const win = steps.slice(w0);
const changes = 1 + steps.filter((s, i) => i && min(s.t) - min(steps[i - 1].t) >= IDLE).length;

// ---- the strip ----
const li = (cls, href, label, t) => `<li class="${cls}"><a href="${href}"><span class="fs-d"></span><span data-flow-label>${esc(label)}</span><span class="fs-t">${t}</span></a></li>`;
function stripAsis(href) {   // A3's stations, picked mechanically for a git-only trace
  const builder = steps.find((s) => s.kind === 'agent' && /admin\/build\/(home|programme|graph)\.mjs/.test(s.what)) || steps[1];
  const data = steps.filter((s) => s.data), dataFirst = data[0];
  const st = [li('s-ask', href + '#s-' + first.n, 'First', hm(first.t))];
  if (dataFirst) st.push(li('s-read quiet', href + '#s-' + dataFirst.n, 'Read', hm(dataFirst.t)));
  st.push(li('lv3', href + '#s-' + builder.n, 'Built', hm(builder.t)));
  const mid = steps[Math.floor(steps.length / 2)];
  st.push(li('lv4 quiet', href + '#s-' + mid.n, `${steps.length} commits`, hm(mid.t)));
  if (data.length) st.push(li('lv4 quiet s-read', href + '#s-' + data.at(-1).n, `${data.length} data`, hm(data.at(-1).t)));
  st.push(li('s-live', href + '#s-' + last.n, 'Live', hm(last.t)));
  st.push(li('s-now', href + '#s-' + last.n, 'Now', hm(T.traced_at)));
  return { k: 'How this page was made', h: `From the first commit to live in ${dur(min(last.t) - min(first.t))} <span>· ${people} ${people === 1 ? 'person' : 'people'} · ${agents.length} agents · ${steps.length} commits</span>`, line: st.join(''), f: `<a href="${href}">See every step</a> · from the git record · taken ${hm(T.traced_at)}` };
}
function stripRules(href, running) {   // the window: the last change only; the history is one link
  const wa = [...new Set(win.map((s) => s.who))];
  const st = [li('s-ask', href + '#s-' + win[0].n, 'Started', hm(win[0].t))];
  wa.slice(0, 3).forEach((a, i) => { const s = win.find((x) => x.who === a); st.push(li((i ? 'lv3 ' : '') + (i > 1 ? 'lv4 ' : '') + 'quiet', href + '#s-' + s.n, short(a).replace(/ \(.*/, ''), hm(s.t))); });
  if (running) { st.push(li('s-live lv2', href + '#s-' + last.n, 'Live', hm(last.t))); st.push(li('s-run', href + '#run', running.role, hm(running.since) + ' &rarr;')); }
  else { st.push(li('s-live', href + '#s-' + last.n, 'Live', hm(last.t))); st.push(li('s-now', href + '#s-' + last.n, 'Now', hm(T.traced_at))); }
  const head = running ? `Working now: ${esc(running.role)}, since ${hm(running.since)} <span>· last change ${win.length} commits, ${wa.length} agents</span>`
    : `Last change: ${dur(Math.max(1, min(last.t) - min(win[0].t)))} <span>· ${win.length} commits · ${wa.length} ${wa.length === 1 ? 'agent' : 'agents'}</span>`;
  return { k: running ? 'How this page is being made' : 'How this page was made', h: head, line: st.join(''),
    f: `<a href="${href}">See every step</a> · ${changes} ${changes === 1 ? 'change' : 'changes'}, ${steps.length} commits, ${agents.length} agents since ${hm(first.t)}${running ? ' · running: status.json' : ''}` };
}
const stripHtml = (s) => `<section class="fs" data-flow="strip" aria-labelledby="fs-h"><p class="fs-k">${s.k}</p><h2 class="fs-h" id="fs-h">${s.h}</h2><ol class="fs-line">${s.line}</ol><p class="fs-f">${s.f}</p></section>`;

// ---- the trace page (A3's markup; the script draws from S) ----
function tracePage(rules) {
  const sel = rules ? win : steps;
  const strip = rules ? stripRules('') : stripAsis('');
  const base = (a) => short(a).replace(/ \(.*/, ''), dup = new Set(agents.map(base).filter((b, i, A) => A.indexOf(b) !== i));
  const AGL = agents.map((a) => dup.has(base(a)) ? base(a) + '·' + (short(a).match(/\((\w+)\)/) || [, '?'])[1] : base(a));
  const S = sel.map((s) => [s.n, lane(s), hm(s.t), kindOf(s), agents.indexOf(s.who)]);
  const stn = new Set([...strip.line.matchAll(/#s-(\d+)/g)].map((m) => +m[1]));
  const byA = Object.entries(sel.reduce((o, s) => (o[s.who] = (o[s.who] || 0) + 1, o), {})).sort((a, b) => b[1] - a[1]).map(([w]) => agents.indexOf(w));
  const span = `${hm(sel[0].t)} to ${hm(sel.at(-1).t)}`;
  const nA = new Set(sel.map((s) => s.who)).size;
  const h2 = rules ? `The last change: ${sel.length} steps, ${nA} agents, ${span}` : `${sel.length} steps, ${LANES.length} lanes, ${span}`;
  const hist = rules ? `<p class="fp-note">Whole history: ${steps.length} steps, ${agents.length} agents, ${changes} ${changes === 1 ? 'change' : 'changes'} since ${hm(first.t)}. <a href="#all">Show all changes</a></p>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>A5 simulation: the trace page for ${esc(T.page || T.page_id)}${rules ? ', with the rules' : ''}</title><link rel="stylesheet" href="flow.css">
<!-- kilo.large.worker@PrompTugal.angelo, prod-pipeline-a5 (design simulation, static, not live). A3's trace page (8193766)
     filled from ${esc(file.replace(/.*\//, ''))} (${T.steps.length} steps${T.repo_head ? ', Fringe dev at ' + T.repo_head : ''}). ${rules ? 'With the rules of sim.md: window = the last change (at most 60 min), columns folded by minute, at most ' + LANE_CAP + ' agent lanes then "others".' : 'As A3 draws it: every step, one column per step.'} -->
<style>.fp-note a{display:inline-flex;align-items:center;min-height:44px;color:var(--brand);font-weight:600}.cell a b{position:absolute;font:600 12px/1 var(--mono);color:var(--ink);transform:translate(9px,-9px)}.cell a{position:relative}</style>
</head><body><main>
<h1>How this page was made</h1>
<p class="dek">Every step behind ${esc(T.page || '')}, from the git record.</p>
${stripHtml(strip)}
<section class="fp" data-flow="plot" aria-labelledby="fp-h">
 <div class="fp-top"><h2 id="fp-h">${h2}</h2>
  <div class="fp-btns"><button class="btn opt" type="button" aria-pressed="false" id="by">By agent</button><button class="btn opt" type="button" id="rp">&#9654; Replay</button><button class="btn" type="button" aria-expanded="false" aria-controls="sc" id="tg">Show the flow</button></div></div>
 <ul class="ov" aria-label="Steps per lane; ringed marks are the strip's stations"></ul>
 <div class="sc" id="sc" tabindex="0" aria-label="The flow, step by step; scrolls sideways"><div class="grid"></div></div>
 <p class="fp-note">One mark per ${rules ? 'minute and lane (a number: several steps)' : 'step'}; ringed in yellow: the strip's stations.</p>${hist}
</section>
</main>
<script>
const LANES=${JSON.stringify(LANES)}, AG=${JSON.stringify(AGL)}, BYA=${JSON.stringify(byA)}, CAP=${rules ? LANE_CAP : 999}, FOLD=${rules};
const S=${JSON.stringify(S)};
const STN=new Set(${JSON.stringify([...stn])});
const mn=(t)=>+t.slice(0,2)*60+ +t.slice(3), t0=mn(S[0][2]), t1=Math.max(mn(S[S.length-1][2]),t0+1);
const sec=document.querySelector('.fp'), ov=sec.querySelector('.ov'), grid=sec.querySelector('.grid'), tg=document.getElementById('tg'), by=document.getElementById('by');
function rows(agent){ if(!agent) return LANES.map((l,i)=>({l,f:(s)=>s[1]===i,k:'k'+i}));
  const top=BYA.slice(0,CAP), r=top.map((a,i)=>({l:AG[a],f:(s)=>s[4]===a,k:'k'+(i%5+1)}));
  if(BYA.length>CAP) r.push({l:'+'+(BYA.length-CAP)+' more',f:(s)=>!top.includes(s[4]),k:'k0'}); return r; }
function draw(agent){ const R=rows(agent);
  ov.innerHTML=R.map((r)=>{const st=S.filter(r.f);return '<li class="'+r.k+'"><span data-flow-label>'+r.l+'</span><span class="bar" aria-hidden="true">'+st.map(s=>'<i class="'+(STN.has(s[0])?'st':'')+'" style="left:'+((mn(s[2])-t0)/(t1-t0)*100).toFixed(1)+'%"></i>').join('')+'</span><span class="n">'+st.length+'</span></li>'}).join('');
  // columns: one per step (as drawn) or one per minute (folded)
  const cols=[]; S.forEach((s)=>{const c=cols[cols.length-1]; if(FOLD&&c&&c.t===s[2]) c.s.push(s); else cols.push({t:s[2],s:[s]})});
  let last=-9, prev=null; const ax=cols.map((c,i)=>{const m=mn(c.t), gap=prev!==null&&m-prev>5; const show=(gap||m!==prev)&&i-last>=3; prev=m; if(!show) return '<span class="cell"></span>'; last=i; return '<span class="cell'+(gap?' gap':'')+'"><span data-flow-label>'+c.t+'</span></span>'});
  grid.innerHTML='<div class="ax"><span class="ln"></span>'+ax.join('')+'</div>'+R.map((r)=>'<div class="row '+r.k+'"><span class="ln" data-flow-label>'+r.l+'</span>'+cols.map((c,i)=>{const h=c.s.filter(r.f); if(!h.length) return '<span class="cell"></span>'; const s=h[0], st=h.some(x=>STN.has(x[0]));
    return '<span class="cell"><a id="s-'+s[0]+'" href="#s-'+s[0]+'" style="--i:'+i+'" class="'+(s[3]==='ci'?'ci ':s[3]==='deploy'?'dep ':'')+(st?'st':'')+'" aria-label="'+c.t+' UTC, '+h.length+' step'+(h.length>1?'s':'')+', '+r.l+'">'+(h.length>1?'<b>'+h.length+'</b>':'')+'</a></span>'}).join('')+'</div>').join('');
  grid.dataset.cols=cols.length; grid.dataset.rows=R.length; }
draw(false);
const set=(o)=>{sec.classList.toggle('open',o);tg.setAttribute('aria-expanded',o);tg.textContent=o?'Overview':'Show the flow'};
tg.addEventListener('click',()=>set(!sec.classList.contains('open')));
by.addEventListener('click',()=>{const p=by.getAttribute('aria-pressed')!=='true';by.setAttribute('aria-pressed',p);draw(p)});
document.getElementById('rp').addEventListener('click',()=>{grid.classList.remove('replay');void grid.offsetWidth;grid.classList.add('replay')});
if(/^#(open|agent|s-)/.test(location.hash)) set(true);
if(location.hash==='#agent'){by.setAttribute('aria-pressed','true');draw(true)}
</script></body></html>
`;
}
writeFileSync(`${dir}/trace-${id}.htm`, tracePage(false));
writeFileSync(`${dir}/trace-${id}-rules.htm`, tracePage(true));
const href = `trace-${id}.htm`, run = { role: 'design', since: new Date(Date.parse(T.traced_at) - 6 * 60000).toISOString() };
const out = { asis: stripHtml(stripAsis(href)), rules: stripHtml(stripRules(href.replace('.htm', '-rules.htm'))), running: stripHtml(stripRules(href.replace('.htm', '-rules.htm'), run)),
  stats: { steps: steps.length, agents: agents.length, people, changes, window_steps: win.length, window_agents: new Set(win.map((s) => s.who)).size, window_from: win[0].t, first: first.t, last: last.t,
    columns_asis: steps.length, columns_folded_all: new Set(steps.map((s) => s.t.slice(0, 16))).size, columns_folded_window: new Set(win.map((s) => s.t.slice(0, 16))).size } };
writeFileSync(`${dir}/strip-${id}.json`, JSON.stringify(out, null, 1) + '\n');
console.log(id, JSON.stringify(out.stats));
