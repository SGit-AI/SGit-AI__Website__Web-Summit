#!/usr/bin/env node
// The wake record (team/<agent>/wakes/<started>.json): the five steps, each with a verdict and a comment.
//   node admin/tools/wake.mjs step <agent> <1-5> <verdict> "<comment>"
//   node admin/tools/wake.mjs gate <agent>         exit 1 unless steps 1 and 2 both said go
//   node admin/tools/wake.mjs close <agent> <ok|partial|failed|idle|hold>
//   node admin/tools/wake.mjs check                every closed wake has all five steps (or is a hold/idle)
import fs from 'fs'
import path from 'path'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const STEPS = { 1: ['plan', ['go', 'stop']], 2: ['pre-review', ['go', 'change', 'stop']], 3: ['work', ['done', 'partial', 'none']], 4: ['post-review', ['clean', 'finding', 'stop']], 5: ['post-check', ['as-planned', 'partial', 'off-plan', 'stop']] }
const [cmd, agent, ...rest] = process.argv.slice(2)
const dir = a => path.join(ROOT, 'team', a, 'wakes')
const latest = a => { const f = fs.readdirSync(dir(a)).filter(f => f.endsWith('.json')).sort().pop(); if (!f) throw new Error(`no wake for ${a}: run start.mjs`); return path.join(dir(a), f) }
const load = f => JSON.parse(fs.readFileSync(f, 'utf8')), save = (f, r) => fs.writeFileSync(f, JSON.stringify(r, null, 2) + '\n')
if (cmd === 'step') {
    const [n, verdict, ...c] = rest, [name, ok] = STEPS[n] || []
    if (!name || !ok.includes(verdict)) { console.error(`step ${n}: verdict must be one of ${ok}`); process.exit(2) }
    const f = latest(agent), r = load(f); r.steps = r.steps.filter(s => s.n !== +n); r.steps.push({ n: +n, step: name, verdict, comment: c.join(' '), at: new Date().toISOString() }); r.steps.sort((a, b) => a.n - b.n); save(f, r)
    if (verdict === 'stop') console.log(`step ${n} said stop: write team/${agent}/HOLD.md and push it (WAKE.md, Stopping)`)
} else if (cmd === 'gate') {
    const r = load(latest(agent)), v = n => (r.steps.find(s => s.n === n) || {}).verdict
    if (v(1) === 'go' && v(2) === 'go') console.log('gate: go'); else { console.error(`gate: no (plan ${v(1) || 'missing'}, pre-review ${v(2) || 'missing'})`); process.exit(1) }
} else if (cmd === 'close') {
    const f = latest(agent), r = load(f), outcome = rest[0]
    if (!['hold', 'idle'].includes(outcome) && [1, 2, 3, 4, 5].some(n => !r.steps.find(s => s.n === n))) { console.error('close: a step is missing; record all five'); process.exit(1) }
    r.outcome = outcome; r.closed = new Date().toISOString(); save(f, r); console.log(`closed ${path.relative(ROOT, f)}: ${outcome}`)
} else if (cmd === 'check') {
    let bad = 0
    for (const a of fs.readdirSync(path.join(ROOT, 'team'))) if (fs.existsSync(dir(a))) for (const f of fs.readdirSync(dir(a)).filter(f => f.endsWith('.json'))) {
        const r = load(path.join(dir(a), f))
        if (r.closed && !['hold', 'idle'].includes(r.outcome) && r.steps.length < 5) { console.error(`team/${a}/wakes/${f}: closed with ${r.steps.length} of 5 steps`); bad++ }
    }
    if (bad) process.exit(1); console.log('wakes: OK')
} else { console.error('usage: wake.mjs step|gate|close|check ...'); process.exit(2) }
