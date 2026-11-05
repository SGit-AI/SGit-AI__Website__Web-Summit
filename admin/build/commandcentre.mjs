// The team's command centre: the data layer, made shared from Silvio's people/silvio/app/data.mjs by
// conductor@web-summit.dinis (3 November 2026). Reads only what is already public in this repository (board/WS-*.md,
// data/team.json, data/meetings/, people/<id>/, git history) and returns one JSON object, written by the build to
// people/<id>/app/data.json (generated, never committed). The front end is assets/cc/. Every person gets one; their
// agents may add people/<id>/app/config.json (workstreams, agents' jobs, extra decisions, prompts, mail searches,
// connectors), and a person's own people/<id>/app/data.mjs replaces all of this (Silvio's does).
// It invents nothing: a field the board does not have (priority, dependencies) is not made up here;
// the page derives urgency from the due date and says so.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'


export const frontMatter = t => {
    const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/), o = {}
    if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim() }
    return { meta: o, body: m ? m[2].trim() : t.trim() }
}

// "Wed 4 Nov", "Wed 4 Nov, 12:00", "daily from Tue 3 Nov": Lisbon is on UTC in November
export const dueAt = s => {
    const m = (s || '').match(/(\d{1,2}) Nov(?:[^0-9]*(\d{1,2}):(\d{2}))?/)
    if (!m) return null
    return new Date(Date.UTC(2026, 10, +m[1], m[2] ? +m[2] : 23, m[3] ? +m[3] : 59)).toISOString()
}

// the same rule as admin/build/inventory.mjs: an agent is named in the subject ("name: ...") or in an Agent: trailer
const AGENT_RE = /(?:^|\n|Agent: )([a-z0-9-]+@web-summit\.[a-z0-9-]+)(?=:|\s|$)/g

const git = (root, args) => { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 }) } catch { return '' } }
// the week's history, read once per build: the same for every person, and it was one git process each (dev@web-summit.dinis)
const WEEK = new Map(), week = root => { if (!WEEK.has(root)) WEEK.set(root, git(root, ['log', '--since=7 days ago', '--format=%x1e%H%x1f%cI%x1f%s%x1f%b'])); return WEEK.get(root) }

const DEFAULTS = {
    summit: { opening: '2026-11-09T18:00:00Z', label: 'Web Summit Lisbon: opening night Mon 9 Nov, conference Tue 10 to Thu 12 Nov', source: 'data/events.json' },
    standups: { times_utc: ['13:00', '18:00'], source: 'data/meetings/schedule.json' },
    agents: {}, decisions: [], funnels: [], prompts: {}, mail_searches: [['Web Summit threads', 'web summit']], connectors: {},
}
const AREA = { outreach: ['Outreach', 'outreach'], merch: ['Merch and print', 'procurement'], content: ['Content', 'video'], tech: ['Tech', 'dev'], pm: ['Running the team', 'conductor'], onboarding: ['Getting set up', 'blue'], riskmandate: ['RiskMandate', 'yellow'], operator: ['Operator', 'conductor'], friendly: ['Friendlies', 'local'], ops: ['Ops', 'slate'], idea: ['Ideas', 'slate'] }

