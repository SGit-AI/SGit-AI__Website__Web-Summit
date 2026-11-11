// people/angelo/pipeline/how-it-works/index.html: the pipeline explained in eight pictures (item b4-how-it-works,
// Angelo, 11 November 2026). Its one source is page.fragment beside this file (a <style> and the markup, no script);
// this file only places it in the site's page, through people/angelo/pages.mjs.
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'people/angelo/pipeline/how-it-works/page.fragment'

export function pages(ROOT) {
    const f = path.join(ROOT, SRC)
    if (!fs.existsSync(f)) return []
    const raw = fs.readFileSync(f, 'utf8')
    const style = (raw.match(/<style>[\s\S]*?<\/style>/) || [''])[0]
    const body = raw.replace(style, '').trim()
    const title = 'How Angelo\'s pipeline works, in eight pictures'
    const description = 'Who is who, the flow of one piece of work, what is in each prompt, session-less workers, retired schedules, project managers, tracking, and the handover market.'
    const md = `Angelo says it once; conductor.b@ routes it; a fresh worker does each step on its own branch (pool/<id>); the work is reviewed onto dev, and nothing public goes out without Angelo's go.

1. **Who is who.** Angelo decides. conductor.b@ routes and never builds. One project manager per project (<project>.pm@PrompTugal.angelo) starts its own workers. Workers are 20 session-less slots, 10 large and 10 small; a large step never goes to a small slot. Scheduled helpers: digest.b@ hourly, accountant.b@ every 4 hours. conductor.fringe@ is the Lisbon Fringe's lead in Dinis's swarm.
2. **The flow of one piece of work.** Angelo's note, intake (brief.md), then one worker per step (research, draft, check, design, build, spec), Angelo's go before anything public, publish and share, review onto dev, live. Example, b0-library on 11 November (UTC): intake 10:55 to 11:00, the spec by alpha.large.worker@ 11:09 to 11:13 (3 commits, 1.40 USD), review onto dev 11:30 to 11:35: 40 minutes.
3. **What is in each prompt.** The common preamble (11 steps) + one role + skills from a library of 14 + the four always on (privacy, plain-language, token-thrift, trace) + one of 5 formats + the slot's name. The prompt is the agent. Files: people/angelo/pipeline/ROLES.md, skills/, formats/.
4. **Session-less.** A fresh session per step, never a second message; context starts empty each time; any free slot of the right size takes any step; archived once its commits are in. The record is the commits.
5. **Schedules retired.** On 8 November nine scheduled workers made 67 runs, at least 9 with nothing to do, about 106 thousand tokens each before cache reads. Now workers start on demand. Still scheduled: digest.b@ every hour at :58, accountant.b@ every 4 hours at :58, conductor.fringe@ hourly until Friday 13 November. Account A's scheduled agents are stopped.
6. **Project managers.** One place per project for Angelo; the conductor stays free to route. A PM starts from a brief (goal, done when, budget, skills), plans, starts its workers, keeps the project's STATE.md, and retires with a debrief (delivered, lessons, cost).
7. **Everything tracked.** Every step and sub-agent is a commit with Agent:, Role:, Item: and For: trailers. Cost per worker run, USD API-equivalent (runs.md): b2 research 2.10, b1 spec 1.54, b0 spec 1.40, b3 first try 0.71 (stopped by the usage limit), accountant baseline 0.11. Tokens are in people/angelo/ledger/.
8. **When usage runs short (proposed).** The handover market: offer, claim (first conductor with an estimated headroom of 1.5 times the cost), run (first commit within 10 minutes or the claim lapses), return (commits on pool/<id>). Why: account B hit its 5-hour limit about 13:35 on 11 November and lost a run. Spec: people/angelo/pipeline/b3-team-offers/spec-handover-market.md.`
    return [{ rel: 'people/angelo/pipeline/how-it-works/index.html', title, description, md, head: style, body }]
}
