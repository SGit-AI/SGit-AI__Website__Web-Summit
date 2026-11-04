#!/usr/bin/env node
// WS-74.test.mjs: lane-check.mjs and feedback-summary.mjs, offline. Run: node people/jose/dev/WS-74.test.mjs
// Addresses and numbers are made up and assembled at run time, so the gate's comms_check never sees one in this file.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { checkLane } from './lane-check.mjs'
import { summarize } from './feedback-summary.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const AT = String.fromCharCode(64)
let passed = 0
const test = (name, fn) => { fn(); passed++; console.log('ok  ' + name) }

const PEM = '-----BEGIN PUBLIC KEY-----\nAAAA\n-----END PUBLIC KEY-----'
const feedback = { lanes: [{ agent: 'vault@web-summit.jose', vault_id: 'v1', recipient: { fingerprint: 'sha256:aaaa', keys_page_id: 'vault-jose', encrypt: PEM } }] }
const keys = { keys: [{ id: 'vault-jose', bundle: { fingerprint: 'sha256:aaaa', encrypt: PEM.replace(/\n/g, '\r\n') } }] }

test('lane-check: the lane, the keys page and the live key agree', () => {
    const r = checkLane(feedback, keys, { live: 'sha256:aaaa' })
    assert.equal(r.ok, true, r.problems.join('; '))
    assert.equal(r.lane.sealed_to, 'sha256:aaaa')
})
test('lane-check: a new session key not yet on the lane is reported', () => {
    const r = checkLane(feedback, keys, { live: 'sha256:bbbb' })
    assert.equal(r.ok, false)
    assert.match(r.problems.join(), /cannot be opened here/)
})
test('lane-check: the keys page moved on but the lane did not', () => {
    const r = checkLane(feedback, { keys: [{ id: 'vault-jose', bundle: { fingerprint: 'sha256:cccc', encrypt: 'X' } }] })
    assert.equal(r.ok, false)
    assert.equal(r.problems.length, 2)
})
test('lane-check: no lane, or a lane naming a missing keys page entry', () => {
    assert.match(checkLane({ lanes: [] }, keys).problems[0], /no lane for vault@web-summit.jose/)
    assert.match(checkLane(feedback, { keys: [] }).problems[0], /not in data\/keys.json/)
})
test('lane-check on the repository as it is: the lane matches the keys page', () => {
    const out = execFileSync(process.execPath, [path.join(here, 'lane-check.mjs')], { encoding: 'utf8' })
    const r = JSON.parse(out)
    assert.equal(r.ok, true, r.problems.join('; '))
    assert.ok(!/BEGIN PUBLIC KEY/.test(out), 'a key was printed')
})

const msg = (sent_at, items, verified = '') => ({ type: 'web-summit.feedback/v1', sent_at, verified, items })
const page = p => ({ path: p, url: 'https://web-summit.sgit.ai/' + p, title: p })
const msgs = [
    msg('2026-11-04T10:00:00Z', [
        { kind: 'comment', text: `Loved it. Write to me at jane${AT}example.com`, page: page('videos/index.html'), images: [] },
        { kind: 'idea', text: 'Shorter intro', page: page('videos/reach-mandate-gap/index.html'), images: [{ data: 'x.jpg' }] },
    ]),
    msg('2026-11-04T11:00:00Z', [{ kind: 'comment', text: 'buy http://a.example now http://b.example', page: page('videos/index.html') }]),
    msg('2026-11-04T12:00:00Z', [{ kind: 'decision', choice: 'Approve', text: 'Ship it', page: page('videos/index.html') }], 'signed by dinis (verified, key sha256:x)'),
    msg('2026-11-03T09:00:00Z', [{ kind: 'comment', text: 'old', page: page('videos/index.html') }]),
    null, { not: 'a submission' },
]

test('summary: counts per page, contact details out, spam and images flagged, signed marked', () => {
    const md = summarize(msgs, { since: '2026-11-04' })
    assert.match(md, /^# Public feedback since 2026-11-04: 4 items in 3 submissions/)
    assert.match(md, /1 signed by a team member's key/)
    assert.match(md, /## videos\/index.html\n\n3 items: 2 comment, 1 decision\./)
    assert.match(md, /Loved it\. Write to me at \[email removed\] \*\[contact details or links removed\]\*/)
    assert.match(md, /possible spam: several links/)
    assert.match(md, /decision \(Approve\): Ship it \*\[signed\]\*/)
    assert.match(md, /1 image\(s\) in the vault, not shown/)
    assert.ok(!md.includes('example.com') && !md.includes('http') && !md.includes('old'))
    assert.match(md, /not to publish as is/)
})

test('summary CLI: reads the drain\'s folders, nested by date', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ws74-'))
    fs.mkdirSync(path.join(dir, '2026-11-04'))
    msgs.slice(0, 3).forEach((m, i) => fs.writeFileSync(path.join(dir, '2026-11-04', `f${i}.json`), JSON.stringify(m)))
    fs.writeFileSync(path.join(dir, '2026-11-04', 'f0.md'), '# not read')
    const out = execFileSync(process.execPath, [path.join(here, 'feedback-summary.mjs'), dir], { encoding: 'utf8' })
    assert.match(out, /4 items in 3 submissions/)
    fs.rmSync(dir, { recursive: true })
})

console.log(`${passed} passed`)
