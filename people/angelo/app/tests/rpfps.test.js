// backlog 0c3 (Angelo, 8 November: "The replay agents map is very slow, when I play it it stutters quite a bit"): the map's
// playback, three days of history, on a CPU slowed to half speed (a laptop, or a fast phone): at least 50 frames a second at
// 1280 px and 45 at 390 px, no frame over 50 ms at the 95th percentile; the timeline's chart under the map is not touched while
// the map plays (its marks unchanged, a veil over its future moving with the playhead instead), and each mark fades as before
// once it pauses. Light and dark. The old code drew 35 frames a second here, the chart repainted on every frame.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp, min] of [['desktop', { width: 1280, height: 800 }, 50], ['phone', { width: 390, height: 844 }, 45]]) for (const scheme of ['light', 'dark']) {
  const p = await b.newPage({ viewport: vp, colorScheme: scheme }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 2 })
  await p.goto(U + '#collab?map=1&w=72h', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]'); await p.waitForSelector('.rp-embed .rp-svg')
  await p.evaluate(t => document.documentElement.setAttribute('data-theme', t), scheme)   // the command centre is dark unless set
  await p.$eval('[data-tmf-scrub]', s => { s.value = s.min; s.dispatchEvent(new Event('input')) })
  const before = await p.evaluate(() => document.querySelectorAll('.rp-embed .rp-e.fut').length)
  await p.click('[data-tmf-play]'); await p.waitForTimeout(400)
  // watch the chart's marks while measuring the frames
  const r = await p.evaluate(() => new Promise(ok => {
   let muts = 0; const mo = new MutationObserver(l => { muts += l.length }); mo.observe(document.querySelector('.rp-embed .rp-svg'), { attributes: true, subtree: true })
   const a = []; let l = 0; const f = t => { if (l) a.push(t - l); l = t; if (a.length < 150) return requestAnimationFrame(f); mo.disconnect(); a.sort((x, y) => x - y)
    const v = document.querySelector('.rp-veil'), cs = v && getComputedStyle(v)
    ok({ fps: Math.round(1000 * a.length / a.reduce((s, x) => s + x, 0)), p95: Math.round(a[Math.floor(a.length * .95)]), muts, veil: !!v && v.getAttribute('display') !== 'none' && cs.display !== 'none' && +v.getAttribute('width') > 0, veilFill: cs && cs.fill, playing: document.querySelector('[data-tmf-play]').getAttribute('aria-pressed') }) }
   requestAnimationFrame(f) }))
  await p.locator('section.tm').screenshot({ path: `${S}/rpfps-${n}-${scheme}.png` }).catch(() => {})
  await p.locator('.rp-wrap').screenshot({ path: `${S}/rpfps-chart-${n}-${scheme}.png` }).catch(() => {})
  await p.click('[data-tmf-play]'); await p.waitForTimeout(300)
  const after = await p.evaluate(() => ({ fut: document.querySelectorAll('.rp-embed .rp-e.fut').length, total: document.querySelectorAll('.rp-embed .rp-e').length, veil: (() => { const v = document.querySelector('.rp-veil'); return !!v && v.getAttribute('display') !== 'none' })(), ov: document.documentElement.scrollWidth - innerWidth }))
  console.log(n, scheme, JSON.stringify({ before, ...r, after }), errs)
  if (r.fps < min) fail(`${n} ${scheme}: ${r.fps} frames a second, wants ${min}`)
  if (r.p95 > 50) fail(`${n} ${scheme}: 95th percentile frame ${r.p95} ms`)
  if (r.muts) fail(`${n} ${scheme}: the chart changed ${r.muts} times while the map played`)
  if (!r.veil || /rgba?\(0, 0, 0(, 0)?\)/.test(r.veilFill || '')) fail(`${n} ${scheme}: no veil over the chart's future while playing (${r.veilFill})`)
  if (r.playing !== 'true') fail(`${n} ${scheme}: playback stopped by itself`)
  if (after.veil || !(after.fut > 0 && after.fut < after.total)) fail(`${n} ${scheme}: the marks did not fade as before after the pause`)
  if (after.ov > 1 || errs.length) fail(`${n} ${scheme}: overflow or errors`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
