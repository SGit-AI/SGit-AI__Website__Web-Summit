const { chromium } = require('playwright');
const S = process.argv[2], U = (process.argv[3] || 'http://127.0.0.1:8765') + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + '#collab', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tm-toggle]');
  const before = await p.locator('.tm-svg').count();
  await p.locator('[data-tm-toggle]').click(); await p.waitForSelector('.tm-svg');
  const r = await p.evaluate(() => ({ hash: location.hash, people: document.querySelectorAll('.tm-p').length, agents: document.querySelectorAll('.tm-a').length, diamonds: document.querySelectorAll('.tm-a rect').length, links: document.querySelectorAll('.tm-links path').length, w: Math.round(document.querySelector('.tm-svg').getBoundingClientRect().width), ov: document.documentElement.scrollWidth - innerWidth }));
  await p.locator('.tm-p[data-tm-f="angelo"]').dispatchEvent('click'); await p.waitForTimeout(200);
  const f = await p.evaluate(() => ({ hash: location.hash, on: document.querySelectorAll('.tm-links path.on').length, off: document.querySelectorAll('.tm-links path.off').length, labels: document.querySelectorAll('.tm-al').length }));
  await p.locator('.tm-wrap').screenshot({ path: `${S}/tm-${n}.png` });
  await p.goto(U + '#collab?map=1&f=dinis', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg');
  const d = await p.evaluate(() => document.querySelectorAll('.tm-links path.on').length);
  console.log(n, JSON.stringify({ before, ...r, focusAngelo: f, bookmarkDinisOn: d }), errs);
  if (before || !r.hash.includes('map=1') || r.people < 5 || r.agents < 50 || !r.diamonds || !r.links || r.ov > 1 || !f.hash.includes('f=angelo') || !f.on || !f.off || !f.labels || !d || errs.length) fail(n);
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
