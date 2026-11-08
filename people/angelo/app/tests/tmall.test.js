// Backlog 0f (the desk's 08:30 brief and 9c5d5ac): every agent a person declares is on the map, in the replay (normal) view as in
// the live one: the fresh-session workers whose commits are on their workers/ branches, and any not yet run, stand beside their
// person from the start of playback, their own commits (repos-events.json, 48 hours) counted under their names, each For: a line. Checked for every one of Angelo's agents (people/angelo/agents.json), in both views, every layout.
const { chromium } = require('playwright'); const fs = require('fs')
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html'
const want = JSON.parse(fs.readFileSync('people/angelo/agents.json', 'utf8')).map(a => { const m = a.name.match(/^([^@]+)@PrompTugal\.([a-z0-9-]+)$/i); return m ? `pt:${m[2].toLowerCase()}:${m[1]}` : a.name })
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  const out = {}
  for (const l of ['ring', 'agents', 'work']) {
   await p.goto(U + `#collab?map=1&l=${l}`, { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg'); await p.waitForTimeout(1500)
   const r = await p.evaluate(want => { const shown = id => { const g = document.querySelector(`.tm-a[data-tm-f="${CSS.escape(id)}"]`); if (!g) return 'absent'; const d = g.querySelector('circle:not(.tm-kr), rect'), cs = getComputedStyle(g), cd = getComputedStyle(d); return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05 || cd.display === 'none' || +cd.opacity < 0.05 || d.getBoundingClientRect().width < 1 ? 'hidden' : 'ok' }
     return want.map(id => [id, shown(id)]).filter(([, s]) => s !== 'ok') }, want)
   out[l] = r; if (r.length) fail(`${n} map ${l}: ${JSON.stringify(r)}`)
   if (l === 'agents' && n === 'desktop') await p.locator('.tm-wrap').screenshot({ path: `${S}/tmall-map-${l}.png` })
  }
  // the live view: the same agents (live.js's own layout)
  await p.goto(U + '#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg .tm-p')
  const lv = await p.evaluate(() => document.querySelectorAll('.lv-svg .tm-a').length)
  const mp = await p.evaluate(() => fetch('data.json').then(r => r.json()).then(D => D.collab.map.agents.length + (D.collab.map.sessionless || []).length)).catch(() => -1)
  // a worker's own commits (from repos-events.json, its workers/ branch) count under its name, and its review is a line to dev@
  const wk = await p.evaluate(() => fetch('data.json').then(r => r.json()).then(D => { const M = D.collab.map, all = M.agents.concat(M.sessionless || []), w = all.filter(a => a.own > 0); return { w: w.length, bad: w.filter(a => !(a.commits >= a.own) || !M.links.some(l => l.from === a.id && l.to === 'pt:angelo:dev' || l.from === a.id && l.worker)).map(a => a.id) } }))
  if (!wk.w || wk.bad.length) fail(`${n}: workers' own commits and review lines ${JSON.stringify(wk)}`)
  if (mp > 0 && lv !== mp) fail(`${n} live: ${lv} agents drawn, the record has ${mp}`)
  console.log(n, JSON.stringify({ missing: out, live: lv, record: mp }), errs.slice(0, 2))
  if (errs.length) fail(`${n}: errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
