// One landscape document with every card design in a grid: an A4 landscape PDF, vector (the trimmed print SVGs), and a
// PNG of each page.  node team/designer/print/concepts-rm/render-overview.mjs [person]   (default: indi)
// Page 1: round 3 at real size (85 x 55 mm). Page 2: round 2's six and round 1's B, front and back side by side.
// Writes cards-overview-<person>.pdf and cards-overview-<person>-p1.png, -p2.png. By designer@web-summit.indi. Apache-2.0.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const { chromium } = createRequire(import.meta.url)('playwright')
const HERE = path.dirname(new URL(import.meta.url).pathname)
const WHO = process.argv[2] || 'indi'
const R4 = WHO === 'round4'   // 'round4': the three unnamed audience cards
const spec = d => JSON.parse(fs.readFileSync(path.join(HERE, d, 'spec.json'), 'utf8'))
// a print SVG, cut to the trim (85 x 55 mm, no bleed), drawn w mm wide
const card = (d, side, w) => fs.readFileSync(path.join(HERE, d, `${WHO}-card-${side}.svg`), 'utf8')
    .replace('width="91mm" height="61mm" viewBox="0 0 91 61"', `width="${w}mm" height="${(w * 55 / 85).toFixed(2)}mm" viewBox="3 3 85 55"`)
    .replace(/<title>.*?<\/title>/, '')
