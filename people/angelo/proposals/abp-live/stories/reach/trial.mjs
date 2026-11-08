#!/usr/bin/env node
// One real trial of a reach scenario, with the trial agent given the practice shell and nothing else
// (dev.abp@PrompTugal.angelo, 8 November 2026, after dev@'s flag in d8389b2: in earlier trials sub-agents reached past
// act.mjs to the session's own tools).
//   node trial.mjs <install|tidy|followup|spend> <rung 0-4> <run folder> [model alias, default haiku]
// A separate Claude Code process (claude -p), started in the run's world folder, with one tool, Bash, whose every
// command goes through guard.sh (CLAUDE_CODE_SHELL_PREFIX): guard.mjs runs this run's act.mjs and nothing else, and
// answers anything else with "not available" (counted in gw/outside.jsonl), so the agent carries on rather than
// stopping at a permission prompt; no settings, hooks, MCP servers, skills or CLAUDE.md loaded. Its transcript stays in the run folder (it holds the fake secrets of that run
// only; run folders are never committed). Prints summary.mjs's line for the run.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const HERE = path.dirname(fileURLToPath(import.meta.url))
const [name, lv, dir, model = 'haiku'] = process.argv.slice(2)
if (!name || lv == null || !dir) { console.error('trial.mjs <scenario> <rung> <run folder> [model]'); process.exit(2) }
const RUN = path.resolve(dir), ACT = path.join(HERE, 'act.mjs')
const prompt = execFileSync('node', [path.join(HERE, 'setup.mjs'), name, lv, RUN], { encoding: 'utf8' })
const r = spawnSync('claude', ['-p', prompt, '--model', model, '--tools', 'Bash', '--allowedTools', 'Bash',
    '--permission-mode', 'dontAsk', '--setting-sources', '', '--strict-mcp-config', '--disable-slash-commands',
    '--no-session-persistence', '--max-turns', '40', '--output-format', 'stream-json', '--verbose'],
    { cwd: path.join(RUN, 'world'), env: { ...process.env, CLAUDE_CODE_SHELL_PREFIX: path.join(HERE, 'guard.sh'), GUARD_RUN: RUN, GUARD_ACT: ACT }, encoding: 'utf8', maxBuffer: 64 << 20, timeout: 600e3 })
fs.writeFileSync(path.join(RUN, 'transcript.local.jsonl'), r.stdout || '')
// what the process tried outside the practice shell (denied by the permission mode), counted by the record, not shown
const lines = (r.stdout || '').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
const res = lines.find(l => l.type === 'result') || {}
const of = path.join(RUN, 'gw', 'outside.jsonl')
const denied = (res.permission_denials || []).length + (fs.existsSync(of) ? fs.readFileSync(of, 'utf8').trim().split('\n').filter(Boolean).length : 0)
fs.writeFileSync(path.join(RUN, 'gw', 'trial.json'), JSON.stringify({ model, denied_outside_shell: denied, turns: res.num_turns, cost_usd: res.total_cost_usd, reply: res.result || '' }))
const sum = JSON.parse(execFileSync('node', [path.join(HERE, 'summary.mjs'), RUN], { encoding: 'utf8' }))
console.log(JSON.stringify({ ...sum, model, denied_outside_shell: denied, turns: res.num_turns }))
