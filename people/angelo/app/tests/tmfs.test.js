const { chromium } = require('playwright');
const S = process.argv[2], B = process.argv[3] || 'http://127.0.0.1:8765', U = B + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 800 }], ['phone', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: B }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  // 1. a direct link opens the map alone, full screen
  await p.goto(U + '#collab?map=1&l=work&f=k%3Abuild&fs=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-fs .tm-svg');
  const d = await p.evaluate(() => { const s = document.querySelector('.tm-fs').getBoundingClientRect(), g = document.querySelector('.tm-fs .tm-svg').getBoundingClientRect(); return { cover: [Math.round(s.width), Math.round(s.height)], svg: [Math.round(g.width), Math.round(g.height)], fits: g.bottom <= innerHeight + 1 && g.right <= innerWidth + 1, layout: document.querySelector('.tm-svg').classList.contains('tm-work'), focusOn: document.querySelectorAll('.tm-flows path.on').length } });
  await p.screenshot({ path: `${S}/tmfs-${n}.png` });
  // 2. copy the link
  await p.locator('[data-tm-copy]').click(); await p.waitForTimeout(200);
  const copied = await p.evaluate(async () => ({ note: document.querySelector('[data-tm-copied]').textContent, clip: await navigator.clipboard.readText() }));
  // 3. close with the button, then full screen again from the page, then Escape
  await p.locator('[data-tm-fs]').click(); await p.waitForTimeout(200); const closed = await p.evaluate(() => ({ fs: !!document.querySelector('.tm-fs'), hash: location.hash }));
  await p.locator('[data-tm-fs]').click(); await p.waitForTimeout(300); const again = await p.evaluate(() => ({ fs: !!document.querySelector('.tm-fs'), hash: location.hash }));
  await p.evaluate(() => document.fullscreenElement && document.exitFullscreen()).catch(() => null); await p.waitForTimeout(200);
  if (await p.evaluate(() => !!document.querySelector('.tm-fs'))) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  const esc = await p.evaluate(() => ({ fs: !!document.querySelector('.tm-fs'), hash: location.hash }));
  console.log(n, JSON.stringify({ direct: d, copied, closed, again, afterExit: esc }), errs);
  if (d.cover[0] < vp.width - 2 || !d.fits || !d.layout || !d.focusOn || !/fs=1/.test(copied.clip) || copied.note !== 'Link copied' || closed.fs || /fs=1/.test(closed.hash) || !again.fs || !/fs=1/.test(again.hash) || esc.fs || errs.length) fail(n);
  await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
