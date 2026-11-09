const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the live graph draws every repository the agents work in (backlog 00 point 7): live.json carries the other repositories'
// exchanges (from repos-events.json) with names and times only, and one from the newsroom travels as a bright pulse on its
// line like any other; at 1280 and 390 px, light and dark
// between two people, as live.js's personOf reads a name: two newsroom agents of one person not on the map both fall back to
// that person's node, and an exchange from a node to itself is not drawn (9 November: the newest one was pt:dinis:dev -> pt:dinis:conductor)
const who = n => { const m = String(n).match(/@(?:web-summit|promptugal)\.([a-z0-9-]+)$/i) || String(n).match(/^pt:([a-z0-9-]+):/); return m ? m[1].toLowerCase() : n }
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507/.test(m.text())) errs.push(m.text()) })
  let L0 = null, mode = 'quiet', pick = null
  await p.route('**/live.json*', async r => { const res = await r.fetch(); const L = await res.json(); L0 = L0 || JSON.parse(JSON.stringify(L))
    // quiet: everything two days old; then one exchange from another repository, ten minutes ago, between two agents the map knows
    L.events = L.events.map(e => [e[0] - 3000, ...e.slice(1)])
    if (mode === 'new') { pick = L.events.filter(e => e[5] > 0 && e[3].length && who(L.agents[e[1]]) !== who(L.targets[e[3][0]])).pop(); L.events.push([Math.round((Date.now() - Date.parse(L.from)) / 6e4) - 10, pick[1], 'x', pick[3], 'testrepo', pick[5]]) }
    await r.fulfill({ response: res, json: L }) })
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg'); await p.waitForTimeout(800)
  const L = L0, others = L ? L.events.filter(e => e[5] > 0) : []
  const keys = L && L.events.every(e => e.length === 6 && Number.isInteger(e[5]) && e[5] < L.repos.length)
  const text = L && JSON.stringify(L).match(/"(subject|body|message|text)"/)
  mode = 'new'; let got = 0, before = await p.evaluate(() => document.querySelectorAll('.lv-pulses circle:not(.flow):not(.halo)').length)
  for (let i = 0; i < 30 && !got; i++) { await p.waitForTimeout(250); got = await p.evaluate(() => document.querySelectorAll('.lv-pulses circle:not(.flow):not(.halo)').length) }
  await p.locator('.lv-frame').screenshot({ path: `${S}/lvrepo-${n}-${scheme}.png` })
  console.log(n, scheme, JSON.stringify({ repos: L && L.repos, others: others.length, keys, text: !!text, before, got, pick: pick && L.repos[pick[5]] }), errs)
  if (!L || L.repos.length < 2 || !others.length || !keys || text || before || !got || errs.length) fail(n + ' ' + scheme)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
