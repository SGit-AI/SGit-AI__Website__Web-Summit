const { chromium } = require('playwright')
// backlog 00d1 (f8000851): the step view plays every recorded run of both stories at all five rungs, at 1280 and 390 px,
// with no page error and no horizontal scroll; the loop moves on from rung to rung; the record holds no fake secret's value.
// Run from the repository's root while it is served on 127.0.0.1:8765 (python3 -m http.server 8765):
//   node people/angelo/proposals/abp-live/tests/steps.test.js [shots folder]
const U = 'http://127.0.0.1:8765/people/angelo/proposals/abp-live/steps.htm', SHOTS = process.argv[2]
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const width of [1280, 390]) {
  const p = await b.newPage({ viewport: { width, height: width > 800 ? 800 : 844 } }); const errs = []
  p.on('pageerror', e => errs.push(e.message))
  await p.goto(U, { waitUntil: 'networkidle' })
  const R = await p.evaluate(() => window.ABP_REACH)
  if (!R) { fail(`${width}: no record`); continue }
  if (/mk_live_|pw-[0-9a-f]{12}|ct_mk/.test(JSON.stringify(R))) fail('a fake secret value is in the record')
  let n = 0
  for (const [s, st] of Object.entries(R.stories)) for (const c of st.cells) for (const r of c.runs) {
   await p.goto(`${U}?story=${s}&rung=${c.rung}&run=${r.id}`, { waitUntil: 'load' })
   await p.click('#play')                                   // pause, then step through by hand
   for (let i = 0; i < r.steps.length; i++) {
    await p.evaluate(i => CTL.go(i), i)
    const t = await p.textContent('#bT'); if (!t.startsWith(`${i + 1} · `)) fail(`${r.id} step ${i}: ${t}`)
    n++
   }
   if (SHOTS && r.id === c.shown && (c.rung === 0 || c.rung === 3)) await p.screenshot({ path: `${SHOTS}/${s}-r${c.rung}-${width}.png`, fullPage: true })
  }
  const wide = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth); if (wide) fail(`${width}: horizontal scroll`)
  await p.goto(U + '?loop=1', { waitUntil: 'load' })
  const r0 = await p.textContent('#lv'); await p.evaluate(() => { CTL.go(CTL.run.steps.length - 1) }); await p.waitForTimeout(5000)
  const r1 = await p.textContent('#lv'); if (r0 === r1) fail(`${width}: the loop did not move on (${r0})`)
  if (errs.length) fail(`${width}: page errors ${JSON.stringify(errs)}`)
  console.log(`  ${width}: ${n} steps shown; loop ${r0} -> ${r1}`)
  await p.close()
 }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1) })()
