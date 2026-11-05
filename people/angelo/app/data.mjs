// Angelo's command centre, data layer (dev@web-summit.angelo, 4 November 2026; brief: people/angelo/app/BRIEF.md).
// It extends the shared one (admin/build/commandcentre.mjs), never copies it: everything the shared build returns
// is kept as it is, so every fix to the shared app reaches this one, and what is added here can move back.
// Added: `kanban` (slices 1 and 2): who counts as Angelo, the people, each issue's last change, its history (commits
// naming it) and its stand-up items. Read only from what is already public in the repository; nothing is invented.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../../..')
const CC = await import(path.join(ROOT, 'admin/build/commandcentre.mjs'))
const KANBAN = createRequire(import.meta.url)('./kanban-core.js')

// the kanban's rules are tested on every build: a broken rule fails the build, not Angelo's phone
KANBAN.selfTest()

export const frontMatter = CC.frontMatter
export const dueAt = CC.dueAt

const git = (root, args) => { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 }) } catch { return '' } }
const readJson = (root, rel) => { try { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')) } catch { return null } }

function kanban(root, person, d) {
    const team = readJson(root, 'data/team.json') || { members: [] }
    const people = Object.fromEntries(team.members.filter(m => m.kind === 'human').map(m => [m.id, m.name]))
    const ids = new Set(d.issues.map(i => i.id))

    // each issue's last change: the newest commit that touched its board file
    const changed = {}
    {
        let at = ''
        for (const l of git(root, ['log', '--format=@%cI', '--name-only', '--', 'board/']).split('\n')) {
            if (l.startsWith('@')) { at = l.slice(1); continue }
            const m = l.match(/^board\/(WS-\d+)-/); if (m && ids.has(m[1]) && !changed[m[1]]) changed[m[1]] = at
        }
    }

    // its history: the newest commits that name it (subject or an Issue: trailer), CI's release commits left out
    const history = {}
    for (const c of git(root, ['log', '--since=30 days ago', '--format=%h%x1f%cI%x1f%s%x1f%b%x1e']).split('\x1e')) {
        const [h, at, s, b] = c.trim().split('\x1f'); if (!h || /^site v\d/.test(s)) continue
        const named = new Set([...`${s}\n${(b || '').split('\n').filter(x => /^Issue:/.test(x)).join(' ')}`.matchAll(/\bWS-\d+\b/g)].map(m => m[0]))
        for (const id of named) if (ids.has(id)) { const l = history[id] || (history[id] = []); if (l.length < 8) l.push({ h, at, s }) }
    }

    // its stand-up items: every data/meetings/<meeting>/*.json item that names it in its `issue` field
    const agenda = {}
    const mdir = path.join(root, 'data/meetings')
    for (const meet of fs.existsSync(mdir) ? fs.readdirSync(mdir).filter(x => /^\d{4}-\d\d-\d\d-\d{4}$/.test(x)).sort() : []) {
        for (const f of fs.readdirSync(path.join(mdir, meet)).filter(x => x.endsWith('.json'))) {
            const it = readJson(root, `data/meetings/${meet}/${f}`); if (!it || !it.issue || !ids.has(it.issue)) continue
            const forList = (Array.isArray(it.for) ? it.for : String(it.for || '').split(/[,\s]+/)).map(x => String(x).toLowerCase())
            ;(agenda[it.issue] || (agenda[it.issue] = [])).push({ meeting: meet, type: it.type || 'item', title: it.title || '', status: it.status || 'open', by: it.by || '', forMe: forList.includes(person), page: `meetings/${meet}/index.html` })
        }
    }
    // an item carried to a later stand-up keeps only its newest copy
    for (const id of Object.keys(agenda)) { const seen = new Map(); for (const a of agenda[id]) seen.set(a.title, a); agenda[id] = [...seen.values()].reverse() }

    const streams = Object.fromEntries((d.workstreams || []).map(w => [w.id, { name: w.name, colour: w.colour }]))
    // a stream the shared build gives that Angelo's config does not name (issues for everyone are 'team')
    for (const i of d.issues) if (i.stream && !streams[i.stream]) streams[i.stream] = { name: i.stream === 'team' ? 'The whole team' : i.stream, colour: 'slate' }
    // WS-131: on a shallow clone (a fresh cloud session's local build) the history above reads short; the page says so
    const shallow = git(root, ['rev-parse', '--is-shallow-repository']).trim() === 'true'
    return { me: person, people, streams, changed, history, agenda, shallow }
}

// the collaboration board (slice 5): everyone, people and agents, who works with whom, and the machine. Built on
// admin/build/inventory.mjs (imported, not copied) and the same public sources as /team/map/.
async function loadInventory() { return import(path.join(ROOT, 'admin/build/inventory.mjs')) }
const INV = await loadInventory()

function collab(root, person, d, now) {
    const team = readJson(root, 'data/team.json') || { members: [] }
    const inv = INV.inventory(root, team)
    const humans = team.members.filter(m => m.kind === 'human')
    const keys = (readJson(root, 'data/keys.json') || { keys: [] }).keys.map(k => String(k.label || '').split(' ')[0])
    const level = id => (readJson(root, `people/${id}/onboarding.json`) || {}).level ?? 0
    const work = id => d.issues.filter(i => (i.status === 'picked' || i.status === 'in progress') && KANBAN.pickers(i, { people: Object.fromEntries(humans.map(m => [m.id, m.name])) }).includes(id)).map(i => ({ id: i.id, title: i.title, status: i.status }))
    const agentsOf = id => inv.agents.filter(a => a.person === id).map(a => ({ name: a.name, job: a.job || '', schedule: a.schedule || '', declared: a.declared, commits: a.commits, last: a.last, key: keys.includes(a.name) }))

    // who works with whom: For: trailers over the last 7 days (agent or person to agent or person), counted per pair of people
    const pairs = {}
    const personOf = n => { const m = String(n).match(/@web-summit\.([a-z0-9-]+)$/); return m ? m[1] : humans.some(h => h.id === n) ? n : null }
    for (const c of git(root, ['log', '--since=7 days ago', '--format=%s%x1f%b%x1e']).split('\x1e')) {
        const [s, b] = c.trim().split('\x1f'); if (!s || /^site v\d/.test(s)) continue
        const from = personOf((s.match(/^([a-z0-9-]+@web-summit\.[a-z0-9-]+):/) || [])[1] || '')
        if (!from) continue
        for (const m of (b || '').matchAll(/^For: (\S+)/gm)) { const to = personOf(m[1]); if (to && to !== from) { const k = [from, to].sort().join('|'); pairs[k] = (pairs[k] || 0) + 1 } }
    }
    // and issues they share as owners
    for (const i of d.issues) { const f = (i.for || []).filter(x => humans.some(h => h.id === x)); for (let x = 0; x < f.length; x++) for (let y = x + 1; y < f.length; y++) { const k = [f[x], f[y]].sort().join('|'); pairs[k] = pairs[k] || 0 } }
    const shared = {}
    for (const i of d.issues.filter(i => i.status !== 'done')) { const f = (i.for || []).filter(x => humans.some(h => h.id === x)); for (let x = 0; x < f.length; x++) for (let y = x + 1; y < f.length; y++) { const k = [f[x], f[y]].sort().join('|'); shared[k] = (shared[k] || 0) + 1 } }

    // the machine: the newest release CI recorded (a release exists only when the gate passed), and keys against agents at work
    const vers = (readJson(root, 'admin/versions.json') || []).filter(v => /^v\d+\.\d+\.\d+$/.test(v.version))
    const vnum = v => v.version.slice(1).split('.').map(Number).reduce((a, x) => a * 1e4 + x, 0)
    const last = vers.sort((a, b) => vnum(b) - vnum(a))[0] || null
    const active = inv.agents.filter(a => a.last && (now - Date.parse(a.last.replace(' ', 'T') + ':00Z')) < 2 * 864e5)
    return {
        people: humans.map(m => ({ id: m.id, name: m.name, role: m.role || '', level: level(m.id), status: m.status || '', agents: agentsOf(m.id), work: work(m.id) })),
        links: Object.entries(pairs).map(([k, n]) => { const [a, b] = k.split('|'); return { a, b, messages: n, shared: shared[k] || 0 } }).filter(l => l.messages || l.shared).sort((x, y) => (y.messages + y.shared) - (x.messages + x.shared)),
        machine: {
            release: last ? { version: last.version, date: last.date, what: String(last.what || '').slice(0, 240) } : null,
            agents: inv.agents.length, active48h: active.length, activeWithKey: active.filter(a => keys.includes(a.name)).length,
            activeWithoutKey: active.filter(a => !keys.includes(a.name)).map(a => a.name),
            ci: `${d.repo}/actions/workflows/deploy-pages.yml`,
        },
    }
}

// summit days (slice 7): the event's public schedule as the team sourced it (data/events.json: the sessions picked as
// relevant, side events and the essentials, each with its source) and the stand-ups (data/meetings/schedule.json).
// No Web Summit API is used: none is published (checked 4 November: the schedule pages call an undocumented internal
// GraphQL service, and robots.txt disallows /api/). Personal calendars come later, sealed and with consent.
function summitDays(root) {
    const ev = readJson(root, 'data/events.json') || {}, sch = readJson(root, 'data/meetings/schedule.json') || {}
    const mdir = path.join(root, 'data/meetings')
    const meetings = fs.existsSync(mdir) ? fs.readdirSync(mdir).filter(x => /^\d{4}-\d\d-\d\d-\d{4}$/.test(x)) : []
    const range = t => { const d = [...String(t || '').matchAll(/\d{4}-\d\d-\d\d/g)].map(m => m[0]); return d.length ? { from: d[0], to: /\bto\b/.test(t) && d[1] ? d[1] : d[0] } : null }
    const pick = k => ev.summit && ev.summit[k] ? { value: ev.summit[k].value, source: ev.summit[k].source } : null
    return {
        read_on: ev.read_on || '', note: ev.note || '',
        api: 'No public Web Summit API: the schedule pages use an undocumented internal service and robots.txt disallows /api/ (checked 4 November 2026). The sessions here are the ones the team picked, each with its source.',
        essentials: ['dates', 'opening_night', 'conference_days', 'venue', 'night_summit', 'badge_pickup', 'opening_hours', 'getting_there', 'wifi', 'app'].map(k => [k, pick(k)]).filter(([, v]) => v),
        sessions: (ev.sessions || []).map(x => ({ id: x.id, title: x.title, day: x.day, time: x.time, stage: x.stage, speakers: (x.speakers || []).map(sp => [sp.name, sp.org].filter(Boolean).join(', ')), why: x.why_relevant || '', source: x.source })),
        side: (ev.side_events || []).map(x => ({ id: x.id, title: x.title, range: range(x.date), when: x.date, place: x.place || '', what: x.what || '', source: x.source || '' })).filter(x => x.range),
        standups: { slots: sch.slots || [], from: sch.from || '', until: sch.until || '', meetings },
        gaps: (ev.gaps || []).slice(0, 3),
    }
}

export function build(root, person, now = new Date()) {
    const d = CC.build(root, person, now)
    d.kanban = kanban(root, person, d)
    d.collab = collab(root, person, d, now)
    d.summit_days = summitDays(root)
    return d
}

// the no-JavaScript fallback and the markdown twin: the shared summary, then what needs Angelo now
export function summaryMd(d, now = new Date()) {
    let md = CC.summaryMd(d, now)
    if (!d.kanban) return md
    const need = KANBAN.sort(d.issues.filter(i => KANBAN.needsMe(i, d.kanban, now)), 'due', 'asc', d.kanban, now)
    md += `\n\n## Needs ${(d.person.name || d.person.id).split(' ')[0]} now (the kanban)\n\n`
    md += need.length ? need.map(i => `- **${i.id}** ${i.title} (${KANBAN.DUE_LABEL[KANBAN.dueBucket(i, now)].toLowerCase()}${(d.kanban.agenda[i.id] || []).some(a => a.forMe && a.status === 'open') ? ', a stand-up item waits on you' : ''})`).join('\n') : 'Nothing overdue, due today or waiting at a stand-up.'
    return md + '\n'
}
