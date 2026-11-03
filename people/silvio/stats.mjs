#!/usr/bin/env node
// Silvio's monitor: reads the board (board/WS-*.md), git history and people/silvio/, and rewrites the
// "## The numbers" section of people/silvio/dashboard.md. Kept by Silvio's agents; touches nothing outside people/silvio/.
//   node people/silvio/stats.mjs            print the numbers
//   node people/silvio/stats.mjs --write    refresh the dashboard section, then commit it with the convention
// Optional: TODAY=2026-11-04 to see the board as of another day.
import fs from 'fs'
import path from 'path'
import { build } from './app/data.mjs'

// one data layer for the dashboard's numbers and the command centre (people/silvio/app/data.mjs):
// the board, the agents (same rule as the site's inventory) and git history
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const ME = 'silvio'
const TODAY = process.env.TODAY ? new Date(process.env.TODAY + 'T12:00:00Z') : new Date()
const D = build(ROOT, ME, TODAY)
const SUMMIT = new Date(D.summit.opening)
const STREAMS = Object.fromEntries(D.workstreams.map(w => [w.name, w.issues]))
const day = d => d.toISOString().slice(0, 10)

const issues = D.issues.filter(i => i.named).map(i => ({ ...i, due_at: i.due_at ? new Date(i.due_at) : null, stream: (D.workstreams.find(w => w.id === i.stream) || {}).name || 'Other' }))
const done = i => /^(done|closed)/.test(i.status)
const open = issues.filter(i => !done(i))
const overdue = open.filter(i => i.due_at && !i.recurring && i.due_at < TODAY)
const next48 = open.filter(i => i.due_at && i.due_at >= TODAY && i.due_at - TODAY < 48 * 3600e3)
const unowned = open.filter(i => !i.picked_by)
const agents = D.agents.map(a => ({ name: a.name, stream: a.job, n7: a.commits_7d, n24: a.commits_24h, last: a.last_at ? new Date(a.last_at) : null }))
const inbox = D.messages.filter(m => TODAY - new Date(m.at) < 864e5)
const pulseDir = path.join(ROOT, 'people', ME, 'pulse')
const pulses = fs.existsSync(pulseDir) ? fs.readdirSync(pulseDir).filter(f => f.endsWith('.md')) : []
const pulseToday = pulses.filter(f => f.startsWith(day(TODAY))).length
const onboarding = D.onboarding

// 4. the health score: a rough 0 to 100 for the morning glance
const days = Math.max(0, Math.ceil((SUMMIT - TODAY) / 864e5))
const activeAgents = agents.filter(a => a.n7 > 0).length
const health = Math.max(0, Math.round(100 - overdue.length * 15 - next48.filter(i => !i.picked_by).length * 5 - (3 - Math.min(3, pulseToday)) * 3 - (agents.length - activeAgents) * 2))
const light = health >= 75 ? 'green' : health >= 50 ? 'amber' : 'red'
const bar = (n, of, w = 10) => '█'.repeat(Math.round(n / Math.max(1, of) * w)) + '░'.repeat(w - Math.round(n / Math.max(1, of) * w))
const when = d => d ? d.toISOString().slice(5, 16).replace('T', ' ') + ' UTC' : 'never'

const md = [
    '## The numbers {#numbers}',
    '',
    `Refreshed by \`node people/silvio/stats.mjs --write\` on ${day(TODAY)}, from the board and git history. Do not edit this section by hand: change the board or the script.`,
    '',
    '| Signal | Now | |',
    '|---|---|---|',
    `| Days to opening night | **${days}** | ${bar(Math.max(0, 8 - days), 8)} |`,
    `| Health | **${health} / 100 (${light})** | ${bar(health, 100)} |`,
    `| Open issues | **${open.length}** of ${issues.length} | ${bar(issues.length - open.length, issues.length)} done |`,
    `| Overdue | **${overdue.length}** | ${overdue.map(i => i.id).join(', ') || 'none'} |`,
    `| Due in 48 hours | **${next48.length}** | ${next48.map(i => i.id).join(', ') || 'none'} |`,
    `| Nobody picked yet | **${unowned.length}** | ${unowned.map(i => i.id).join(', ') || 'none'} |`,
    `| Agents active (7 days) | **${activeAgents} of ${agents.length}** | ${bar(activeAgents, agents.length)} |`,
    `| Messages for me (24 h) | **${inbox.length}** | \`git log --since=yesterday --grep "For: .*web-summit.silvio"\` |`,
    `| Pulse today | **${pulseToday} of 3** | ${bar(pulseToday, 3, 3)} |`,
    `| Onboarding level | **L${onboarding.level}** of L4 | ${bar(onboarding.level, 4, 4)} |`,
    '',
    '### By workstream {#by-stream}',
    '',
    '| Workstream | Open | Next due | Picked |',
    '|---|---|---|---|',
    ...Object.keys(STREAMS).map(s => { const o = open.filter(i => i.stream === s); return `| ${s} | ${o.length} ${bar(o.length, 6, 6)} | ${o[0] ? `${o[0].id} (${o[0].due})` : 'none'} | ${o.filter(i => i.picked_by).length} of ${o.length} |` }),
    '',
    '### By day {#by-day}',
    '',
    '| Due | Issues |',
    '|---|---|',
    ...[...new Set(open.map(i => i.due_at ? day(i.due_at) : 'no date'))].map(d => `| ${d}${d !== 'no date' && new Date(d + 'T23:59:00Z') < TODAY ? ' (late)' : ''} | ${open.filter(i => (i.due_at ? day(i.due_at) : 'no date') === d).map(i => `${i.id} ${i.title}`).join('; ')} |`),
    '',
    '### Agents {#agent-activity}',
    '',
    '| Agent | Job | Commits 24 h | Commits 7 days | Last seen |',
    '|---|---|---|---|---|',
    ...agents.map(a => `| ${a.n7 ? '●' : '○'} ${a.name} | ${a.stream} | ${a.n24} | ${a.n7} | ${when(a.last)} |`),
    '',
].join('\n')

if (process.argv.includes('--write')) {
    const f = path.join(ROOT, 'people', ME, 'dashboard.md'), t = fs.readFileSync(f, 'utf8')
    const start = t.indexOf('## The numbers {#numbers}')
    if (start < 0) throw new Error('dashboard.md has no "## The numbers {#numbers}" section')
    const after = t.slice(start + 1).search(/\n## /)
    fs.writeFileSync(f, t.slice(0, start) + md + (after < 0 ? '' : t.slice(start + 1 + after)))
    console.log(`people/silvio/dashboard.md: the numbers refreshed (health ${health}, ${open.length} open, ${overdue.length} overdue)`)
} else console.log(md)
