# The Agents board: the addition to `data.mjs`, for Jose's yes

By `designer@web-summit.jose`, 8 November 2026, for the task `people/jose/tasks/2026-11-07-designer-agents-board.md` (C31, C33). **Not applied.** `people/jose/app/data.mjs` is code the build runs (WS-133), so it waits on Jose's yes on his Actions list. Once he says yes, it applies in minutes.

## What it adds

The board at the top of Jose's command centre (in `people/jose/app/app.js`, live) already shows each agent's last run, next run and "on demand". Three columns need three repository files that the browser cannot list:

| Column | Read at build time from |
|---|---|
| **Doing now** | `people/jose/tasks/*.md`: `for:` names the agent, `status: open` or `picked`. A file for several agents shows only for those with no `## Report (<agent>, ...)` yet. |
| **Waiting on me** (a count, linked to his Actions) | `people/jose/dashboard.md`, section `## Actions {#actions}`: rows naming the agent by its full name (`dev@web-summit.jose`, never "dev"). No item numbers copied. |
| **Red** | waiting on Jose (above), or a task file `status: blocked` (its `blocked:` line or `## Blocked` paragraph is the reason shown), or an open action naming it in `people/jose/watcher/actions.json`. |

No network, no new collector, no token or address: three files that are already in the repository.

## The change, exactly

In `people/jose/app/data.mjs`, add this function (it uses the `fs` and `path` imports the file already has):

```js
// the Agents board's data (task 2026-11-07, C31): three repository files read at build time, nothing else, no network
function agentsBoard(root) {
    const ME = /^[a-z0-9-]+@web-summit\.jose$/
    const read = rel => { try { return fs.readFileSync(path.join(root, rel), 'utf8') } catch { return '' } }
    const out = { doing: {}, blocked: {}, waits: {}, failing: {}, source: ['people/jose/tasks/*.md', 'people/jose/watcher/actions.json', 'people/jose/dashboard.md#actions'] }
    const add = (k, agent, v) => (out[k][agent] || (out[k][agent] = [])).push(v)

    // 1. task files: for: names the agent, status open or picked (doing now) or blocked (with its reason); a file for several
    //    agents shows only for those with no Report yet (a "## Report (<agent>, ...)" heading names the agent that reported)
    let files = []
    try { files = fs.readdirSync(path.join(root, 'people/jose/tasks')).filter(f => /\.md$/.test(f) && f !== 'README.md') } catch {}
    for (const f of files) {
        const t = read(`people/jose/tasks/${f}`), m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
        if (!m) continue
        const meta = Object.fromEntries(m[1].split('\n').map(l => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()]).filter(([k]) => k))
        const status = (meta.status || 'open').toLowerCase(), forList = (meta.for || '').split(/,\s*/).map(s => s.trim()).filter(s => ME.test(s))
        if (!['open', 'picked', 'blocked'].includes(status) || !forList.length) continue
        const title = ((m[2].match(/^# (.+)$/m) || [])[1] || f).replace(/^For [^:]+:\s*/, '')
        const reported = new Set([...m[2].matchAll(/^## Report \(([a-z0-9-]+@web-summit\.jose)/gm)].map(x => x[1]))
        const singleDone = forList.length === 1 && /^## Report\s*$/m.test(m[2]) && /^## Report\s*\n+\S/m.test(m[2])
        for (const agent of forList) {
            if (reported.has(agent) || singleDone) continue
            if (status === 'blocked') add('blocked', agent, { file: `people/jose/tasks/${f}`, reason: meta.blocked || ((m[2].match(/^## Blocked\s*\n+(.+)$/m) || [])[1]) || 'no reason given' })
            else add('doing', agent, { file: `people/jose/tasks/${f}`, title, status, due: meta.due || '' })
        }
    }

    // 2. the watcher's open actions that name one of Jose's agents (red: "the watcher's latest names it as failing")
    try {
        const W = JSON.parse(read('people/jose/watcher/actions.json') || '{}')
        for (const a of W.actions || []) if (a.status === 'open' && ME.test(a.agent || '')) add('failing', a.agent, { id: a.id, seen: a.seen || '' })
    } catch {}

    // 3. Jose's Actions (people/jose/dashboard.md, ## Actions {#actions} to the next ## heading): rows that name the agent by its
    //    FULL name count as "waiting on me" (a short name like "dev" also matches other people's dev agents); no numbers copied
    const md = read('people/jose/dashboard.md'), s = md.indexOf('## Actions {#actions}')
    if (s >= 0) {
        const rest = md.slice(s + 1), e = rest.search(/^## /m), sec = e >= 0 ? rest.slice(0, e) : rest
        for (const row of sec.split('\n').filter(l => /^\|\s*\d+\s*\|/.test(l)))
            for (const agent of new Set([...row.matchAll(/\b([a-z0-9-]+@web-summit\.jose)\b/g)].map(x => x[1]))) out.waits[agent] = (out.waits[agent] || 0) + 1
    }
    return out
}
```

and one line in `build()`, after `d.summit_days = summitDays(root)`:

```js
    d.agentsBoard = agentsBoard(root)
```

That is all. `app.js` already reads `D.agentsBoard` when it is there: the three columns fill in, the light turns red with "Needs you" and its reason, and the note "these wait on Jose's yes" goes away.

## Checked

- **Run on the repository on 8 November (16:50 UTC):**
  - doing now: two task files for the designer (one door, and this board), one for the watcher (A-06), one for sales-coach (one door);
  - waiting on Jose: crm 3, vault 2, watcher 2, designer 2, dev 2, conductor 1;
  - nothing blocked, and no open watcher action for his agents.
- **In the browser, with that output added to a local `data.json`** (never committed): the board shows both columns and turns red for those agents, with no page overflow at 390 px. Without it, the board shows the note, as it does on the site now.
- **One thing to know:** a row counts as "waiting on me" by full agent name, so the conductor's rows for an agent must name it in full, as the task says it does (C31, rule 5).
