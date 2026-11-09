// Renders the pass's images from the brand's SVGs (team/designer/print/concepts-rm/brand/) with the pre-installed
// Chromium. conductor@web-summit.indi, 9 November 2026.   node team/designer/wallet/render-images.mjs
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = path.dirname(fileURLToPath(import.meta.url)), BRAND = path.join(HERE, '../print/concepts-rm/brand')
const svg = f => fs.readFileSync(path.join(BRAND, f), 'utf8')
const jobs = [
  ['icon', 'riskmandate-mark.svg', 29, 29], ['thumbnail', 'riskmandate-mark.svg', 90, 90],
  ['logo', 'riskmandate-lockup-dark.svg', 160, 50],
]
const b = await chromium.launch(), p = await b.newPage()
for (const [name, file, w, h] of jobs) for (const s of [1, 2, 3]) {
  await p.setViewportSize({ width: w, height: h })
  await p.setContent(`<html><body style="margin:0;background:transparent"><div style="width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:flex-start">${svg(file).replace('<svg', `<svg style="max-width:${w}px;max-height:${h}px;width:auto;height:${h}px"`)}</div></body></html>`)
  const out = path.join(HERE, 'pass', `${name}${s > 1 ? '@' + s + 'x' : ''}.png`)
  const pg = await b.newPage({ deviceScaleFactor: s, viewport: { width: w, height: h } })
  await pg.setContent(await p.content()); await pg.screenshot({ path: out, omitBackground: true }); await pg.close()
}
await b.close(); console.log('render-images: done')
