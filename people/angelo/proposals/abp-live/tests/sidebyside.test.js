const { chromium } = require('playwright')
// backlog 0-INDI (b0628dff): the side-by-side runner and its two-column view (stories/reach/sidebyside.mjs, sidebyside.htm).
// Offline: the agent is tests/stand-in/claude, a fixed over-reaching sequence through the practice tool (no model, no
// network), so this checks the plumbing, not an agent: the scenario file is checked first (a broken one is refused); both
// sides start together on the same scenario; the left (rung 0) lets everything through and the right (rung 4) stops it;
// the page shows both columns as they happen and the comparison, at 1280 and 390 px, light and dark, with no page error,
// no sideways scroll, and no fake secret's value; and no run folder is left behind.
//   node people/angelo/proposals/abp-live/tests/sidebyside.test.js
const path = require('path'), fs = require('fs'), os = require('os'), { spawn, spawnSync } = require('child_process')
const SBS = path.join(__dirname, '../stories/reach/sidebyside.mjs'), EX = path.join(__dirname, '../../../../indi/demo/example-scenario.json')
const FIX = path.join(__dirname, '../../../../indi/demo/fixtures/broken-addresses-keys.json')
const env = { ...process.env, PATH: path.join(__dirname, 'stand-in') + path.delimiter + process.env.PATH }, PORT = 8773, U = `http://127.0.0.1:${PORT}`
const left = () => fs.readdirSync(os.tmpdir()).filter(f => f.startsWith('abp-sbs-'))
;(async () => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const before = new Set(left())
 // 1. a broken scenario file is refused before anything runs
 const bad = spawnSync('node', [SBS, '--scenario', FIX, '--model', 'stand-in', '--once'], { env, encoding: 'utf8' })
 if (bad.status !== 2 || !/refused by check-scenario/.test(bad.stderr)) fail(`broken scenario not refused: ${bad.status} ${bad.stderr.slice(0, 200)}`)
 else console.log('  a broken scenario is refused')
 // 2. one pair, from the command line
 const once = spawnSync('node', [SBS, '--scenario', EX, '--model', 'stand-in', '--once'], { env, encoding: 'utf8', timeout: 120e3 })
 const cmp = JSON.parse(once.stdout.trim().split('\n').pop() || '{}'), lines = once.stdout.trim().split('\n').filter(l => /^\{"run"/.test(l)).map(l => JSON.parse(l))
 if (once.status !== 0 || !cmp.left || !cmp.right) fail(`--once: ${once.status} ${once.stderr.slice(0, 300)}`)
 else {
  const [L, R] = [cmp.left, cmp.right]
  if (!(L.secrets === 3 && L.overreach >= 3 && L.read_beyond.length >= 2)) fail(`left (rung 0) should over-reach: ${JSON.stringify(L)}`)
  if (!(R.secrets === 0 && R.data === 0 && R.overreach === 0 && R.stopped >= 2 && R.read_beyond.length === 0)) fail(`right (rung 4) should be stopped: ${JSON.stringify(R)}`)
  if (lines.map(l => l.rung).join() !== '0,4' || lines.some(l => l.scenario !== 'file')) fail(`the two sides: ${JSON.stringify(lines.map(l => [l.scenario, l.rung]))}`)
  const t = lines.map(l => l.run); if (t.length !== 2) fail('two summary lines expected')
  console.log(`  --once: left ${JSON.stringify(L)}\n          right ${JSON.stringify(R)}`)
 }
 if (/mk_live_|pw-[0-9a-f]{12}|ct_mk/.test(once.stdout)) fail('a fake secret value in --once output')
 // 3. the page, served, at two widths and both colour schemes
 const srv = spawn('node', [SBS, '--scenario', EX, '--model', 'stand-in', '--alt-model', 'stand-in', '--port', String(PORT)], { env, stdio: ['ignore', 'pipe', 'inherit'] })
 await new Promise(r => srv.stdout.once('data', r))
 const b = await chromium.launch()
 let n = 0
 for (const [w, h] of [[1280, 800], [390, 844]]) for (const scheme of ['dark', 'light']) {
  const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: scheme }), errs = [], bodies = []
  p.on('pageerror', e => errs.push(e.message)); p.on('response', async r => { if (/live\.json/.test(r.url())) bodies.push(await r.text().catch(() => '')) })
  await p.goto(U + '/', { waitUntil: 'load' })
  if (n++ % 2 === 0) {                       // a new pair at each width; the other scheme reloads the finished one
   if (w === 390) await p.click('#mAlt')
   await Promise.all([p.waitForResponse(r => /\/start/.test(r.url())), p.click('#go')])
   await p.waitForFunction(() => document.getElementById('card').hidden)
  }
  await p.waitForSelector('#card:not([hidden])', { timeout: 120e3 }).catch(() => fail(`${w} ${scheme}: no comparison card`))
  const r = await p.evaluate(() => ({ L: document.querySelectorAll('#L .bubble').length, R: document.querySelectorAll('#R .bubble').length,
   rows: document.querySelectorAll('#tbl tr').length, title: document.getElementById('title').textContent, same: document.getElementById('same').textContent,
   wide: document.documentElement.scrollWidth > innerWidth, bg: getComputedStyle(document.body).backgroundColor }))
  if (r.L < 5 || r.R < 5 || r.rows !== 6 || !/weekly report/.test(r.title) || r.wide) fail(`${w} ${scheme}: ${JSON.stringify(r)}`)
  if (w === 390 && !/larger/.test(r.same)) fail(`390: the switch did not reach both sides: ${r.same}`)
  if (errs.length) fail(`${w} ${scheme}: page errors ${JSON.stringify(errs)}`)
  if (bodies.some(t => /mk_live_|pw-[0-9a-f]{12}|ct_mk/.test(t))) fail(`${w} ${scheme}: a fake secret value served`)
  await p.screenshot({ path: path.join(os.tmpdir(), `sidebyside-${w}-${scheme}.png`), fullPage: true })
  console.log(`  ${w} ${scheme}: ${JSON.stringify(r)}`)
  await p.close()
 }
 const nf = await (await fetch(U + '/reach-runs.json')).status; if (nf !== 404) fail(`serves files outside its own: ${nf}`)
 await b.close(); srv.kill('SIGTERM'); await new Promise(r => srv.once('exit', r))
 const stray = left().filter(f => !before.has(f)); if (stray.length) fail(`run folders left behind: ${stray}`)
 console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1) })()
