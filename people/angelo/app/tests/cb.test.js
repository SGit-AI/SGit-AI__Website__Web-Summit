const { chromium } = require('playwright');
const S = process.argv[2], B = process.argv[3] || 'http://127.0.0.1:8765', U = B + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
  await p.goto(U + (n === 'desktop' ? '#home' : '#kanban'), { waitUntil: 'networkidle' });
  if (n === 'desktop') await p.locator('.cc-nav [data-view="collab"]').click(); else { await p.waitForSelector('.ak-switch a'); await p.locator('.ak-switch a', { hasText: 'Team' }).click() }
  await p.waitForSelector('.ak-person', { timeout: 8000 }).catch(() => fail('no people'));
  const v = await p.evaluate(() => ({ title: document.querySelector('#cc-title').textContent, people: document.querySelectorAll('.ak-person').length, links: document.querySelectorAll('.ak-links li').length, release: document.querySelector('.ak-machine .ak-big')?.textContent, ci: document.querySelector('.ak-machine a')?.href, next: [...document.querySelectorAll('.ak-person > small')].map(x => x.textContent).slice(0, 3) }));
  console.log(n, JSON.stringify(v)); if (v.people < 5 || !v.links || !/^https:\/\/github\.com\/SGit-AI\//.test(v.ci || '')) fail('collab view');
  await p.screenshot({ path: `${S}/cb-${n}.png`, fullPage: false });
  await p.locator('[data-ak-person="angelo"]').click(); await p.waitForSelector('.ak-sheet');
  const sh = await p.evaluate(() => ({ hash: location.hash, agents: document.querySelectorAll('.ak-agents li').length, work: [...document.querySelectorAll('.ak-sheet a')].map(a => a.getAttribute('href')).slice(0, 2) }));
  console.log(n, 'sheet', JSON.stringify(sh)); if (!sh.hash.includes('p=angelo') || !sh.agents) fail('person sheet');
  await p.screenshot({ path: `${S}/cb-${n}-sheet.png` });
  // a picked issue opens on the kanban
  if (sh.work[0]) { await p.locator('.ak-sheet a').first().click(); await p.waitForSelector('.ak-sheet #ak-body', { timeout: 8000 }).catch(() => fail('issue link')); const gh = await p.evaluate(() => [...document.querySelectorAll('.ak-sheet a')].map(a => a.href).filter(h => h.includes('github')).slice(0, 2)); console.log(n, 'github links', gh); if (gh.some(h => /github\.com\/https/.test(h))) fail('doubled github url') }
  await p.goBack(); await p.waitForTimeout(400);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 1) fail('horizontal scroll ' + ov);
  if (errs.length) fail('errors ' + errs.join(' | '));
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
