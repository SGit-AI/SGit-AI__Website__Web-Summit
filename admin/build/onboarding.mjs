// Getting connected, the workflow the team settled on on 2 November 2026 (Dinis's memo of the evening): a RiskMandate
// Google Workspace email, the Claude team account on it, a GitHub account with push here, then a conductor agent, a
// dashboard agent and published agent keys, then agents on a schedule, then the vaults. A person's level is computed
// from the steps done, never typed: the steps people do by hand come from people/<id>/onboarding.json, and the ones
// the repository can see are read from it (an agent's commits, the keys page). Deterministic.
import fs from 'fs'
import path from 'path'

export const STEPS = [
    ['workspace', 'Workspace email', 'manual'], ['claude', 'Claude (team)', 'manual'], ['github', 'GitHub account', 'manual'], ['repo', 'Can push', 'manual'],
    ['conductor', 'Conductor agent', 'auto'], ['dashboard', 'Dashboard agent', 'auto'], ['keys', 'Agent keys', 'auto'], ['schedule', 'On a schedule', 'both'], ['vault', 'Vaults', 'both']]
export const LEVELS = ['L0 not started', 'L1 Workspace email and Claude', 'L2 GitHub and push access', 'L3 a conductor agent running', 'L4 a dashboard agent and agent keys', 'L5 agents on a schedule', 'L6 the vaults: fully wired']
const GROUPS = [['workspace', 'claude'], ['github', 'repo'], ['conductor'], ['dashboard', 'keys'], ['schedule'], ['vault']]
const HOW = {
    workspace: 'log in to your RiskMandate Workspace email', claude: 'log in to the Claude team account with that email', github: 'create a GitHub account (with your Workspace email) and send Dinis the username',
    repo: 'accept the invitation to the repository', conductor: 'start your conductor agent with the prompt in your brief', dashboard: 'start your dashboard agent (the start page, step 5)',
    keys: 'have each agent make its key and publish the public half (the start page, step 6)', schedule: 'give your conductor and dashboard agents a schedule', vault: 'start your vault agent and publish your first vault (the vault agent page; the start page, step 8)'
}

export function onboarding(ROOT, getINV) {
    const keys = (() => { try { return JSON.stringify(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keys.json'), 'utf8')).keys.map(k => k.label)) } catch { return '' } })()
    const manual = id => { const f = path.join(ROOT, 'people', id, 'onboarding.json'); const o = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; const s = { ...(o.steps || {}) }; if (s.email && !s.workspace) s.workspace = s.email; if (s.pki && !s.keys) s.keys = s.pki; return { steps: s, updated: o.updated, notes: o.notes } }
    const onboard = id => {
        const m = manual(id), INV = getINV(), mine = INV.agents.filter(a => a.person === id)
        const auto = {
            conductor: mine.some(a => a.agent === 'conductor' && a.commits > 0),
            dashboard: mine.some(a => a.agent === 'dashboard' && a.commits > 0),
            keys: fs.existsSync(path.join(ROOT, 'people', id, 'key.json')) || keys.includes(`@web-summit.${id}`),
            schedule: mine.some(a => a.schedule) || m.steps.schedule === 'yes',
            // a published vault of their own (people/<id>/vaults.json, checked by the build), or the step recorded by hand
            vault: (() => { try { return (JSON.parse(fs.readFileSync(path.join(ROOT, 'people', id, 'vaults.json'), 'utf8')).vaults || []).length > 0 } catch { return false } })() || m.steps.vault === 'yes'
        }
        const steps = Object.fromEntries(STEPS.map(([k, , kind]) => [k, kind === 'manual' ? m.steps[k] === 'yes' : kind === 'auto' ? auto[k] || m.steps[k] === 'yes' : auto[k]]))
        let level = 0; for (const g of GROUPS) { if (g.every(k => steps[k])) level++; else break }
        const next = STEPS.find(([k]) => !steps[k])
        return { level, steps, done: Object.values(steps).filter(Boolean).length, next: next ? { step: next[1], how: HOW[next[0]] } : null, updated: m.updated, agents: mine.filter(a => a.commits > 0).length }
    }
    const table = (people, up) => ['| Person | Level | ' + STEPS.map(s => s[1]).join(' | ') + ' | Next |', '|---|---|' + STEPS.map(() => '---|').join('') + '---|',
        ...people.map(m => { const o = onboard(m.id); return `| [${m.name}](${up}people/${m.id}/index.html) | ${LEVELS[o.level]} | ${STEPS.map(([k]) => o.steps[k] ? 'yes' : '·').join(' | ')} | ${o.next ? `${o.next.step}: ${o.next.how}` : 'all done'} |` })].join('\n')
    const leaderboard = people => {
        const rows = people.map(m => ({ m, o: onboard(m.id) })).sort((a, b) => b.o.level - a.o.level || b.o.done - a.o.done || b.o.agents - a.o.agents)
        return `Who has set up what, ranked: the level first, then the steps done, then the agents running. A level is reached when every step before it is done. The steps people do by hand are recorded in \`people/<id>/onboarding.json\` (by them or their agent); the conductor agent, the dashboard agent and the agent keys are read from the repository, so they count the moment they happen.

| # | Person | Level | Steps done | Agents running | Next step |
|---|---|---|---|---|---|
${rows.map(({ m, o }, i) => `| ${i + 1} | [${m.name}](../../people/${m.id}/index.html) | ${LEVELS[o.level]} | ${o.done} of ${STEPS.length} | ${o.agents} | ${o.next ? `**${o.next.step}**: ${o.next.how}` : 'all done'} |`).join('\n')}

## Every step, for everyone {#steps}

${table(people, '../../')}

## The levels {#levels}

${LEVELS.map(l => `- **${l.slice(0, 2)}**${l.slice(2)}`).join('\n')}

How to do each step: [the start page](../../start/index.html#steps).`
    }
    return { onboard, table, leaderboard }
}
