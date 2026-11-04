// Previews of the RiskMandate card concepts, with Chromium (Playwright), as render.mjs does for the print files:
//   node team/designer/print/concepts-rm/render-concepts.mjs
// For each concept and person: <id>-card-front.png and -back.png at trim size (the bleed cropped off, no marks),
// 1004 x 650 px (300 dpi); <id>-card.pdf, both sides with bleed at exact size, vector; sheet.png per concept;
// compare.png, the three concepts for indi, front and back. Apache-2.0. By designer@web-summit.dinis.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { chromium } = createRequire(import.meta.url)('playwright')
const CONCEPTS = [['a-band', 'A Band'], ['b-seal', 'B Seal'], ['c-poster', 'C Poster']]
const PEOPLE = ['indi', 'dinis'], SIDES = ['front', 'back']
const PX_W = 1004, PX_H = 650
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: PX_W, height: PX_H }, deviceScaleFactor: 1 })
const trim = s => s.replace(/width="91mm" height="61mm" viewBox="0 0 91 61"/, `width="${PX_W}" height="${PX_H}" viewBox="3 3 85 55"`)
for (const [cid] of CONCEPTS) for (const id of PEOPLE) {
    const svgs = SIDES.map(side => fs.readFileSync(path.join(HERE, cid, `${id}-card-${side}.svg`), 'utf8'))
    for (const [i, side] of SIDES.entries()) {
        await p.setViewportSize({ width: PX_W, height: PX_H })
        await p.setContent(`<!doctype html><html><body style="margin:0">${trim(svgs[i])}</body></html>`)
        await p.screenshot({ path: path.join(HERE, cid, `${id}-card-${side}.png`), clip: { x: 0, y: 0, width: PX_W, height: PX_H } })
    }
    await p.setContent(`<!doctype html><html><head><style>@page{size:91mm 61mm;margin:0}html,body{margin:0}.p{width:91mm;height:61mm;overflow:hidden;page-break-after:always}.p:last-child{page-break-after:auto}svg{display:block}</style></head><body>${svgs.map(s => `<div class="p">${s}</div>`).join('')}</body></html>`)
    await p.pdf({ path: path.join(HERE, cid, `${id}-card.pdf`), width: '91mm', height: '61mm', printBackground: true })
}
const img = f => `data:image/png;base64,${fs.readFileSync(path.join(HERE, f)).toString('base64')}`
const css = `body{margin:0;padding:40px;background:#ECECEA;font-family:Inter,Arial,sans-serif;color:#161615}h1{font-size:30px;margin:0 0 6px}p{margin:0 0 24px;font-size:17px;color:#444}
.g{display:grid;gap:28px}.c{display:flex;flex-direction:column;gap:8px;font-size:16px;font-weight:600}.c img{width:502px;height:325px;box-shadow:0 2px 8px #0003;display:block}`
async function sheet(out, title, sub, cells, cols) {
    const h = `<!doctype html><html><head><style>${css}.g{grid-template-columns:repeat(${cols},502px)}</style></head><body><h1>${title}</h1><p>${sub}</p><div class="g">${cells.map(([f, l]) => `<div class="c"><img src="${img(f)}">${l}</div>`).join('')}</div></body></html>`
    await p.setViewportSize({ width: 80 + cols * 502 + (cols - 1) * 28, height: 400 })
    await p.setContent(h); await p.screenshot({ path: path.join(HERE, out), fullPage: true })
}
for (const [cid, name] of CONCEPTS)
    await sheet(`${cid}/sheet.png`, `RiskMandate card, concept ${name}`, 'Trim size, 85 x 55 mm, shown at half of 300 dpi. RM LOGO marks the place of the seal, to replace with the supplied file.',
        PEOPLE.flatMap(id => SIDES.map(side => [`${cid}/${id}-card-${side}.png`, `${id}, ${side}`])), 2)
await sheet('compare.png', 'RiskMandate card: the three concepts, for Indi', 'Front on the top row, back below. Trim size. RM LOGO marks the place of the seal.',
    [...CONCEPTS.map(([cid, n]) => [`${cid}/indi-card-front.png`, `${n}, front`]), ...CONCEPTS.map(([cid, n]) => [`${cid}/indi-card-back.png`, `${n}, back`])], 3)
await b.close()
console.log('rendered previews, PDFs, 3 sheets and compare.png')
