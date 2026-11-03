// The PDFs and PNGs of the print files, with Chromium (Playwright, as in the cloud sessions). Called by make-print.py:
//   node team/designer/print/render.mjs team/designer/print
// Each SVG in files/manifest.json becomes a PDF at its exact size in millimetres (vector: the SVG's outlined paths) and,
// for the garments, a 300 dpi PNG with a transparent background. Each person's two card sides also become one 2-page PDF.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { execFileSync } from 'child_process'

const HERE = path.resolve(process.argv[2])
const { chromium } = createRequire(import.meta.url)('playwright')
const items = JSON.parse(fs.readFileSync(path.join(HERE, 'files/manifest.json'), 'utf8'))
const page_ = (svgs, w, h) => `<!doctype html><html><head><style>@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0;padding:0;background:transparent}
.p{width:${w}mm;height:${h}mm;overflow:hidden;page-break-after:always}.p:last-child{page-break-after:auto}svg{display:block;width:${w}mm;height:${h}mm}</style></head>
<body>${svgs.map(s => `<div class="p">${s}</div>`).join('')}</body></html>`
// a 300 dpi PNG, transparent: captured in strips of at most 1200 px (one capture of a whole hoodie back, 3071 x 4563 px,
// fails now and then in headless Chromium), then stacked and tagged 300 dpi by ImageMagick (convert -append)
async function png(svgText, it, out) {
    const px = mm => Math.round(mm / 25.4 * 300), W = px(it.w), H = px(it.h), STRIP = 1200, parts = []
    const q = await b.newPage({ viewport: { width: W, height: Math.min(H, STRIP) }, deviceScaleFactor: 1 })
    await q.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svgText.replace(/width="[\d.]+mm" height="[\d.]+mm"/, `width="${W}" height="${H}"`)}</body></html>`)
    for (let y0 = 0, i = 0; y0 < H; y0 += STRIP, i++) {
        const h = Math.min(STRIP, H - y0), part = `${out}.part${i}.png`
        await q.setViewportSize({ width: W, height: h })
        await q.evaluate(y => { document.body.style.marginTop = -y + 'px' }, y0)
        await q.screenshot({ path: part, omitBackground: true }); parts.push(part)
    }
    await q.close()
    execFileSync('convert', [...parts, '-append', '-units', 'PixelsPerInch', '-density', '300', '-define', 'png:color-type=6', out])
    for (const f of parts) fs.unlinkSync(f)
}
const b = await chromium.launch()
const p = await b.newPage()
for (const it of items) {
    const s = fs.readFileSync(path.join(HERE, it.svg), 'utf8')
    await p.setContent(page_([s], it.w, it.h))
    await p.pdf({ path: path.join(HERE, it.pdf), width: `${it.w}mm`, height: `${it.h}mm`, printBackground: true, pageRanges: '1' })
    if (it.png) await png(s, it, path.join(HERE, it.png))
}
// one PDF per person with both sides of the card, front then back
const people = [...new Set(items.map(it => it.svg.split('/')[1]))]
for (const id of people) {
    const f = items.find(it => it.svg.endsWith(`${id}-card-front.svg`)), k = items.find(it => it.svg.endsWith(`${id}-card-back.svg`))
    await p.setContent(page_([f, k].map(it => fs.readFileSync(path.join(HERE, it.svg), 'utf8')), f.w, f.h))
    await p.pdf({ path: path.join(HERE, `files/${id}/${id}-card.pdf`), width: `${f.w}mm`, height: `${f.h}mm`, printBackground: true })
}
await b.close()
console.log(`rendered ${items.length} files and ${people.length} card PDFs`)
