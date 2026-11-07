const { chromium } = require('playwright');
const S = process.argv[2], B = process.argv[3] || 'http://127.0.0.1:8765', U = B + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  // today, as it is
  let p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + (n === 'desktop' ? '#home' : '#kanban'), { waitUntil: 'networkidle' });
  if (n === 'desktop') await p.locator('.cc-nav [data-view="summit"]').click(); else { await p.waitForSelector('.ak-switch a'); await p.locator('.ak-switch a', { hasText: 'Summit' }).click() }
  await p.waitForSelector('.ak-tabs [data-ak-day]', { timeout: 8000 }).catch(() => fail('no days'));
  const v = await p.evaluate(() => ({ title: document.querySelector('#cc-title').textContent, days: [...document.querySelectorAll('[data-ak-day]')].map(x => x.textContent).slice(0, 4), items: document.querySelectorAll('.ak-ev').length, ess: document.querySelectorAll('.ak-ess dd').length, cur: !!document.querySelector('[data-view="summit"][aria-current]') }));
  console.log(n, 'today', JSON.stringify(v)); if (!v.days.length || !v.items || v.ess < 5) fail('summit view');
  await p.locator('[data-ak-day="2026-11-10"]').click(); await p.waitForTimeout(200);
  const t = await p.evaluate(() => ({ hash: location.hash, items: document.querySelectorAll('.ak-ev').length, firsts: [...document.querySelectorAll('.ak-ev .ak-evt b')].map(x => x.textContent).slice(0, 6), kinds: [...new Set([...document.querySelectorAll('.ak-ev .chip')].map(x => x.textContent))] }));
  console.log(n, 'tue', JSON.stringify(t)); if (!t.hash.includes('day=2026-11-10') || t.items < 20) fail('day switch');
  const sorted = t.firsts.filter(Boolean); if (sorted.join() !== sorted.slice().sort().join()) fail('not in time order');
  await p.screenshot({ path: `${S}/sd-${n}.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 1) fail('horizontal scroll ' + ov);
  if (errs.length) fail('errors ' + errs.join(' | ')); await p.close();
  // during the summit: Tue 10 Nov 11:55 Lisbon (UTC)
  p = await b.newPage({ viewport: vp }); await p.clock.setFixedTime(new Date('2026-11-10T11:55:00Z'));
  await p.goto(U + '#summit', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-ev');
  const live = await p.evaluate(() => ({ tab: document.querySelector('[data-ak-day][aria-selected="true"]')?.textContent, now: [...document.querySelectorAll('.ak-live .ak-title')].map(x => x.textContent), next: document.querySelector('.ak-next .ak-title')?.textContent }));
  console.log(n, 'on 10 Nov 11:55', JSON.stringify(live)); if (live.tab !== 'Today' || !live.now.some(x => /agentic internet/i.test(x)) || !live.next) fail('now/next');
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
