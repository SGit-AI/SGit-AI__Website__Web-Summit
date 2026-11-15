#!/usr/bin/env node
// crm-pipeline-d1 mocks (design@PrompTugal.angelo, 13 Nov 2026). Renders three options (a, b, c) x three views (add,
// board, record) as static HTML from sample-pipeline.json (made-up people and companies only), into <outdir>, never into
// the repository (*.html is generated output here: gitignored, and the gate wants every .html to be a site page).
// With --shots it screenshots each at 390 and 1280 px (deviceScaleFactor 2) into mock/<a|b|c>/<view>-<width>.png.
//   node people/angelo/projects/crm-pipeline/d1-design/mock/render.mjs <outdir> [--shots]
// Palettes are read, not copied: A and C take the site's tokens (assets/site.css, tokens:start..end); B takes the
// private CRM vault app's own (admin/tools/crm_app.html.tpl). No new palette.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../../../../../..')
const OUT = process.argv[2]
if (!OUT) { console.error('usage: render.mjs <outdir> [--shots]'); process.exit(1) }
fs.mkdirSync(OUT, { recursive: true })

const D = JSON.parse(fs.readFileSync(path.join(HERE, 'sample-pipeline.json'), 'utf8'))
const siteTokens = fs.readFileSync(path.join(ROOT, 'assets/site.css'), 'utf8').match(/\/\* tokens:start \*\/([\s\S]*?)\/\* tokens:end \*\//)[1]
const tpl = fs.readFileSync(path.join(ROOT, 'admin/tools/crm_app.html.tpl'), 'utf8')
const vaultTokens = tpl.match(/:root\{--bg[^}]*\}/)[0] + '\n' + tpl.match(/@media \(prefers-color-scheme:dark\)\{:root\{[^}]*\}\}/)[0]

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const cap = s => s[0].toUpperCase() + s.slice(1)
const ST = Object.fromEntries(D.stages.map(s => [s.id, s]))
const TODAY = new Date(D.today + 'T00:00:00Z')
const days = d => Math.round((new Date(d + 'T00:00:00Z') - TODAY) / 864e5)
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
function due(d) {
  if (!d) return { cls: 'none', txt: 'No date' }
  const n = days(d)
  if (n < 0) return { cls: 'late', txt: `Late ${-n}d` }
  if (n === 0) return { cls: 'today', txt: 'Today' }
  if (n === 1) return { cls: 'soon', txt: 'Tomorrow' }
  const dt = new Date(d + 'T00:00:00Z'); return { cls: 'soon', txt: `${WD[dt.getUTCDay()]} ${dt.getUTCDate()}` }
}
const order = (a, b) => (a.due ? days(a.due) : 99) - (b.due ? days(b.due) : 99)
const deals = [...D.deals].sort(order)
const mine = deals.filter(x => x.owner === D.me)
const rec = D.deals.find(x => x.events)
const time = iso => { const t = new Date(iso); return `${WD[t.getUTCDay()]} ${t.getUTCDate()} Nov, ${String(t.getUTCHours()).padStart(2, '0')}:${String(t.getUTCMinutes()).padStart(2, '0')}` }
const who = o => `<span class="who" title="owner"><i aria-hidden="true">${o[0].toUpperCase()}</i>${cap(o)}</span>`
const chipDue = d => { const u = due(d); return `<span class="due ${u.cls}">${u.txt}</span>` }
const chipStage = s => `<span class="stg k-${ST[s].kind}">${ST[s].kind === 'loop' ? '&#8635; ' : ''}${ST[s].label}</span>`
const MADEUP = '<p class="madeup">Mock. Every person and company shown is <b>made-up</b>.</p>'

