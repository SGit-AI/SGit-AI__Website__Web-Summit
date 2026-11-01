#!/usr/bin/env node
// Start every session: fetch dev and fast-forward to it, stop on a hold, open a wake record, print the start banner.
//   node admin/tools/start.mjs <agent> --kind "scheduled, every 2 hours" --objective "..." [--plan "a|b"]
// Exit 3 on a hold (team/*/HOLD.md exists): do no work. Exit 4 if dev cannot be fast-forwarded.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { banner, args } from './banner.mjs'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const git = (...a) => execFileSync('git', a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
const o = args(process.argv.slice(2)), agent = o._[0]
if (!agent) { console.error('usage: start.mjs <agent> --kind K --objective O'); process.exit(2) }
if (!fs.existsSync(path.join(ROOT, 'team', agent, 'ROLE.md'))) { console.error(`no team/${agent}/ROLE.md: ask the operator which role you are; do not pick one`); process.exit(2) }
try { git('fetch', 'origin', 'dev'); if (git('rev-parse', '--abbrev-ref', 'HEAD') === 'dev') git('merge', '--ff-only', 'origin/dev') }
catch (e) { console.error(`could not sync with origin/dev: ${e.stderr || e.message}\nResolving that is the wake.`); process.exit(4) }
const holds = fs.readdirSync(path.join(ROOT, 'team')).filter(d => fs.existsSync(path.join(ROOT, 'team', d, 'HOLD.md')))
if (holds.length) {
    const first = fs.readFileSync(path.join(ROOT, 'team', holds[0], 'HOLD.md'), 'utf8').split('\n')[0]
    console.log(banner('hold', agent, { reason: `${first} (team/${holds[0]}/HOLD.md)` })); process.exit(3)
}
const at = new Date().toISOString().replace(/\.\d+Z$/, 'Z'), commit = git('rev-parse', '--short', 'HEAD')
const dir = path.join(ROOT, 'team', agent, 'wakes'); fs.mkdirSync(dir, { recursive: true })
const rec = { agent, started: at, kind: o.kind || 'unstated', objective: o.objective || 'unstated', commit, plan: [], steps: [], outcome: null, closed: null }
fs.writeFileSync(path.join(dir, `${at.replace(/:/g, '')}.json`), JSON.stringify(rec, null, 2) + '\n')
console.log(banner('start', agent, { ...o, at, commit }))
console.log(`wake record: team/${agent}/wakes/${at.replace(/:/g, '')}.json`)
