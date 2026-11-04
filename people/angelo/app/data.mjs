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
    return { me: person, people, streams, changed, history, agenda }
}

export function build(root, person, now = new Date()) {
    const d = CC.build(root, person, now)
    d.kanban = kanban(root, person, d)
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
