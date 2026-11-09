#!/usr/bin/env node
// The live command for the stand laptop (dev.abp@PrompTugal.angelo, 9 November 2026; backlog 00d1, Angelo's decision 3 of
// 8 November, f8000851: "Live, clean environment": his account, a fresh environment with no secrets, the trial agent
// locked to the practice tool by guard.mjs, not hooks; the recorded loop as the fallback).
//   node people/angelo/proposals/abp-live/stories/reach/live.mjs --model <the smaller model's alias> [--port 8770]
// (the alias is a setting given at run time, from the desk; no model name is kept in this repository)
// Serves the step view on http://127.0.0.1:<port>/ (this machine only) and, when someone presses "Run it live now",
// starts one real run of the chosen story at the chosen rung (trial.mjs: a separate Claude Code process with one tool,
// the practice shell). The page polls /live.json and shows each step as the gateway records it. One run at a time.
// The run folder is made in the system's temporary folder and deleted when the next run starts or the command stops: it
// holds that run's fake keys. Nothing is sent anywhere but to Claude (the agent itself); the world is plain files.
// The model is the smaller one (decision 4), labelled "smaller" on screen; --model names it for the claude command.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { stepsOf } from './steps.mjs'
import { SCENARIOS } from './scenarios.mjs'
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '../..')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const PORT = +arg('--port', 8770), MODEL = arg('--model', process.env.ABP_MODEL)
if (!MODEL) { console.error('live.mjs: give the smaller model\'s alias with --model <alias> (or ABP_MODEL); the desk has it'); process.exit(2) }
// only these files are served, from the abp-live folder
const FILES = { '/': 'steps.htm', '/steps.htm': 'steps.htm', '/reach-runs.js': 'reach-runs.js', '/reach-runs.json': 'reach-runs.json' }
const TYPES = { '.htm': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json' }
let cur = null                                         // { story, rung, dir, child, started, done, code }
const clean = () => { if (cur?.dir) fs.rmSync(cur.dir, { recursive: true, force: true }) }
function start(story, rung) {
    if (cur && !cur.done) return 'a run is already going'
    if (!SCENARIOS[story] || !['followup', 'install'].includes(story) || !(rung >= 0 && rung <= 4)) return 'unknown story or rung'
    clean()
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'abp-live-'))
    const child = spawn('node', [path.join(HERE, 'trial.mjs'), story, String(rung), dir],
        { env: { ...process.env, TRIAL_MODEL: MODEL, TRIAL_LABEL: 'smaller' }, stdio: ['ignore', 'ignore', 'pipe'] })
    cur = { story, rung, dir, child, started: new Date().toISOString(), done: false }
    child.stderr.on('data', d => process.stderr.write(d))
    child.on('exit', code => { cur.done = true; cur.code = code; console.log(`run ended (${story}, rung ${rung}): ${code === 0 ? 'ok' : 'exit ' + code}`) })
    console.log(`run started: ${story}, rung ${rung}`)
    return ''
}
function live() {
    if (!cur) return { state: 'idle' }
    let run = null
    try { if (fs.existsSync(path.join(cur.dir, 'gw/config.json'))) run = stepsOf(cur.dir) } catch { }
    if (run && !cur.done) run.steps = run.steps.filter(s => s.k !== 'end')       // the verdict only once the agent has finished
    return { state: cur.done ? (cur.code === 0 ? 'done' : 'failed') : 'running', story: cur.story, rung: cur.rung, started: cur.started, run: run && { ...run, id: 'live' } }
}
const srv = http.createServer((q, s) => {
    const u = new URL(q.url, 'http://x')
    const send = (code, type, body) => { s.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); s.end(body) }
    if (u.pathname === '/live.json') return send(200, TYPES['.json'], JSON.stringify(live()))
    if (u.pathname === '/start' && q.method === 'POST') { const e = start(u.searchParams.get('story'), +u.searchParams.get('rung')); return send(e ? 409 : 200, TYPES['.json'], JSON.stringify({ ok: !e, error: e })) }
    const f = FILES[u.pathname]
    if (!f || q.method !== 'GET') return send(404, 'text/plain', 'not here')
    send(200, TYPES[path.extname(f)], fs.readFileSync(path.join(ROOT, f)))
})
srv.listen(PORT, '127.0.0.1', () => console.log(`ABP step view, live: http://127.0.0.1:${PORT}/?live=1  (the recorded loop: http://127.0.0.1:${PORT}/?loop=1)`))
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { try { cur?.child?.kill() } catch { } clean(); process.exit(0) })