const name = (JSON.parse(fs.readFileSync(path.join(HERE, '..', '..', '..', '..', 'data/design.json'), 'utf8')).people.find(p => p.id === WHO) || {}).name
const aud = s => ` <span class="aud">for ${!s.audience || /^(general|everyone)/.test(s.audience) ? 'everyone' : s.audience}</span>`
const cell = (d, w) => { const S = spec(d); return `<div class="cell"><h3>${S.name.replace(/^(\d)\. /, 'R2-$1 ')}${aud(S)}</h3><div class="pair"><div class="c">${card(d, 'front', w)}<i>front</i></div><div class="c">${card(d, 'back', w)}<i>back</i></div></div><p>${S.rationale}</p></div>` }
const css = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;600;700&family=Barlow:wght@400;500&display=swap');
@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Barlow,Arial,sans-serif;color:#161615}
.page{width:297mm;height:210mm;padding:11mm 13mm;background:#EEEDEA;page-break-after:always;overflow:hidden;display:flex;flex-direction:column}
.page:last-child{page-break-after:auto}
h1{font-family:'Barlow Condensed';font-weight:700;font-size:22pt;margin:0}h2{font-weight:400;font-size:10pt;margin:1mm 0 5mm;color:#4A4845}
h3{font-family:'Barlow Condensed';font-weight:600;font-size:12pt;margin:0 0 1.5mm}.aud{font-weight:300;color:#4A4845}
.grid{display:grid;gap:5mm 8mm;flex:1;align-content:start}.pair{display:flex;gap:3mm}.c{display:flex;flex-direction:column}
.c svg{display:block;box-shadow:0 .3mm .6mm rgba(0,0,0,.18),0 1.5mm 4mm rgba(0,0,0,.10)}i{font-style:normal;font-size:7pt;color:#4A4845;margin-top:1mm}
p{font-size:8pt;margin:1.5mm 0 0;color:#4A4845;max-width:175mm}.side{flex:1;font-size:8.5pt;line-height:1.4}.side ul{margin:0;padding-left:4mm}.side li{margin-bottom:1.6mm}.foot{font-size:7.5pt;color:#4A4845;margin-top:auto}`
const foot = n => `<div class="foot">RiskMandate business cards for Web Summit Lisbon, ${name}'s cards, 85 x 55 mm trim. Every QR goes to the person's own page. Page ${n} of 2. designer@web-summit.indi, 4 November 2026.</div>`
const html = R4 ? "" : `<!doctype html><style>${css}</style>
<div class="page"><h1>Round 3: the revamp, after the user tests</h1><h2>Record for everyone and Terminal for engineers, at real size. Grey "Job title to confirm" and "Stand number to confirm" are placeholders until the team gives them.</h2>
<div style="display:flex;gap:9mm"><div class="grid" style="grid-template-columns:1fr">${['round3/1-record', 'round3/2-terminal'].map(d => cell(d, 85)).join('')}</div>
<div class="side"><h3>What changed after the tests</h3><ul>
<li><b>What RiskMandate does</b> is on the front, in the brand's own line: what one agent can reach, what you authorised it to do, and the gap between the two.</li>
<li><b>RISK MANDATE in words</b> beside the seal, so nobody has to guess the company.</li>
<li><b>Web Summit Lisbon</b> and Thursday 12 November next to the QR, with the stand number once we know it.</li>
<li><b>A plain job title</b> under the name, in place of the team roles.</li>
<li><b>The URL beside the QR</b>, which a careful reader checks before scanning.</li>
<li><b>Gone:</b> personal slogans, "Talk to my agent" (not live yet) and the "Meet me" / "Book a meeting" pair.</li></ul>
<h3 style="margin-top:5mm">Still to give</h3><ul><li>Seven job titles</li><li>The stand number</li></ul></div></div>${foot(1)}</div>
<div class="page"><h1>Round 2: six designs for Web Summit, and round 1's B</h1><h2>Front and back side by side, at half real size.</h2>
<div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:4mm 6mm">${['1-seal', '2-pass', '3-record', '4-boardroom', '5-terminal', '6-signature'].map(d => cell('round2/' + d, 40.5)).join('')}${cell('b-seal', 40.5)}</div>${foot(2)}</div>`
// round 4: the three unnamed audience cards on one landscape page, a column each, front over back
const html4 = !R4 ? '' : (() => {
    const ds = fs.readdirSync(path.join(HERE, 'round4')).filter(d => fs.existsSync(path.join(HERE, 'round4', d, 'spec.json'))).sort()
    const col = d => { const S = spec('round4/' + d), a = S.files['team-card-front.svg'].accent
        const c = (side, w) => fs.readFileSync(path.join(HERE, 'round4', d, `team-card-${side}.svg`), 'utf8').replace('width="91mm" height="61mm" viewBox="0 0 91 61"', `width="${w}mm" height="${(w * 55 / 85).toFixed(2)}mm" viewBox="3 3 85 55"`).replace(/<title>.*?<\/title>/, '')
        return `<div class="cell"><h3><span style="display:inline-block;width:3.2mm;height:3.2mm;background:${a.hex};margin-right:1.6mm;vertical-align:-0.3mm"></span>${S.audience}</h3><div class="c">${c('front', 78)}<i>front</i></div><div class="c" style="margin-top:2.5mm">${c('back', 78)}<i>back</i></div><p>${S.rationale.replace(/ Coded .*/, '')}<br>Colour code: ${a.name} ${a.hex} (C${a.cmyk[0]} M${a.cmyk[1]} Y${a.cmyk[2]} K${a.cmyk[3]}). The audience is never printed.</p></div>` }
    return `<!doctype html><style>${css}</style><div class="page"><h1>Three cards for Web Summit, one per audience</h1><h2>No names: about 200 of each. The colour tells the team which card to hand over; the main line is about three times the tagline. The QR goes to the team page.</h2>
<div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:0 9mm">${ds.map(col).join('')}</div><div class="foot">RiskMandate business cards for Web Summit Lisbon, 85 x 55 mm trim, shown at 92% of real size. "Stand number to confirm" is a placeholder. designer@web-summit.indi, 4 November 2026.</div></div>` })()
const b = await chromium.launch()
const p = await b.newPage()
await p.setContent(R4 ? html4 : html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
const out = path.join(HERE, `cards-overview-${WHO}`)
await p.pdf({ path: out + '.pdf', width: '297mm', height: '210mm', printBackground: true })
// a PNG of each page, to look at without opening the PDF
const q = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 2 })
await q.setContent(R4 ? html4 : html, { waitUntil: 'networkidle' }); await q.evaluate(() => document.fonts.ready)
const pages = await q.$$('.page')
for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `${out}-p${i + 1}.png` })
await b.close()
console.log('wrote', path.basename(out) + '.pdf and', pages.length, 'page PNGs')
