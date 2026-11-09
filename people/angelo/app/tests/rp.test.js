// Replay's timeline, now under Team and the machine's map (#replay redirects there): filters, a commit's detail; and the clip, which stays its own view.
// Its playback is the map's (tmf, tmtl).
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + '#replay', { waitUntil: 'networkidle' });
  await p.waitForSelector('.rp-embed .rp-svg', { timeout: 8000 }).catch(() => fail('no chart'));
  const a = await p.evaluate(() => ({ title: document.querySelector('#cc-title').textContent, dots: document.querySelectorAll('circle.rp-e').length, rows: document.querySelectorAll('.rp-row').length, ov: document.documentElement.scrollWidth - innerWidth }));
  await p.screenshot({ path: `${S}/rp-${n}.png` });
  // filters: Angelo only, reports only
  if (n === 'phone') await p.locator('.rp-filters > summary').click(); await p.locator('[data-rp="p"][data-v="angelo"]').click(); await p.locator('[data-rp="k"][data-v="p"]').click();
  const f = await p.evaluate(() => ({ hash: location.hash, dots: document.querySelectorAll('circle.rp-e').length, colours: [...new Set([...document.querySelectorAll('circle.rp-e')].map(c => c.getAttribute('fill')))] }));
  await p.locator('circle.rp-e').first().click({ force: true }); await p.waitForSelector('.rp-detail', { timeout: 4000 }).catch(() => fail('detail'));
  const d = await p.evaluate(() => ({ gh: document.querySelector('.rp-detail a[href*="/commit/"]')?.href }));
  // the clip stays its own full-screen view
  await p.goto(U + '#replay?c=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.rp-clip .rp-svg', { timeout: 8000 }).catch(() => fail('no clip'));
  console.log(n, JSON.stringify({ first: a, filtered: f, detail: d }), errs);
  if (!/Team and the machine/.test(a.title) || a.dots < 10 || a.ov > 1 || !f.hash.includes('r_p=angelo') || f.colours.length !== 1 || !d.gh || !/github\.com\/SGit-AI/.test(d.gh)) fail('checks ' + JSON.stringify({ a, f, d }));
  if (errs.length) fail('errors ' + errs.join(' | ')); await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
