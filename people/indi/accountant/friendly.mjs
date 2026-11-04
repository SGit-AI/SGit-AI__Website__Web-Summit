#!/usr/bin/env node
// The friendly brief: one A4 page in plain words, pastel, for Indi to read on a phone or on paper.
// Usage: node people/indi/accountant/friendly.mjs people/indi/accountant/briefs/<stamp>.json
// Reads the brief's "friendly" block and writes <stamp>-friendly.pdf beside it, and a copy as latest.pdf (the HTML is not kept).
// Needs Playwright with Chromium (pre-installed in Claude Code cloud sessions). Written by accountant@web-summit.indi.
import fs from 'node:fs'
import { createRequire } from 'node:module'

const src = process.argv[2]
if (!src || !fs.existsSync(src)) { console.error('friendly: give the brief JSON'); process.exit(2) }
const b = JSON.parse(fs.readFileSync(src, 'utf8')), f = b.friendly
if (!f) { console.error('friendly: the brief has no "friendly" block'); process.exit(2) }
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const PAL = ['#cdefe3', '#e3ddf7', '#ffe1d0', '#d6ecfa', '#fff3c4', '#f9d9e3'], EDGE = ['#7cc9ad', '#a99be0', '#f0a37f', '#86bde6', '#e5c75c', '#e597b0']

const max = Math.max(...(f.bars || []).map(x => x.value), 1)
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>${esc(b.title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@700;800&display=swap">
<style>
@page { size: A4; margin: 10mm 12mm 8mm; }
* { box-sizing: border-box; }
body { font-family: Lexend, sans-serif; color: #3b3a4a; font-size: 10pt; line-height: 1.45; margin: 0; }
h1, h2 { font-family: Nunito, sans-serif; margin: 0; }
.top { background: linear-gradient(120deg, #e3ddf7, #d6ecfa); border-radius: 16px; padding: 12px 18px; }
.kick { font-size: 8.5pt; letter-spacing: .06em; text-transform: uppercase; color: #6d6a85; }
h1 { font-size: 20pt; color: #2f2d45; margin: 2px 0 4px; }
.sum { font-size: 11pt; margin: 0; }
h2 { font-size: 12.5pt; color: #2f2d45; margin: 9px 0 5px; }
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.tile { border-radius: 14px; padding: 8px 10px; border: 1.5px solid; }
.tile b { font-family: Nunito; font-size: 17pt; display: block; color: #2f2d45; }
.tile span { font-weight: 600; font-size: 9pt; display: block; }
.tile i { font-style: normal; font-size: 8pt; color: #5d5a72; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { border-radius: 999px; padding: 3px 10px; font-size: 9pt; border: 1.5px solid; }
.on { background: #cdefe3; border-color: #7cc9ad; } .off { background: #f4f3f8; border-color: #cfcbe0; color: #77738f; }
.bar { display: grid; grid-template-columns: 150px 1fr 90px; align-items: center; gap: 8px; margin: 3px 0; font-size: 9pt; }
.bar div { height: 13px; border-radius: 7px; }
.bar em { font-style: normal; text-align: right; font-weight: 600; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.card { border-radius: 14px; padding: 8px 11px; border: 1.5px solid; font-size: 9pt; }
.card b { font-family: Nunito; font-size: 10.5pt; display: block; }
.card small { display: block; color: #5d5a72; margin-top: 4px; font-size: 8pt; }
.dec { border: 1.5px solid #e5c75c; background: #fffbe8; border-radius: 14px; padding: 7px 12px; margin-bottom: 6px; }
.dec b { font-family: Nunito; font-size: 10.5pt; }
.dec p { margin: 2px 0 4px; font-size: 9pt; }
.opt { display: inline-block; margin: 2px 10px 0 0; font-size: 9pt; }
.opt::before { content: ''; display: inline-block; width: 10px; height: 10px; border: 1.5px solid #8a87a0; border-radius: 3px; margin-right: 5px; vertical-align: -1px; }
.rec { background: #cdefe3; border-radius: 6px; padding: 0 6px; font-weight: 600; }
.foot { display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-top: 8px; font-size: 8pt; color: #5d5a72; }
.foot b { color: #3b3a4a; }
</style></head><body>
<div class="top"><div class="kick">${esc(b.kicker)} · brief ${esc(b.number)} · ${esc(b.date)}</div>
<h1>${esc(f.title || b.title)}</h1><p class="sum">${esc(f.summary)}</p></div>
<div class="tiles">${(f.numbers || []).map((n, i) => `<div class="tile" style="background:${PAL[i % 6]};border-color:${EDGE[i % 6]}"><b>${esc(n.n)}</b><span>${esc(n.label)}</span><i>${esc(n.explain)}</i></div>`).join('')}</div>
<h2>Who is measuring</h2><div class="chips">${(f.agents || []).map(a => `<span class="chip ${a.on ? 'on' : 'off'}">${a.on ? '&#10003; ' : ''}${esc(a.name)}: ${esc(a.state)}</span>`).join('')}</div>
${f.bars ? `<h2>${esc(f.bars_title || 'Where the tokens went')}</h2>${f.bars.map((x, i) => `<div class="bar"><span>${esc(x.label)}</span><div style="width:${Math.max(2, 100 * x.value / max)}%;background:${PAL[(i + 1) % 6]};border:1.5px solid ${EDGE[(i + 1) % 6]}"></div><em>${esc(x.shown || x.value.toLocaleString('en-GB'))}</em></div>`).join('')}${f.bars_note ? `<p style="font-size:8.5pt;color:#5d5a72;margin:4px 0 0">${esc(f.bars_note)}</p>` : ''}` : ''}
<h2>Ways to save</h2><div class="cards">${(f.savings || []).map((s, i) => `<div class="card" style="background:${PAL[(i + 2) % 6]};border-color:${EDGE[(i + 2) % 6]}"><b>${i + 1}. ${esc(s.title)}</b>${esc(s.plain)}<small>${esc(s.evidence)}</small></div>`).join('')}</div>
<h2>Your decisions (tick one each)</h2>${(f.decisions || []).map(d => `<div class="dec"><b>${esc(d.id)}. ${esc(d.question)}</b><p>${esc(d.plain)}</p>${d.options.map(o => `<span class="opt">${o === d.recommend ? `<span class="rec">${esc(o)} (my pick)</span>` : esc(o)}</span>`).join('')}</div>`).join('')}
<div class="foot"><div>${(f.glossary || []).map(g => `<b>${esc(g[0])}:</b> ${esc(g[1])}`).join('<br>')}</div><div><b>Next:</b> ${esc(f.next)}<br><b>Numbers from:</b> ${esc((b.sources || []).join(', '))}<br>By ${esc(b.by)}</div></div>
</body></html>`

const out = src.replace(/\.json$/, '-friendly.pdf'), tmp = src.replace(/\.json$/, '-friendly.html')
fs.writeFileSync(tmp, html)
const { chromium } = createRequire(process.cwd() + '/')('playwright')
const browser = await chromium.launch(), page = await browser.newPage()
await page.goto('file://' + fs.realpathSync(tmp), { waitUntil: 'networkidle' })
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, scale: 0.93 })
await browser.close(); fs.unlinkSync(tmp)
fs.copyFileSync(out, out.replace(/[^/]*$/, 'latest.pdf'))   // the dashboard links to briefs/latest.pdf
console.log('friendly: ' + out)
