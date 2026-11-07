// For me (spec-kanban-tasks.md): the four columns, the Later button, Seen copying a line, "since you last looked", both widths and themes
const { chromium } = require('playwright');
const S = process.argv[2], B = process.argv[3] || 'http://127.0.0.1:8765', U = B + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, permissions: ['clipboard-read', 'clipboard-write'] }); const p = await ctx.newPage()
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/status of 507/.test(m.text())) errs.push(m.text()) });
  // a first visit long ago, so every card reads as new
  await p.addInitScript(() => { try { if (!sessionStorage.getItem('t')) { localStorage.setItem('ak.lastLooked', JSON.stringify('2026-10-01T00:00:00Z')); localStorage.setItem('ak.ownSeen', '1'); sessionStorage.setItem('t', '1') } } catch { } });
  await p.goto(U + '#kanban', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-task', { timeout: 8000 }).catch(() => fail('no task cards'));
  const v = await p.evaluate(() => ({ cols: [...document.querySelectorAll('.ak-tasks .ak-col header, .ak-tabs button')].map(x => x.textContent.replace(/\s+/g, ' ').trim()), cards: document.querySelectorAll('.ak-task').length, news: document.querySelectorAll('.ak-task.ak-new').length, since: document.querySelector('.ak-since')?.textContent.trim().slice(0, 90), views: document.querySelectorAll('.ak-views a').length, ov: document.documentElement.scrollWidth - innerWidth }));
  console.log(n, scheme, JSON.stringify(v));
  if (v.cols.length !== 4 || !/^Needs you/.test(v.cols[0])) fail('four columns, Needs you first');
  if (n === 'phone') { const pos = await p.evaluate(() => ({ tabs: document.querySelector('.ak-tabs').getBoundingClientRect(), card: document.querySelector('.ak-task').getBoundingClientRect(), done: document.querySelector('[data-ak-tab="done"]').getBoundingClientRect() })); if (pos.card.top > 844 || pos.done.right > 390) fail('phone: first card or Done tab off the first screen ' + JSON.stringify(pos)) }
  if (!v.news || !/Since you last looked|new since/.test(v.since || '')) fail('changes since last look');
  if (v.views < 4) fail('the other views');
  if (v.ov > 1) fail('horizontal page scroll ' + v.ov);
  await p.screenshot({ path: `${S}/tasks-${n}-${scheme}.png` });
  // Later hides a Needs you card
  const id = await p.evaluate(() => document.querySelector('[data-later]')?.dataset.later);
  if (id) { await p.locator(`[data-later="${id}"]`).click(); await p.waitForTimeout(150); if (await p.locator(`[data-task="${id}"]`).count()) fail('Later did not hide ' + id) } else fail('no Later button')
  // Mark all as looked at clears the highlights
  await p.locator('[data-looked]').click(); await p.waitForTimeout(150);
  if (await p.locator('.ak-task.ak-new').count()) fail('highlights stayed after Mark all as looked at');
  // Seen copies one line for the desk
  if (n === 'phone') { await p.locator('[data-ak-tab="delivered"]').click(); await p.waitForTimeout(150) }
  const seen = p.locator('[data-mark="seen"]').first();
  if (await seen.count()) { await seen.click(); await p.waitForSelector('.ak-copy', { timeout: 3000 }).catch(() => fail('no copied line')); const line = await p.evaluate(() => document.querySelector('.ak-copy code')?.textContent || ''); console.log(n, scheme, 'line', line.slice(0, 60)); if (!/^Seen: D-[0-9a-f]{8} /.test(line)) fail('copied line: ' + line) }
  else console.log(n, scheme, 'no delivered card to mark (fine if none was delivered this week)')
  // the old layout is one tap away
  await p.locator('.ak-views a', { hasText: 'Status' }).click(); await p.waitForSelector('[data-ak-tog="now"]', { timeout: 5000 }).catch(() => fail('old layout'));
  if (errs.length) fail('errors ' + errs.join(' | '));
  await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
