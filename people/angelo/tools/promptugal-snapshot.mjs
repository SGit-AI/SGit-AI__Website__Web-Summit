#!/usr/bin/env node
// A snapshot of the PrompTugal newsroom's agents, for Angelo's command centre (dev@web-summit.angelo, 6 November 2026,
// at Angelo's word: "Set up the snapshot for now"). The newsroom's agents work in their own public repository,
// PrompTugal/PrompTugal__News__Website, which this site's build cannot see; this reads a local clone of it (read-only)
// and writes, into Angelo's folder, who committed there, how often and when, and who wrote to whom in the last 7 days.
// Public information only: names, counts and times from the git log; no commit text.
//   node people/angelo/tools/promptugal-snapshot.mjs <path to the clone> [--fetch]
// --fetch first brings the clone up to date (a bounded fetch of its dev branch). The output is
// people/angelo/app/promptugal.json. A PrompTugal name, <agent>@PrompTugal.<person>, is written as pt:<person>:<agent>,
// the form Angelo's command centre uses: the gate's contact check would read the name as an email address.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
const clone = process.argv[2]
if (!clone || !fs.existsSync(path.join(clone, '.git'))) { console.error('promptugal-snapshot: give the path to a clone of PrompTugal/PrompTugal__News__Website'); process.exit(2) }
const git = args => execFileSync('git', ['-C', clone, ...args], { encoding: 'utf8', maxBuffer: 64 << 20 })
const origin = git(['remote', 'get-url', 'origin']).trim()
if (!/github\.com\/PrompTugal\/PrompTugal__News__Website/i.test(origin)) { console.error(`promptugal-snapshot: ${clone} is not a clone of PrompTugal/PrompTugal__News__Website (${origin})`); process.exit(2) }
if (process.argv.includes('--fetch')) { git(['fetch', '-q', '--depth=3000', 'origin', 'dev']); git(['checkout', '-q', '--detach', 'FETCH_HEAD']) }

const roster = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members.filter(m => m.kind === 'human').map(m => m.id))
const NAME = /^([a-z0-9][a-z0-9.-]*)@([A-Za-z][A-Za-z0-9-]*)\.([a-z0-9-]+)$/   // agent names may carry a dot (dev.pages@PrompTugal.dinis)
const idOf = n => { const m = String(n).match(NAME); if (!m || !roster.has(m[3].toLowerCase())) return null; return /^promptugal$/i.test(m[2]) ? `pt:${m[3].toLowerCase()}:${m[1]}` : `${m[1]}@web-summit.${m[3].toLowerCase()}` }
// labels from the newsroom's own roster, where its names still match
const labels = {}
try { for (const a of JSON.parse(fs.readFileSync(path.join(clone, 'data/newsroom/agents.json'), 'utf8')).agents || []) { const id = a.name && idOf(a.name); if (id) labels[id] = a.label || '' } } catch { }

// the newsroom's own keys page (board/keys.json): which of its agents hold a live key there
const keyed = new Set()
try { for (const k of JSON.parse(fs.readFileSync(path.join(clone, 'board/keys.json'), 'utf8')).keys || []) if (/^active$/i.test(k.status || '') && !k.replaced_by) { const id = idOf(k.agent || String(k.label || '').split(' ')[0]); if (id) keyed.add(id) } } catch { }
const head = git(['rev-parse', '--short', 'HEAD']).trim(), now = Date.now(), week = now - 7 * 864e5
const agents = new Map(), links = new Map()
for (const rec of git(['log', '--format=%cI%x1f%s%x1f%b%x1e']).split('\x1e')) {
    const [at, s = '', b = ''] = rec.trim().split('\x1f'); if (!at || /^site v\d/.test(s)) continue
    const who = (s.match(/^([a-z0-9][a-z0-9.-]*@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+):/) || b.match(/^Agent: *([a-z0-9][a-z0-9.-]*@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+)/m) || [])[1]
    const id = who && idOf(who); if (!id) continue
    const a = agents.get(id) || { id, person: id.startsWith('pt:') ? id.split(':')[1] : id.split('.').pop(), short: id.startsWith('pt:') ? id.split(':')[2] : id.split('@')[0], family: id.startsWith('pt:') ? 'PrompTugal' : 'web-summit', label: labels[id] || '', commits: 0, first: at, last: at }
    a.commits++; if (at < a.first) a.first = at; if (at > a.last) a.last = at; agents.set(id, a)
    if (Date.parse(at) >= week) for (const line of b.match(/^For: *(.+)$/gm) || []) for (const t of line.slice(4).split(/,\s*/)) {
        const to = idOf(t.trim()) || (roster.has(t.trim()) ? t.trim() : null); if (!to || to === id) continue
        const k = `${id}|${to}`; links.set(k, (links.get(k) || 0) + 1)
    }
}
const out = {
    about: "The PrompTugal newsroom's agents, from the git log of PrompTugal/PrompTugal__News__Website (its dev branch), for Angelo's command centre; refreshed by dev@web-summit.angelo at its wakes. Names, counts and times only. pt:<person>:<agent> is a PrompTugal agent of that person.",
    source: 'https://github.com/PrompTugal/PrompTugal__News__Website', commit: head, read_at: new Date(now).toISOString(), days: 7,
    agents: [...agents.values()].map(a => ({ ...a, key: keyed.has(a.id) })).sort((x, y) => y.commits - x.commits),
    links: [...links].map(([k, n]) => { const [from, to] = k.split('|'); return { from, to, n } }).sort((x, y) => y.n - x.n),
}
fs.writeFileSync(path.join(ROOT, 'people/angelo/app/promptugal.json'), JSON.stringify(out, null, 1) + '\n')
console.log(`promptugal-snapshot: ${out.agents.length} agents, ${out.links.length} pairs in ${out.days} days, from ${head}`)
