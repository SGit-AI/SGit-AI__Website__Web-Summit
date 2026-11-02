// Everything on the team, counted (WS-95): every person, every agent, every channel. Deterministic: agents come from
// three places, merged: the roster (data/team.json, each person's "agents"), what each person's agents declare
// (people/<id>/agents.json: [{name, job, schedule?, session?}]), and the git log (every "<agent>@web-summit.<person>"
// that ever committed, with its first and last commit and how many). Nobody has to remember to register.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

export function inventory(ROOT, teamData) {
    const people = teamData.members.filter(m => m.kind === 'human')
    const agents = new Map()
    const add = (name, extra) => { const [a, p] = name.split('@web-summit.'); if (!p) return; const cur = agents.get(name) || { name, agent: a, person: p, commits: 0, first: '', last: '', declared: false, job: '', schedule: '' }; agents.set(name, { ...cur, ...Object.fromEntries(Object.entries(extra).filter(([, v]) => v !== undefined && v !== '')) }) }
    for (const m of people) for (const n of m.agents || []) add(n, { declared: true })
    for (const m of people) { const f = path.join(ROOT, 'people', m.id, 'agents.json'); if (fs.existsSync(f)) for (const a of JSON.parse(fs.readFileSync(f, 'utf8'))) add(a.name, { declared: true, job: a.job, schedule: a.schedule, session: a.session }) }
    try {
        const raw = execFileSync('git', ['log', '--format=%cI%x1f%s%x1f%b%x1e'], { cwd: ROOT, maxBuffer: 64 << 20 }).toString()
        for (const rec of raw.split('\x1e').map(r => r.trim()).filter(Boolean).reverse()) {
            const [at, s, b] = rec.split('\x1f')
            if (/^site v[0-9]/.test(s)) continue                                   // CI's release commits repeat the subject
            const names = new Set([...(`${s}\n${b || ''}`).matchAll(/(?:^|\n|Agent: )([a-z0-9-]+@web-summit\.[a-z0-9-]+)(?=:|\s|$)/g)].map(x => x[1]))
            for (const n of names) { const cur = agents.get(n); add(n, { commits: (cur?.commits || 0) + 1, first: cur?.first || at.slice(0, 16).replace('T', ' '), last: at.slice(0, 16).replace('T', ' ') }) }
        }
    } catch { /* no history in this checkout: the roster and the declarations still count */ }
    const channels = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/channels.json'), 'utf8')).channels
    return { people, agents: [...agents.values()].filter(a => people.some(p => p.id === a.person)).sort((a, b) => a.person.localeCompare(b.person) || a.agent.localeCompare(b.agent)), channels }
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
