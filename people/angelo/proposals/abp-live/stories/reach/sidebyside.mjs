#!/usr/bin/env node
// Two agents side by side: the same model, job, fake company and tool, started at the same moment; the only difference is
// the ABP (dev.abp@PrompTugal.angelo, 9 November 2026; backlog 0-INDI, Indi's ask 163fe218, Angelo's "Yes to all three",
// b0628dff; spec: people/angelo/proposals/abp-live/spec-sidebyside.md).
//   node sidebyside.mjs --scenario <scenario.json | followup | install> --model <alias> [--alt-model <alias>]
//                       [--right <1-4>] [--port 8772] [--once]
// Left: rung 0 (nothing in the way). Right: the ABP's rung (--right, else the file's abp.rung, else 4), its mandate (the
// file's abp.mandate) added to the rule from rung 1. Both are trial.mjs runs, unchanged: a separate Claude Code process each,
// one tool (the practice shell, locked by guard.mjs), fake keys made fresh for each side.
// A scenario file is the stand-demo shape (people/indi/demo/example-scenario.json), read at run time from wherever the
// demo agent wrote it (never from this repository), checked first by Indi's check-scenario.mjs (refused unless OK), and
// copied only into the two run folders, which are made in the system's temporary folder and deleted when the next pair
// starts or the command stops: a visitor's scenario never enters the repository.
// Models: --model is the default for both sides (labelled "smaller"), --alt-model the switch (both sides change together,
// labelled "larger"). Aliases are settings given at run time; no model name is kept in this repository.
// Served on http://127.0.0.1:<port>/ (this machine only): sidebyside.htm, /live.json, POST /start?model=main|alt (from
// this page or a command only; another site's page is refused).
// --once: no server; runs one pair, prints both summary lines (labels only) and the comparison, and exits.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { stepsOf } from './steps.mjs'
import { SCENARIOS, fromDoc } from './scenarios.mjs'
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..')
const CHECK = path.resolve(HERE, '../../../../../indi/demo/check-scenario.mjs')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const MODEL = arg('--model', process.env.ABP_MODEL), ALT = arg('--alt-model', process.env.ABP_ALT_MODEL), PORT = +arg('--port', 8772)
const SCEN = arg('--scenario'), ONCE = process.argv.includes('--once')
const die = m => { console.error('sidebyside.mjs: ' + m); process.exit(2) }
if (!MODEL) die('give the model\'s alias with --model <alias> (or ABP_MODEL); the desk has it')
if (!SCEN) die('give --scenario <scenario.json | followup | install>')

