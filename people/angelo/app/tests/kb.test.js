const { chromium } = require('playwright');
const S = process.argv[2], B = process.argv[3] || 'http://127.0.0.1:8765';
const U = B + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/status of 507/.test(m.text())) errs.push(m.text()) });
  await p.goto(U + '#tasks', { waitUntil: 'networkidle' });
  // the shared view still works, and the Kanban entry is there
  const shared = await p.evaluate(() => document.querySelector('#cc-title')?.textContent);
  if (!/My tasks/.test(shared)) fail('shared view broke: ' + shared);
  const entry = n === 'desktop' ? '.cc-nav [data-view="kanban"]' : '.cc-tabs a[href="#kanban"]';
  if (!await p.locator(entry).count()) fail('no Kanban entry');
  await p.locator(entry).click(); await p.waitForSelector('.ak-card', { timeout: 8000 }).catch(() => fail('no cards'));
  const def = await p.evaluate(() => ({ title: document.querySelector('#cc-title').textContent, cards: document.querySelectorAll('.ak-card').length, cols: [...document.querySelectorAll('.ak-col header, .ak-tabs button')].map(x => x.textContent.replace(/\s+/g, ' ').trim()), fresh: document.querySelector('.ak-fresh')?.textContent, current: document.querySelector('[data-view="kanban"][aria-current], .cc-tabs a[href="#kanban"][aria-current]') !== null }));
  console.log(n, 'default', JSON.stringify(def));
  if (!def.current) fail('Kanban not marked current');
  if (!def.cols.some(c => /^Needs you/.test(c))) fail('For me is not the default: ' + def.cols.join('|'));
  await p.screenshot({ path: `${S}/kb-${n}-default.png` });
  // the old layouts, one tap away (f=0)
  await p.goto(U + '#kanban?f=0', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-ak-tog="now"]');
  // Needs me now
  await p.locator('[data-ak-tog="now"]').click(); await p.waitForTimeout(200);
  const need = await p.evaluate(() => ({ hash: location.hash, cards: document.querySelectorAll('.ak-card').length, flagged: document.querySelectorAll('.ak-card.ak-need').length }));
  console.log(n, 'needs me', JSON.stringify(need)); if (need.cards !== need.flagged || !need.hash.includes('n=1')) fail('needs me now');
  // layout: columns by due, lanes by workstream, sort by id desc, all statuses, nobody's filter: via the address (bookmark)
  await p.goto(U + '#kanban?f=0&m=0&c=due&l=stream&s=id&d=desc&t=open,picked,in%20progress,done', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-card');
  const lay = await p.evaluate(() => ({ lanes: [...document.querySelectorAll('.ak-lane')].map(x => x.textContent.replace(/\s+/g, ' ').trim()).slice(0, 4), first: [...document.querySelectorAll('.ak-card .ak-id')].slice(0, 3).map(x => x.textContent), cols: document.querySelector('[data-ak="col"]').value, lane: document.querySelector('[data-ak="lane"]').value }));
  console.log(n, 'bookmark', JSON.stringify(lay)); if (lay.cols !== 'due' || lay.lane !== 'stream' || !lay.lanes.length) fail('bookmarked layout');
  // keyword search via the Filter panel
  await p.goto(U + '#kanban?f=0&m=0', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-card');
  await p.locator('.ak-panel summary', { hasText: 'Filter' }).click(); await p.locator('input[data-ak="q"]').fill('WS-140'); await p.waitForTimeout(600);
  const q = await p.evaluate(() => ({ hash: location.hash, ids: [...document.querySelectorAll('.ak-card .ak-id')].map(x => x.textContent), open: document.querySelector('.ak-panel[open]') !== null, chip: document.querySelector('.ak-chip')?.textContent }));
  console.log(n, 'search', JSON.stringify(q));
  // open a card: details, full text fetched, Back closes it
  await p.goto(U + '#kanban?f=0&m=0&t=open,picked,in%20progress,done&q=WS-140', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-card');
  await p.locator('[data-ak-card="WS-140"]').click(); await p.waitForSelector('.ak-sheet');
  await p.waitForFunction(() => !/Loading/.test(document.querySelector('#ak-body')?.textContent || 'Loading'), null, { timeout: 8000 }).catch(() => fail('body not loaded'));
  const det = await p.evaluate(() => ({ hash: location.hash, body: document.querySelector('#ak-body').textContent.slice(0, 80), hist: document.querySelectorAll('.ak-sheet section:nth-of-type(3) li').length, overflow: document.documentElement.scrollWidth > innerWidth }));
  console.log(n, 'details', JSON.stringify(det)); if (!det.hash.includes('o=WS-140') || !/Found by Angelo/.test(det.body)) fail('details');
  await p.screenshot({ path: `${S}/kb-${n}-card.png` });
  await p.goBack(); await p.waitForTimeout(400);
  const closed = await p.evaluate(() => ({ sheet: !!document.querySelector('.ak-sheet'), hash: location.hash }));
  console.log(n, 'back', JSON.stringify(closed)); if (closed.sheet) fail('Back did not close the card');
  // page-level horizontal overflow at this width
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 1) fail('horizontal page scroll ' + ov);
  if (errs.length) fail('errors ' + errs.join(' | '));
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
