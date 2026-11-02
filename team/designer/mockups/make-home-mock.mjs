// WS-103 mock-up of the home page, by designer@web-summit.dinis (2 November 2026). Run from the repository root:
//   node team/designer/mockups/make-home-mock.mjs
// Draws the people and agents with admin/build/cast.mjs and the colours from data/design.json. The numbers and lines are a
// snapshot of v0.1.100 typed here for the picture only; on the site each comes from data (team/designer/home/SPEC.md).
// Writes assets/design/home-phone.png and home-desktop.png (needs Playwright, as in the cloud sessions).
import fs from 'fs'; import os from 'os'; import path from 'path'; import { createRequire } from 'module'
const ROOT = process.cwd(), OUT = path.join(os.tmpdir(), 'ws103-home-mock.html')
const { humanFigure, agentFigure, headIcon } = await import(path.join(ROOT, 'admin/build/cast.mjs'))
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/design.json'))), C = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/cast.json')))
const col = Object.fromEntries(D.people.map(p => [p.id, p.colour]))
const fig = (b, w = 40, h = 50) => `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${b}</svg>`
const icon = b => `<svg viewBox="0 0 24 24" class="ic">${b}</svg>`
// from team/setup/ (the computed leaderboard, v0.1.100)
const people = [
  ['vicky', 'Vicky', 5, 2, 'Vaults: open the team vaults'],
  ['dinis', 'Dinis', 3, 10, 'Dashboard agent'],
  ['angelo', 'Angelo', 3, 3, 'Dashboard agent'],
  ['silvio', 'Silvio', 3, 3, 'Dashboard agent'],
  ['nimay', 'Nimay', 1, 0, 'Accept the GitHub invitation'],
  ['indi', 'Indi', 1, 0, 'Accept the GitHub invitation'],
  ['jose', 'Jose', 1, 0, 'Accept the GitHub invitation'],
]
const agents = C.agents.slice(0, 6)
const cast = people.map(([id, name, lvl, n]) => `<a class="who" href="#"><div class="fig">${fig(humanFigure({ colour: col[id] }, 'round', lvl >= 3 ? 'happy' : 'worried'))}</div>
  <b>${name}</b><span class="lvl"><i style="width:${lvl / 6 * 100}%;background:${col[id]}"></i></span><small>L${lvl} · ${n} agent${n === 1 ? '' : 's'}</small></a>`).join('')
