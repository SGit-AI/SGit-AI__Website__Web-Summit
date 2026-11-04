// The deck as a PDF (Dinis, 4 November 2026: "ability to download the pdf of it"): opens the built show page at
// 1600x900, shows each slide fullscreen without the controls, captures it, and prints the captures one per landscape
// page. Usage: node team/conductor/tools/deck_pdf.cjs <meeting id> [base url, default http://localhost:8765/]
// Writes assets/shows/<id>/deck.pdf. Needs Playwright with Chromium (as in the conductor's session); serve the
// repository root first (python3 -m http.server 8765) after node admin/build/build.mjs.
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const id = process.argv[2], base = process.argv[3] || 'http://localhost:8765/'
const root = path.resolve(__dirname, '..', '..', '..'), out = path.join(root, 'assets', 'shows', id, 'deck.pdf')
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } })
  await p.goto(base + 'meetings/' + id + '/show/index.html', { waitUntil: 'networkidle' })
  await p.evaluate(() => {
    document.querySelectorAll('.addkey,.fb-btn').forEach(e => e.remove())
    const d = document.querySelector('.deck')
    d.classList.add('full'); document.documentElement.classList.add('deck-on')
    d.querySelector('.deck-bar').style.display = 'none'; d.style.padding = '0'; d.style.fontSize = '22px'
  })
  const n = await p.evaluate(() => document.querySelectorAll('.deck .slide').length)
  const imgs = []
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => {
      const s = [...document.querySelectorAll('.deck .slide')]
      s.forEach((x, k) => x.classList.toggle('current', k === i))
      s[i].style.width = '1600px'; s[i].style.height = '900px'; s[i].style.borderRadius = '0'
    }, i)
    await p.waitForTimeout(250)
    const el = (await p.$$('.deck .slide'))[i]
    imgs.push((await el.screenshot({ type: 'jpeg', quality: 82 })).toString('base64'))
  }
  const q = await b.newPage()
  await q.setContent('<style>@page{size:1600px 900px;margin:0}body{margin:0}img{display:block;width:1600px;height:900px;page-break-after:always}</style>' + imgs.map(x => '<img src="data:image/jpeg;base64,' + x + '">').join(''))
  await q.pdf({ path: out, width: '1600px', height: '900px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
  await b.close()
  console.log(n + ' slides -> ' + path.relative(root, out) + ' (' + Math.round(fs.statSync(out).size / 1024) + ' KB)')
})()
