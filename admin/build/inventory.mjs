// Everything on the team, counted (WS-95): every person, every agent, every channel. Deterministic: agents come from
// three places, merged: the roster (data/team.json, each person's "agents"), what each person's agents declare
// (people/<id>/agents.json: [{name, job, schedule?, session?}]), and the git log (every "<agent>@web-summit.<person>"
// that ever committed, with its first and last commit and how many). Nobody has to remember to register.
import fs from 'fs'
import path from 'path'
import { history } from './gitlog.mjs'

// an agent's name: <agent>@<team>.<person>, for web-summit and any other team (PrompTugal, 6 November), its person on the roster
// (proposed by dev@web-summit.angelo for its keeper, 6 November: the maps were missing every @PrompTugal.<person> agent)
// a role may carry a mode (desk.conductor@PrompTugal.angelo, runner.conductor@…, 6 November)
const NAME = /^([a-z0-9][a-z0-9.-]*)@([A-Za-z][A-Za-z0-9-]*)\.([a-z0-9-]+)$/
const NAME_IN_TEXT = /(?:^|\n|Agent: )([a-z0-9][a-z0-9.-]*@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+)(?=:|\s|$)/g
// how an agent runs, from what its agents.json entry says: a fresh session each run, a scheduled wake into its own session,
// or a long session with no schedule; '' when nothing is declared
export function agentKind(session = '', schedule = '') {
    if (/\b(fresh|new) (claude code )?session (for )?(each|every)( run)?|a new session each|fresh session/i.test(`${session} ${schedule}`)) return 'fresh'
    if (/\bcron\b|\b\d{1,2}:\d{2}\b|hourly|every (two|three|\d+) hours/i.test(schedule) && !/^\s*(paused|proposed|none|no scheduled)/i.test(schedule)) return 'scheduled'
    return session ? 'long' : ''
}

export function inventory(ROOT, teamData) {
    const people = teamData.members.filter(m => m.kind === 'human')
    const roster = new Set(people.map(p => p.id))
    const agents = new Map(), alias = new Map()   // keys are lower case: git subjects and agents.json differ in case (PrompTugal)
    const key = n => String(n).toLowerCase()
    const add = (name, extra) => {
        const k = alias.get(key(name)) || key(name), m = (agents.get(k)?.name || name).match(NAME); if (!m) return
        const person = m[3].toLowerCase(); if (!roster.has(person)) return
        const cur = agents.get(k) || { name: agents.get(k)?.name || name, agent: m[1], team: m[2], person, commits: 0, first: '', last: '', declared: false, job: '', schedule: '', session: '', kind: '', aliases: [] }
        agents.set(k, { ...cur, ...Object.fromEntries(Object.entries(extra).filter(([, v]) => v !== undefined && v !== '')) })
    }
    for (const m of people) for (const n of m.agents || []) add(n, { declared: true })
    for (const m of people) {
        const f = path.join(ROOT, 'people', m.id, 'agents.json'); if (!fs.existsSync(f)) continue
        for (const a of JSON.parse(fs.readFileSync(f, 'utf8'))) {
            // a renamed agent (its entry says was: "<old name> until …") is one agent: the old name becomes its alias
            const was = (String(a.was || '').match(/^([a-z0-9-]+@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+)/) || [])[1]
            if (was) { const old = agents.get(key(was)); alias.set(key(was), key(a.name)); agents.delete(key(was)); if (old) add(a.name, { commits: old.commits, first: old.first, last: old.last }) }
            add(a.name, { name: a.name, declared: true, job: a.job, schedule: a.schedule, session: a.session, kind: agentKind(a.session, a.schedule), aliases: was ? [was] : undefined })
        }
    }
    try {
        for (const { at, s, b } of [...history(ROOT)].reverse()) {
            if (/^site v[0-9]/.test(s)) continue                                   // CI's release commits repeat the subject
            const names = new Set([...(`${s}\n${b || ''}`).matchAll(NAME_IN_TEXT)].map(x => alias.get(key(x[1])) || key(x[1])))
            for (const k of names) { const cur = agents.get(k), n = cur ? cur.name : [...(`${s}\n${b || ''}`).matchAll(NAME_IN_TEXT)].map(x => x[1]).find(x => key(x) === k); if (!n) continue; add(n, { commits: (cur?.commits || 0) + 1, first: cur?.first || at.slice(0, 16).replace('T', ' '), last: at.slice(0, 16).replace('T', ' ') }) }
        }
    } catch { /* no history in this checkout: the roster and the declarations still count */ }
    const channels = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/channels.json'), 'utf8')).channels
    return { people, agents: [...agents.values()].sort((a, b) => a.person.localeCompare(b.person) || a.agent.localeCompare(b.agent) || a.team.localeCompare(b.team)), channels }
}

export function inventoryMd(INV, onboard, LEVELS) {
    const { people, agents, channels } = INV
    const connected = people.filter(p => (onboard(p.id).level || 0) > 0)
    const active = agents.filter(a => a.commits > 0)
    const prow = p => { const mine = agents.filter(a => a.person === p.id); return `| [${p.name}](../../people/${p.id}/index.html) | ${p.core ? 'one of the seven' : 'working with us'} | ${LEVELS[onboard(p.id).level || 0]} | ${mine.length} | ${mine.filter(a => a.commits).length} |` }
    const arow = a => `| \`${a.name}\` | ${a.person} | ${a.commits ? 'active' : a.declared ? 'proposed (in the brief), not yet running' : 'seen'} | ${a.job || ''}${a.schedule ? ` (${a.schedule})` : ''} | ${a.commits} | ${a.last || 'not yet'} |`
    return `Every person, every agent and every channel on the team, counted from the data and the git log at build time, so nothing is lost as the team grows. An agent appears here the first time it commits, or as soon as its person declares it in \`people/<id>/agents.json\`.

- **${people.length} people**: ${people.filter(p => p.core).length} going to Lisbon, ${people.filter(p => !p.core).length} working with us; **${connected.length} connected** (past level 0).
- **${active.length} agents have committed**, and ${agents.length - active.length} more are proposed in the briefs but not running yet, across ${new Set(agents.map(a => a.person)).size} people's accounts.
- **${channels.length} channels.**

## People {#people}

| Person | | Level | Agents | Active |
|---|---|---|---|---|
${people.map(prow).join('\n')}

## Agents {#agents}

| Agent | Person | State | Job | Commits | Last commit (UTC) |
|---|---|---|---|---|---|
${agents.map(arow).join('\n')}

## Channels {#channels}

| Channel | Kind | For | Purpose | Status |
|---|---|---|---|---|
${channels.map(c => `| ${c.name} | ${c.kind} | ${c.for} | ${c.purpose} | ${c.status} |`).join('\n')}

Kept by the conductor (\`data/channels.json\`); each person's agents keep \`people/<id>/agents.json\`.`
}

// the built part of a person's dashboard: their agents, as the inventory sees them
export function myAgentsMd(INV, id) {
    const mine = INV.agents.filter(a => a.person === id)
    return mine.length ? mine.map(a => `- \`${a.name}\`${a.job ? `: ${a.job}` : ''}. ${a.commits ? `${a.commits} commits, last ${a.last} UTC` : 'no commits yet'}.`).join('\n') : 'None yet. When your first agent commits, it appears here; or declare them in `people/<you>/agents.json`.'
}