export function build(root, person, now = new Date()) {
    const config = { ...DEFAULTS, ...(readJson(root, `people/${person}/app/config.json`) || {}) }
    const team = JSON.parse(fs.readFileSync(path.join(root, 'data/team.json'), 'utf8'))
    const me = team.members.find(m => m.id === person) || {}
    const version = (() => { try { return fs.readFileSync(path.join(root, 'admin/build/version.txt'), 'utf8').trim() } catch { return '' } })()

    // 1. the whole board, one file per issue
    // no workstreams in the config: one per board area among the issues named for this person
    if (!config.workstreams) {
        const named = fs.readdirSync(path.join(root, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).map(f => frontMatter(fs.readFileSync(path.join(root, 'board', f), 'utf8')).meta).filter(m => (m.for || '').split(/,\s*/).includes(person))
        const areas = [...new Set(named.map(m => m.area || 'other'))]
        config.workstreams = areas.map(a => ({ id: a, name: (AREA[a] || [a])[0], colour: (AREA[a] || [, 'slate'])[1], agent: '', issues: named.filter(m => (m.area || 'other') === a).map(m => m.id), with: '', goal: `The issues on the board in the area "${a}" named for you (grouped by the build; your agents can set workstreams in people/${person}/app/config.json).` }))
    }
    const streamOf = id => (config.workstreams.find(w => w.issues.includes(id)) || {}).id || null
    const issues = fs.readdirSync(path.join(root, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).map(f => {
        const { meta, body } = frontMatter(fs.readFileSync(path.join(root, 'board', f), 'utf8'))
        const forList = (meta.for || '').split(/,\s*/).map(s => s.trim()).filter(Boolean)
        return {
            id: meta.id, title: meta.title, area: meta.area || '', for: forList, due: meta.due || '', due_at: dueAt(meta.due),
            recurring: /daily|every/i.test(meta.due || ''), status: (meta.status || 'open').toLowerCase(), picked_by: meta.picked_by || '',
            agents: (meta.agents || '').replace(/\.$/, ''), body: body.slice(0, 1500), file: `board/${f}`,
            // named: the issue names the person; team: it is for everyone
            mine: forList.includes(person) || forList.includes('everyone'), named: forList.includes(person), stream: streamOf(meta.id) || (forList.includes('everyone') ? 'team' : null),
        }
    }).sort((a, b) => (a.due_at || '9').localeCompare(b.due_at || '9') || a.id.localeCompare(b.id, 'en', { numeric: true }))

    // 2. git history, the last 7 days: who committed what (release commits by CI are left out)
    const raw = week(root)
    const commits = raw.split('\x1e').filter(Boolean).map(c => {
        const [hash, at, subject, body] = c.split('\x1f')
        const names = [...new Set([...`${subject}\n${body || ''}`.matchAll(AGENT_RE)].map(x => x[1]))]
        return { hash: hash.slice(0, 7), at, subject, agents: names, release: /^site v\d/.test(subject), fors: [...(body || '').matchAll(/^For: (.+)$/gm)].map(m => m[1].trim()) }
    })
    const work = commits.filter(c => !c.release)
    const age = c => now - new Date(c.at)

    // 3. my agents: declared in data/team.json, plus the kit's dashboard agent; active = it has committed
    // "joined" = the onboarding notes record it joining, but it has not committed under its own name yet
    const notes = (readJson(root, `people/${person}/onboarding.json`) || {}).notes || ''
    const joined = name => new RegExp(`${name.replace(/[.@-]/g, '\\$&')}, joined`).test(notes)
    // ...and every agent the person's own people/<id>/agents.json declares (conductor@web-summit.jose, 5 November, at Jose's word)
    const own = (readJson(root, `people/${person}/agents.json`) || []).map(a => a && a.name).filter(n => typeof n === 'string' && n.endsWith(`@web-summit.${person}`))
    const declared = [...new Set([...(me.agents || []), ...own, `dashboard@web-summit.${person}`])]
    const agents = declared.map(name => {
        const short = name.split('@')[0], cfg = config.agents[short] || { colour: { conductor: 'conductor', dev: 'dev', dashboard: 'conductor', outreach: 'outreach', video: 'video', procurement: 'procurement' }[short] }, mine = work.filter(c => c.agents.includes(name))
        const status = mine.length ? 'active' : joined(name) ? 'joined' : 'proposed'
        return { name, short, colour: cfg.colour || 'slate', job: cfg.job || '', schedule: cfg.schedule || '', status, commits_24h: mine.filter(c => age(c) < 864e5).length, commits_7d: mine.length, last_at: mine[0]?.at || null, last_subject: mine[0]?.subject || '' }
    })

    // 4. the team's activity, last 48 hours, newest first (public commit subjects only)
    const activity = work.filter(c => age(c) < 2 * 864e5).slice(0, 60).map(c => ({ hash: c.hash, at: c.at, subject: c.subject.slice(0, 160), agent: c.agents[0] || '', mine: c.agents.some(a => a.endsWith(`.${person}`)) }))
    const messages = work.filter(c => age(c) < 2 * 864e5 && c.fors.some(f => f.includes(`web-summit.${person}`) || f === person)).map(c => ({ hash: c.hash, at: c.at, subject: c.subject.slice(0, 160), agent: c.agents[0] || '' }))

    const onboarding = readJson(root, `people/${person}/onboarding.json`) || {}
    // decisions waiting: every open decision item for this person on the stand-up agenda (one file per item), then the config's own
    const first = id => ((team.members.find(m => m.id === id) || {}).name || id).split(' ')[0]
    const MD = path.join(root, 'data/meetings')
    const agendaDecisions = fs.existsSync(MD) ? fs.readdirSync(MD).filter(d => /^\d{4}-/.test(d)).flatMap(d => fs.readdirSync(path.join(MD, d)).filter(f => f.endsWith('.json')).map(f => ({ ...readJson(root, `data/meetings/${d}/${f}`), meeting: d })))
        .filter(x => x.type === 'decision' && x.status === 'open' && (x.for || []).includes(person))
        .map(x => ({ who: first(person), what: x.title, issue: x.issue || '', since: x.added || `${x.meeting.slice(0, 10)}T00:00:00Z`, source: `meetings/${x.meeting}/index.html`, recommend: x.recommend || '' })) : []
    const decisions = [...agendaDecisions, ...config.decisions]
    return {
        about: `Built from the repository at build time: board/WS-*.md, data/team.json, data/meetings/, people/${person}/ and git history. Public, like the rest of the site.`,
        built_at: now.toISOString(), version, person: { id: person, name: me.name || person, role: me.role || '', owns: me.owns || [], status: me.status || '', ...(fs.existsSync(path.join(root, 'people', person, 'photo.jpg')) ? { photo: '../photo.jpg' } : {}) },
        summit: config.summit, standups: config.standups, workstreams: config.workstreams, decisions, funnels: config.funnels, prompts: config.prompts, mail_searches: config.mail_searches, connectors: config.connectors, ideas: config.ideas || '',
        // chat in the page (assets/cc/app.js): only where the person's config.json sets it; the key is never here
        llm: config.llm || null,
        links: config.links || [],
        // event mode (Silvio, 5 November): the summit's sessions and side events, already public on /summit/
        event: (() => { const E = readJson(root, 'data/events.json') || {}; return { read_on: E.read_on || '', sessions: E.sessions || [], side_events: E.side_events || [] } })(),
        onboarding: { level: onboarding.level ?? null, steps: onboarding.steps || {}, updated: onboarding.updated || '' },
        issues, agents, activity, messages,
        repo: 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit', branch: 'dev',
    }
}

function readJson(root, rel) { try { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')) } catch { return null } }

// the no-JavaScript fallback and the page's markdown twin: the same numbers, as text
export function summaryMd(d, now = new Date()) {
    const mine = d.issues.filter(i => i.named), open = mine.filter(i => i.status !== 'done')
    const overdue = open.filter(i => i.due_at && new Date(i.due_at) < now && !i.recurring)
    const rows = open.map(i => `| ${i.id} | ${i.title.replace(/\|/g, '/')} | ${i.due || 'no date'} | ${i.status} | ${i.picked_by || 'nobody yet'} |`)
    return [
        `${d.person.name}'s command centre: ${open.length} open issues named for ${d.person.name.split(' ')[0]} of ${mine.length} (plus ${d.issues.filter(i => i.mine && !i.named && i.status !== 'done').length} open for everyone), ${overdue.length} overdue, ${d.agents.filter(a => a.status === 'active').length} of ${d.agents.length} agents active. Data as of ${d.built_at.slice(0, 16).replace('T', ' ')} UTC (${d.version}).`,
        '',
        '## My open issues {#issues}',
        '',
        '| Issue | Title | Due | Status | Picked by |',
        '|---|---|---|---|---|',
        ...rows,
        '',
        '## Decisions I need {#decisions}',
        '',
        ...d.decisions.map(x => `- **${x.who}:** ${x.what}${x.issue ? ` (${x.issue})` : ''}`),
        '',
        '## My agents {#agents}',
        '',
        ...d.agents.map(a => `- **${a.name}** (${a.status}): ${a.job}${a.commits_7d ? `; ${a.commits_7d} commits this week` : ''}`),
        '',
        '[What changed in the command centre, day by day](../../../command-centre/index.html)',
    ].join('\n')
}
