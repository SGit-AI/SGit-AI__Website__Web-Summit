const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true;
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + '#kanban', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-card');
  const r = await p.evaluate(() => ({ grp: document.querySelector('.cc-nav .ak-grp')?.textContent, marks: document.querySelectorAll('.cc-nav .ak-mk').length, title: document.querySelector('#cc-title .ak-own')?.textContent, note: !!document.querySelector('.ak-ownnote'), tab: document.querySelector('.cc-tabs a[href="#kanban"]')?.textContent.trim(), sharedTitleMark: null }));
  await p.screenshot({ path: `${S}/own-${n}.png` });
  await p.locator('[data-ak-ownok]').click(); await p.goto(U + '#collab', { waitUntil: 'networkidle' }); await p.waitForSelector('.ak-person');
  const r2 = await p.evaluate(() => ({ note: !!document.querySelector('.ak-ownnote'), title: document.querySelector('#cc-title .ak-own')?.textContent }));
  await p.goto(U + '#tasks', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
  const r3 = await p.evaluate(() => ({ sharedMarked: !!document.querySelector('#cc-title .ak-own'), title: document.querySelector('#cc-title').textContent }));
  console.log(n, JSON.stringify({ ...r, after: r2, shared: r3 }), errs);
  ok = ok && r.grp === "✦ Angelo's own" && r.marks === 5 && /✦/.test(r.title) && r.note && !r2.note && /Angelo's own/.test(r2.title || '') && !r3.sharedMarked && /Kanban ✦/.test(r.tab || '') && !errs.length; await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