// the scenario: a built-in story by name, or a file checked by Indi's check before anything runs
let scenario, title, doc = null
if (/\.json$/.test(SCEN)) {
    const file = path.resolve(SCEN)
    if (file.startsWith(path.resolve(HERE, '../../../../..') + path.sep) && !/example-scenario\.json$/.test(file) && !/\/fixtures\//.test(file))
        console.error('sidebyside.mjs: note: this scenario file is inside the repository; a visitor\'s scenario belongs outside it')
    try { doc = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { die(`${SCEN}: not readable JSON (${e.message})`) }
    const { check } = await import(CHECK).catch(() => die(`Indi's check (${path.relative(process.cwd(), CHECK)}) is missing: no scenario file runs unchecked`))
    const f = check(doc)
    if (f.length) die(`${SCEN} refused by check-scenario.mjs:\n  ${f.join('\n  ')}`)
    scenario = file; title = fromDoc(doc).title
} else if (['followup', 'install'].includes(SCEN)) { scenario = SCEN; title = SCENARIOS[SCEN].title }
else die(`unknown scenario ${SCEN}`)
const RIGHT = +(arg('--right') ?? doc?.abp?.rung ?? 4)
if (!(RIGHT >= 1 && RIGHT <= 4)) die('--right must be a rung from 1 to 4 (the left side is always 0)')

let pair = null                                        // { model, label, started, sides: [{ rung, dir, child, done, code }] }
const clean = () => { for (const s of pair?.sides || []) fs.rmSync(s.dir, { recursive: true, force: true }) }
function start(which = 'main') {
    if (pair && pair.sides.some(s => !s.done)) return 'a pair is already running'
    if (which === 'alt' && !ALT) return 'no --alt-model was given'
    clean()
    const model = which === 'alt' ? ALT : MODEL, label = which === 'alt' ? 'larger' : 'smaller'
    // both run folders are made first, then both processes start in the same tick: the same moment, as near as a machine can
    const sides = [0, RIGHT].map(rung => ({ rung, dir: fs.mkdtempSync(path.join(os.tmpdir(), `abp-sbs-${rung}-`)), done: false }))
    for (const s of sides) {
        s.child = spawn('node', [path.join(HERE, 'trial.mjs'), scenario, String(s.rung), s.dir],
            { env: { ...process.env, TRIAL_MODEL: model, TRIAL_LABEL: label }, stdio: ['ignore', 'pipe', 'pipe'] })
        s.out = ''; s.child.stdout.on('data', d => s.out += d); s.child.stderr.on('data', d => process.stderr.write(d))
        s.child.on('exit', code => { s.done = true; s.code = code; s.ended = Date.now(); console.log(`side ${s.rung ? 'right' : 'left'} (rung ${s.rung}) ended: ${code === 0 ? 'ok' : 'exit ' + code}`) })
    }
    pair = { model: which, label, started: new Date().toISOString(), sides }
    console.log(`pair started: ${title}, rung 0 against rung ${RIGHT}, the ${label} model on both`)
    return ''
}
const side = s => {
    let run = null
    try { if (fs.existsSync(path.join(s.dir, 'gw/config.json'))) run = stepsOf(s.dir) } catch { }
    if (run && !s.done) run.steps = run.steps.filter(x => x.k !== 'end')         // the verdict only once the agent has finished
    // tokens and time (review point 6): the time from the pair's start to this side's end, the tokens from the agent's own
    // result (trial.json; null when it gave none, shown as "not recorded")
    let tokens = null; try { tokens = JSON.parse(fs.readFileSync(path.join(s.dir, 'gw/trial.json'), 'utf8')).tokens ?? null } catch { }
    const secs = Math.round(((s.ended || Date.now()) - Date.parse(pair.started)) / 1000)
    return { rung: s.rung, state: s.done ? (s.code === 0 ? 'done' : 'failed') : 'running', run, tokens, secs }
}
function live() {
    const base = { title, right: RIGHT, alt: !!ALT }
    if (!pair) return { ...base, state: 'idle' }
    const sides = pair.sides.map(side)
    const state = sides.every(s => s.state !== 'running') ? (sides.every(s => s.state === 'done') ? 'done' : 'failed') : 'running'
    return { ...base, state, model: pair.label, started: pair.started, left: sides[0], rightSide: sides[1] }
}
// the comparison, from both runs' records: labels and counts only
const card = (r, sd) => r && { tokens: sd.tokens, secs: sd.secs, read_beyond: r.steps.filter(s => s.k === 'read').flatMap(s => s.files).filter(f => f.c !== 'need' && !f.refused).map(f => f.f).filter((f, i, a) => a.indexOf(f) === i),   // each file once, however often read
    stopped: r.refused, held: r.held, overreach: r.overreach, secrets: r.seen.secrets, data: r.seen.data, job: r.job }

if (ONCE) {
    start('main')
    await Promise.all(pair.sides.map(s => new Promise(ok => s.done ? ok() : s.child.on('exit', ok))))
    const L = live()
    for (const s of pair.sides) console.log(s.out.trim())
    console.log(JSON.stringify({ title, model: L.model, left: card(L.left.run, L.left), right: card(L.rightSide.run, L.rightSide) }))
    clean(); process.exit(L.state === 'done' ? 0 : 1)
}
const FILES = { '/': 'sidebyside.htm', '/sidebyside.htm': 'sidebyside.htm' }
// POST /start only from this server's own page (dev@PrompTugal.angelo's finding, dc2ca5c5): a browser sends Origin with a
// cross-site POST, so a page from anywhere else (or a DNS name rebound to 127.0.0.1) is refused; no Origin means a command
// on this machine (curl), which is allowed.
const ownPage = q => q.headers.origin === undefined || q.headers.origin === `http://127.0.0.1:${PORT}`
const srv = http.createServer((q, s) => {
    const u = new URL(q.url, 'http://x')
    const send = (code, type, body) => { s.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); s.end(body) }
    if (u.pathname === '/live.json') return send(200, 'application/json', JSON.stringify(live()))
    if (u.pathname === '/start' && q.method === 'POST') { if (!ownPage(q)) return send(403, 'application/json', JSON.stringify({ ok: false, error: 'only this page may start a pair' })); const e = start(u.searchParams.get('model') === 'alt' ? 'alt' : 'main'); return send(e ? 409 : 200, 'application/json', JSON.stringify({ ok: !e, error: e })) }
    const f = FILES[u.pathname]
    if (!f || q.method !== 'GET') return send(404, 'text/plain', 'not here')
    send(200, 'text/html; charset=utf-8', fs.readFileSync(path.join(ROOT, f)))
})
srv.listen(PORT, '127.0.0.1', () => console.log(`ABP side by side: http://127.0.0.1:${PORT}/  (${title}; rung 0 against rung ${RIGHT})`))
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { for (const x of pair?.sides || []) try { x.child.kill() } catch { } clean(); process.exit(0) })
