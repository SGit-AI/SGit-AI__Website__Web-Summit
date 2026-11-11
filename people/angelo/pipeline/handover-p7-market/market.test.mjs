// node --test people/angelo/pipeline/handover-p7-market/   (all against a temporary bare repository, never origin)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url)), M = path.join(dir, 'market.mjs'), C = path.join(dir, 'capacity.mjs')
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'market-test-'))
const bare = () => { const d = path.join(tmp(), 'remote.git'); execFileSync('git', ['init', '-q', '--bare', d]); return d }
const run = (script, args, env = {}) => new Promise(res => {
    const p = spawn('node', [script, ...args], { env: { ...process.env, ...env } }); let out = ''
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d); p.on('close', code => res({ code, out: out.trim() }))
})
const T0 = '2026-11-11T18:00:00Z', at = min => new Date(Date.parse(T0) + min * 60e3).toISOString()
const OFFER = (r, extra = []) => ['offer', 'p7', '--remote', r, '--offerer', 'desk.conductor@PrompTugal.angelo', '--cost', '2', '--size', 'large', '--start-within', '30', '--now', T0, ...extra]
const A = 'alpha.large.worker@PrompTugal.angelo', B = 'bravo.large.worker@PrompTugal.dinis'
const listJson = async (r, now) => JSON.parse((await run(M, ['list', '--remote', r, '--json', '--now', now])).out)

test('two claimers race: exactly one wins, the other is refused', async () => {
    const r = bare(); assert.equal((await run(M, OFFER(r))).code, 0)
    const [x, y] = await Promise.all([A, B].map(w => run(M, ['claim-offer', 'p7', '--remote', r, '--worker', w, '--account', w.split('@')[1], '--now', at(1)])))
    assert.deepEqual([x.code, y.code].sort(), [0, 1], x.out + ' | ' + y.out)
    const [o] = await listJson(r, at(2)); assert.equal(o.status, 'claimed'); assert.ok([A, B].includes(o.claimer))
})

test('a claim lapses with no first commit and is reclaimed by another', async () => {
    const r = bare(); await run(M, OFFER(r))
    assert.equal((await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', A, '--account', 'a', '--now', at(1)])).code, 0)
    assert.equal((await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', B, '--account', 'b', '--now', at(5)])).code, 1)   // still live at 4 minutes
    assert.equal((await listJson(r, at(12)))[0].status, 'lapsed')                                                              // 11 minutes, no commit
    const c = await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', B, '--account', 'b', '--now', at(12)])
    assert.equal(c.code, 0, c.out); assert.match(c.out, /took over from/)
    const [o] = await listJson(r, at(13)); assert.equal(o.claimer, B); assert.equal(o.lapses, 1)
})

test('lapse command opens the offer again; a worker commit on pool/<id> keeps the claim', async () => {
    const r = bare(); await run(M, OFFER(r)); await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', A, '--account', 'a', '--now', at(1)])
    assert.equal((await run(M, ['lapse', 'p7', '--remote', r, '--by', 'desk.conductor@PrompTugal.angelo', '--now', at(5)])).code, 1)   // not yet lapsed
    // the worker's first commit on pool/p7 (made now: the real clock is after the claim time)
    const w = tmp(); execFileSync('git', ['init', '-q', w]); fs.writeFileSync(path.join(w, 'f'), 'x')
    execFileSync('git', ['-C', w, 'add', 'f']); execFileSync('git', ['-C', w, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', `first\n\nAgent: ${A}`], { env: { ...process.env, GIT_COMMITTER_DATE: at(3) } })
    execFileSync('git', ['-C', w, 'push', '-q', r, 'HEAD:refs/heads/pool/p7'])
    assert.equal((await listJson(r, at(30)))[0].status, 'started')   // 29 minutes later, still not lapsed: the worker started
})

test('lapse command: a claim with no commit lapses on request and the offer is open again', async () => {
    const r = bare(); await run(M, OFFER(r)); await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', A, '--account', 'a', '--now', at(1)])
    const l = await run(M, ['lapse', 'p7', '--remote', r, '--by', 'desk.conductor@PrompTugal.angelo', '--now', at(20)]); assert.equal(l.code, 0, l.out)
    assert.equal((await listJson(r, at(21)))[0].status, 'open')
})

test('a stale capacity row counts as no room', async () => {
    const f = path.join(tmp(), 'capacity.json')
    await run(C, ['write', '--file', f, '--environment', 'claude', '--account', 'dinis.A', '--declared-headroom', '20', '--now', T0])
    assert.match((await run(C, ['list', '--file', f, '--now', at(60)])).out, /\tROOM\t/)
    assert.match((await run(C, ['list', '--file', f, '--now', at(121)])).out, /\tno room\t/)
})

test('an offer to an environment with no room stays open', async () => {
    const r = bare(), f = path.join(tmp(), 'capacity.json'); await run(M, OFFER(r, ['--env', 'openrouter']))
    // fresh claude row with plenty of room, but nothing for openrouter; and a limited openrouter row
    await run(C, ['write', '--file', f, '--environment', 'claude', '--account', 'dinis.A', '--declared-headroom', '50', '--now', T0])
    let c = await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', B, '--account', 'dinis.A', '--capacity', f, '--now', at(1)])
    assert.equal(c.code, 1); assert.match(c.out, /stays open/)
    await run(C, ['write', '--file', f, '--environment', 'openrouter', '--account', 'dinis.A', '--rate-limit', '{"status":"limited"}', '--now', T0])
    c = await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', B, '--account', 'dinis.A', '--capacity', f, '--now', at(1)])
    assert.equal(c.code, 1)
    assert.equal((await listJson(r, at(2)))[0].status, 'open')
    // room under the 1.5 x margin (cost 2 USD needs 3 USD): 2.5 is refused, 3 is accepted
    await run(C, ['write', '--file', f, '--environment', 'openrouter', '--account', 'dinis.A', '--declared-headroom', '2.5', '--now', T0])
    assert.equal((await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', B, '--account', 'dinis.A', '--capacity', f, '--now', at(1)])).code, 1)
    await run(C, ['write', '--file', f, '--environment', 'openrouter', '--account', 'dinis.A', '--declared-headroom', '3', '--now', T0])
    assert.equal((await run(M, ['claim-offer', 'p7', '--remote', r, '--worker', B, '--account', 'dinis.A', '--capacity', f, '--now', at(1)])).code, 0)
})

test('the market refuses origin', async () => {
    assert.equal((await run(M, ['list', '--remote', 'origin'])).code, 2)
})
