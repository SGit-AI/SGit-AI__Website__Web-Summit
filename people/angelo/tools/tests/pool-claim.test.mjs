#!/usr/bin/env node
// pool-claim.mjs (spec-worker-pool.md section 2): against a throwaway bare repository, never the real origin.
// Two clones race for the same item, many times at once: exactly one wins each race. Then: a live claim refuses another
// worker; renew and release by the holder only (the desk may release); a claim two hours old is taken over and says so.
//   node people/angelo/tools/tests/pool-claim.test.mjs
import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const TOOL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'pool-claim.mjs')
const T = fs.mkdtempSync(path.join(os.tmpdir(), 'pool-test-')), sh = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: 'pipe' })
let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }, pass = m => console.log('  ok', m)
sh(T, 'init', '-q', '--bare', 'remote.git')
for (const c of ['a', 'b']) { sh(T, 'clone', '-q', 'remote.git', c); sh(path.join(T, c), 'config', 'user.name', 't'); sh(path.join(T, c), 'config', 'user.email', 't@t') }
const run = (c, args, env = {}) => new Promise(res => {
    const p = spawn('node', [TOOL, ...args], { cwd: path.join(T, c), env: { ...process.env, ...env } }); let out = ''
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d); p.on('close', code => res({ code, out: out.trim() }))
})
const W1 = 'worker.1@PrompTugal.angelo', W2 = 'worker.2@PrompTugal.angelo'
// 1. races: both clones claim the same fresh item at the same moment, ten times
let races = 0
for (let i = 0; i < 10; i++) {
    const [x, y] = await Promise.all([run('a', ['claim', `race${i}`, '--worker', W1]), run('b', ['claim', `race${i}`, '--worker', W2])])
    const wins = [x, y].filter(r => r.code === 0).length, refused = [x, y].filter(r => r.code === 1).length
    if (wins === 1 && refused === 1) races++; else fail(`race${i}: ${x.code}/${y.code}: ${x.out} | ${y.out}`)
}
if (races === 10) pass('10 races, one winner each')
const list = JSON.parse((await run('a', ['list', '--json'])).out)
if (Object.keys(list).length === 10 && Object.values(list).every(c => c.live)) pass('list shows 10 live claims'); else fail('list: ' + JSON.stringify(list))
// 2. holder rules
const h = list.race0.worker, other = h === W1 ? W2 : W1
if ((await run('a', ['renew', 'race0', '--worker', other])).code === 1) pass('renew by another is refused'); else fail('renew by another')
if ((await run('a', ['renew', 'race0', '--worker', h])).code === 0) pass('renew by the holder'); else fail('renew by the holder')
if ((await run('b', ['release', 'race0', '--worker', other])).code === 1) pass('release by another is refused'); else fail('release by another')
if ((await run('b', ['release', 'race1', '--by', 'desk.conductor@PrompTugal.angelo'])).code === 0) pass('the desk may release'); else fail('desk release')
if ((await run('b', ['release', 'race0', '--worker', h])).code === 0 && !JSON.parse((await run('a', ['list', '--json'])).out).race0) pass('release by the holder'); else fail('release by the holder')
// 3. stale: three hours later, another worker takes over, and is told to say so
const later = new Date(Date.now() + 3 * 3600e3).toISOString(), h2 = list.race2.worker, o2 = h2 === W1 ? W2 : W1
const tk = await run('a', ['claim', 'race2', '--worker', o2], { POOL_NOW: later })
if (tk.code === 0 && /took over from/.test(tk.out)) pass('a stale claim is taken over, and says so'); else fail('stale takeover: ' + tk.out)
const c2 = JSON.parse((await run('a', ['list', '--json'], { POOL_NOW: later })).out).race2
if (c2.worker === o2 && c2.took_over_from === h2) pass('the record names who it was taken from'); else fail('record: ' + JSON.stringify(c2))
// 4. never force: the remote's history only grows
const n = Number(sh(path.join(T, 'remote.git'), 'rev-list', '--count', 'pool/claims'))
if (n === 14) pass(`pool/claims has ${n} commits, one per change`); else fail(`${n} commits, expected 14 (10 claims, a renew, two releases, a takeover)`)
// 5. bad input
if ((await run('a', ['claim', 'claims', '--worker', W1])).code === 2 && (await run('a', ['claim', 'x', '--worker', 'nobody'])).code === 2) pass('bad item or worker refused'); else fail('bad input accepted')
// 6. the working tree is never touched
if (sh(path.join(T, 'a'), 'status', '--porcelain') === '') pass('clone a: working tree untouched'); else fail('working tree changed')
fs.rmSync(T, { recursive: true, force: true })
console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1)
