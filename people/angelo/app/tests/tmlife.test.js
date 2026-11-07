const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U + '#collab?map=1&w=all', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]')
  const snap = () => p.evaluate(() => {
    const on = [...document.querySelectorAll('.tm-a:not(.tmf-gone)')]
    const size = Object.fromEntries(on.map(g => { const d = g.querySelector('circle:not(.tm-kr), rect'); return [g.dataset.tmF, +(d.getAttribute('r') || d.getAttribute('width'))] }))
    const pulses = document.querySelectorAll('.tmf-pulses circle:not(.z)').length, lines = document.querySelectorAll('.tmf-links path:not(.z)').length
    const rects = [...document.querySelectorAll('.tm-a rect')].filter(r => !/rotate\(45/.test(r.getAttribute('transform') || '')).length
    const tr = Object.fromEntries(on.map(g => [g.dataset.tmF, g.getAttribute('transform') || '']))
    return { ids: on.map(g => g.dataset.tmF), size, pulses, lines, rects, tr, now: document.querySelector('[data-tmf-now]').textContent }
  })
  await p.$eval('[data-tmf-scrub]', s => { s.value = s.min; s.dispatchEvent(new Event('input')) }); await p.waitForTimeout(300)
  const first = await snap()
  await p.selectOption('[data-tmf-speed]', '1440'); await p.click('[data-tmf-play]')
  let prev = first, left = 0, shrank = 0, lonely = 0, moved = 0, badRect = 0, samples = 0, counts = [first.ids.length]
  for (let i = 0; i < 40; i++) { await p.waitForTimeout(150); const s = await snap(); samples++
    for (const id of prev.ids) if (!s.ids.includes(id)) left++
    for (const id of s.ids) if (prev.size[id] && s.size[id] + 0.05 < prev.size[id]) shrank++
    for (const id of s.ids) if (prev.tr[id] !== undefined && prev.tr[id] !== s.tr[id]) moved++
    if (s.pulses && !s.lines) lonely++
    badRect += s.rects; counts.push(s.ids.length); prev = s }
  await p.click('[data-tmf-play]').catch(() => {})
  await p.$eval('[data-tmf-scrub]', s => { s.value = Math.round(+s.min + (+s.max - +s.min) * 0.35); s.dispatchEvent(new Event('input')) }); await p.waitForTimeout(1500)
  await p.locator('section.tm .tm-wrap').screenshot({ path: `${S}/tmlife-${n}-35.png` })
  console.log(n, JSON.stringify({ first: first.ids.length, counts: counts.filter((_, i) => i % 5 === 0), left, shrank, moved, lonely, badRect }), errs)
  if (first.ids.length > 3 || left || shrank || !moved || lonely || badRect || counts[counts.length - 1] < 30 || errs.length) fail(n)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
