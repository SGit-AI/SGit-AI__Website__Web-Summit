const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + '#replay', { waitUntil: 'networkidle' }); await p.waitForSelector('.rp-embed .rp-svg');
  const a = await p.evaluate(() => ({ arcs: document.querySelectorAll('.rp-arc').length, dots: document.querySelectorAll('circle.rp-e').length, ov: document.documentElement.scrollWidth - innerWidth }));
  await p.locator('.rp-wrap').screenshot({ path: `${S}/arcs-${n}.png` });
  // a dot with arcs: select it, its arcs highlight
  const h = await p.evaluate(() => { const arc = document.querySelector('.rp-arc'); return arc && arc.dataset.h });
  if (h) { await p.evaluate(h => document.querySelector(`circle[data-h="${h}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true })), h); await p.waitForTimeout(300) }
  const on = await p.evaluate(() => document.querySelectorAll('.rp-arc.on').length);
  // playback fades arcs too
  // (the map's controls drive the timeline now: one clock)
  await p.locator('[data-tmf-speed]').selectOption('1440'); await p.locator('[data-tmf-play]').click(); await p.waitForTimeout(700); await p.locator('[data-tmf-play]').click();
  if (n === 'phone') await p.locator('.rp-filters > summary').click();
  const fut = await p.evaluate(() => ({ fut: document.querySelectorAll('.rp-arc.fut').length, all: document.querySelectorAll('.rp-arc').length }));
  // the toggle hides them and goes in the address
  await p.locator('[data-rp-m]').click(); await p.waitForTimeout(200);
  const off = await p.evaluate(() => ({ arcs: document.querySelectorAll('.rp-arc').length, hash: location.hash }));
  console.log(n, JSON.stringify({ ...a, selectedArcsOn: on, playing: fut, off }), errs);
  if (!a.arcs || a.ov > 1 || (h && !on) || !(fut.fut > 0) || off.arcs || !off.hash.includes('m=0') || errs.length) fail(n);
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
