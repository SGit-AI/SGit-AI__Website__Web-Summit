// spec-live-map.md section 2, in the still map: "as counts in each node's tooltip". Each agent's tooltip ends with what the record
// shows of it (keys published and ended, keys handed over, a lane, sealed messages sent or verified), counted from data.json's
// replay.live, names and counts only. Checked against the data for every agent on the map. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U + '#replay?w=all', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg [data-tm-f]', { timeout: 8000 }).catch(() => fail('no map'))
  const r = await p.evaluate(async () => {
    const L = (await (await fetch('data.json')).json()).replay.live, tips = new Map([...document.querySelectorAll('.tm-a[data-tm-f]')].map(g => [g.dataset.tmF, g.querySelector(':scope > title').textContent]))
    const want = new Map(), add = (id, k) => { if (!tips.has(id)) return; const o = want.get(id) || {}; o[k] = (o[k] || 0) + 1; want.set(id, o) }
    for (const [, w, st] of L.keys) add(w, st === 'published' ? 'kp' : 'ke')
    for (const [, by, to] of L.handovers) { add(by, 'hg'); add(to, 'hr') }
    for (const [, w] of L.lanes) if (!(want.get(w) || {}).ln) add(w, 'ln')
    for (const [, w, k] of L.messages || []) add(w, k === 'verified' ? 'mv' : 'ms')
    const wrong = [], txt = [...tips.values()].join('\n')
    for (const [id, t] of tips) {
      const o = want.get(id), has = t.includes('. On the record: ')
      if (!o) { if (has) wrong.push([id, 'counts with no events', t]); continue }
      const parts = []
      if (o.kp) parts.push(`${o.kp} published`); if (o.ke) parts.push(`${o.ke} ended`)
      const h = (o.hg || 0) + (o.hr || 0)
      if (!has || (parts.length && !t.includes(`keys: ${parts.join(', ')}`)) || (h && !t.includes(`${h} key${h === 1 ? '' : 's'} handed over`)) || (o.ln && !t.includes('a lane for sealed messages'))
        || ((o.ms || o.mv) && !t.includes(`sealed messages: ${[o.ms ? `${o.ms} sent` : '', o.mv ? `${o.mv} verified` : ''].filter(Boolean).join(', ')}`))) wrong.push([id, o, t])
    }
    return { agents: tips.size, withCounts: [...tips.values()].filter(t => t.includes('On the record')).length, wrong: wrong.slice(0, 3), hex: /[0-9a-f]{32,}|sgit_[a-z_]+_/i.test(txt) }
  })
  await p.locator('.tm-svg').screenshot({ path: `${S}/lvtip-${n}-${scheme}.png` })
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(n, scheme, JSON.stringify({ ...r, ov }), errs)
  if (!(r.withCounts >= 10)) fail(`${n} ${scheme}: only ${r.withCounts} of ${r.agents} tooltips carry counts`)
  if (r.wrong.length) fail(`${n} ${scheme}: tooltips not matching the data ${JSON.stringify(r.wrong)}`)
  if (r.hex) fail(`${n} ${scheme}: a token or key in a tooltip`)
  if (ov > 1 || errs.length) fail(`${n} ${scheme}: overflow ${ov} errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
