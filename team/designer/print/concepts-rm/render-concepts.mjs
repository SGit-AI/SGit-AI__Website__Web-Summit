// Previews, PDFs, sheets and measurements for the card concepts, with Chromium (Playwright, as in the cloud sessions).
//   node team/designer/print/concepts-rm/render-concepts.mjs [scratch-dir]
// Per concept: <id>-card-front.png / -back.png (trim size, 85 x 55 mm at 300 dpi, no bleed, no marks), <id>-card.pdf
// (both sides, 91 x 61 mm with bleed, vector), sheet.png; then compare.png (the three, front and back, for Indi).
// Into scratch-dir (default: none) it writes what check-concepts.py reads: a 600 dpi render of every side with bleed, and
// the measured bounding box of every element marked class="safe". By designer@web-summit.indi. Apache-2.0.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const { chromium } = createRequire(import.meta.url)('playwright')
// optional second argument: a sub-folder holding another round (round2); its designs are the folders with a spec.json
const HERE = path.join(path.dirname(new URL(import.meta.url).pathname), process.argv[3] || '')
const SCRATCH = process.argv[2]
const CONCEPTS = fs.readdirSync(HERE).filter(d => fs.existsSync(path.join(HERE, d, 'spec.json'))).sort(), PEOPLE = ['dinis', 'nimay', 'angelo', 'jose', 'vicky', 'silvio', 'indi'], SIDES = ['front', 'back']
// the card sets in a design: a person id each, or 'team' for round 4's unnamed cards
const ids = c => [...new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(HERE, c, 'spec.json'), 'utf8')).files).map(f => f.split('-card-')[0]))]
const read = f => fs.readFileSync(f, 'utf8')
const trimmed = s => s.replace('width="91mm" height="61mm" viewBox="0 0 91 61"', 'width="100%" height="100%" viewBox="3 3 85 55"')
const b = await chromium.launch()
const shot = async (html, w, h, out, opts = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.dpr || 1 })
    await p.setContent(html); await p.evaluate(() => document.fonts.ready)
    await p.screenshot({ path: out, fullPage: !!opts.full }); await p.close()
}
const measure = {}
for (const c of CONCEPTS) {
    for (const id of ids(c)) {
        for (const side of SIDES) {
            const f = path.join(HERE, c, `${id}-card-${side}.svg`), s = read(f)
            // the preview: trim size at 300 dpi (85 mm = 1004 px), no bleed
            await shot(`<body style="margin:0">${trimmed(s)}</body>`, 1004, 650, path.join(HERE, c, `${id}-card-${side}.png`))
            if (SCRATCH) {
                const p = await b.newPage({ viewport: { width: 910, height: 610 } })
                await p.setContent(`<body style="margin:0">${s.replace('width="91mm" height="61mm"', 'width="910" height="610"')}</body>`)
                measure[`${c}/${id}-card-${side}.svg`] = await p.evaluate(() => [...document.querySelectorAll('.safe')].map(e => {
                    const r = e.getBBox(), m = e.getCTM(), k = m.a   // user units of the root viewBox (mm)
                    return { role: e.dataset.role, x0: r.x * k + m.e, y0: r.y * m.d + m.f, x1: (r.x + r.width) * k + m.e, y1: (r.y + r.height) * m.d + m.f }
                }).map(o => { const sc = 10; return { role: o.role, box: [o.x0 / sc, o.y0 / sc, o.x1 / sc, o.y1 / sc] } }))
                await p.close()
                // 600 dpi render with bleed, for the QR read-back
                await shot(`<body style="margin:0">${s.replace('width="91mm" height="61mm"', 'width="2150" height="1441"')}</body>`, 2150, 1441, path.join(SCRATCH, `${c}--${id}-card-${side}.png`))
            }
        }
        // a two-page PDF with bleed, as the print order's printer takes it
        const p = await b.newPage()
        const pages = SIDES.map(side => `<div style="width:91mm;height:61mm;overflow:hidden;page-break-after:always">${read(path.join(HERE, c, `${id}-card-${side}.svg`))}</div>`).join('')
        await p.setContent(`<!doctype html><style>@page{size:91mm 61mm;margin:0}body{margin:0}svg{display:block}</style>${pages}`)
        await p.pdf({ path: path.join(HERE, c, `${id}-card.pdf`), width: '91mm', height: '61mm', printBackground: true }); await p.close()
    }
}
if (SCRATCH) fs.writeFileSync(path.join(SCRATCH, 'measure.json'), JSON.stringify(measure, null, 1))

