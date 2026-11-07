#!/usr/bin/env node
// policy@web-summit.angelo's lane audit: every commit by one of Angelo's agents in a range, and the files it wrote
// outside the paths people/angelo/policy/lanes.json allows it, and whether it names another owner in a For: line. Read-only: it prints, nothing more.
//   node people/angelo/policy/audit.mjs [<since: a sha or an ISO time>] [<until ref, default origin/dev>]
// The agent is the commit's "Agent:" trailer, else its subject's "<agent>:" prefix. CI's releases ("site vX.Y.Z")
// are skipped. This is also the prototype of proposals/gate-lane-check.md.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const lanes0 = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/angelo/policy/lanes.json'), 'utf8'))
const lanes = { ...lanes0, agents: {} }
for (const [k, v] of Object.entries(lanes0.agents)) for (const n of [k, ...(v.aliases || [])]) lanes.agents[n.toLowerCase()] = { ...v, self: k }
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 << 20 })
const [since = '2026-11-04T17:41Z', until = 'origin/dev'] = process.argv.slice(2)
const range = /^[0-9a-f]{7,40}$/.test(since) ? [`${since}..${until}`] : [`--since=${since}`, until]
const toRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\0').replace(/\*/g, '[^/]*').replace(/\0/g, '.*') + '$')
let n = 0
for (const sha of git('log', '--reverse', '--no-merges', '--format=%H', ...range).split('\n').filter(Boolean)) {
  const [head, subject, ...body] = git('show', '-s', '--format=%h %cI%n%s%n%b', sha).split('\n')
  if (/^site v\d/.test(subject)) continue
  const agent = (body.join('\n').match(/^Agent:\s*([a-z0-9.-]+@(?:web-summit|promptugal)\.angelo)\b/mi) || subject.match(/^([a-z0-9.-]+@(?:web-summit|promptugal)\.angelo):/i) || [])[1]
  if (!agent) continue
  n++
  const lane = lanes.agents[agent.toLowerCase()]
  if (!lane) { console.log(`${head} ${agent} | NO LANE in lanes.json`); continue }
  const files = git('diff-tree', '--no-commit-id', '--name-only', '-r', sha).split('\n').filter(Boolean)
  const self = lane.self.split('@')[0]
  const ok = [...lanes.common, ...lane.writes].map(toRe), t3 = (lane.tier3_paths || []).map(toRe)
  const out = files.filter(f => !ok.some(r => r.test(f))).map(f => t3.some(r => r.test(f)) ? `${f} (tier 3: needs Angelo's quoted words)` : f)
  const fors = body.filter(l => /^For:/i.test(l)).map(l => l.slice(4).trim()).filter(f => !/angelo$/i.test(f))
  if (out.length) console.log(`${head} ${self} | ${subject.slice(agent.length + 2, agent.length + 70)}\n    outside: ${out.join(', ')}\n    For (others): ${fors.join(', ') || 'NONE'}`)
}
console.log(`${n} commits by Angelo's agents in the range.`)
