const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + (n === 'desktop' ? '#home' : '#kanban'), { waitUntil: 'networkidle' });
  if (n === 'desktop') await p.locator('.cc-nav [data-view="replay"]').click(); else { await p.waitForSelector('.ak-switch a'); await p.locator('.ak-switch a', { hasText: 'Replay' }).click() }
  await p.waitForSelector('.rp-svg', { timeout: 8000 }).catch(() => fail('no chart'));
  const a = await p.evaluate(() => ({ title: document.querySelector('#cc-title').textContent, dots: document.querySelectorAll('circle.rp-e').length, rows: document.querySelectorAll('.rp-row').length, rel: document.querySelectorAll('.rp-rel line').length, stand: document.querySelectorAll('.rp-stand line').length, ov: document.documentElement.scrollWidth - innerWidth }));
  await p.screenshot({ path: `${S}/rp-${n}.png` });
  // filters: all time, Angelo only, reports only
  if (n === 'phone') await p.locator('.rp-filters > summary').click(); await p.locator('[data-rp-w]').selectOption('all'); await p.locator('[data-rp="p"][data-v="angelo"]').click(); await p.locator('[data-rp="k"][data-v="p"]').click();
  const f = await p.evaluate(() => ({ hash: location.hash, dots: document.querySelectorAll('circle.rp-e').length, colours: [...new Set([...document.querySelectorAll('circle.rp-e')].map(c => c.getAttribute('fill')))] }));
  // a dot opens its commit
  await p.locator('circle.rp-e').first().click({ force: true }); await p.waitForSelector('.rp-detail', { timeout: 4000 }).catch(() => fail('detail'));
  const d = await p.evaluate(() => ({ hash: location.hash, gh: document.querySelector('.rp-detail a[href*="/commit/"]')?.href }));
  // playback: play at 1 day a second, pause, check the fade and the scrubber moved
  await p.locator('[data-rp-speed]').selectOption('1440'); await p.locator('[data-rp-play]').click(); await p.waitForTimeout(1200);
  const pl = await p.evaluate(() => ({ fut: document.querySelectorAll('.rp-e.fut').length, total: document.querySelectorAll('.rp-e').length, scrub: +document.querySelector('[data-rp-scrub]').value, min: +document.querySelector('[data-rp-scrub]').min, label: document.querySelector('[data-rp-now]').textContent, btn: document.querySelector('[data-rp-play]').textContent }));
  await p.locator('[data-rp-play]').click();
  // jump: back to everyone, last 3 days, then the scrubber to the start shows all faded
  await p.goto(U + '#replay?w=72h', { waitUntil: 'networkidle' }); await p.waitForSelector('.rp-svg');
  const j = await p.evaluate(() => { const o = document.querySelector('[data-rp-jump] option[value]:not([value=""])'); return o ? o.value : null });
  if (j) { await p.locator('[data-rp-jump]').selectOption(j); await p.waitForTimeout(200) }
  const jp = await p.evaluate(() => ({ scrub: document.querySelector('[data-rp-scrub]').value, fut: document.querySelectorAll('.rp-e.fut').length }));
  console.log(n, JSON.stringify({ first: a, filtered: f, detail: d, playing: pl, jump: { to: j, ...jp } }), errs);
  if (!/Replay/.test(a.title) || a.dots < 10 || a.ov > 1 || !f.hash.includes('p=angelo') || f.colours.length !== 1 || !d.gh || !/github\.com\/SGit-AI/.test(d.gh) || !(pl.fut > 0 && pl.scrub > pl.min) || !/Pause/.test(pl.btn) || (j && !(jp.fut > 0))) fail('replay');
  if (errs.length) fail('errors ' + errs.join(' | ')); await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
