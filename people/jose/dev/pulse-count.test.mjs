#!/usr/bin/env node
// pulse-count.test.mjs: the WS-41 measure, offline. Run: node people/jose/dev/pulse-count.test.mjs
import assert from 'node:assert/strict'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { count, table } from './pulse-count.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
let passed = 0
const test = (name, fn) => { fn(); passed++; console.log('ok  ' + name) }
const files = [
    { person: 'jose', name: '2026-11-03-evening.md' }, { person: 'vicky', name: '2026-11-03-morning.md' },
    { person: 'jose', name: '2026-11-05-morning.md' }, { person: 'angelo', name: '2026-11-05-morning.md' },
    { person: 'jose', name: 'README.md' }, { person: 'jose', name: '2026-11-05-lunch.md' },
]

test('counts per day and slot, ignoring other names', () => {
    const r = count(files)
    assert.equal(r.total, 4)
    assert.deepEqual(r.days['2026-11-05'].morning.sort(), ['angelo', 'jose'])
    assert.deepEqual(r.by_person, { jose: 2, vicky: 1, angelo: 1 })
    assert.deepEqual(Object.keys(r.days), ['2026-11-03', '2026-11-05'])
})
test('one person, for the reminder test on Jose\'s conductor', () => {
    const r = count(files, { person: 'jose' })
    assert.equal(r.total, 2)
    assert.match(table(r), /\| 2026-11-03 \| 0 \| 0 \| 1 \(jose\) \|/)
})
test('on the repository: runs and prints names of people only, never what they wrote', () => {
    const out = execFileSync(process.execPath, [path.join(here, 'pulse-count.mjs')], { encoding: 'utf8' })
    assert.match(out, /^\| Day \| Morning \| Midday \| Evening \|/)
    assert.match(out, /Total: \d+ check-in/)
})
console.log(`${passed} passed`)
