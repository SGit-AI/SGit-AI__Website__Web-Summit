const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U + '#collab?map=1', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]')
  const st = () => p.evaluate(() => ({ hash: location.hash, replay: document.querySelector('.tm-svg').classList.contains('tm-replay'), stat: document.querySelectorAll('.tm-links path').length, dyn: document.querySelectorAll('.tmf-links path:not(.z)').length, pulses: document.querySelectorAll('.tmf-pulses circle:not(.z)').length, hot: document.querySelectorAll('.tmf-hot').length, tick: document.querySelector('[data-tmf-tick]').textContent.slice(0, 60), now: document.querySelector('[data-tmf-now]').textContent, ov: document.documentElement.scrollWidth - innerWidth }))
  const first = await st()
  await p.$eval('[data-tmf-scrub]', s => { s.value = s.min; s.dispatchEvent(new Event('input')) }); const atStart = await st()
  await p.click('[data-tmf-play]'); let mid = null, maxP = 0, maxD = 0, cols = new Set(); for (let i = 0; i < 16; i++) { await p.waitForTimeout(200); mid = await st(); maxP = Math.max(maxP, mid.pulses); maxD = Math.max(maxD, mid.dyn); for (const c of await p.evaluate(() => [...document.querySelectorAll('.tmf-pulses circle:not(.z)')].map(c => c.getAttribute('fill')))) cols.add(c) } mid.pulses = maxP; mid.dyn = maxD; mid.cols = [...cols]
  await p.locator('section.tm').screenshot({ path: `${S}/tmf-${n}.png` })
  await p.click('[data-tmf-play]'); const a = await st(); await p.waitForTimeout(500); const b2 = await st()
  // the window, kept in the address; layouts and focus keep the bar
  await p.selectOption('[data-tmf-w]', '72h'); await p.waitForSelector('[data-tmf-play]'); const w72 = await st()
  await p.click('[data-tm-l="agents"]'); await p.waitForSelector('[data-tmf-play]'); await p.$eval('[data-tmf-scrub]', s => { s.value = s.min; s.dispatchEvent(new Event('input')) }); await p.click('[data-tmf-play]'); await p.waitForTimeout(2000); const ag = await st()
  await p.locator('.tm-p[data-tm-f="angelo"]').dispatchEvent('click'); await p.waitForSelector('[data-tmf-play]'); await p.$eval('[data-tmf-scrub]', s => { s.value = s.max; s.dispatchEvent(new Event('input')) }); const foc = await st()
  // full screen keeps the controls on screen
  await p.goto(U + '#collab?map=1&w=72h&fs=1', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]'); const fsr = await p.evaluate(() => { const r = document.querySelector('[data-tmf-play]').getBoundingClientRect(); return { bottom: Math.round(r.bottom), vh: innerHeight } })
  // Replay is the timeline only
  await p.goto(U + '#replay?v=map', { waitUntil: 'networkidle' }); await p.waitForSelector('.rp-svg'); const rp = await p.evaluate(() => ({ map: !!document.querySelector('.rpm-svg,[data-rp-v]'), dots: document.querySelectorAll('.rp-dots circle').length }))
  console.log(n, JSON.stringify({ first, atStart: [atStart.replay, atStart.dyn], mid, paused: [a.now, b2.now], w72: w72.hash, ag: [ag.hash, ag.dyn, ag.pulses], foc: [foc.hash, foc.dyn], fsr, rp }), errs)
  if (first.replay || !first.stat || !atStart.replay || atStart.dyn > 3 || !mid.dyn || !mid.pulses || a.now !== b2.now || !/w=72h/.test(w72.hash) || !/l=agents/.test(ag.hash) || !(ag.dyn || ag.pulses) || mid.cols.some(c => !/--rm-(role|gold|green|orange|blue|red)/.test(c)) || !/f=angelo/.test(foc.hash) || fsr.bottom > fsr.vh || rp.map || !rp.dots || first.ov > 1 || errs.length) fail(n)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
