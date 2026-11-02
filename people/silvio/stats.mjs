#!/usr/bin/env node
// Silvio's monitor: reads the board (board/WS-*.md), git history and people/silvio/, and rewrites the
// "## The numbers" section of people/silvio/dashboard.md. Kept by Silvio's agents; touches nothing outside people/silvio/.
//   node people/silvio/stats.mjs            print the numbers
//   node people/silvio/stats.mjs --write    refresh the dashboard section, then commit it with the convention
// Optional: TODAY=2026-11-04 to see the board as of another day.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const ME = 'silvio'
const SUMMIT = new Date('2026-11-10T09:00:00Z') // Web Summit, Lisbon, 10 to 12 November (WS-31)
const TODAY = process.env.TODAY ? new Date(process.env.TODAY + 'T12:00:00Z') : new Date()

// Silvio's workstreams, from the brief (brief-silvio.md) and the team map; an issue not listed here is "Other"
const STREAMS = {
    'Outreach': ['WS-24', 'WS-25', 'WS-26', 'WS-28'],
    'Video': ['WS-40', 'WS-52', 'WS-71', 'WS-72', 'WS-75', 'WS-80'],
    'Local and procurement': ['WS-48', 'WS-54', 'WS-101'],
    'Merch sponsor': ['WS-58'],
    'Agentic PM': ['WS-53'],
}
const streamOf = id => Object.keys(STREAMS).find(s => STREAMS[s].includes(id)) || 'Other'

// Silvio's agents (data/team.json) and the workstream each one carries
const AGENT_STREAM = {
    conductor: 'all of them', dev: 'the site and tools', procurement: 'Local and procurement',
    local: 'Local and procurement', outreach: 'Outreach', sponsor: 'Merch sponsor', video: 'Video',
}

const git = (...a) => { try { return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }) } catch { return '' } }
const frontMatter = t => { const m = t.match(/^---\n([\s\S]*?)\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim() } return o }
const dueDate = s => { const m = (s || '').match(/(\d{1,2}) Nov/); return m ? new Date(Date.UTC(2026, 10, +m[1], 23, 59)) : null }
const day = d => d.toISOString().slice(0, 10)

// 1. the issues for Silvio
const issues = fs.readdirSync(path.join(ROOT, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).map(f => {
    const fm = frontMatter(fs.readFileSync(path.join(ROOT, 'board', f), 'utf8'))
    return { ...fm, file: f, due_at: dueDate(fm.due), stream: streamOf(fm.id) }
}).filter(i => (i.for || '').split(/,\s*/).includes(ME))
    .sort((a, b) => (a.due_at || 0) - (b.due_at || 0) || a.id.localeCompare(b.id, 'en', { numeric: true }))

const done = i => /^(done|closed)/.test(i.status)
const open = issues.filter(i => !done(i))
const overdue = open.filter(i => i.due_at && i.due_at < TODAY)
const next48 = open.filter(i => i.due_at && i.due_at >= TODAY && i.due_at - TODAY < 48 * 3600e3)
const unowned = open.filter(i => !i.picked_by)

// 2. the agents: active means at least one commit signed with its Agent: trailer
const log = git('log', '--since=7 days ago', '--format=%x1e%cI%x1f%B')
const commits = log.split('\x1e').filter(Boolean).map(c => { const [at, body] = c.split('\x1f'); return { at: new Date(at), agent: (body.match(/^Agent: (\S+)/m) || [])[1], fors: [...body.matchAll(/^For: (.+)$/gm)].map(m => m[1]) } })
const agents = Object.keys(AGENT_STREAM).map(a => {
    const name = `${a}@web-summit.${ME}`, mine = commits.filter(c => c.agent === name)
    return { name, stream: AGENT_STREAM[a], n7: mine.length, n24: mine.filter(c => TODAY - c.at < 864e5).length, last: mine[0]?.at }
})
const inbox = commits.filter(c => TODAY - c.at < 864e5 && c.fors.some(f => f.includes(`web-summit.${ME}`) || f.trim() === ME))

// 3. pulse and onboarding
const pulseDir = path.join(ROOT, 'people', ME, 'pulse')
const pulses = fs.existsSync(pulseDir) ? fs.readdirSync(pulseDir).filter(f => f.endsWith('.md')) : []
const pulseToday = pulses.filter(f => f.startsWith(day(TODAY))).length
const onboarding = JSON.parse(fs.readFileSync(path.join(ROOT, 'people', ME, 'onboarding.json'), 'utf8'))

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
    `| Days to Lisbon | **${days}** | ${bar(Math.max(0, 8 - days), 8)} |`,
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
    '| Agent | Carries | Commits 24 h | Commits 7 days | Last seen |',
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
