const { chromium } = require('playwright');
const S = process.argv[2], U = (process.argv[3] || 'http://127.0.0.1:8765') + '/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(U + '#collab?map=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg');
  const out = {};
  for (const l of ['agents', 'work']) {
   await p.locator(`[data-tm-l="${l}"]`).click(); await p.waitForSelector(`.tm-svg.tm-${l}`);
   out[l] = await p.evaluate(() => { const vb = 1000, nodes = [...document.querySelectorAll('.tm-a circle:not(.tm-kr), .tm-a rect, .tm-p circle, .tm-k polygon, .tm-k circle')]; return { hash: location.hash, agents: document.querySelectorAll('.tm-a').length, people: document.querySelectorAll('.tm-p').length, kinds: document.querySelectorAll('.tm-k').length, flows: document.querySelectorAll('.tm-flows path').length, spokes: document.querySelectorAll('.tm-spokes line').length, outside: nodes.filter(e => { const b = e.getBBox(); return b.x < 0 || b.y < 0 || b.x + b.width > vb || b.y + b.height > vb }).length, ov: document.documentElement.scrollWidth - innerWidth } });
   await p.locator('.tm-wrap').screenshot({ path: `${S}/tml-${l}-${n}.png` });
  }
  // focus a kind of work: its flows lit, the rest dimmed
  await p.locator('.tm-lg[data-tm-f="k:build"]').click(); await p.waitForTimeout(200);
  const f = await p.evaluate(() => ({ hash: location.hash, on: document.querySelectorAll('.tm-flows path.on').length, off: document.querySelectorAll('.tm-flows path.off').length, agentsOn: document.querySelectorAll('.tm-a:not(.off)').length }));
  await p.locator('.tm-wrap').screenshot({ path: `${S}/tml-build-${n}.png` });
  console.log(n, JSON.stringify({ ...out, focusBuild: f }), errs);
  if (out.agents.kinds || !out.agents.spokes || out.agents.outside || !out.work.kinds || !out.work.flows || out.work.outside || out.work.ov > 1 || !f.hash.includes('l=work') || !f.on || !f.off || errs.length) fail(n);
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
