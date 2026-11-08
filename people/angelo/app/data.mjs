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
createRequire(import.meta.url)('./where.js').selfTest() // WS-181's rules (the newest line wins, events, fading)

export const frontMatter = CC.frontMatter
export const dueAt = CC.dueAt

const git = (root, args) => { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 }) } catch { return '' } }
const readJson = (root, rel) => { try { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')) } catch { return null } }

// agents' names (Angelo's standard, 6 November): <role>@<team>.<person>, team web-summit or PrompTugal, a role that may carry a
// mode (desk.conductor, runner.conductor). One agent can go by several names over time (conductor@web-summit.angelo is now
// desk.conductor@PrompTugal.angelo; conductor-runner@... is runner.conductor@...), so the views key agents by person and role:
// canon() is that key, desk.<role> is <role>, runner.<role> is <role>-runner
const NAME_SRC = '([a-z0-9][a-z0-9.-]*)@(web-summit|promptugal)\\.([a-z0-9-]+)'
const NAME_ONE = new RegExp('^' + NAME_SRC + '$', 'i'), NAME_LEAD = new RegExp('^' + NAME_SRC + ':', 'i'), NAME_AGENT = new RegExp('^Agent: *' + NAME_SRC, 'im')
const parseName = n => { const m = String(n).trim().match(NAME_ONE); return m ? { role: m[1].toLowerCase(), team: /^promptugal$/i.test(m[2]) ? 'PrompTugal' : 'web-summit', person: m[3].toLowerCase() } : null }
const canonRole = r => r.startsWith('desk.') ? r.slice(5) : r.startsWith('runner.') ? r.slice(7) + '-runner' : r
const canon = n => { const pt = String(n).match(/^pt:([a-z0-9-]+):([a-z0-9.-]+)$/); if (pt) return `${pt[1]}/${canonRole(pt[2])}`; const p = parseName(n); return p ? `${p.person}/${canonRole(p.role)}` : null }
// the name an agent is shown by: the one its person declares now (people/<id>/agents.json), else the newest seen
function declaredNames(root, humans) { const m = new Map(); for (const h of humans) for (const a of readJson(root, `people/${h.id}/agents.json`) || []) { const c = canon(a.name); if (c) m.set(c, a) } return m }
// who committed (subject or Agent: trailer), any team
const committer = (s, b) => { const m = String(s).match(NAME_LEAD) || String(b || '').match(NAME_AGENT); return m ? `${m[1]}@${m[2]}.${m[3]}` : null }
// a PrompTugal name is kept as pt:<person>:<role> in the views' data (the gate's older checks read it as an address)
const viewId = n => { const p = parseName(n); return p && p.team === 'PrompTugal' ? `pt:${p.person}:${p.role}` : n }

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
    // live keys on the keys page: by the entry's agent field or its label's first word; ended, retired or replaced keys do not count
    const keys = (readJson(root, 'data/keys.json') || { keys: [] }).keys.filter(k => !k.replaced_by && !/^(ended|retired|superseded)/i.test(k.status || '')).map(k => k.agent || String(k.label || '').split(' ')[0])
    // the level the setup page computes from what exists (admin/build/onboarding.mjs), not the one written by hand in
    // people/<id>/onboarding.json, which falls behind (Angelo, 6 November: "the LX levels don't seem to be accurate")
    const OB = OBMOD.onboarding(root, () => inv)
    const level = id => { try { return OB.onboard(id).level || 0 } catch { return (readJson(root, `people/${id}/onboarding.json`) || {}).level ?? 0 } }
    // a renamed agent (its agents.json entry says was: "<old name> until …") shows once, under its new name
    const renamed = new Map()
    for (const m of humans) for (const a of readJson(root, `people/${m.id}/agents.json`) || []) { const old = (String(a.was || '').match(/^([a-z0-9-]+@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+)/) || [])[1]; if (old) renamed.set(old.toLowerCase(), a) }
    const work = id => d.issues.filter(i => (i.status === 'picked' || i.status === 'in progress') && KANBAN.pickers(i, { people: Object.fromEntries(humans.map(m => [m.id, m.name])) }).includes(id)).map(i => ({ id: i.id, title: i.title, status: i.status }))
    // only agents that have run: at least one commit here (Angelo, 6 November: proposed agents "aren't real"); merged by
    // the name they go by now, so an old and a new name are one agent
    // Angelo's agents were renamed <role>@PrompTugal.angelo on 6 November (desk.conductor and runner.conductor for the
    // conductor's two modes); the old and new names are one agent (canon: person/role), shown by the declared name
    const DECL = declaredNames(root, humans)
    const local = new Map() // this repo's commits under PrompTugal names, for an inventory that does not read them (before 0638bb07)
    for (const c of git(root, ['log', '--format=%cI%x1f%s%x1f%b%x1e']).split('\x1e')) {
        const [at, s = '', b = ''] = c.trim().split('\x1f'); if (!at || /^site v\d/.test(s)) continue
        const w = committer(s, b), p = w && parseName(w); if (!p || p.team !== 'PrompTugal') continue
        const k = w.toLowerCase(), cur = local.get(k) || { name: w, person: p.person, commits: 0, last: '' }
        cur.commits++; const t = at.slice(0, 16).replace('T', ' '); if (t > cur.last) cur.last = t; local.set(k, cur)
    }
    const agentsOf = id => {
        const by = new Map()
        const add = a => {
            const c = canon(a.name) || a.name.toLowerCase(), dcl = DECL.get(c), r = renamed.get(a.name.toLowerCase()) || dcl, name = dcl ? dcl.name : r ? r.name : a.name, cur = by.get(c)
            const row = { name, job: (r && r.job) || a.job || (cur && cur.job) || '', schedule: (r && r.schedule) || a.schedule || (cur && cur.schedule) || '', declared: a.declared || !!r, commits: a.commits + (cur ? cur.commits : 0), last: cur && cur.last > a.last ? cur.last : a.last, key: keys.includes(a.name) || keys.includes(name) || !!(cur && cur.key), was: a.name !== name ? a.name : (cur && cur.was) || '' }
            by.set(c, row)
        }
        for (const a of inv.agents.filter(a => a.person === id && a.commits > 0)) add(a)
        const inInv = new Set(inv.agents.map(a => a.name.toLowerCase()))
        for (const [k, a] of local) if (a.person === id && !inInv.has(k)) add({ ...a, declared: false })
        // and their work in the PrompTugal newsroom's repository (the snapshot): added to the same agent, or listed on its own
        const PTS = readJson(root, 'people/angelo/app/promptugal.json')
        for (const a of (PTS && PTS.agents || []).filter(a => a.person === id)) {
            const asName = a.id.startsWith('pt:') ? `${a.short}@PrompTugal.${a.person}` : a.id, c = canon(asName) || asName.toLowerCase(), dcl = DECL.get(c), r = renamed.get(asName.toLowerCase()) || dcl, name = dcl ? dcl.name : r ? r.name : asName
            const cur = by.get(c), last = a.last.slice(0, 16).replace('T', ' ')
            if (cur) { cur.elsewhere = (cur.elsewhere || 0) + a.commits; if (last > (cur.last || '')) cur.last = last }
            else by.set(c, { name, job: a.label || (r && r.job) || '', schedule: (r && r.schedule) || '', declared: !!r, commits: 0, elsewhere: a.commits, last, key: keys.includes(name), was: '' })
        }
        return [...by.values()].sort((x, y) => (y.last || '').localeCompare(x.last || ''))
    }

    // who works with whom: For: trailers over the last 7 days (agent or person to agent or person), counted per pair of people
    const pairs = {}
    const personOf = n => { const p = parseName(n); return p ? p.person : humans.some(h => h.id === n) ? n : null }
    for (const c of git(root, ['log', '--since=7 days ago', '--format=%s%x1f%b%x1e']).split('\x1e')) {
        const [s, b] = c.trim().split('\x1f'); if (!s || /^site v\d/.test(s)) continue
        const from = personOf(committer(s, b) || '')
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
    // the agents-and-keys card counts the same agents as the people lists (those that have run, here or in the PrompTugal
    // newsroom); a key is a live key on this site's keys page or, for a newsroom agent, on the newsroom's own; an agent whose
    // declaration says it has no key (a runner) is listed as such, not as a gap
    const peopleRows = humans.map(m => ({ id: m.id, name: m.name, role: m.role || '', level: level(m.id), status: m.status || '', agents: agentsOf(m.id), work: work(m.id) }))
    const declared = new Map(); for (const m of humans) for (const a of readJson(root, `people/${m.id}/agents.json`) || []) declared.set(String(a.name).toLowerCase(), a)
    const ptKeyed = new Set(((readJson(root, 'people/angelo/app/promptugal.json') || {}).agents || []).filter(a => a.key).map(a => a.id))
    const ptId = n => { const m = String(n).match(/^([a-z0-9][a-z0-9.-]*)@promptugal\.([a-z0-9-]+)$/i); return m ? `pt:${m[2].toLowerCase()}:${m[1].toLowerCase()}` : '' }
    const everyone = peopleRows.flatMap(p => p.agents)
    const active = everyone.filter(a => a.last && (now - Date.parse(a.last.replace(' ', 'T') + ':00Z')) < 2 * 864e5)
    const hasKey = a => a.key || keys.includes(a.name) || ptKeyed.has(ptId(a.name))
    const noKeyByDesign = a => /\bno key\b|with no key/i.test(`${(declared.get(a.name.toLowerCase()) || {}).job || ''} ${(declared.get(a.name.toLowerCase()) || {}).session || ''}`)
    return {
        people: peopleRows,
        links: Object.entries(pairs).map(([k, n]) => { const [a, b] = k.split('|'); return { a, b, messages: n, shared: shared[k] || 0 } }).filter(l => l.messages || l.shared).sort((x, y) => (y.messages + y.shared) - (x.messages + x.shared)),
        machine: {
            release: last ? { version: last.version, date: last.date, what: String(last.what || '').slice(0, 240) } : null,
            agents: everyone.length, active48h: active.length, activeWithKey: active.filter(hasKey).length,
            activeWithoutKey: active.filter(a => !hasKey(a) && !noKeyByDesign(a)).map(a => a.name),
            noKeyByDesign: active.filter(a => !hasKey(a) && noKeyByDesign(a)).map(a => a.name),
            newsroom: everyone.filter(a => a.elsewhere).length,
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

// the cockpit's ranking (from the conductor, 8401935e item 3): what only Angelo can do and the decisions waiting on him,
// each scored with why it is where it is, by admin/build/cockpit.mjs itself (imported, not copied). Its inputs are the
// build's own modules (meetings, inventory, onboarding); the board is read the way build.mjs reads it.
const CK = await import(path.join(ROOT, 'admin/build/cockpit.mjs'))
const MEETMOD = await import(path.join(ROOT, 'admin/build/meetings.mjs'))
const OBMOD = await import(path.join(ROOT, 'admin/build/onboarding.mjs'))
function cockpitRanking(root, person, now) {
    try {
        const teamData = readJson(root, 'data/team.json') || { members: [] }
        const dir = path.join(root, 'board')
        const ISSUES = { issues: fs.readdirSync(dir).filter(f => /^WS-\d+.*\.md$/.test(f)).sort().map(f => { const { meta, body } = CC.frontMatter(fs.readFileSync(path.join(dir, f), 'utf8')); return { ...meta, file: f, for: (meta.for || '').split(',').map(x => x.trim()).filter(Boolean), done: body.trim().replace(/\n+/g, ' ') } }) }
        let inv = null; const getINV = () => inv || (inv = INV.inventory(root, teamData))
        const VERSION = fs.readFileSync(path.join(root, 'admin/build/version.txt'), 'utf8').trim()
        const D = CK.cockpit({ ROOT: root, id: person, teamData, ISSUES, MEET: MEETMOD.meetingsContext(root), INV: getINV(), OB: OBMOD.onboarding(root, getINV), VERSION, now: now.getTime() })
        // what the cockpit's decide part draws (assets/cockpit.js): the cards without their evidence and graph (not drawn here)
        const card = x => { const { evidence, graph, params, score_parts, ...r } = x; return { ...r, type: r.type || 'only-you', ref: r.ref || r.file, issue: r.issue || r.id || '', meeting: r.first_meeting || '', with: r.with || [], options: r.options || [], recommend: r.recommend || '', detail: String(r.detail || r.action || '').slice(0, 600) } }
        return { person: D.person, only_you: D.only_you.map(card), decisions: D.decisions.map(card), delegates: D.delegates, lane: D.lane, processed: D.processed }
    } catch (e) { return { error: String(e.message || e).slice(0, 200), only_you: [], decisions: [], delegates: [] } }
}

// Replay (people/angelo/proposals/replay/BRIEF.md, Angelo's go 5 November): every commit on dev since 2 November as an
// event, compactly: [minute since 2 Nov 00:00 UTC, agent index, kind, [For: target indexes], [issue numbers], subject].
// Kinds are read from the commit, not declared: r a release by CI, d a decision recorded, q a request (a conductor's
// commit to other agents), p a report (an agent's commit to its own conductor), w other work. Public data only.
const REPLAY_FROM = Date.UTC(2026, 10, 2)
// a subject cut at a word boundary, never inside a name (a cut agent name reads like an email address to the gate)
const clip = (t, n) => { if (t.length <= n) return t; const c = t.slice(0, n).replace(/\s+\S*$/, ''); return c + '…' }
function replay(root) {
    const team = readJson(root, 'data/team.json') || { members: [] }
    const people = team.members.filter(m => m.kind === 'human').map(m => ({ id: m.id, name: m.name }))
    const agents = [], aIdx = new Map(), targets = [], tIdx = new Map(), events = []
    const DECL = declaredNames(root, team.members.filter(m => m.kind === 'human'))
    const agentOf = n => { const c = canon(n); if (!aIdx.has(c)) { aIdx.set(c, agents.length); const d = DECL.get(c), nm = d ? d.name : n, p = parseName(nm); agents.push({ name: viewId(nm), short: p.role, person: p.person }) } return aIdx.get(c) }
    const targetOf = n => { if (!tIdx.has(n)) { tIdx.set(n, targets.length); targets.push(n) } return tIdx.get(n) }
    const raw = git(root, ['log', '--since=2026-11-02T00:00:00Z', '--format=%h%x1f%cI%x1f%s%x1f%b%x1e'])
    for (const c of raw.split('\x1e')) {
        const [h, at, s = '', b = ''] = c.trim().split('\x1f'); if (!h) continue
        const t = Math.round((Date.parse(at) - REPLAY_FROM) / 6e4); if (t < 0) continue
        const rel = s.match(/^site (v\d+\.\d+\.\d+):/)
        if (rel) { events.push([t, -1, 'r', [], [], rel[1]]); continue }
        const who = committer(s, b), wp = who && parseName(who)
        if (!wp || !people.some(p => p.id === wp.person)) continue
        const fors = [...new Set([...b.matchAll(/^For: *(.+)$/gm)].flatMap(m => m[1].split(/,\s*/)).map(x => x.trim()).filter(x => parseName(x) || /^[a-z0-9-]+$/.test(x)).map(x => { const c = canon(x), d = c && DECL.get(c); return parseName(x) ? viewId(d ? d.name : x) : x }))]
        const issues = [...new Set([...`${s}\n${b}`.matchAll(/\bWS-(\d+)\b/g)].map(m => +m[1]))].slice(0, 6)
        const from = wp.person, short = canonRole(wp.role)
        const kind = /\b(decided|decision recorded|settled|his words|her words|in (?:his|her) words)\b/i.test(s) ? 'd'
            : /^conductor(-runner)?$/.test(short) && fors.some(f => { const c = canon(f); return c && c !== canon(who) && c.startsWith(from + '/') }) ? 'q'
            : !/^conductor(-runner)?$/.test(short) && fors.some(f => /^[^/]+\/conductor(-runner)?$/.test(canon(f) || '') && canon(f).startsWith(from + '/')) ? 'p' : 'w'
        events.push([t, agentOf(who), kind, fors.map(targetOf), issues, clip(s.replace(/^[^:]+: /, ''), 70), h])
    }
    events.sort((x, y) => x[0] - y[0])
    // the stand-ups, from the schedule (each slot's minute) and the meetings that have a folder
    const sch = readJson(root, 'data/meetings/schedule.json') || {}, mdir = path.join(root, 'data/meetings')
    const standups = fs.existsSync(mdir) ? fs.readdirSync(mdir).filter(x => /^\d{4}-\d\d-\d\d-\d{4}$/.test(x)).map(id => [Math.round((Date.UTC(+id.slice(0, 4), +id.slice(5, 7) - 1, +id.slice(8, 10), +id.slice(11, 13), +id.slice(13, 15)) - REPLAY_FROM) / 6e4), id]) : []
    // slice 4, the runs: the agents' run logs (WS-160) as observability@web-summit.dinis publishes them, in its public vault;
    // only the published read key's record (people/dinis/vaults.json), which the page uses to read latest/runs.json itself
    const obs = ((readJson(root, 'people/dinis/vaults.json') || {}).vaults || []).find(v => v.agent === 'observability@web-summit.dinis' && /^sgit_public_read_[0-9a-f]{64}$/.test(v.read_key || ''))
    const runs = obs ? { endpoint: 'https://dev.send.sgraph.ai', vault_id: obs.vault_id, read_key: obs.read_key, path: 'latest/runs.json', source: 'people/dinis/vaults.json' } : null
    return { from: new Date(REPLAY_FROM).toISOString(), people, agents, targets, events, standups, runs, live: liveEvents(root), repo: 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit' }
}

// spec-live-map.md section 2 (approved 7 November, c6fc4442), the record's own events, from the public files and their commits;
// vault@'s data-and-who-may-see-it.md is the rule. Each is [minutes since REPLAY_FROM, ...names]; before 2 November is negative.
// keys: [t, agent, 'published'|'ended'], from each commit of data/keys.json. handovers: [t, by, to], every file in data/sealed/
// drawn only as "a key handed over" (decision 1): never its name, kind or contents. lanes: [t, agent, 'inbox'|'feedback'], an
// agent that can receive sealed messages, from the commit that first gave it the lane. messages: [t, agent, 'sent'|'verified',
// commit], a sealed message an agent says it sent or verified. comms: [t, from, to, kind], the newsroom's comms ledger. Names
// only: no token, key or vault id.
const minsOf = iso => Math.round((Date.parse(iso) - REPLAY_FROM) / 6e4)
const sealedAt = a => { const m = String(a || '').match(/^(\d{4}-\d\d-\d\d)T(\d\d):?(\d\d)(?::?(\d\d))?(?:\.\d+)?Z$/); return m ? `${m[1]}T${m[2]}:${m[3]}:${m[4] || '00'}Z` : null }
function liveEvents(root) {
    const keysNow = (readJson(root, 'data/keys.json') || {}).keys || []
    // a name as the replay's agents carry it: an old name becomes the name its person's agents.json declares now
    const DECL = declaredNames(root, ((readJson(root, 'data/team.json') || {}).members || []).filter(m => m.kind === 'human'))
    const asNow = n => { const d = DECL.get(canon(n)); return viewId(d ? d.name : n) }
    const agentOfKey = k => { const n = k.agent || (String(k.label || '').match(new RegExp(NAME_SRC, 'i')) || [])[0]; return n && parseName(n) ? asNow(n) : null }
    const byId = new Map(keysNow.map(k => [k.id, agentOfKey(k)]))
    // keys: replay the file's history, commit by commit, and note when each id first appears and when it stops being active
    const keys = [], seen = new Map()
    for (const line of git(root, ['log', '--reverse', '--format=%H %cI', '--', 'data/keys.json']).trim().split('\n').filter(Boolean)) {
        const [h, at] = line.split(' '); let ks
        try { ks = JSON.parse(git(root, ['show', `${h}:data/keys.json`])).keys || [] } catch { continue }
        for (const k of ks) {
            const who = agentOfKey(k) || byId.get(k.id); if (!who) continue
            if (!byId.has(k.id)) byId.set(k.id, who)
            const on = !k.status || k.status === 'active', was = seen.get(k.id)
            if (was === undefined) keys.push([minsOf(at), who, on ? 'published' : 'ended'])
            else if (was && !on) keys.push([minsOf(at), who, 'ended'])
            else if (!was && on) keys.push([minsOf(at), who, 'published'])
            seen.set(k.id, on)
        }
    }
    // handovers: by and to, and when; "to" is a person's id or a key's id
    const people = new Set(((readJson(root, 'data/team.json') || {}).members || []).filter(m => m.kind === 'human').map(m => m.id))
    const party = n => { n = String(n || '').trim(); if (people.has(n)) return n; if (parseName(n)) return asNow(n); return byId.get(n) || null }
    const handovers = [], sdir = path.join(root, 'data/sealed')
    const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.json') ? [path.join(d, e.name)] : []) : []
    for (const f of walk(sdir)) {
        let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')) } catch { continue }
        const by = party(j.by), to = party(j.to) || party(j.agent), at = sealedAt(j.at)
        if (by && to && at && by !== to) handovers.push([minsOf(at), by, to])
    }
    handovers.sort((x, y) => x[0] - y[0])
    // lanes: the inbox lane files, and the feedback pane's lanes, each from the commit that first gave the agent its lane
    const lanes = [], firstAt = rel => git(root, ['log', '--diff-filter=A', '--format=%cI', '--', rel]).trim().split('\n').pop()
    const idir = path.join(root, 'data/inbox')
    for (const f of fs.existsSync(idir) ? fs.readdirSync(idir).filter(x => /^lane-.*\.json$/.test(x)) : []) {
        const j = readJson(root, `data/inbox/${f}`) || {}, at = firstAt(`data/inbox/${f}`)
        if (parseName(j.agent || '') && at) lanes.push([minsOf(at), asNow(j.agent), 'inbox'])
    }
    const fbSeen = new Set()
    for (const line of git(root, ['log', '--reverse', '--format=%H %cI', '--', 'assets/feedback.json']).trim().split('\n').filter(Boolean)) {
        const [h, at] = line.split(' '); let ls
        try { ls = JSON.parse(git(root, ['show', `${h}:assets/feedback.json`])).lanes || [] } catch { continue }
        for (const l of ls) if (parseName(l.agent || '') && !fbSeen.has(l.agent)) { fbSeen.add(l.agent); lanes.push([minsOf(at), asNow(l.agent), 'feedback']) }
    }
    lanes.sort((x, y) => x[0] - y[0]); keys.sort((x, y) => x[0] - y[0])
    // messages: a sealed or signed message sent or verified, only where an agent says so in its own commit's subject (a body
    // often quotes others' events, so it is not read). [t, agent, 'sent'|'verified', short commit]: never the subject's text.
    const messages = [], MSG_V = /\b(?:signed|sealed) message\b[^;]{0,40}?\b(?:verified|read)\b|\breply verified\b|\bverified both ways\b|\bworks both ways\b|\bsignature verified\b/i
    const MSG_S = /\b(?:signed|sealed) (?:message|test|reply)\b[^;]{0,40}?\bsent\b|\breply sent to\b|\bsent (?:on|to) (?:\S+ ){0,3}lane\b|\b(?:a|my|the) first sealed message\b|\bsealed test\b/i
    for (const c of git(root, ['log', '--since=2026-11-02T00:00:00Z', '--format=%h%x1f%cI%x1f%s%x1f%b%x1e']).split('\x1e')) {
        const [h, at, s = '', b = ''] = c.trim().split('\x1f'); if (!h || /^site v\d/.test(s)) continue
        const kind = MSG_V.test(s) ? 'verified' : MSG_S.test(s) ? 'sent' : null; if (!kind) continue
        const who = committer(s, b), wp = who && parseName(who)
        if (wp && people.has(wp.person)) messages.push([minsOf(at), asNow(who), kind, h.slice(0, 8)])
    }
    // the newsroom (piece 3), from the snapshot people/angelo/tools/promptugal-snapshot.mjs writes: its agents' key events join
    // keys, and security@PrompTugal.dinis's comms ledger gives comms: [t, from, to, 'message'|'session'|'sealed'], names only
    const PT = readJson(root, 'people/angelo/app/promptugal.json') || {}
    for (const [at, who, st] of PT.keys || []) if (/^(published|ended)$/.test(st) && Date.parse(at)) keys.push([minsOf(at), who, st])
    keys.sort((x, y) => x[0] - y[0])
    const comms = ((PT.comms || {}).rows || []).filter(r => Date.parse(r[0]) && /^(message|session|sealed)$/.test(r[3])).map(([at, f, t, k]) => [minsOf(at), f, t, k]).sort((x, y) => x[0] - y[0])
    messages.sort((x, y) => x[0] - y[0])
    return neverList(root, { keys, handovers, lanes, messages, comms })
}
// the never list (data-and-who-may-see-it.md): no sealed file's name, no token, no key, no vault id. Anything that looks like one
// drops the whole section, so a leak is never published; the build says why.
export function neverList(root, live) {
    const text = JSON.stringify(live), bad = []
    const sdir = path.join(root, 'data/sealed'), names = []
    const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).forEach(e => e.isDirectory() ? walk(path.join(d, e.name)) : names.push(e.name.replace(/\.json$/, ''))) : null
    walk(sdir)
    for (const n of names) if (text.includes(n) || text.includes(n.replace(/^[\dT-]+Z-/, ''))) bad.push('a sealed file name')
    if (/[0-9a-f]{32,}/i.test(text)) bad.push('a token or hash')
    if (/BEGIN [A-Z ]*KEY|sgit_[a-z_]+_[0-9a-f]/i.test(text)) bad.push('a key')
    const vaults = new Set([...(((readJson(root, 'assets/feedback.json') || {}).lanes) || []).map(l => l.vault_id)].filter(Boolean))
    for (const f of fs.existsSync(path.join(root, 'data/inbox')) ? fs.readdirSync(path.join(root, 'data/inbox')) : []) { const v = (readJson(root, `data/inbox/${f}`) || {}).vault_id; if (v) vaults.add(v) }
    for (const v of vaults) if (text.includes(`"${v}"`)) bad.push('a vault id')
    if (bad.length) { console.error(`people/angelo/app/data.mjs: the live section is left out, it held ${[...new Set(bad)].join(', ')}`); return { error: 'left out by the never list' } }
    return live
}

// For me (spec-kanban-tasks.md, approved 7 November, cb97bf39): Angelo's tasks as cards from four public sources, placed in
// four columns by kanban-core.js. Read only; a row it cannot read is listed in `unplaced`, never guessed.
const REPO = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit'
// when each line of a file last changed (git blame), so a card knows when it appeared or moved
function lineTimes(root, rel) {
    const out = []; let t = ''
    for (const l of git(root, ['blame', '--line-porcelain', '--', rel]).split('\n')) {
        if (l.startsWith('committer-time ')) t = new Date(+l.slice(15) * 1000).toISOString()
        else if (l.startsWith('\t')) out.push(t)
    }
    return out
}
// agents' full names are shortened to <role>@ (the gate's contact check reads a full name as an address)
const plain = t => String(t || '').replace(/([a-z0-9][a-z0-9.-]*)@(?:web-summit|promptugal)\.[a-z0-9-]+/gi, '$1@').replace(/~~/g, '').replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim()
const briefLink = t => { const h = String(t || '').match(/\b([0-9a-f]{7,12})\b/); if (h) return `${REPO}/commit/${h[1]}`; const f = String(t || '').match(/((?:people|board|content|data|admin|assets)\/[\w./@-]+\.\w+)/); return f ? `${REPO}/blob/dev/${f[1]}` : '' }
const WAITS_ON_HIM = /\bangelo\b|\bhis\b|\bhim\b/i
function tasks(root, person, d, now) {
    const cards = [], unplaced = [], byIssue = new Set()
    // 1. the backlog (people/angelo/backlog.md): one card a row; a Status column, when the desk adds it, wins
    const BL = 'people/angelo/backlog.md', blText = (() => { try { return fs.readFileSync(path.join(root, BL), 'utf8') } catch { return '' } })(), blAt = lineTimes(root, BL)
    let head = null
    blText.split('\n').forEach((l, n) => {
        if (!l.startsWith('|')) return
        const cells = l.split('|').slice(1, -1).map(c => c.trim())
        if (cells[0] === '#') { head = cells.map(c => c.toLowerCase()); return }
        if (!head || !/^\d+$/.test(cells[0])) return
        const col = k => cells[head.findIndex(h => h.startsWith(k))] || ''
        const item = col('item'), waits = col('waits'), status = col('status').toLowerCase(), struck = /~~/.test(item)
        const place = status ? { waiting: 'need', 'waits on angelo': 'need', 'in progress': 'progress', delivered: 'delivered', done: 'done' }[status] : struck ? 'done' : WAITS_ON_HIM.test(waits) ? 'need' : 'progress'
        if (!place) { unplaced.push(`backlog #${cells[0]}: status "${status}"`); return }
        const issue = (item.match(/\bWS-\d+\b/) || [])[0] || ''
        if (issue) byIssue.add(issue)
        cards.push({ id: `B-${cells[0]}`, src: 'backlog', col: place, title: plain(item).replace(/\s+done:.*$/i, '').replace(/\s*\((?:[0-9a-f]{7,12}(?:,\s*)?)+\)/g, ''), done: struck ? plain((item.match(/done:\s*(.*)$/i) || [])[1] || '') : '', agent: col('agent'), brief: plain(col('brief')), link: briefLink(col('brief')) || briefLink(item), waits: plain(waits), chip: place === 'need' ? 'waits on you' : '', rank: 40 - +cells[0] / 100, at: blAt[n] || '', issue })
    })
    // 2. the desk's "Open with Angelo" (people/angelo/conductor/STATE.md): one card a top-level bullet, all in Needs you
    const ST = 'people/angelo/conductor/STATE.md', stText = (() => { try { return fs.readFileSync(path.join(root, ST), 'utf8') } catch { return '' } })(), stAt = lineTimes(root, ST)
    let inOpen = false, k = 0
    stText.split('\n').forEach((l, n) => {
        if (/^## /.test(l)) { inOpen = /^## Open with Angelo/i.test(l); return }
        if (!inOpen || !l.startsWith('- ')) return
        const raw = l.slice(2), tag = raw.match(/^\[([A-Za-z]+-\d+)\]\s*/), body = plain(tag ? raw.slice(tag[0].length) : raw)
        const id = tag ? tag[1] : 'O-' + body.toLowerCase().replace(/[^a-z0-9]+/g, '-').split('-').filter(Boolean).slice(0, 5).join('-')
        const cut = body.search(/: |\. /), title = (cut > 12 && cut < 110 ? body.slice(0, cut) : body.slice(0, 110) + (body.length > 110 ? '…' : ''))
        const rec = (body.match(/recommend(?:ation|ed|s)?:\s*([^.;]+)/i) || [])[1] || ''
        cards.push({ id, src: 'open', col: 'need', title, text: body.slice(0, 700), agent: 'desk', brief: 'Open with Angelo', link: `${REPO}/blob/dev/${ST}`, chip: /tier[ -]3/i.test(body) ? 'tier 3' : 'click', rec: rec.trim(), rank: 30 - (k++) / 100, at: stAt[n] || '' })
    })
    // 3. his board issues not already on a backlog row: needing him now, or picked and in progress
    const ck = new Map([...((d.cockpit || {}).only_you || []), ...((d.cockpit || {}).decisions || [])].map(x => [x.issue, x.score]))
    for (const i of d.issues) {
        if (byIssue.has(i.id) || i.status === 'done') continue
        const need = KANBAN.needsMe(i, d.kanban, now)
        if (!need && !(KANBAN.isMine(i, d.kanban) && (i.status === 'picked' || i.status === 'in progress'))) continue
        const up = (d.kanban.agenda[i.id] || []).some(a => a.forMe && a.status === 'open')
        cards.push({ id: i.id, src: 'issue', col: need ? 'need' : 'progress', title: plain(i.title), agent: plain(i.picked_by || ''), brief: i.id, link: `${REPO}/blob/dev/${i.file}`, chip: need ? (up ? 'stand-up' : KANBAN.DUE_LABEL[KANBAN.dueBucket(i, now)].toLowerCase()) : i.status, rank: 20 + (+ck.get(i.id) || 0) / 1000, at: d.kanban.changed[i.id] || '', issue: i.id })
    }
    // 4. deliveries: commits of the last week For the desk with a "Delivered:" line; Angelo's marks in people/angelo/tasks/seen.json
    const marks = new Map(); for (const m of ((readJson(root, 'people/angelo/tasks/seen.json') || {}).marks || [])) if (m && m.card) marks.set(m.card, m)
    for (const c of git(root, ['log', `--since=${DONE_WINDOW_DAYS + 1} days ago`, '--format=%h%x1f%cI%x1f%s%x1f%b%x1e']).split('\x1e')) {
        const [h, at, s = '', b = ''] = c.trim().split('\x1f'); if (!h || /^site v\d/.test(s)) continue
        const dl = b.match(/^Delivered:\s*(.+)$/m); if (!dl || !/^For: desk\.conductor@PrompTugal\.angelo/mi.test(b)) continue
        const who = (s.match(/^([a-z0-9.-]+)@/i) || [])[1] || '', id = 'D-' + h.slice(0, 8), m = marks.get(id)
        const ref = (dl[1].match(/https?:\/\/\S+|(?:people|board|content|data|admin|assets)\/[\w./@-]+/) || [])[0] || ''
        cards.push({ id, src: 'delivery', col: m ? (m.action === 'changes' ? 'progress' : 'done') : 'delivered', title: plain(s.replace(/^[^:]+:\s*/, '')), agent: who ? who + '@' : '', brief: h, link: ref ? (/^http/.test(ref) ? ref : `${REPO}/blob/dev/${ref.replace(/[.,;]+$/, '')}`) : `${REPO}/commit/${h}`, commit: `${REPO}/commit/${h}`, chip: m ? (m.action === 'changes' ? 'needs changes' : 'seen') : 'delivered', note: m && m.action === 'changes' ? plain(m.text) : '', rank: 0, at: m ? m.at : at })
    }
    return { cards, unplaced, counts: Object.fromEntries(['backlog', 'open', 'issue', 'delivery'].map(x => [x, cards.filter(c => c.src === x).length])) }
}
const DONE_WINDOW_DAYS = KANBAN.DONE_DAYS

export function build(root, person, now = new Date()) {
    const d = CC.build(root, person, now)
    d.kanban = kanban(root, person, d)
    d.cockpit = cockpitRanking(root, person, now)
    d.tasks = tasks(root, person, d, now)
    d.collab = collab(root, person, d, now)
    // the whole team as one map (WS-97): team-collaboration@web-summit.angelo's people/angelo/tools/team-map.mjs, run, not copied
    try {
        const M = JSON.parse(execFileSync('node', [path.join(root, 'people/angelo/tools/team-map.mjs'), '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 32 << 20 }))
        // a PrompTugal agent's name (<agent>@PrompTugal.<person>) reads as an email address to the gate's contact check, which
        // knows only @web-summit. names: kept here as pt:<person>:<agent>, shown as "<agent>, PrompTugal"
        // team-map.mjs names a node <role>@<person> with the names it went by (since bd87ea54): each node is given the name
        // its person declares now (else its newest), its team and its kind from the inventory (any of its names' rows)
        const DM = declaredNames(root, M.people.map(p => ({ id: p.id })))
        const invK = new Map(); for (const a of INV.inventory(root, readJson(root, 'data/team.json') || { members: [] }).agents) { const c = canon(a.name); if (c && a.kind) invK.set(c, a.kind) }
        const tmId = new Map()
        M.agents = M.agents.map(a => {
            const ns = Array.isArray(a.names) && a.names.length ? a.names : [a.id]
            const pick = ns.find(n => { const c = canon(n); return c && DM.get(c) && c === `${a.person}/${a.short}` }) || ns.find(n => { const c = canon(n); return c && DM.get(c) }) || ns.find(n => /@promptugal\./i.test(n)) || ns[0]
            const c = canon(pick), dcl = c && DM.get(c), nm = (dcl || {}).name || pick, p = parseName(nm), id = viewId(nm)
            tmId.set(a.id, id)
            return { ...a, id, short: p ? p.role : a.short, family: a.family || (p ? p.team : 'web-summit'), kind: (dcl && INV.agentKind ? INV.agentKind(dcl.session, dcl.schedule) : '') || a.kind || invK.get(c) || '' }
        })
        const fix = id => tmId.get(id) || viewId(id)
        M.links = M.links.map(l => ({ ...l, from: fix(l.from), to: fix(l.to) }))
        // the PrompTugal newsroom's agents work in their own repository (Angelo, 6 November): merged from the snapshot
        // people/angelo/app/promptugal.json, which dev@web-summit.angelo refreshes at its wakes; active ones only (7 days)
        const PT = readJson(root, 'people/angelo/app/promptugal.json')
        if (PT && PT.agents) {
            const have = new Set(M.agents.map(a => a.id)), weekAgo = Date.now() - 7 * 864e5
            for (const a of PT.agents) if (!have.has(a.id) && Date.parse(a.last) >= weekAgo && M.people.some(p => p.id === a.person)) { M.agents.push({ id: a.id, person: a.person, family: a.family, short: a.short, commits: a.commits, elsewhere: true, first: a.first }); have.add(a.id) }
            const idx = new Map(M.links.map((l, i) => [`${l.from}|${l.to}`, i]))
            for (const l of PT.links || []) if ((have.has(l.from) || M.people.some(p => p.id === l.from)) && (have.has(l.to) || M.people.some(p => p.id === l.to))) { const k = `${l.from}|${l.to}`; if (idx.has(k)) M.links[idx.get(k)].n += l.n; else { idx.set(k, M.links.length); M.links.push({ ...l }) } }
            M.promptugal = { read_at: PT.read_at, commit: PT.commit, agents: PT.agents.length }
            M.totals = { ...M.totals, agents: M.agents.length, promptugal: M.agents.filter(a => a.family !== 'web-summit').length, messages: M.links.reduce((n, l) => n + l.n, 0) }
        }
        // one agent, one node: an agent's old and new names (Angelo's agents became <role>@PrompTugal.angelo on 6 November)
        // and its newsroom self are merged under the name its person declares now
        const toNode = id => { const c = canon(id), dcl = c && DM.get(c); return dcl ? viewId(dcl.name) : id }
        { const to = toNode
          const nodes = new Map()
          for (const a of M.agents) { const id = to(a.id), cur = nodes.get(id); if (!cur) nodes.set(id, { ...a, id, short: id.startsWith('pt:') ? id.split(':')[2] : id.split('@')[0], family: id.startsWith('pt:') ? 'PrompTugal' : a.family }); else { cur.commits = (cur.commits || 0) + (a.commits || 0); if (!a.elsewhere) delete cur.elsewhere; if (!cur.kind && a.kind) cur.kind = a.kind } }
          M.agents = [...nodes.values()]
          const li = new Map()
          for (const l of M.links) { const f = to(l.from), t = to(l.to); if (f === t) continue; const k = `${f}|${t}`; if (li.has(k)) li.get(k).n += l.n; else li.set(k, { ...l, from: f, to: t }) }
          M.links = [...li.values()] }
        // an agent declared to "commit as" another (a runner, Angelo, 6 November) has no commits of its own: drawn beside the
        // agent it works as, with a dashed line, whenever that one is on the map
        { const have = new Set(M.agents.map(a => a.id))
          for (const p of M.people) for (const a of readJson(root, `people/${p.id}/agents.json`) || []) {
            const hm = (String(a.job || '').match(/commits as ([a-z0-9][a-z0-9.-]*@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+)/) || [])[1], host = hm && viewId(hm), me = viewId(a.name)
            if (!host || have.has(me) || !have.has(host)) continue
            M.agents.push({ id: me, person: p.id, family: me.startsWith('pt:') ? 'PrompTugal' : 'web-summit', short: me.startsWith('pt:') ? me.split(':')[2] : me.split('@')[0], commits: 0, runsAs: host, kind: INV.agentKind ? INV.agentKind(a.session, a.schedule) : '' }); have.add(me)
            M.links.push({ from: me, to: host, n: 1, as: true })
          }
          M.totals = { ...M.totals, agents: M.agents.length } }
        // sessionless agents (backlog 00c; dev.map@PrompTugal.angelo, 8 November): every agent its person declares as a fresh
        // session each run (the runners and the workers). One already on the map keeps its node and gets its kind if it had none;
        // one not on the map (its commits are on its workers/ branch, or it has not run yet) is listed in M.sessionless, which only
        // the live graph draws, beside its person, so it is seen between runs too. Names only, from the agents.json files.
        { const byId = new Map(M.agents.map(a => [a.id, a])); M.sessionless = []
          for (const p of M.people) for (const a of readJson(root, `people/${p.id}/agents.json`) || []) {
            if (!a || !a.name || !INV.agentKind || INV.agentKind(a.session, a.schedule) !== 'fresh') continue
            const me = viewId(a.name), on = byId.get(me)
            if (on) { if (!on.kind) on.kind = 'fresh'; continue }
            M.sessionless.push({ id: me, person: p.id, family: me.startsWith('pt:') ? 'PrompTugal' : 'web-summit', short: me.startsWith('pt:') ? me.split(':')[2] : me.split('@')[0], commits: 0, kind: 'fresh' })
          } }
        // the kinds of work (the third layout): each agent's commits in 7 days that name an issue, by the issue's board area,
        // grouped into seven kinds; the PrompTugal newsroom's agents, from their own repository, count as newsroom work
        const KINDS = [['build', 'Building the site and tools', ['tech', 'agents']], ['content', 'Content and the newsroom', ['content', 'video', 'newsroom']], ['outreach', 'Outreach', ['outreach', 'crm', 'friendly']], ['setup', 'Getting set up', ['onboarding', 'people', 'team']], ['running', 'Running the team', ['pm', 'operator', 'operations', 'ops']], ['riskmandate', 'RiskMandate', ['riskmandate', 'idea']], ['merch', 'Merch and design', ['merch', 'design']]]
        const kindOf = {}; for (const [k, , areas] of KINDS) for (const a of areas) kindOf[a] = k
        const areaOf = {}; for (const f of fs.readdirSync(path.join(root, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f))) { const m = fs.readFileSync(path.join(root, 'board', f), 'utf8').match(/^area: *(.+)$/m); areaOf[+f.match(/^WS-(\d+)/)[1]] = m ? m[1].trim().toLowerCase() : '' }
        const work = new Map(), ids = new Set(M.agents.map(a => a.id))
        for (const c of git(root, ['log', '--since=7 days ago', '--format=%s%x1f%b%x1e']).split('\x1e')) {
            const [sj, bd = ''] = c.trim().split('\x1f'); if (!sj || /^site v\d/.test(sj)) continue
            const cm = committer(sj, bd), who = cm && toNode(viewId(cm)); if (!who || !ids.has(who)) continue
            const kinds = new Set([...`${sj}\n${bd}`.matchAll(/\bWS-(\d+)\b/g)].map(m => kindOf[areaOf[+m[1]]]).filter(Boolean))
            for (const k of kinds) { const key = `${who}|${k}`; work.set(key, (work.get(key) || 0) + 1) }
        }
        for (const a of (PT && PT.agents) || []) if (ids.has(a.id) && a.id.startsWith('pt:')) work.set(`${a.id}|content`, (work.get(`${a.id}|content`) || 0) + a.commits)
        M.work = { kinds: KINDS.map(([id, label]) => ({ id, label })), links: [...work].map(([k, n]) => { const [agent, kind] = k.split('|'); return { agent, kind, n } }) }
        d.collab.map = M
    } catch (e) { d.collab.map = { error: String(e.message || e).slice(0, 160) } }
    d.summit_days = summitDays(root)
    d.replay = replay(root)
    return d
}

// the no-JavaScript fallback and the markdown twin: the shared summary, then what needs Angelo now
export function summaryMd(d, now = new Date()) {
    let md = CC.summaryMd(d, now)
    if (!d.kanban) return md
    if (d.tasks) {
        const cols = KANBAN.taskColumns(d.tasks.cards, now)
        md += `\n\n## ${(d.person.name || d.person.id).split(' ')[0]}'s tasks (the kanban, For me)\n`
        for (const c of cols) md += `\n### ${c.label} (${c.items.length})\n\n` + (c.items.length ? c.items.slice(0, 25).map(t => `- **${t.id}** ${t.title}${t.agent ? `, ${t.agent}` : ''}${t.rec ? `. Recommended: ${t.rec}` : ''}`).join('\n') : 'Nothing here.') + '\n'
    }
    const need = KANBAN.sort(d.issues.filter(i => KANBAN.needsMe(i, d.kanban, now)), 'due', 'asc', d.kanban, now)
    md += `\n\n## Needs ${(d.person.name || d.person.id).split(' ')[0]} now (the kanban)\n\n`
    md += need.length ? need.map(i => `- **${i.id}** ${i.title} (${KANBAN.DUE_LABEL[KANBAN.dueBucket(i, now)].toLowerCase()}${(d.kanban.agenda[i.id] || []).some(a => a.forMe && a.status === 'open') ? ', a stand-up item waits on you' : ''})`).join('\n') : 'Nothing overdue, due today or waiting at a stand-up.'
    return md + '\n'
}

// live.json (people/angelo/proposals/live-map/spec-realtime.md, Angelo's go 7 November): the last 48 hours of exchanges, for the
// live graph, which reads it again every minute. [minute since 2 Nov, agent index, kind, [For: target indexes], commit, repository index]; names
// and times only, never a subject or any text. build.mjs writes what this returns, next to data.json.
export function extras(d) {
    const R = d.replay; if (!R) return {}
    const cut = Math.round((Date.now() - Date.parse(R.from)) / 6e4) - 48 * 60
    // names, not indexes, until the end, so this site's exchanges and the other repositories' share one list
    const evs = R.events.filter(e => e[0] >= cut && e[1] >= 0).map(e => [e[0], R.agents[e[1]].name, e[2], e[3].map(i => R.targets[i]), e[6], 0])
    // every other repository the agents work in (backlog 00 point 7: dev.map@PrompTugal.angelo, 8 November): repos-events.json,
    // written by people/angelo/tools/repos-snapshot.mjs, the same names and times, drawn on the same lines; kind 'x', and the
    // repository's index into `repos` (0 is this site's dev). A missing or unreadable file leaves this site's exchanges alone.
    const SITE = 'SGit-AI/SGit-AI__Website__Web-Summit', repos = [SITE + ' (dev)']
    try {
        const X = JSON.parse(fs.readFileSync(path.join(HERE, 'repos-events.json'), 'utf8')), x0 = Math.round((Date.parse(X.from) - Date.parse(R.from)) / 6e4)
        const ri = new Map()
        for (const e of X.events || []) {
            const m = x0 + e[0]; if (!(m >= cut)) continue
            const r0 = (X.repos[e[3]] || {}).repo || '?', rn = r0 === SITE ? SITE + ' (workers)' : r0; if (!ri.has(rn)) { ri.set(rn, repos.length); repos.push(rn) }
            evs.push([m, X.names[e[1]], 'x', e[2].map(i => X.names[i]), e[4], ri.get(rn)])
        }
        evs.sort((a, b) => a[0] - b[0])
    } catch { /* no other repositories read yet */ }
    const an = [...new Set(evs.map(e => e[1]))], tn = [...new Set(evs.flatMap(e => e[3]))]
    const a2 = new Map(an.map((x, i) => [x, i])), t2 = new Map(tn.map((x, i) => [x, i]))
    return { 'people/angelo/app/live.json': JSON.stringify({ built_at: d.built_at, version: d.version, from: R.from, repos, agents: an, targets: tn, events: evs.map(e => [e[0], a2.get(e[1]), e[2], e[3].map(n => t2.get(n)), e[4], e[5]]) }) }
}