const needs = [
  ['nimay', 'Nimay, Jose, Indi', 'Accept the GitHub invitation to the repository. All three are stuck at this one step.', 'WS-09'],
  ['dinis', 'Dinis', 'Three decisions before the 13:00 stand-up: the print order\'s deadline and ceiling, the GitHub invitations, the first five companies.', 'brief 4'],
  ['sarah', 'Sarah, everyone', 'Vote on the shirts, hoodies and cards. No votes yet; the final set is late.', 'WS-62'],
]
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Home page mock-up</title><style>
:root{--ink:#1f2933;--muted:#5b6670;--paper:#fbfaf7;--card:#fff;--line:#e4e1da;--accent:#b0481a;--band:#1f2933}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.45 Inter,"Helvetica Neue",Arial,sans-serif}
.wrap{max-width:1040px;margin:0 auto;padding:0 16px}
.top{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;font-size:13px;border-bottom:1px solid var(--line);background:#fff}
.top{gap:12px}.top b{letter-spacing:.02em;white-space:nowrap}.top span{color:var(--muted);overflow-x:auto;white-space:nowrap}@media(max-width:520px){.top span{font-size:0}.top span::after{content:"☰ Menu";font-size:13px}}
.hero{background:var(--band);color:#fff;padding:22px 0 18px}
.hero h1{font:700 30px/1.08 Georgia,"Times New Roman",serif;margin:0 0 6px}
.hero p{margin:0;color:#cfd6dd;font-size:14px}
.count{display:flex;gap:8px;margin-top:14px}.count div{background:#ffffff14;border-radius:10px;padding:8px 10px;flex:1}
.count b{display:block;font-size:24px;line-height:1}.count small{color:#cfd6dd;font-size:12px}
h2{font:700 13px/1 Inter,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:22px 0 10px}
.need{display:flex;gap:10px;background:var(--card);border:1px solid var(--line);border-left:6px solid var(--c);border-radius:10px;padding:10px 12px;margin-bottom:8px}
.need b{display:block}.need p{margin:2px 0 0;font-size:14px}.tag{font-size:11px;font-weight:700;color:var(--accent);white-space:nowrap}
.now{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}
.now ol{margin:6px 0 0;padding-left:20px}.now li{margin:3px 0}.meta{font-size:12px;color:var(--muted)}
.standup{display:flex;align-items:center;gap:10px;margin-top:8px;background:#fff4ec;border:1px solid #f1d2bd;border-radius:10px;padding:10px 12px}
.standup b{font-size:20px;color:var(--accent)}
.cast{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.who{display:flex;flex-direction:column;align-items:center;text-decoration:none;color:inherit;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:6px 4px 8px}
.who .fig svg{width:52px;height:65px}.who b{font-size:13px}.who small{font-size:11px;color:var(--muted)}
.lvl{width:80%;height:5px;background:#eee;border-radius:3px;margin:3px 0;overflow:hidden}.lvl i{display:block;height:100%}
.agents{display:flex;gap:4px;align-items:flex-end;overflow:hidden;margin-top:10px}
.agents svg{width:34px;height:42px;flex:none}.agents span{font-size:12px;color:var(--muted);margin-left:6px}
.nums{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.nums div{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.nums b{font-size:24px;display:block;line-height:1.1}.nums small{color:var(--muted);font-size:12px}
.note{font-size:12px;color:var(--muted);margin:18px 0 30px;border-top:1px dashed var(--line);padding-top:10px}
@media(min-width:760px){.hero h1{font-size:44px}.grid{display:grid;grid-template-columns:1.1fr 1fr;gap:22px}.cast{grid-template-columns:repeat(7,1fr)}.nums{grid-template-columns:repeat(4,1fr)}}
</style></head><body>
<div class="top"><b>web-summit.sgit.ai</b><span>Home · Work · Team · Summit · About</span></div>
<section class="hero"><div class="wrap">
<h1>Seven of us. Our agents.<br>One RiskMandate.</h1>
<p>Web Summit Lisbon, 9 to 12 November. Our stand: Thursday 12 November.</p>
<div class="count"><div><b>7</b><small>days to the summit</small></div><div><b>4 of 7</b><small>of us connected</small></div><div><b>18</b><small>agents running</small></div></div>
</div></section>
<main class="wrap"><div class="grid"><div>
<h2>Needs you</h2>
${needs.map(([c, who, what, ref]) => `<div class="need" style="--c:${col[c] || '#b0481a'}"><div><b>${who}</b><p>${what}</p></div><span class="tag">${ref}</span></div>`).join('')}
<div class="standup"><b>13:00</b><div><strong>Next stand-up, Tuesday 3 November</strong><div class="meta">4 items on the agenda · decisions first</div></div></div>
</div><div>
<h2>Happening now</h2>
<div class="now"><div class="meta">22:57 · journalist@web-summit.dinis · full report</div><ol>
<li><b>The build got fast:</b> 3.3 s to 0.45 s.</li><li><b>The mentors' first run:</b> a note on six dashboards.</li><li><b>The print order:</b> 2 of 7 printers replied; one asked Silvio to call.</li></ol>
<div class="agents">${agents.map(a => fig(agentFigure(a, col[a.person]))).join('')}<span>the agents who did it</span></div></div>
</div></div>
<h2>Who is doing it</h2><div class="cast">${cast}</div>
<h2>The numbers</h2><div class="nums"><div><b>93</b><small>issues open of 104</small></div><div><b>4</b><small>stand-up items waiting</small></div><div><b>0 of 7</b><small>design votes in</small></div><div><b>2 of 7</b><small>printers replied</small></div></div>
<p class="note">Mock-up for WS-103 by designer@web-summit.dinis, 2 November 2026. Data as of v0.1.100: levels and agents from /team/setup/, the stand-up from data/meetings/, the report of 22:57. Not live yet: on the site every number is read from data, none typed.</p>
</main></body></html>`
fs.writeFileSync(OUT, html)
const { chromium } = createRequire(import.meta.url)('playwright')
const b = await chromium.launch()
for (const [name, w] of [['home-phone.png', 390], ['home-desktop.png', 1200]]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: w < 500 ? 2 : 1 })
    await p.goto('file://' + OUT); await p.screenshot({ path: path.join(ROOT, 'assets/design', name), fullPage: true }); await p.close()
}
await b.close(); console.log('assets/design/home-phone.png, assets/design/home-desktop.png')
