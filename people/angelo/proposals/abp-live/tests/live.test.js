const { chromium } = require('playwright')
// backlog 00d1 (f8000851, decision 3): the live command. Starts stories/reach/live.mjs, presses "Run it live now" on the
// follow-up at the chosen rung, and checks that the step view shows the run's steps as they happen, ends with the
// verdict, never serves a fake secret's value, and serves nothing outside its own files. Needs the claude command
// (logged in); one real run of the smaller model, about 20 to 40 seconds.
//   node people/angelo/proposals/abp-live/tests/live.test.js [rung]
const path = require('path'), { spawn } = require('child_process')
const RUNG = +(process.argv[2] || 0), PORT = 8771, U = `http://127.0.0.1:${PORT}`
;(async () => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const srv = spawn('node', [path.join(__dirname, '../stories/reach/live.mjs'), '--port', String(PORT)], { stdio: ['ignore', 'pipe', 'inherit'] })
 await new Promise(r => srv.stdout.once('data', r))
 const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1280, height: 800 } }), errs = [], seenN = new Set(), bodies = []
 p.on('pageerror', e => errs.push(e.message))
 p.on('response', async r => { if (r.url().includes('live.json')) try { bodies.push(await r.text()) } catch { } })
 for (const bad of ['/../scenarios.mjs', '/tests/live.test.js', '/sw.js']) { const r = await fetch(U + bad); if (r.status !== 404) fail(`served ${bad}: ${r.status}`) }
 await p.goto(`${U}/?live=1&story=followup&rung=${RUNG}`, { waitUntil: 'load' })
 await p.click('#liveB')
 const t0 = Date.now(); let state = ''
 while (Date.now() - t0 < 180e3) {
  await p.waitForTimeout(1000)
  state = await p.textContent('#liveS'); seenN.add(await p.evaluate(() => document.querySelectorAll('#bar2 span').length))
  if (/finished|failed/.test(state)) break
 }
 const title = await p.textContent('#title'), bubble = await p.textContent('#bT')
 if (!/finished/.test(state)) fail(`the run did not finish: ${state}`)
 if (!/LIVE/.test(title)) fail(`no LIVE mark: ${title}`)
 if (seenN.size < 2) fail(`the steps did not grow while it ran: ${[...seenN]}`)
 if (!/Job done|Waits|Stops|More than/.test(bubble)) fail(`no verdict at the end: ${bubble}`)
 if (bodies.some(t => /mk_live_|pw-[0-9a-f]{12}|ct_mk/.test(t))) fail('a fake secret value was served')
 if (errs.length) fail(`page errors ${JSON.stringify(errs)}`)
 console.log(`  rung ${RUNG}: ${state}; step counts seen ${[...seenN].join(',')}; last: ${bubble}`)
 await p.screenshot({ path: process.env.SHOT || '/dev/null' }).catch(() => { })
 await b.close(); srv.kill('SIGINT'); console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1) })()
