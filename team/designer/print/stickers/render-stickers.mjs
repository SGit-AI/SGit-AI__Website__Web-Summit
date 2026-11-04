// Previews, print PDFs and an overview of the RiskMandate stickers, with Chromium (Playwright, as in the cloud sessions).
//   node team/designer/print/stickers/render-stickers.mjs
// <name>.png: the sticker as it will look, cut to its shape, transparent outside, 300 dpi; <name>.pdf: the print file at
// exact size, vector, with its cut line; stickers-overview.pdf (+ -p1.png, -p2.png): A4 landscape, page 1 the stickers at
// real size on a laptop lid, page 2 the print proof with the cut lines. By designer@web-summit.indi. Apache-2.0.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const { chromium } = createRequire(import.meta.url)('playwright')
const HERE = path.dirname(new URL(import.meta.url).pathname)
const all = JSON.parse(fs.readFileSync(path.join(HERE, 'stickers.json'), 'utf8'))
const list = all.filter(s => s.name !== 'gap-animated')
const raw = n => fs.readFileSync(path.join(HERE, n + '.svg'), 'utf8')
// the sticker as cut: the artwork clipped to the cut path, the cut line itself hidden
const asCut = (n, wmm) => { const s = raw(n), cut = s.match(/<g id="cutline"[^>]*><path d="([^"]+)"/)[1]
    return s.replace(/<g id="cutline".*?<\/g>/s, '').replace('<g id="artwork">', `<clipPath id="cut-${n}"><path d="${cut}"/></clipPath><g id="artwork" clip-path="url(#cut-${n})">`)
        .replace(/<clipPath id="gapring">/g, `<clipPath id="gapring-${n}">`).replace(/url\(#gapring\)/g, `url(#gapring-${n})`)
        .replace(/width="[\d.]+mm" height="[\d.]+mm"/, m => wmm ? `width="${wmm}mm"` : m) }
const b = await chromium.launch()
for (const st of all) {
    const px = mm => Math.round(mm / 25.4 * 300)
    const p = await b.newPage({ viewport: { width: px(st.w_mm), height: px(st.h_mm) } })
    await p.setContent(`<body style="margin:0;background:transparent">${asCut(st.name).replace(/width="[\d.]+mm" height="[\d.]+mm"/, `width="${px(st.w_mm)}" height="${px(st.h_mm)}"`)}</body>`)
    await p.screenshot({ path: path.join(HERE, st.name + '.png'), omitBackground: true }); await p.close()
    if (st.name === 'gap-animated') continue
    const q = await b.newPage()
    await q.setContent(`<!doctype html><style>@page{size:${st.w_mm}mm ${st.h_mm}mm;margin:0}body{margin:0}svg{display:block}</style>${raw(st.name)}`)
    await q.pdf({ path: path.join(HERE, st.name + '.pdf'), width: `${st.w_mm}mm`, height: `${st.h_mm}mm`, printBackground: true }); await q.close()
}
const font = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;600;700&family=Barlow:wght@400;500&display=swap');`
const css = `${font}@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Barlow,Arial,sans-serif;color:#161615}
.page{width:297mm;height:210mm;padding:11mm 13mm;background:#EEEDEA;page-break-after:always;overflow:hidden;position:relative}.page:last-child{page-break-after:auto}
h1{font-family:'Barlow Condensed';font-weight:700;font-size:22pt;margin:0}h2{font-weight:400;font-size:10pt;margin:1mm 0 4mm;color:#4A4845}
h3{font-family:'Barlow Condensed';font-weight:600;font-size:11.5pt;margin:0 0 .8mm}p{font-size:8.2pt;margin:0 0 3.2mm;color:#4A4845;line-height:1.35}
.lid{position:absolute;left:13mm;top:30mm;width:196mm;height:168mm;border-radius:7mm;background:#5E6166;box-shadow:inset 0 0 0 .6mm #4C4F54}
.st{position:absolute;filter:drop-shadow(0 .5mm .7mm rgba(0,0,0,.35))}.st svg{display:block}
.legend{position:absolute;left:216mm;top:30mm;width:68mm}.foot{position:absolute;left:13mm;bottom:7mm;font-size:7.5pt;color:#4A4845}
.proof{display:grid;grid-template-columns:1fr 1fr;gap:6mm 10mm;align-items:start}.proof svg{display:block;background:#fff;outline:.2mm solid #0002}`
const place = { corporate: [8, 9, -3], steps: [10, 104, 2], gap: [114, 10, 6], cartoon: [113, 86, -5] }   // mm on the lid, degrees
const lid = list.map(s => { const [x, y, r] = place[s.name]; return `<div class="st" style="left:${x}mm;top:${y}mm;transform:rotate(${r}deg)">${asCut(s.name)}</div>` }).join('')
const what = {
    corporate: 'The brand\'s own lockup, the seal and "RiskMandate", on the container black, with what we do. 100 x 40 mm.',
    gap: 'The idea in one picture: what an agent can reach (dashed), what you authorised (green), and the gap between, striped in the brand\'s caution gold. Ø 76 mm. A moving version is for screens.',
    steps: 'Know their reach, define their mandate, control the gap: the three steps as three plain icons. 100 x 40 mm.',
    cartoon: 'Our agent, very helpful, with very long arms, in the PROD jar. "Trust your agents. Then check." 76 x 76 mm.' }
const names = { corporate: 'Corporate', gap: 'Infographic: the gap', steps: 'Infographic: know, define, control', cartoon: 'Cartoon' }
const legend = list.map(s => `<h3>${names[s.name]}</h3><p>${what[s.name]}</p>`).join('')
const proof = list.map(s => `<div><h3>${names[s.name]} <span style="font-weight:300">${s.w_mm - 4} x ${s.h_mm - 4} mm cut, 2 mm bleed</span></h3>${raw(s.name)}</div>`).join('')
const html = `<!doctype html><style>${css}</style>
<div class="page"><h1>RiskMandate laptop stickers</h1><h2>Four stickers, at real size on a laptop lid. Brand colours and rules from riskmandate.ai/brand; the seal and the lockup are the supplied files.</h2>
<div class="lid">${lid}</div><div class="legend">${legend}<p style="margin-top:5mm">Print: die-cut vinyl, matt, the cut on the magenta line (CutContour). Every letter outlined.</p></div>
<div class="foot">designer@web-summit.indi, 4 November 2026. Page 1 of 2.</div></div>
<div class="page"><h1>Print proof</h1><h2>The print files at real size, with the bleed and the magenta cut line the printer cuts on (not printed).</h2>
<div class="proof">${proof}</div><div class="foot">designer@web-summit.indi, 4 November 2026. Page 2 of 2.</div></div>`
const p = await b.newPage()
await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
await p.pdf({ path: path.join(HERE, 'stickers-overview.pdf'), width: '297mm', height: '210mm', printBackground: true })
const q = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 2 })
await q.setContent(html, { waitUntil: 'networkidle' }); await q.evaluate(() => document.fonts.ready)
const pages = await q.$$('.page'); for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(HERE, `stickers-overview-p${i + 1}.png`) })
await b.close()
console.log('rendered', all.length, 'stickers and the overview')