// ---- the sheets ----
const font = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;600;700&family=Barlow:wght@400;500&display=swap');`
const base = `${font}*{box-sizing:border-box}body{margin:0;background:#EEEDEA;color:#161615;font-family:Barlow,Inter,Arial,sans-serif}
h1{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:44px;margin:0}h2{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:26px;margin:0 0 12px}
.card{background:#fff;box-shadow:0 2px 3px rgba(0,0,0,.12),0 10px 28px rgba(0,0,0,.12);line-height:0}.card img{width:100%}
.lab{font-size:16px;color:#555;margin:10px 0 0}.sw{display:inline-flex;align-items:center;gap:10px;margin:0 26px 8px 0;font-size:16px}
.sw i{width:34px;height:34px;display:inline-block;border:1px solid #0002}`
const spec = c => JSON.parse(read(path.join(HERE, c, 'spec.json')))
const img = f => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`
for (const c of CONCEPTS) {
    const S = spec(c)
    const sw = S.palette.map(x => `<span class="sw"><i style="background:${x.hex}"></i><b>${x.name}</b> ${x.hex} &middot; C${x.cmyk[0]} M${x.cmyk[1]} Y${x.cmyk[2]} K${x.cmyk[3]}</span>`).join('')
    const grid = ids(c).map(id => { const a = S.files[`${id}-card-front.svg`].accent; return SIDES.map(side => `<div><div class="card"><img src="${img(path.join(HERE, c, `${id}-card-${side}.png`))}"></div><p class="lab"><i style="display:inline-block;width:12px;height:12px;background:${a.hex};border:1px solid #0003;margin-right:6px"></i>${id}, ${side} &middot; accent ${a.hex} (C${a.cmyk[0]} M${a.cmyk[1]} Y${a.cmyk[2]} K${a.cmyk[3]})</p></div>`).join('') }).join('')
    await shot(`<style>${base}</style><div style="padding:56px 64px;width:2400px">
<h1>RiskMandate card, ${S.name}${S.audience && S.audience !== 'general' ? ` <span style="font-weight:300">&middot; for ${S.audience}</span>` : ''}</h1><p style="font-size:20px;margin:8px 0 22px;max-width:1300px">${S.rationale}</p>
<div>${sw}</div><p style="font-size:16px;margin:6px 0 30px"><b>Type:</b> ${S.type}. 85 x 55 mm trim, shown at the same scale. Seal: the supplied RiskMandate mark (riskmandate.ai/brand).</p>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:30px 34px">${grid}</div></div>`, 2400, 1200, path.join(HERE, c, 'sheet.png'), { full: true })
}
const cols = CONCEPTS.map(c => { const S = spec(c); return `<div><h2>${S.name}${S.audience && S.audience !== 'general' ? ` <span style="font-weight:300;font-size:20px">&middot; ${S.audience}</span>` : ''}</h2>${SIDES.map(side => `<div class="card" style="margin-bottom:8px"><img src="${img(path.join(HERE, c, `${ids(c).includes('indi') ? 'indi' : ids(c)[0]}-card-${side}.png`))}"></div><p class="lab" style="margin:0 0 22px">${side}</p>`).join('')}<p style="font-size:15px;margin:0">${S.rationale}</p></div>` }).join('')
await shot(`<style>${base}</style><div style="padding:52px 56px;width:1800px"><h1>${CONCEPTS.length === 3 ? (ids(CONCEPTS[0]).includes('team') ? 'Three cards' : 'Three concepts') : CONCEPTS.length + ' designs'}${ids(CONCEPTS[0]).includes('indi') ? ', Indi Gupte' : ''}, front and back</h1>
<p style="font-size:18px;margin:8px 0 30px">RiskMandate business card, 85 x 55 mm. Same scale throughout. The seal is the supplied RiskMandate mark.</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:44px">${cols}</div></div>`, 1800, 1000, path.join(HERE, 'compare.png'), { full: true })
await b.close()
console.log('rendered')