// ---------- shared CSS (token names are the site's; B maps the vault app's onto them) ----------
const BASE = `
*{box-sizing:border-box}html,body{margin:0}body{background:var(--bg);color:var(--ink);font:15px/1.45 var(--sans,system-ui,sans-serif)}
button{font:inherit;color:inherit}h1,h2,h3{margin:0}
.madeup{margin:0;padding:6px 16px;font-size:12px;background:var(--warn-soft);color:var(--ink);border-bottom:1px solid var(--line)}
.who{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--ink-2)}.who i{font-style:normal;display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--accent-soft);color:var(--accent-dk,var(--accent));font-weight:700;font-size:11px}
.due{display:inline-block;font-size:12px;font-weight:600;padding:1px 8px;border-radius:999px;border:1px solid var(--line);white-space:nowrap}
.due.late{background:var(--bad-soft);color:var(--bad);border-color:var(--bad)}.due.today{background:var(--warn-soft);color:var(--warn);border-color:var(--warn)}.due.soon,.due.none{color:var(--ink-2)}
.stg{display:inline-block;font-size:12px;padding:1px 8px;border-radius:6px;background:var(--surface-2);color:var(--ink-2);white-space:nowrap}.stg.k-loop{background:var(--accent-soft);color:var(--accent-dk,var(--accent))}.stg.k-end{background:var(--ok-soft);color:var(--ok)}
.btn{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid var(--line-2,var(--line));background:var(--surface);font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.pill{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface);cursor:pointer;font-size:14px}
.pill[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:600}
.pill b{font-weight:700;margin-left:4px}
label.f{display:grid;gap:4px;font-size:13px;font-weight:600;color:var(--ink-2)}
.inp{min-height:48px;padding:0 12px;border-radius:10px;border:1px solid var(--line-2,var(--line));background:var(--surface);color:var(--ink);font:inherit;font-size:16px;font-weight:400;width:100%}
textarea.inp{padding:10px 12px;min-height:72px}
.hint{font-size:12px;color:var(--ink-2);font-weight:400}
.sr{position:absolute;left:-9999px}
`
// A and C: the site's chrome (nav, breadcrumb), as /crm/ shows it today
const SITE_NAV = `<nav class="site"><b>web-summit.<span>sgit.ai</span></b><span class="links">Start Team Work Summit X-ray Investors Observability PKI About</span></nav>`
const SITE_CSS = `
nav.site{display:flex;gap:28px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line);background:var(--nav-bg)}nav.site b{font-size:17px}nav.site b span{color:var(--accent)}
nav.site .links{color:var(--ink-2);word-spacing:14px;white-space:nowrap;overflow:hidden}
@media (max-width:700px){nav.site .links{display:none}}
.crumb{font-size:13px;color:var(--ink-2);padding:12px 16px 0}
`
const page = (title, tokens, css, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} (mock)</title>
<style>${tokens}\n${BASE}\n${css}</style></head><body>${MADEUP}${body}</body></html>`

// ======================= OPTION A: a Pipeline tab in /crm/ on our site =======================
const A_CSS = SITE_CSS + `
.crmhead{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between;padding:8px 16px 10px}
.crmhead h1{font-size:24px}.lock{font-size:12px;color:var(--ok);background:var(--ok-soft);border-radius:999px;padding:3px 10px}
.tabs{display:flex;gap:4px;padding:0 16px;border-bottom:1px solid var(--line);overflow-x:auto}.tabs span{padding:10px 12px;font-size:14px;color:var(--ink-2);white-space:nowrap}.tabs span[aria-current]{color:var(--ink);font-weight:700;border-bottom:3px solid var(--accent)}
.bar{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;align-items:center}
.board{display:grid;grid-template-columns:1fr 3fr 1fr 1fr;gap:12px;padding:0 16px 16px;align-items:start}
.col{background:var(--surface-2);border-radius:12px;padding:10px;display:grid;gap:8px;align-content:start}
.col h3{font-size:13px;display:flex;justify-content:space-between}.col h3 em{font-style:normal;color:var(--ink-2)}
.loop{border:2px dashed var(--accent);border-radius:14px;padding:8px;display:grid;gap:8px;background:var(--accent-soft)}
.loop>header{font-size:13px;font-weight:700;color:var(--accent-dk);display:flex;gap:8px;align-items:center}.loop>header span{font-weight:400;color:var(--ink-2)}
.loop .cols{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.loop .col{background:var(--surface)}
.loop svg{width:100%;height:26px;color:var(--accent)}
.ends{display:grid;gap:12px}.col.end{opacity:.92}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:8px 10px;display:grid;gap:4px;box-shadow:var(--shadow)}
.card.late{border-left:4px solid var(--bad)}.card.today{border-left:4px solid var(--warn)}
.card b{font-size:14px}.card .p{font-size:12px;color:var(--ink-2)}.card .r{display:flex;justify-content:space-between;align-items:center;gap:6px}
.fab{position:fixed;right:16px;bottom:20px;min-height:56px;padding:0 22px;border-radius:999px;background:var(--accent);color:var(--accent-ink);border:0;font-weight:700;font-size:16px;box-shadow:0 6px 18px rgb(0 0 0 / .25)}
.phone{display:none}.pm{display:none}
.day h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2);margin:14px 0 6px}.day h2.l{color:var(--bad)}
.row{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:10px 12px;background:var(--surface);border:1px solid var(--line);border-radius:12px;margin-bottom:8px}
.row.late{border-left:4px solid var(--bad)}.row.today{border-left:4px solid var(--warn)}.row .p{grid-column:1/-1;font-size:13px;color:var(--ink-2)}
.seg{display:flex;border:1px solid var(--line);border-radius:10px;overflow:hidden}.seg button{flex:1;min-height:40px;border:0;background:var(--surface)}.seg button[aria-pressed=true]{background:var(--ink);color:var(--bg);font-weight:600}
@media (max-width:700px){.pm{display:inline-block}.pw{display:none}.board{display:none}.phone{display:block;padding:0 16px 90px}.bar .wide{display:none}}
/* the add sheet */
.scrim{position:fixed;inset:0;background:rgb(0 0 0 / .35)}
.sheet{position:fixed;z-index:2;background:var(--surface);display:grid;gap:14px;padding:16px;align-content:start;overflow:auto;box-shadow:0 10px 40px rgb(0 0 0 / .3)}
@media (min-width:701px){.sheet{top:60px;left:50%;transform:translateX(-50%);width:520px;max-height:calc(100vh - 80px);border-radius:16px}}
@media (max-width:700px){.sheet{left:0;right:0;bottom:0;top:52px;border-radius:16px 16px 0 0;padding-bottom:12px}}
.sheet>header{display:flex;justify-content:space-between;align-items:center}.sheet h2{font-size:19px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.found{font-size:13px;background:var(--sent-soft);border:1px solid var(--sent-line);border-radius:10px;padding:8px 10px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.save{position:sticky;bottom:0;display:flex;gap:8px;background:var(--surface);padding-top:8px}.save .btn{flex:1;justify-content:center;min-height:52px;font-size:16px}
.idea{font-size:12px;color:var(--ink-2);border-top:1px dashed var(--line);padding-top:8px}
/* the record */
.panel{position:fixed;z-index:2;top:0;right:0;bottom:0;width:min(560px,100vw);background:var(--surface);border-left:1px solid var(--line);overflow:auto;padding:16px;display:grid;gap:16px;align-content:start;box-shadow:var(--shadow)}
.panel h2{font-size:22px}.panel h3{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2);margin-bottom:6px}
.steps{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font-size:12px}.steps span{padding:3px 8px;border-radius:6px;background:var(--surface-2);color:var(--ink-2)}.steps span.on{background:var(--accent);color:var(--accent-ink);font-weight:700}.steps .lp{border:1px dashed var(--accent);border-radius:8px;padding:3px;display:flex;gap:4px}
.moves{display:flex;flex-wrap:wrap;gap:8px}
.tl{list-style:none;margin:0;padding:0;display:grid;gap:10px;border-left:2px solid var(--line);padding-left:12px}.tl li{font-size:14px}.tl .t{display:block;font-size:12px;color:var(--ink-2)}
.next{background:var(--warn-soft);border-radius:12px;padding:10px 12px;display:grid;gap:8px}
dl.kv{display:grid;grid-template-columns:max-content 1fr;gap:4px 12px;margin:0;font-size:14px}dl.kv dt{color:var(--ink-2)}dl.kv dd{margin:0}
`
const aCard = x => `<div class="card ${due(x.due).cls}"><b>${esc(x.company)}</b><span class="p">${esc(x.contact)} &middot; ${esc(x.next)}</span><span class="r">${who(x.owner)}${chipDue(x.due)}</span></div>`
const aCol = (s, list) => `<div class="col ${ST[s].kind}"><h3>${ST[s].label}<em>${list.length}</em></h3>${list.map(aCard).join('')}</div>`
const by = (s, list = deals) => list.filter(x => x.stage === s)
const LOOP_ARROW = `<svg viewBox="0 0 600 26" preserveAspectRatio="none" aria-hidden="true"><path d="M560 2 C560 22, 40 22, 40 4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M34 10 L40 2 L46 10" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
function aBoardBody(list = mine) {
  const groups = [['Late', list.filter(x => x.due && days(x.due) < 0), 'l'], ['Today', list.filter(x => x.due && days(x.due) === 0), ''], ['Next', list.filter(x => x.due && days(x.due) > 0), ''], ['No date', list.filter(x => !x.due), '']]
  return `${SITE_NAV}<p class="crumb">Home &rsaquo; The team CRM &rsaquo; Pipeline</p>
<div class="crmhead"><h1>Pipeline</h1><span class="lock">Unlocked with your site key: Angelo</span></div>
<div class="tabs"><span>Companies</span><span>Contacts</span><span>Actions</span><span aria-current="page">Pipeline</span><span>Mail</span></div>
<div class="bar"><button class="pill pm" aria-pressed="true">Mine <b>${mine.length}</b></button><button class="pill pw">Mine <b>${mine.length}</b></button><button class="pill pm">Everyone <b>${deals.length}</b></button><button class="pill pw" aria-pressed="true">Everyone <b>${deals.length}</b></button><button class="pill">Late <b>${deals.filter(x => x.due && days(x.due) < 0).length}</b></button><button class="pill">Due today <b>${deals.filter(x => x.due && days(x.due) === 0).length}</b></button><span class="wide"><input class="inp" style="min-height:40px;width:220px" placeholder="Find a company or person"></span><button class="btn primary wide">+ Add</button></div>
<div class="board">${aCol('to_contact', by('to_contact'))}
<section class="loop"><header>&#8635; The loop <span>until won or parked</span></header><div class="cols">${['to_follow_up', 'in_conversation', 'call_booked'].map(s => aCol(s, by(s))).join('')}</div>${LOOP_ARROW}</section>
${aCol('proposal', by('proposal'))}<div class="ends">${aCol('won', by('won'))}${aCol('parked', by('parked'))}</div></div>
<div class="phone"><div class="seg" role="group" aria-label="View"><button aria-pressed="true">By due date</button><button>A stage at a time</button></div>
<div class="day">${groups.filter(g => g[1].length).map(([t, l, c]) => `<h2 class="${c}">${t} (${l.length})</h2>` + l.map(x => `<div class="row ${due(x.due).cls}"><b>${esc(x.company)}</b>${chipDue(x.due)}<span class="p">${esc(x.next)}</span><span>${chipStage(x.stage)}</span>${who(x.owner)}</div>`).join('')).join('')}</div></div>
<button class="fab">+ Add</button>`
}
const A = {
  board: page('A board', siteTokens, A_CSS, aBoardBody()),
  add: page('A add', siteTokens, A_CSS, aBoardBody() + `<div class="scrim"></div><form class="sheet" aria-label="Add a connection">
<header><h2>New connection</h2><button class="btn" type="button">Close</button></header>
<label class="f">Person<input class="inp" value="Rita Okafor"><span class="hint">Name and role only here; contact details go in the sealed part (if kept)</span></label>
<label class="f">Company<input class="inp" value="Tidecr"></label>
<div class="found"><b>Tidecraft Robotics</b> is already in the CRM: <b>Silvio</b> spoke to them yesterday. Add to theirs, or start your own?</div>
<div class="f">Stage<div class="chips">${D.stages.map(s => `<button type="button" class="pill" aria-pressed="${s.id === 'to_follow_up'}">${s.label}</button>`).join('')}</div></div>
<div class="f">Follow up<div class="chips"><button type="button" class="pill" aria-pressed="true">Tomorrow</button><button type="button" class="pill">Next week</button><button type="button" class="pill">Pick a date</button><button type="button" class="pill">None</button></div></div>
<div class="grid2"><label class="f">Owner<select class="inp"><option>Me (Angelo)</option></select></label><label class="f">Consent<select class="inp"><option>Asked: yes</option></select></label></div>
<label class="f">Note<textarea class="inp">Asked how blocking works for tool calls; wants the policy demo.</textarea></label>
<p class="idea">Idea, not built: dictate the note, or photograph a business card. Needs the person's consent first, and a check that nothing leaves the vault.</p>
<div class="save"><button class="btn primary" type="button">Save</button></div></form>`),
  record: page('A record', siteTokens, A_CSS, aBoardBody() + `<div class="scrim"></div>${aRecord()}`),
}
function aRecord() {
  const ev = rec.events.slice().reverse()
  const st = s => `<span class="${s === rec.stage ? 'on' : ''}">${ST[s].label}</span>`
  return `<aside class="panel" aria-label="${esc(rec.company)}"><header style="display:flex;justify-content:space-between;gap:8px"><div><p class="hint" style="margin:0">Company &middot; owner ${cap(rec.owner)}</p><h2>${esc(rec.company)}</h2></div><button class="btn">Close</button></header>
<div class="steps">${st('to_contact')}<span class="lp">${st('to_follow_up')}${st('in_conversation')}${st('call_booked')}</span>${st('proposal')}${st('won')}${st('parked')}</div>
<div class="next"><b>Next: ${esc(rec.next)}</b><span>${chipDue(rec.due)} ${who(rec.owner)}</span><div class="moves"><button class="btn">Done</button><button class="btn">Snooze 1 day</button><button class="btn">Snooze 1 week</button></div></div>
<div><h3>Move to</h3><div class="moves"><button class="btn primary">Proposal</button><button class="btn">In conversation</button><button class="btn">To follow up</button><button class="btn">Won</button><button class="btn">Parked</button></div></div>
<div><h3>Contact</h3><dl class="kv"><dt>Person</dt><dd>${esc(rec.contact)}, ${esc(rec.role)}</dd><dt>Details</dt><dd>Sealed to Angelo and Dinis &middot; <u>open</u></dd><dt>Consent</dt><dd>${esc(rec.consent)}</dd></dl></div>
<div><h3>History</h3><ol class="tl">${ev.map(e => `<li><span class="t">${time(e.at)} &middot; ${cap(e.by)}</span>${e.kind === 'stage' ? `Moved ${ST[e.from].label} &rarr; <b>${ST[e.to].label}</b>` : e.kind === 'created' ? `Added, at <b>${ST[e.to].label}</b>` : 'Note'}${e.note ? `: ${esc(e.note)}` : ''}</li>`).join('')}</ol></div>
<p><button class="btn">Add a note</button> <button class="btn">Remove this person</button></p></aside>`
}

// ======================= OPTION B: the pipeline as the private vault's own app =======================
const B_TOKENS = vaultTokens + `
:root{--surface:var(--card);--surface-2:var(--soft);--ink-2:var(--ink2);--accent:var(--green);--accent-dk:var(--green);--accent-ink:var(--card);--accent-soft:var(--soft);--ok:var(--green);--ok-soft:var(--soft);
--bad:var(--terra);--bad-soft:color-mix(in srgb,var(--terra) 14%,var(--card));--warn:var(--gold);--warn-soft:color-mix(in srgb,var(--gold) 14%,var(--card));--line-2:var(--line);--shadow:none;--sent-soft:var(--soft);--sent-line:var(--line)}`
const B_CSS = `
.host{display:flex;gap:10px;align-items:center;padding:8px 16px;font-size:12px;background:var(--ink);color:var(--bg)}.host b{font-weight:600}
header.app{padding:14px 16px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:10px;align-items:center}
header.app h1{font-size:20px}header.app h1 span{color:var(--green)}
.tabs{display:flex;gap:6px;flex-wrap:wrap}.tabs .pill{min-height:34px}
.stagebar{display:flex;gap:6px;padding:12px 16px;overflow-x:auto}.stagebar .pill{flex:none}
main{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:14px;padding:0 16px 16px}
.list{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.list table{width:100%;border-collapse:collapse;font-size:14px}.list th{text-align:left;font-size:12px;color:var(--ink2);font-weight:600;padding:8px 12px;border-bottom:1px solid var(--line)}.list td{padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}.list tr[aria-current] td{background:var(--soft)}
.detail{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:grid;gap:12px;align-content:start}
.detail h2{font-size:18px}.detail h3{font-size:13px;color:var(--ink2)}
.files{font:12px/1.6 ui-monospace,monospace;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px 10px;color:var(--ink2);overflow-x:auto;white-space:pre}
.ev{width:100%;border-collapse:collapse;font-size:13px}.ev td{border-bottom:1px solid var(--line);padding:5px 4px;vertical-align:top}
.form{max-width:620px;margin:0 auto;padding:16px;display:grid;gap:12px}
.warn{font-size:13px;border:1px solid var(--terra);color:var(--ink);background:var(--bad-soft);border-radius:10px;padding:8px 10px}
@media (max-width:700px){main{grid-template-columns:1fr}.list .hide{display:none}.detail.side{display:none}header.app input{display:none}}
`
const bHead = active => `<div class="host"><b>dev.vault.sgraph.ai</b><span>ws-team-crm-private &middot; app mode</span></div>
<header class="app"><h1>The team CRM <span>(private)</span></h1><div class="tabs">${['Companies', 'Contacts', 'Actions', 'Schedules', 'Mail', 'Pipeline'].map(t => `<button class="pill" aria-pressed="${t === active}">${t}</button>`).join('')}</div><input class="inp" style="min-height:36px;max-width:260px;border-radius:999px" placeholder="Search"></header>`
const bStageBar = cur => `<div class="stagebar">${D.stages.map(s => `<button class="pill" aria-pressed="${s.id === cur}">${ST[s.id].kind === 'loop' ? '&#8635; ' : ''}${s.label} <b>${by(s.id).length}</b></button>`).join('')}</div>`
const bList = (cur, sel) => `<div class="list"><table><thead><tr><th>Company</th><th class="hide">Person</th><th>Owner</th><th>Next</th></tr></thead><tbody>${by(cur).map(x => `<tr${x.id === sel ? ' aria-current="true"' : ''}><td><b>${esc(x.company)}</b><br><span class="hint">${esc(x.next)}</span></td><td class="hide">${esc(x.contact)}</td><td>${cap(x.owner)}</td><td>${chipDue(x.due)}</td></tr>`).join('')}</tbody></table></div>`
const bFiles = `pipeline/${rec.id}/
  record.json            company, contact ref, owner, consent
  events/
    20261112T1041Z-angelo-3f2a.json   created
    20261112T1605Z-angelo-9c1d.json   stage
    20261112T1820Z-silvio-07be.json   note
    20261113T0912Z-angelo-b4e0.json   stage
    20261113T1130Z-angelo-51aa.json   stage
pipeline/index.json      derived: the board`
const bDetail = side => `<section class="detail${side ? ' side' : ''}"><h2>${esc(rec.company)}</h2><p style="margin:0">${chipStage(rec.stage)} &middot; owner ${cap(rec.owner)} &middot; ${chipDue(rec.due)} ${esc(rec.next)}</p>
<div style="display:flex;flex-wrap:wrap;gap:6px"><button class="btn primary">Move stage&hellip;</button><button class="btn">Snooze</button><button class="btn">Add note</button></div>
<h3>Contact</h3><p style="margin:0">${esc(rec.contact)}, ${esc(rec.role)} &middot; <span class="hint">${esc(rec.consent)}</span></p>
<h3>Events (append-only)</h3><table class="ev">${rec.events.slice().reverse().map(e => `<tr><td class="hint">${time(e.at)}</td><td>${cap(e.by)}</td><td>${e.kind === 'stage' ? `${ST[e.from].label} &rarr; <b>${ST[e.to].label}</b>` : e.kind === 'created' ? `created at ${ST[e.to].label}` : 'note'}${e.note ? `<br><span class="hint">${esc(e.note)}</span>` : ''}</td></tr>`).join('')}</table>
<h3>Files in the vault</h3><div class="files">${esc(bFiles)}</div></section>`
const B = {
  board: page('B board', B_TOKENS, B_CSS, bHead('Pipeline') + bStageBar('call_booked') + `<main>${bList('call_booked', rec.id)}${bDetail(true)}</main>`),
  record: page('B record', B_TOKENS, B_CSS, bHead('Pipeline') + `<main style="grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)"><div class="list side-list">${bList('call_booked', rec.id).replace('<div class="list">', '<div>')}</div>${bDetail(false)}</main><style>@media (max-width:700px){.side-list{display:none}}</style>`),
  add: page('B add', B_TOKENS, B_CSS, bHead('Pipeline') + `<form class="form" aria-label="New pipeline record"><h2>New pipeline record</h2>
<label class="f">Company<input class="inp" value="Tidecraft Robotics"><span class="hint">Matches companies/ in this vault: 1 found</span></label>
<label class="f">Person<input class="inp" value="Rita Okafor"></label><label class="f">Role<input class="inp" value="Head of platform"></label>
<label class="f">Stage<select class="inp"><option>To follow up</option></select></label>
<label class="f">Owner<select class="inp"><option>angelo</option></select></label>
<label class="f">Next step<input class="inp" value="Send the policy demo"></label><label class="f">Due<input class="inp" value="2026-11-14"></label>
<label class="f">Consent<input class="inp" value="Asked at the stand: yes"></label><label class="f">Note<textarea class="inp">Asked how blocking works for tool calls.</textarea></label>
<p class="warn">Saving writes <code>pipeline/tidecraft-robotics/events/&lt;time&gt;-angelo-&lt;id&gt;.json</code> and pushes the vault. In the browser this needs a write that works (WS-189, question 4) and an access token per person.</p>
<button class="btn primary" type="button">Save to the vault</button></form>`),
}

// ======================= OPTION C: agent-first; the board reads, the agent writes =======================
const C_CSS = SITE_CSS + `
.wrap{padding:12px 16px 24px;display:grid;gap:16px}
.flow{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:stretch}
.flow div{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:8px;text-align:center}.flow div b{display:block;font-size:24px}.flow div span{font-size:12px;color:var(--ink-2)}
.flow .loop{background:var(--accent-soft);border-color:var(--accent)}.flow .end{background:var(--ok-soft)}
.flowcap{font-size:12px;color:var(--ink-2);margin-top:-10px}
.matrix{width:100%;border-collapse:separate;border-spacing:4px;font-size:13px}.matrix th{font-size:12px;color:var(--ink-2);text-align:left;font-weight:600;padding:2px 4px}.matrix th.loop{color:var(--accent-dk)}
.matrix td{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:6px;vertical-align:top;min-width:90px}.matrix td.e{background:transparent;border-color:transparent}
.matrix .co{display:block;padding:2px 0}.matrix .co.late{color:var(--bad);font-weight:700}.matrix .co.today{color:var(--warn);font-weight:700}
.agenda h2{font-size:15px;margin-bottom:8px}.it{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;padding:8px 0;border-bottom:1px solid var(--line)}.it .p{grid-column:2;font-size:13px;color:var(--ink-2)}
.two{display:grid;grid-template-columns:2fr 1fr;gap:16px;align-items:start}
.ro{font-size:12px;color:var(--ink-2)}
@media (max-width:700px){.flow{grid-template-columns:repeat(4,1fr)}.two{grid-template-columns:1fr}.matrix{display:none}}
/* the agent chat */
.chat{display:grid;gap:12px;max-width:620px;margin:0 auto;padding:12px 16px 120px}
.msg{padding:10px 12px;border-radius:14px;max-width:88%;font-size:15px}.msg.me{justify-self:end;background:var(--accent);color:var(--accent-ink);border-bottom-right-radius:4px}.msg.ag{background:var(--surface);border:1px solid var(--line);border-bottom-left-radius:4px}
.parsed{display:grid;grid-template-columns:max-content 1fr;gap:4px 12px;margin:8px 0;font-size:14px}.parsed dt{color:var(--ink-2)}.parsed dd{margin:0}
.composer{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-top:1px solid var(--line);padding:10px 16px;display:flex;gap:8px;align-items:center}.composer .inp{flex:1}
.composer .mic{width:52px;min-height:52px;border-radius:50%;border:1px solid var(--line);background:var(--surface-2);font-weight:700}
.panel{max-width:760px;margin:0 auto;padding:12px 16px 24px;display:grid;gap:16px}.panel h2{font-size:24px}.panel h3{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-2);margin-bottom:6px}
.brief{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.asks{display:flex;flex-wrap:wrap;gap:8px}
.tl{list-style:none;margin:0;padding:0 0 0 12px;display:grid;gap:10px;border-left:2px solid var(--line)}.tl li{font-size:14px}.tl .t{display:block;font-size:12px;color:var(--ink-2)}
`
const cHead = t => `${SITE_NAV}<p class="crumb">Home &rsaquo; The team CRM &rsaquo; ${t}</p>`
const OWN = D.owners
const cBoard = () => {
  const stages = D.stages
  const late = deals.filter(x => x.due && days(x.due) <= 0)
  return cHead('Pipeline') + `<div class="wrap"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center"><h1 style="font-size:24px">Pipeline</h1><span class="ro">Read-only here. To change anything, tell your agent.</span></div>
<div class="flow">${stages.map(s => `<div class="${s.kind}"><b>${by(s.id).length}</b><span>${s.kind === 'loop' ? '&#8635; ' : ''}${s.label}</span></div>`).join('')}</div>
<p class="flowcap">&#8635; marks the loop: to follow up, in conversation and call booked repeat until won or parked.</p>
<div class="two"><div><table class="matrix"><thead><tr><th>Owner</th>${stages.map(s => `<th class="${s.kind}">${s.label}</th>`).join('')}</tr></thead><tbody>${OWN.map(o => `<tr><th>${who(o)}</th>${stages.map(s => { const l = deals.filter(x => x.owner === o && x.stage === s.id); return l.length ? `<td>${l.map(x => `<span class="co ${due(x.due).cls}">${esc(x.company)}${due(x.due).cls === 'late' ? ' (late)' : due(x.due).cls === 'today' ? ' (today)' : ''}</span>`).join('')}</td>` : '<td class="e"></td>' }).join('')}</tr>`).join('')}</tbody></table></div>
<section class="agenda"><h2>Due now, everyone (${late.length})</h2>${late.map(x => `<div class="it">${chipDue(x.due)}<b>${esc(x.company)}</b><span class="p">${esc(x.next)} &middot; ${cap(x.owner)}</span></div>`).join('')}</section></div></div>`
}
const C = {
  board: page('C board', siteTokens, C_CSS, cBoard()),
  add: page('C add', siteTokens, C_CSS, cHead('Tell my agent') + `<div class="chat">
<p class="msg ag">Who did you meet? Say it as you would to a colleague.</p>
<p class="msg me">Met Rita Okafor, head of platform at Tidecraft Robotics. Asked how blocking works for tool calls. Wants the demo. Follow up tomorrow. She said fine to keep her details.</p>
<div class="msg ag"><b>I will file this. Check it:</b><dl class="parsed"><dt>Person</dt><dd>Rita Okafor, Head of platform</dd><dt>Company</dt><dd>Tidecraft Robotics (exists: Silvio met them yesterday)</dd><dt>Stage</dt><dd>${chipStage('to_follow_up')}</dd><dt>Owner</dt><dd>Angelo (you)</dd><dt>Follow up</dt><dd>${chipDue('2026-11-14')} send the demo</dd><dt>Consent</dt><dd>Yes, said at the stand</dd><dt>Note</dt><dd>Asked how blocking works for tool calls.</dd></dl>
<div class="asks"><button class="btn primary">File it</button><button class="btn">Change</button><button class="btn">Tell Silvio too</button></div></div>
<p class="hint" style="text-align:center">Your agent writes one event file to the private CRM; the board updates in a minute or two.</p></div>
<div class="composer"><input class="inp" placeholder="Tell your agent&hellip;"><button class="mic" aria-label="Dictate (idea; needs consent)">Mic</button></div>`),
  record: page('C record', siteTokens, C_CSS, cHead('Pipeline') + `<div class="panel"><div><p class="hint" style="margin:0">Owner ${cap(rec.owner)} &middot; ${chipStage(rec.stage)}</p><h2>${esc(rec.company)}</h2></div>
<div class="brief"><h3>Where it stands (written by the agent)</h3><p style="margin:0">Rita Okafor (Head of platform) met Angelo at the stand on 12 Nov and asked how blocking works for tool calls; Silvio heard the same question from their platform team. A call is booked for <b>today at 15:00</b> to show the policy demo. Next: if the call goes well, a proposal.</p></div>
<div><h3>Ask your agent</h3><div class="asks"><button class="btn primary">Move to proposal</button><button class="btn">Snooze 1 week</button><button class="btn">Draft the follow-up</button><button class="btn">Park it</button></div></div>
<div><h3>History</h3><ol class="tl">${rec.events.slice().reverse().map(e => `<li><span class="t">${time(e.at)} &middot; ${cap(e.by)} (through their agent)</span>${e.kind === 'stage' ? `${ST[e.from].label} &rarr; <b>${ST[e.to].label}</b>` : e.kind === 'created' ? `Added at <b>${ST[e.to].label}</b>` : 'Note'}${e.note ? `: ${esc(e.note)}` : ''}</li>`).join('')}</ol></div></div>`),
}

const ALL = { a: A, b: B, c: C }
for (const [o, views] of Object.entries(ALL)) for (const [v, html] of Object.entries(views)) {
  fs.mkdirSync(path.join(OUT, o), { recursive: true }); fs.writeFileSync(path.join(OUT, o, `${v}.html`), html)
}
console.log(`wrote ${Object.keys(ALL).length * 3} mocks to ${OUT}`)

if (process.argv.includes('--shots')) {
  const { chromium } = (await import('node:module')).createRequire(import.meta.url)('playwright')   // NODE_PATH-installed
  const b = await chromium.launch()
  for (const [o, views] of Object.entries(ALL)) for (const v of Object.keys(views)) for (const w of [390, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: w === 390 ? 844 : 800 }, deviceScaleFactor: 2, colorScheme: 'light' })
    await p.goto('file://' + path.join(OUT, o, `${v}.html`))
    fs.mkdirSync(path.join(HERE, o), { recursive: true })
    await p.screenshot({ path: path.join(HERE, o, `${v}-${w}.png`) })
    await p.close()
  }
  await b.close()
  console.log('screenshots in', HERE)
}
