// The timeline under Team and the machine's map: one clock, filters in the address, #replay redirects, Replay out of the menu.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  // an old Replay address lands on the map with the timeline, keeping its filters
  await p.goto(U + '#replay?w=72h&p=angelo', { waitUntil: 'networkidle' });
  await p.waitForSelector('.rp-embed .rp-svg', { timeout: 8000 }).catch(() => fail('no timeline'));
  const a = await p.evaluate(() => ({ hash: location.hash, title: document.querySelector('#cc-title').textContent, map: !!document.querySelector('.tm-svg'), dots: document.querySelectorAll('.rp-embed circle.rp-e').length, ownPlay: !!document.querySelector('.rp-embed [data-rp-play]'), menu: !!document.querySelector('.cc-nav [data-view="replay"]'), overflow: document.documentElement.scrollWidth - innerWidth }));
  await p.screenshot({ path: `${S}/tmtl-${n}.png`, fullPage: true });
  // one clock: scrubbing the map moves the timeline's playhead and fades the dots after it
  const before = await p.evaluate(() => document.querySelectorAll('.rp-embed .rp-e.fut').length);
  await p.evaluate(() => { const r = document.querySelector('[data-tmf-scrub]'); r.value = r.min; r.dispatchEvent(new Event('input', { bubbles: true })) }); await p.waitForTimeout(300);
  const after = await p.evaluate(() => ({ fut: document.querySelectorAll('.rp-embed .rp-e.fut').length, total: document.querySelectorAll('.rp-embed .rp-e').length, head: document.querySelector('.rp-embed .rp-head').getAttribute('x1') }));
  // a commit picked on the timeline moves the map's clock there and is kept in the address. The first commit whose agent is on
  // the map: the timeline shows every agent's commits, the map leaves some out (runner.writer, a fresh session each run, is drawn
  // only on the live graph), and which commit comes first depends on the hour (dev@'s review, 8426842)
  const first = await p.evaluate(() => { const on = new Set([...document.querySelectorAll('.tm-a[data-tm-f]')].map(g => g.dataset.tmF)); return [...document.querySelectorAll('.rp-embed circle.rp-e')].findIndex(c => on.has(c.querySelector('title').textContent.split(', ')[0])) });
  if (first < 0) fail('no commit on the timeline by an agent on the map');
  // clicked as an event on the dot itself: at some hours the window's first dot sits at the very left edge, under the row labels,
  // where a click by position lands on the label (dev.map, 8 November, 06:40 UTC)
  await p.locator('.rp-embed circle.rp-e').nth(Math.max(0, first)).dispatchEvent('click'); await p.waitForSelector('.rp-embed .rp-detail', { timeout: 4000 }).catch(() => fail('no detail'));
  const d = await p.evaluate(() => ({ hash: location.hash, scrub: +document.querySelector('[data-tmf-scrub]').value, min: +document.querySelector('[data-tmf-scrub]').min }));
  // the picked commit's agent is picked out on the map, and un-picked when the commit is
  await p.waitForTimeout(200); const picked = await p.evaluate(() => document.querySelectorAll('.tm-a.tmf-pick').length);
  await p.locator('.rp-embed circle.rp-e.on').first().dispatchEvent('click'); await p.waitForTimeout(300);
  const cleared = await p.evaluate(() => document.querySelectorAll('.tm-a.tmf-pick').length);
  if (picked !== 1 || cleared !== 0) fail('pick on the map: ' + picked + ' then ' + cleared);
  console.log(n, JSON.stringify({ a, before, after, d }), errs);
  if (!/#collab\?/.test(a.hash) || !a.hash.includes('map=1') || !a.hash.includes('r_p=angelo') || !a.hash.includes('w=72h') || !/Team and the machine/.test(a.title) || !a.map || a.dots < 3 || a.ownPlay || a.menu || a.overflow > 1) fail('landing ' + JSON.stringify(a));
  if (!(after.fut >= after.total - 2 && after.fut > before)) fail('timeline did not follow the map');
  if (!d.hash.includes('r_sel=') || !d.hash.includes('r_p=angelo') || !d.hash.includes('map=1') || d.scrub < d.min) fail('pick ' + d.hash);
  if (errs.length) fail('errors ' + errs.join(' | ')); await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
