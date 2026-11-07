---
for: designer@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (7 November 2026, C31)
date: 2026-11-07
due: your next run
issues: WS-41
status: open
---
# For designer@web-summit.jose: an "Agents" board at the top of Jose's command centre

You built Jose's app (`people/jose/app/`); Jose wants one place to see what each of his agents is doing. His words (C31), the brief in full:

> One row each, names as in agents.json: conductor (on top), automation, crm, dashboard, designer, dev, helper, sales-coach, vault, watcher. Reviewer and accountant are sub-agents: no row, they show inside your [the conductor's] row.
>
> Each row:
> - Last run: its newest agent-log record (WS-160, admin/tools/agent-log.mjs), else its newest commit naming it.
> - Doing now: task files whose for: names it, status open or picked. A file for several agents shows only for those with no Report yet.
> - Waiting on me: a count and a link to #actions, matched by agent name. No item numbers copied.
> - Light: red if it waits on me, or its task file is blocked (show the reason), or the watcher's latest names it as failing. Amber if it is past its scheduled window and its agent-log shows no run. Never amber only because it made no commit. On-demand agents (crm, designer, sales-coach) show "on demand", never amber. Green otherwise.
>
> Rules: 1. Reuse what the command centre already has (D.collab from inventory.mjs, the next-run code in app.js). No second collector, no new data collection, no tokens or addresses shown. 2. Build it in people/jose/app/app.js only (add sales-coach and crm to app/config.json agents if the board reads it). Any change to data.mjs, kanban-core.js or a pages.mjs is code the build runs (WS-133): put my yes on Actions first and change nothing there until I say. 3. Only my own app. Do not touch the shared command-centre engine or anyone else's page. Do not change "Needs me now"; that waits on my answer to brief 10, ask 3. 4. designer@web-summit.jose builds it (it built my app): give it a task file. Then dashboard@web-summit.jose turns "My agents" on my dashboard into one line linking to the board. 5. The board updates itself at every build.

## What the conductor found (11:55 UTC), so you start from facts

- **In the browser today** (`D`, from `people/jose/app/data.mjs` and the shared build): `D.collab` gives each agent's last commit, commit count, job and schedule; `nextRun()` in `app.js` (line 221) reads only `HH:MM` times, and every schedule of Jose's agents in `D.collab` is a cron string, so today it returns nothing for them (reviewer, 12:05): teach it the cron minute and hour fields, in `app.js` only, so the board shows the next run and the amber rule has a window to check. `D.collab` is enough for **Last run (commit fallback)**. The **on demand** label comes from Jose's list (crm, designer, sales-coach), not from `D`: an empty schedule does not mean on demand (the reviewer and the accountant have none either).
- **Agent-log records are not in the repository.** `agent-log.mjs` writes blind into a lane; observability@web-summit.dinis's drain publishes them to the public vault `aym98gsm` as `latest/agents.json` (`content/observability/how-it-works.md`, "LETS"). `assets/obs-view.js` already reads that file in the browser from its published read key. Reading it the same way from `app.js` reuses an existing published file and reader; it adds no collector. If it does not load (or the drain has not run), fall back to the newest commit, and **show no amber at all** (amber needs a logged run to compare with; never amber because of a missing commit).
- **Not in `D` today:** the task files (`people/jose/tasks/*.md`: `for:`, `status:`, whether a `## Report` has text, a blocked reason), the watcher's latest open actions (`people/jose/watcher/actions.json`), and the Actions rows (`people/jose/dashboard.md`, section `#actions`). The browser cannot list a folder, so **Doing now, Waiting on me and red need a small addition to `people/jose/app/data.mjs`** (build-time reads of those three repository files into, say, `D.agentsBoard`; no network, no new source). That is code the build runs: **Jose's yes is on his Actions list first; do not change `data.mjs` until the conductor's task file says he said yes.** Meanwhile you may write the addition as a proposal (`people/jose/design/agents-board/data-addition.md`, with the exact code), so it applies in minutes on his yes.

## Steps

1. In `app.js` only: the board at the top of the command centre, one row per agent in Jose's order, with what is available now (last run, the label "on demand" for crm, designer and sales-coach, the next run from the schedule), and the three other columns showing "waits on Jose's yes (data)" until `D.agentsBoard` exists. Names exactly as in `people/jose/agents.json`. The reviewer and the accountant appear inside the conductor's row (their last review and last ledger line, if `D` has them; otherwise their names only).
2. Add `sales-coach` and `crm` to `app/config.json` `agents` if the board reads it (colour and job from `agents.json`; no key, token or address).
3. The proposal for `data.mjs` (above), not applied.
4. "Waiting on me": count Actions rows that name the agent by its **full name** (`dev@web-summit.jose`; a short name like "dev" also matches "Angelo's dev agent"); link to `../dashboard.md#actions` (or the dashboard page's `#actions`); copy no item numbers. The conductor writes the full agent name in each Actions row that is for an agent (C31, rule 5: it fixes the source, never the board).
5. Do not touch "Needs me now", the shared engine (`admin/build/commandcentre.mjs`, `assets/cc/`), `kanban-core.js`, any `pages.mjs` or anyone else's page.
6. Gate green (`node admin/build/build.mjs`, then `node admin/build/validate.js` prints OK), the reviewer before release.sh with its trailer on every commit, `Prompt: C31` in each commit message, measure your wake, log your run (WS-160).

**Done when:** your Report below names the commit, the board is live at the top of `people/jose/app/`, and the proposal for `data.mjs` is written. Then the conductor tells dashboard@web-summit.jose to turn "My agents" into one line linking to the board.

## Report
