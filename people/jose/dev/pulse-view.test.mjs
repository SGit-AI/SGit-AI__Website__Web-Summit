#!/usr/bin/env node
// pulse-view.test.mjs: Jose's pulse view (WS-41 step 2), offline. Run: node people/jose/dev/pulse-view.test.mjs
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { parsePulse, pulseView } from './pulse-view.mjs'
import { build } from '../pages.mjs'

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..', '..', '..')
let passed = 0
const test = (name, fn) => { fn(); passed++; console.log('ok  ' + name) }
const file = (by, a) => `---\nperson: jose\nby: ${by}\n---\n` + a.map(([n, l, t]) => `**${n}. ${l}.** ${t}`).join('\n\n') + '\n'

test('a pulse file is read as written: the slot, who took it, each answer', () => {
    const p = parsePulse('2026-11-06-evening.md', file('conductor@web-summit.jose, from the interview', [[1, 'Where we are', 'Two days out.'], [2, 'Blocking me', 'Nothing.'], [6, "How I'm feeling", 'Good, & ready <3']]))
    assert.equal(p.date, '2026-11-06'); assert.equal(p.slot, 'evening')
    assert.equal(p.by, 'conductor@web-summit.jose, from the interview')
    assert.deepEqual(p.answers.map(a => [a.n, a.label, a.text]), [[1, 'Where we are', 'Two days out.'], [2, 'Blocking me', 'Nothing.'], [6, "How I'm feeling", 'Good, & ready <3']])
    assert.equal(parsePulse('README.md', 'x'), null)
    assert.equal(parsePulse('2026-11-06-lunch.md', 'x'), null)
})

test('the view: every day and slot since the start, empty slots say so, text escaped, no script, nothing invented', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pv-')), d = path.join(tmp, 'people', 'jose', 'pulse')
    fs.mkdirSync(d, { recursive: true })
    fs.writeFileSync(path.join(d, '2026-11-03-evening.md'), file('x', [[2, 'Blocking me', 'The network.'], [6, "How I'm feeling", 'Tired <b>but</b> good']]))
    fs.writeFileSync(path.join(d, '2026-11-05-evening.md'), file('y', [[1, 'Where we are', 'Close.']]))
    fs.writeFileSync(path.join(d, '.keep'), '')
    const v = pulseView(tmp, { today: '2026-11-06' })
    assert.equal(v.rel, 'people/jose/pulse/index.html')
    for (const day of ['Fri 6 Nov', 'Thu 5 Nov', 'Wed 4 Nov', 'Tue 3 Nov']) assert.ok(v.body.includes(`<th scope="row">${day}</th>`), day)
    assert.equal((v.body.match(/>check-in</g) || []).length, 2)
    assert.equal((v.body.match(/no check-in/g) || []).length, 10)
    assert.ok(v.body.includes('Tired &lt;b&gt;but&lt;/b&gt; good') && !v.body.includes('<b>but</b>'))
    assert.ok(!/<script/i.test(v.body))
    assert.match(v.md, /\| Tue 3 Nov \| no check-in \| no check-in \| check-in \|/)
    assert.match(v.md, /- \*\*Tue 3 Nov, evening:\*\* The network\./)
    assert.ok(v.description.includes('2 so far'))
    fs.rmSync(tmp, { recursive: true })
})

test('on the repository: pages.mjs gives one page under people/jose/, built from his real files', () => {
    const pages = build(root)
    assert.equal(pages.length, 1)
    assert.ok(pages[0].rel.startsWith('people/jose/') && pages[0].rel.endsWith('.html'))
    const real = fs.readdirSync(path.join(root, 'people', 'jose', 'pulse')).filter(f => /^\d{4}-\d{2}-\d{2}-(morning|midday|evening)\.md$/.test(f)).length
    assert.equal((pages[0].body.match(/>check-in</g) || []).length, real)
})

console.log(`${passed} passed`)
