// Backlog 0e, the layouts (Angelo, 8 November: "the 'agents in the centre' is not really nice, it should look like agents and their
// work, but without the work, so all agents in the other ring" and "In the live view, I would also like to be able to choose the view
// among the options available in the normal view."). The map's agents layout puts each person's agents in one ring inside the people,
// the centre left to the lines, no kinds of work; the live view has a quiet switch with the same three layouts, inside the hexagon
// (so the pop-out has it too), people where the map puts them, remembered on this device; lv=<layout> in the address wins.
// 2D and 3D, 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const r = (x, y) => Math.hypot(x - 500, y - 500)
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' }), p = await ctx.newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message))
  // the map (normal view), agents layout: agents in a ring between 280 and 380 from the centre, people at 445, nothing at the centre
  await p.goto(U + '#collab?map=1&l=agents', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg.tm-agents')
  const mp = await p.evaluate(() => ({ people: [...document.querySelectorAll('.tm-p circle')].map(c => [c.closest('[data-tm-f]').dataset.tmF, +c.getAttribute('cx'), +c.getAttribute('cy')]),
    agents: [...document.querySelectorAll('.tm-a > circle:not(.tm-kr)')].map(c => [+c.getAttribute('cx'), +c.getAttribute('cy')]), kinds: document.querySelectorAll('.tm-k').length, tab: (document.querySelector('[data-tm-l="agents"]') || {}).textContent }))
  if (n === 'desktop' && scheme === 'dark') await p.locator('.tm-wrap').screenshot({ path: `${S}/lvlay-map-agents.png` })
  const ar = mp.agents.map(([x, y]) => r(x, y)), pr = mp.people.map(([, x, y]) => r(x, y))
  if (!mp.agents.length || ar.some(v => v < 280 || v > 380) || pr.some(v => Math.abs(v - 445) > 1) || mp.kinds || mp.tab !== 'Agents ring') fail(`${n} ${scheme}: the map's agents layout ${JSON.stringify({ min: Math.min(...ar), max: Math.max(...ar), pr: pr.slice(0, 3), kinds: mp.kinds, tab: mp.tab })}`)
  // the live view: the switch, ring first (nothing stored), then each layout
  await p.goto(U + '#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg .tm-p')
  const st = () => p.evaluate(() => { const hx = document.querySelector('.lv-hex').getBoundingClientRect(), lay = document.querySelector('.lv-lay'), lr = lay.getBoundingClientRect()
    return { on: [...document.querySelectorAll('[data-lv-l]')].filter(x => x.getAttribute('aria-pressed') === 'true').map(x => x.dataset.lvL), n: document.querySelectorAll('[data-lv-l]').length,
      people: [...document.querySelectorAll('.lv-svg .tm-p circle')].map(c => [+c.getAttribute('cx'), +c.getAttribute('cy')]), agents: [...document.querySelectorAll('.lv-svg .tm-a > circle:not(.lv-kr)')].map(c => [+c.getAttribute('cx'), +c.getAttribute('cy')]),
      kinds: document.querySelectorAll('.lv-k').length, spokes: document.querySelectorAll('.lv-spokes line').length, wflows: document.querySelectorAll('.lv-links path.wflow').length,
      layIn: lr.width > 0 && lr.right <= innerWidth && lr.bottom <= Math.max(innerHeight, document.documentElement.scrollHeight) && lr.left >= 0, layOp: +getComputedStyle(lay).opacity, ov: document.documentElement.scrollWidth - innerWidth, hexW: hx.width } })
  const s0 = await st()
  if (s0.n !== 3 || s0.on.join() !== 'ring' || s0.kinds || s0.spokes || !s0.layIn || s0.layOp > 0.6 || s0.ov > 1) fail(`${n} ${scheme}: the switch at first ${JSON.stringify({ ...s0, people: undefined, agents: undefined })}`)
  const got = {}
  for (const L of ['agents', 'work', 'ring']) {
   await p.locator(`[data-lv-l="${L}"]`).click(); await p.waitForFunction(L => document.querySelector(`[data-lv-l="${L}"]`).getAttribute('aria-pressed') === 'true', L, { timeout: 8000 }).catch(() => fail(`${n} ${scheme}: ${L} not switched on`))
   await p.waitForTimeout(300); const s = got[L] = await st()
   await p.locator('.lv-hex').screenshot({ path: `${S}/lvlay-${L}-${n}-${scheme}.png` })
   const ar2 = s.agents.map(([x, y]) => r(x, y)), pr2 = s.people.map(([x, y]) => r(x, y))
   if (L === 'ring' && (s.kinds || s.spokes || pr2.some(v => Math.abs(v - 300) > 1))) fail(`${n} ${scheme}: live ring ${JSON.stringify({ kinds: s.kinds, spokes: s.spokes })}`)
   if (L !== 'ring' && (ar2.some(v => v < 280 || v > 380) || pr2.some(v => Math.abs(v - 445) > 1) || !s.spokes)) fail(`${n} ${scheme}: live ${L} ${JSON.stringify({ min: Math.min(...ar2), max: Math.max(...ar2), spokes: s.spokes })}`)
   if (L === 'agents' && s.kinds) fail(`${n} ${scheme}: live agents has kinds`)
   if (L === 'work' && (!s.kinds || !s.wflows)) fail(`${n} ${scheme}: live work has no kinds or flows ${JSON.stringify({ kinds: s.kinds, wflows: s.wflows })}`)
   if (L !== 'ring' && (s.people.length !== mp.people.length || s.people.some(([x, y], i) => Math.hypot(x - mp.people[i][1], y - mp.people[i][2]) > 1.5))) fail(`${n} ${scheme}: live ${L}: people not where the map puts them`)
  }
  // remembered on this device: agents, then a reload
  await p.locator('[data-lv-l="agents"]').click(); await p.reload({ waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg .tm-p')
  const s1 = await st(); if (s1.on.join() !== 'agents') fail(`${n} ${scheme}: not remembered: ${s1.on}`)
  // the address wins
  await p.goto(U + '?lv=work#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg .tm-p'); const s2 = await st(); if (s2.on.join() !== 'work' || !s2.kinds) fail(`${n} ${scheme}: lv=work in the address ${s2.on}`)
  // still moving after a switch (the flow never stops), and in 3D the switch redraws the WebGL view too
  const moving = await p.waitForFunction(() => document.querySelectorAll('.lv-pulses circle').length > 0, null, { timeout: 15000 }).then(() => true).catch(() => false)
  if (!moving) fail(`${n} ${scheme}: nothing moves after a switch`)
  if (n === 'desktop') {
   await p.goto(U + '#live?d3=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D`))
   await p.locator('[data-lv-l="ring"]').click(); await p.waitForSelector('.lv-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D after a switch`))
   const c3 = await p.evaluate(() => ({ canv: document.querySelectorAll('.lv-3d canvas').length, boxes: document.querySelectorAll('.lv-3d').length, on: document.querySelector('[data-lv-l][aria-pressed="true"]').dataset.lvL }))
   await p.waitForTimeout(500); await p.locator('.lv-hex').screenshot({ path: `${S}/lvlay-3d-${n}-${scheme}.png` })
   if (c3.canv !== 1 || c3.boxes !== 1 || c3.on !== 'ring') fail(`${n} ${scheme}: 3D after a switch ${JSON.stringify(c3)}`)
  }
  console.log(n, scheme, JSON.stringify({ map: { agents: mp.agents.length, rmin: Math.round(Math.min(...ar)), rmax: Math.round(Math.max(...ar)) }, live: Object.fromEntries(Object.entries(got).map(([k, v]) => [k, { kinds: v.kinds, spokes: v.spokes, wflows: v.wflows }])), remembered: s1.on, address: s2.on }), errs.slice(0, 2))
  if (errs.length) fail(`${n} ${scheme}: errors ${errs.join(' | ')}`)
  await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
