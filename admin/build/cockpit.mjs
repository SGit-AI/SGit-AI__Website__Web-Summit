// A person's cockpit (Dinis, 5 November 2026: "this should be my first dashboard ... the key decisions, what I need to
// know, what's happening ... a very good way to make those decisions ... prioritize ... delegate"). Opt-in: a person's
// people/<id>/dashboard.md with `layout: cockpit` in its front matter gets a full-width page (no rail) whose top is
// built here, at every release, as people/<id>/dashboard.json, and drawn by assets/cockpit.js. Written by
// dashboard@web-summit.dinis. Deterministic from the repository: the board, data/meetings/, the git log, the roster.
//
// The ranking (WS-151): first what only this person can do (a board issue with `only: <id>`), ranked by how many
// people it blocks (`blocks:`), then the open decisions for them on the stand-up agenda, scored by: blocks someone,
// overdue, marked urgent, waiting longest, and decisions before questions. Each item says why it is where it is.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { clipWords } from './text.mjs'

const split = v => String(v || '').split(',').map(x => x.trim()).filter(Boolean)
const DAY = 864e5
// "Wed 4 Nov, 12:00" -> a time (Lisbon is UTC in November); null when there is no date
export const dueAt = s => { const m = String(s || '').match(/(\d{1,2}) Nov(?:[^0-9]*(\d{1,2}):(\d{2}))?/); return m ? Date.UTC(2026, 10, +m[1], m[2] ? +m[2] : 23, m[3] ? +m[3] : 59) : null }
const hours = ms => Math.round(ms / 36e5)
const REPO = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit'
// the git log once per build: subject, body and hash, to find the commits that mention an issue (the evidence)
let LOG = null
const gitLog = ROOT => LOG ??= (() => { try { return execFileSync('git', ['log', '-n', '4000', '--format=%h%x1f%cI%x1f%s%x1f%b%x1e'], { cwd: ROOT, maxBuffer: 64 << 20 }).toString().split('\x1e').map(l => l.trim()).filter(Boolean).map(l => { const [h, at, s, b] = l.split('\x1f'); return { h, at, s, b: b || '' } }).filter(c => !/^site v[0-9]/.test(c.s)) } catch { return [] } })()
// the card kinds: data/cards/<kind>.json, one JSON module each (see data/cards/README.md)
const kinds = ROOT => { const d = path.join(ROOT, 'data/cards'); return fs.existsSync(d) ? Object.fromEntries(fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => [f.replace(/\.json$/, ''), JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'))])) : {} }

export function cockpit({ ROOT, id, teamData, ISSUES, MEET, INV, OB, VERSION, now = Date.now() }) {
    const people = teamData.members.filter(m => m.kind === 'human')
    const me = people.find(p => p.id === id)
    const issue = Object.fromEntries(ISSUES.issues.map(x => [x.id, x]))
    const open = x => !/^(done|closed)/i.test(x.status || '')
    const cfgF = path.join(ROOT, 'people', id, 'cockpit.json')
    const cfg = fs.existsSync(cfgF) ? JSON.parse(fs.readFileSync(cfgF, 'utf8')) : {}

    // ---- only you can do this: board issues with `only:` naming this person ----
    const onlyYou = ISSUES.issues.filter(x => open(x) && split(x.only).includes(id)).map(x => {
        const d = dueAt(x.due), blocks = split(x.blocks)
        return { id: x.id, title: x.title, action: x.action || '', link: x.link || '', due: x.due || '', late: d != null && d < now, ref: `board/${x.file}`,
            score: 60 + blocks.length * 20 + (d != null && d < now ? 25 : 0), score_parts: [['only you can do it', 60], ...(blocks.length ? [[`blocks ${blocks.join(', ')}`, blocks.length * 20]] : []), ...(d != null && d < now ? [['overdue', 25]] : [])],
            blocks, waiting_h: d != null && d < now ? hours(now - d) : 0, file: `board/${x.file}`, why: [blocks.length ? `blocks ${blocks.join(', ')}` : '', d != null && d < now ? `${Math.max(1, hours(now - d))} h overdue` : ''].filter(Boolean).join(' · ') || 'only you can do it' }
    }).sort((a, b) => b.blocks.length - a.blocks.length || b.waiting_h - a.waiting_h)

    // ---- the decisions: every open decision or question for this person, on any agenda, deduplicated ----
    const seen = new Set(), decisions = []
    for (const s of MEET.all) for (const it of MEET.items(s.id)) {
        if (it.status !== 'open' || !['decision', 'question'].includes(it.type) || !(it.for || []).includes(id)) continue
        const key = it.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
        if (seen.has(key)) continue
        seen.add(key)
        const iss = it.issue && issue[it.issue], due = iss ? dueAt(iss.due) : null, added = Date.parse(it.added || s.at)
        const blocks = iss ? split(iss.blocks) : [], others = (it.for || []).filter(p => p !== id && p !== 'everyone')
        const urgent = /urgent|^today\b|tonight/i.test(it.title)
        const score = (iss && split(iss.only).includes(id) ? 60 : 0) + blocks.length * 20 + (due && due < now ? 25 : 0) + (urgent ? 20 : 0)
            + Math.min(30, (now - added) / 36e5 / 2) + (it.type === 'decision' ? 5 : 0)
            + (it.priority ? (it.priority.set === 'now' ? 100 : -100) : 0)
        const why = [it.priority ? (it.priority.set === 'now' ? 'you said: do this first' : 'you said: later') : '', blocks.length ? `blocks ${blocks.join(', ')}` : '', due && due < now ? `${it.issue} overdue` : '', urgent ? 'marked urgent' : '', `waiting ${now - added > 2 * DAY ? Math.round((now - added) / DAY) + ' days' : Math.max(1, hours(now - added)) + ' h'}`].filter(Boolean).join(' · ')
        decisions.push({ ref: it.file, type: it.type, title: it.title, detail: it.detail || '', options: it.options || [], recommend: it.recommend || '',
            by: it.by || '', for: it.for || [], with: others, issue: it.issue || '', added: it.added || s.at, first_meeting: s.id, score: Math.round(score), why, blocks,
            score_parts: [...(iss && split(iss.only).includes(id) ? [['only you can do it', 60]] : []), ...(blocks.length ? [[`blocks ${blocks.join(', ')}`, blocks.length * 20]] : []), ...(due && due < now ? [[`${it.issue} overdue`, 25]] : []), ...(urgent ? [['marked urgent', 20]] : []), [`waiting ${Math.round((now - added) / 36e5)} h`, Math.round(Math.min(30, (now - added) / 36e5 / 2))], ...(it.type === 'decision' ? [['a decision', 5]] : []), ...(it.priority ? [[it.priority.set === 'now' ? 'you said: do this first' : 'you said: later', it.priority.set === 'now' ? 100 : -100]] : [])] })
    }
    decisions.sort((a, b) => b.score - a.score)

    // ---- every card's evidence, metadata, side effects and relationships (Dinis, 5 November: "what is the metadata?
    // what do I need? what is the evidence? ... the side effects and the graph of relationships") ----
    const K = kinds(ROOT), log = gitLog(ROOT), agendaOf = new Map()
    for (const s of MEET.all) for (const it of MEET.items(s.id)) for (const w of new Set([it.issue, ...(`${it.title} ${it.detail || ''}`.match(/WS-\d+/g) || [])].filter(Boolean))) { if (!agendaOf.has(w)) agendaOf.set(w, []); agendaOf.get(w).push({ meeting: s.id, title: it.title, type: it.type, status: it.status, by: it.by || '', ref: it.file }) }
    const issueBox = x => x && { id: x.id, title: x.title, status: x.status || 'open', due: x.due || '', for: x.for, picked_by: x.picked_by || '', area: x.area || '', body: (x.done || '').slice(0, 900), agents: x.agents || '', url: `${REPO}/blob/dev/board/${x.file}` }
    const commitsOf = w => w ? log.filter(c => new RegExp(`\\b${w}\\b`).test(c.s + ' ' + c.b)).slice(0, 6).map(c => ({ h: c.h, at: c.at, s: clipWords(c.s, 160), url: `${REPO}/commit/${c.h}` })) : []
    const params = x => Object.fromEntries(Object.entries(x || {}).filter(([k]) => k.startsWith('card_')).map(([k, v]) => [k.slice(5), String(v).replace(/^"|"$/g, '')]))
    function enrich(item, iss, kindName, extra = {}) {
        const w = iss ? iss.id : item.issue || '', text = `${item.title} ${item.detail || ''} ${iss ? iss.done || '' : ''}`
        const related = [...new Set(text.match(/WS-\d+/g) || [])].filter(r => r !== w && issue[r]).slice(0, 8).map(r => ({ id: r, title: issue[r].title, status: issue[r].status || 'open' }))
        const kind = K[kindName] ? kindName : (item.type === 'question' ? 'question' : 'decision')
        const p = { issue: w, issue_url: iss ? `${REPO}/blob/dev/board/${iss.file}` : '', repo_url: REPO, meeting: item.first_meeting || '', ...params(iss), ...extra }
        const agenda = (agendaOf.get(w) || []).filter(a => a.ref !== item.ref).slice(0, 6)
        const by = item.by || (iss && (iss.agents || '').match(/([a-z0-9-]+@web-summit\.[a-z0-9-]+)/) || [])[1] || ''
        const graph = { nodes: [{ id: 'me', label: w || 'this', kind: 'item' }], edges: [] }
        const node = (nid, label, k, rel) => { if (!graph.nodes.some(n => n.id === nid)) graph.nodes.push({ id: nid, label, kind: k }); graph.edges.push({ from: 'me', to: nid, rel }) }
        for (const b of item.blocks || []) node('p:' + b, b, 'person', 'blocks')
        if (by) node('a:' + by, by.split('@')[0] + '.' + by.split('.').pop(), 'agent', 'asked by')
        for (const x of item.with || []) node('p:' + x, x, 'person', 'with')
        for (const r of related) node('i:' + r.id, r.id, /^(done|closed)/i.test(r.status) ? 'done' : 'issue', 'mentions')
        for (const a of agenda.slice(0, 3)) node('m:' + a.ref, a.title.slice(0, 28), 'meeting', a.status === 'open' ? 'also on the agenda' : a.status)
        return { ...item, kind, params: p, evidence: { issue: issueBox(iss), agenda, commits: commitsOf(w), related, by }, graph }
    }
    const onlyCards = onlyYou.map(x => { const iss = issue[x.id]; return enrich({ ...x, by: '' }, iss, iss.card || 'only-you') })
    const decCards = decisions.map(x => enrich(x, x.issue && issue[x.issue], x.type))

    // ---- who can take a delegated decision: the people who can push, and their conductors ----
    const delegates = people.filter(p => p.id !== id && (OB.onboard(p.id).level || 0) >= 2).map(p => ({ id: p.id, name: p.name, first: p.name.split(' ')[0], agent: `conductor@web-summit.${p.id}`, role: p.role || '' }))

    // ---- what is happening: this person's agents, the team's agents, the machine ----
    const history = MEET.log(new Date(now - 7 * DAY).toISOString())
    const lastOf = name => history.find(h => h.s.startsWith(name + ':'))
    const agent = a => { const l = lastOf(a.name); const t = l ? Date.parse(l.at) : null; return { name: a.name, short: a.name.split('@')[0], person: a.person, job: a.job || '', schedule: a.schedule || '', commits: a.commits || 0, last_at: l ? l.at : null, last: l ? l.s.slice(a.name.length + 1).trim() : '', idle_h: t ? hours(now - t) : null } }
    const mine = INV.agents.filter(a => a.person === id).map(agent).sort((a, b) => (a.idle_h ?? 1e9) - (b.idle_h ?? 1e9))
    const team = INV.agents.filter(a => a.person !== id && a.commits).map(agent).filter(a => a.last_at).sort((a, b) => a.idle_h - b.idle_h)
    const midnight = new Date(now); midnight.setUTCHours(0, 0, 0, 0)
    const today = MEET.log(midnight.toISOString()), day = MEET.log(new Date(now - DAY).toISOString())
    const ack = MEET.ack(id), since = ack ? MEET.log(ack.acknowledged_at) : day
    const openIssues = ISSUES.issues.filter(open), late = openIssues.filter(x => { const d = dueAt(x.due); return d != null && d < now })
    const reviews = (() => { const d = path.join(ROOT, 'team/security/reviews'); return fs.existsSync(d) ? fs.readdirSync(d).filter(f => /^\d{4}-.*\.md$/.test(f)).sort() : [] })()
    const levels = people.map(p => ({ id: p.id, first: p.name.split(' ')[0], level: OB.onboard(p.id).level || 0 }))
    const nx = MEET.next()

    return {
        built_at: new Date(now).toISOString(), version: VERSION, person: { id, name: me.name, first: me.name.split(' ')[0] },
        lane: { agent: cfg.lane || `dashboard@web-summit.${id}`, drained: cfg.drained || 'at every wake of the dashboard agent' },
        standup: { id: nx.id, at: nx.at, briefing: `../../meetings/${nx.id}/${id}/index.html`, agenda: `../../meetings/${nx.id}/index.html` },
        only_you: onlyCards, decisions: decCards, delegates, kinds: K,
        agents: { mine, team: team.slice(0, 12), team_active_24h: team.filter(a => a.idle_h < 24).length, team_total: INV.agents.filter(a => a.person !== id).length },
        health: {
            version: VERSION, releases_today: today.filter(x => x.release).length, commits_today: today.filter(x => !x.release).length,
            commits_24h: day.filter(x => !x.release).length, since: { from: ack ? ack.acknowledged_at : null, releases: since.filter(x => x.release).length, commits: since.filter(x => !x.release).length },
            last_release: (history.find(x => x.release) || {}).at || null,
            board: { open: openIssues.length, late: late.length, unowned: openIssues.filter(x => !x.picked_by).length, done: ISSUES.issues.length - openIssues.length },
            security_review: reviews.length ? reviews[reviews.length - 1].replace(/\.md$/, '') : null,
        },
        setup: levels,
        // what the dashboard agent did with each action sent from the cockpit, by id (admin/tools/cockpit_apply.mjs)
        processed: (() => { const f = path.join(ROOT, 'people', id, 'cockpit-log.json'); return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')).entries || []).filter(e => e.uid && Date.parse(e.applied_at) > now - 7 * DAY) : [] })(),
        milestones: cfg.milestones || [],
        links: cfg.links || [],
    }
}

// the no-JavaScript version, and the markdown twin: the same data as text
export function cockpitMd(D) {
    const b = s => String(s).replace(/\|/g, '/')
    return [`**${D.only_you.length} only you can do · ${D.decisions.length} decisions waiting · ${D.health.board.late} issues overdue.** Next stand-up: [${D.standup.id}](${D.standup.briefing}). Built ${D.built_at.slice(0, 16).replace('T', ' ')} UTC (${D.version}).`,
        `## Only you can do this {#only-you}`, `[Focus on these, one at a time](focus/only-you/index.html)`, D.only_you.length ? D.only_you.map((x, i) => `${i + 1}. **${x.id}: ${b(x.title)}.** ${b(x.action)} *(${x.why})*`).join('\n') : 'Nothing: no open issue is marked `only:` for you.',
        `## Decide {#decide}`, `[Focus on these, one at a time](focus/decide/index.html)`, D.decisions.map((x, i) => `${i + 1}. **${b(x.title)}**${x.issue ? ` (${x.issue})` : ''}. ${x.recommend ? `Recommended: ${b(x.recommend)}. ` : ''}*${x.why}; from ${x.by}.*`).join('\n'),
        `## Your agents {#agents}`, D.agents.mine.map(a => `- \`${a.name}\`: ${a.last_at ? `${a.idle_h} h ago, ${b(a.last)}` : 'no commit in the last week'}`).join('\n'),
        `## The machine {#health}`, `- ${D.health.releases_today} releases and ${D.health.commits_today} commits today; ${D.health.board.open} issues open, ${D.health.board.late} overdue, ${D.health.board.unowned} unowned; last security review ${D.health.security_review || 'none'}.`,
    ].join('\n\n')
}
