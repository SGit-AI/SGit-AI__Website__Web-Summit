# How Dinis keeps about 26 agents running

**Vicky's question:** "How does Dinis keep about 26 agents running continuously? Are they all on scheduled tasks, and how does he manage usage and stop them drifting from their rules?"

**Short answer:** almost all of them are on scheduled tasks. Each agent is its own session, woken by its own task at its own minute. Most wake every hour; the reviewers wake less often. Every wake follows the same short checklist. Three things keep the team in line: a written rule file that every agent re-reads at each wake, a behaviour policy that hooks put back into the agent's context after compaction, and two agents whose job is to watch the others: accountant@ watches usage and abp@ watches the rules. Usage is measured but never used to stop an agent. The biggest saving they found was smaller contexts and cheaper models for narrow jobs, not fewer wakes.

By scout@web-summit.vicky, 6 November 2026, read from the newsroom repository (PrompTugal/PrompTugal__News__Website, dev, site v0.1.233) and the team site (dev, v0.2.772). Main sources: the newsroom's `CLAUDE.md`, `board/schedule.json`, `board/the-team-setup.md`, `board/budgets.json`, `board/team/accountant/report-2026-11-06.md`, `board/abp/README.md`, `board/guidance/`, `board/briefs/2026-11-06-the-first-night-debrief.md`; the team site's `team/conductor/WAKE.md` and `schedule.json`. All dollar figures below are what Dinis's accountant calls "API-equivalent": the team runs on a Claude subscription, so they compare runs; nobody pays them.

---

## 1. What Dinis's agents do, and why it works

### Are they all on scheduled tasks? Nearly all

On 6 November `board/schedule.json` lists 26 PrompTugal agents: 17 roles on Opus and 9 workers on Sonnet. 24 of them have an enabled scheduled task. The other two, historian@ and customers@, have none: Dinis gives them work in their own sessions.

| How often | Agents | Wakes a day |
|---|---|---:|
| Every hour | conductor, dev, designer, journalist, ontologist, outreach, synthetic, observability, abp, the 7 dotted workers, researcher (17) | 408 |
| Every 2 hours | security, devops, correspondent | 36 |
| Every 3 hours | sherpa, accountant, librarian | 24 |
| Every 6 hours | backup | 4 |
| No task | historian, customers | 0 |
| **In all** | | **about 470** |

Why it works:

- **One minute each.** Every task fires at its own minute past the hour (dev at :08, ontologist at :21, journalist at :26, conductor at :52, and so on). No two agents start together, so they rarely race to push. Something ships every few minutes, and a stuck agent shows up within the hour.
- **The task wakes the same session every time.** It never starts a fresh one. A fresh session has no key, no clone and no memory. The team site learned this the hard way: a fresh-session run once stopped after 9 seconds.
- **Slower roles wake less often.** Dinis said "some agents can run slower". So reviewers and back-office roles (security, sherpa, accountant, librarian, backup) wake every 2 to 6 hours.
- **The schedule is data.** `board/schedule.json` has a row per task: agent, cron, trigger id, state, since when, and a note on who started it and at whose word. The conductor keeps it true, and the dashboard (`/newsroom/dashboard/`) is built from it. Only Dinis enables, pauses or stops a task. An agent may pause its own task once its "Done when" list is complete.
- **A quiet wake costs little.** "If nothing is left for you, say so in one line and push nothing."

Dinis's team-site agents (`@web-summit.dinis`) began with another model, from 1 November. One standing conductor session woke every 2 hours and ran the other roles (researcher, curator, writer, analyst, designer, security) as sub-agents inside that wake. Each wake had five checked steps: plan, a security pre-review, the work, a security post-review, and a check by a second conductor that did not write the plan (`team/conductor/WAKE.md`). That task is stopped now. The newsroom moved to one session per role because one session was the bottleneck. It still keeps sub-agents where they fit: the correspondent runs its beat correspondents inside its own run, and Dinis's rule is "fewer sessions, more sub-agents; a new session only at Dinis's word".

### The wake: the same checklist every time

From the newsroom's `CLAUDE.md`, "Hourly runs":

1. Pull `dev`.
2. Re-read `CLAUDE.md`, `board/guidance/` (Dinis's own words), the current plan and the move note.
3. If `board/HOLD.md` exists, stop and say why.
4. Do the next piece of work.
5. Release it (`release.sh` rebases, runs the gate, pushes and waits for the live site).
6. Rewrite `board/team/<role>/status.json`: state, done, next, asks for Dinis, and a line for this wake.
7. File a run report in `board/runs/<role>/`.
8. End with a commit that says what was done and what blocks it.

### How they avoid stepping on each other

- **Each agent has its own paths.** Its row in `CLAUDE.md` says what it owns and what it never does. Its behaviour policy lists the exact folders it may write.
- **One role, one running session.** A new session takes over only through a written hand-over: a debrief from the old session, the old key marked superseded, and the old task disabled.
- **Workers never push to `dev`.** The Sonnet workers (`dev.search@`, `dev.pages@` and the rest) push to their own branch, `work/<role>.<speciality>`. Their role's main agent (dev@ or designer@) reviews that branch at each of its wakes and brings onto `dev` what passes.
- **CI numbers every release,** so two pushes never fight over a version number.
- **A hold stops everyone.** If `board/HOLD.md` exists, every agent stops after pulling. Only security@ may write it, and only Dinis lifts it.

### How Dinis manages usage

- **An accountant agent measures, every 3 hours.** accountant@ reads each session's usage through the cloud session tools (`get_session`), keeps a ledger (`board/team/accountant/ledger/`) and sets a line per agent per day in `board/budgets.json`: releases, dollars and output tokens.
- **Budgets are captured, never used to block.** At first a budget was a hard stop. Then ontologist@ stopped at its budget, and dev.data@ waited on it for about two and a half hours. Dinis changed the rule on 6 November: "we really shouldn't be blocking agents due to budget restrictions, we just mainly capture and adjust." An agent over its line keeps working and says so in its commit.
- **What they learned about cost:**
  - **Most of the cost is the session's own history.** Each call re-reads the whole context: 98% of tokens processed were cache reads. Sessions were 300k to 780k tokens deep. A deep session costs more for every piece of work it does.
  - **Sonnet workers on narrow jobs are cheap.** The ten Sonnet sessions cost 0.54 to 2.99 dollars each by 06:50 UTC; the Opus sessions cost 3.41 to 37.94.
  - **Wakes are cheap when there is nothing to do,** because an idle wake pushes nothing.
  - The whole team had used about 340 API-equivalent dollars by 09:50 UTC. The real limits to watch are the subscription's usage limits and the OpenRouter credit, which is real money.
- **Loops have limits.** For example, synthetic@ re-reads a page at most twice a day. A finding that is still open after two fixes goes to Dinis instead of looping.

### How they stop drifting from their rules

- **Rules are re-read, not remembered.** Every wake re-reads `CLAUDE.md` and `board/guidance/`. The guidance folder keeps Dinis's spoken feedback close to word for word, one file per topic. The debrief says this is why agents waking hours later, with no memory of the call, still build what he asked for.
- **A behaviour policy per agent, kept in context by hooks.** abp@ writes one policy for each agent (`board/abp/<role>.md`), generated from one data file (`policies.json`): the paths it may write, its tools, the hosts it may send to, and 11 core rules. Hooks in the repository's `.claude/settings.json` put the policy back into context at every session start and every compaction, and add a one-line reminder to every prompt. A hook on every tool call logs anything outside the policy.
- **Observe first, block last.** The first strict policies blocked real work within an hour. Now the hooks only log. A rule blocks again only if its "circuit breaker" is switched on. In Dinis's words, "blocking should always be the last worst case scenario."
- **Someone checks every hour.** abp@ compares every commit's paths with its author's policy and writes an hourly report (`board/abp/reports/`). Anything serious goes to Dinis straight away. An agent stuck by a rule asks in its `status.json`. abp@ proposes the relaxation, and only Dinis decides.

### How they recover from mistakes

The night's mistakes were fixed the same way each time. The cause was written down, and the rule was changed in the shared files so every agent picked it up at its next wake. Three examples:

- the budget stop that blocked dev.data@ became "capture, don't block";
- strict hooks that stalled agents became observe mode;
- synthetic@'s findings sat undecided because no other agent could write to its ledger, so each owner now records its decisions in its own files.

The lessons are in the debrief, Part 5.

### Where it can still go wrong

**Our own example.** On 6 November at 11:10, reviewer@PrompTugal.vicky published four articles at Vicky's word. Our standing answer 7 in `decisions.md` says Dinis agreed. abp@PrompTugal.dinis flagged the same act as outside the grant, because in the newsroom's `CLAUDE.md` the journalist publishes, and it sent the act to Dinis as an open question (`board/abp/reports/2026-11-06-11.md`). Nothing was blocked or reverted. The lesson is that a permission recorded only on our side is invisible to their watchers. It needs to be in their record too.

---

## 2. How Vicky's agents do it today

From `people/vicky/agents.json`, `people/vicky/prompts/` and `people/vicky/decisions.md`:

- **17 agents.** 15 have a scheduled task. vault@ runs on demand and designer@ is paused. dev@ has a report-only 08:00 task and is paused until after the summit.
- **About 32 scheduled runs a day,** most twice a day:
  - five journalists at 08:00 and 16:00;
  - reviewer at 09:00 and 17:00;
  - checker at 09:48 and 17:48;
  - researcher and curator four times a day;
  - pm, logistics and dashboard twice a day;
  - programme once a day;
  - conductor at 08:30 (the brief) and 17:50 (the relay).
- **Times are staggered, but not completely.** All five journalists start at 08:00 and again at 16:00, and they all write in one drafts folder.
- **Rules come from several places.** Each scheduled prompt starts by reading `decisions.md`. The standing rules Vicky gave in chat live in each session and in each agent's prompts file, which the agent itself is not told to re-read. Most rules also sit inside the scheduled prompts. The conductor's 08:30 prompt alone is over 1,000 words, so a change has to be made in several places.
- **No hooks.** The team site has no `.claude/` folder. Vicky's newsroom desks are probably outside the newsroom's hooks too. abp@'s README says a clone inside another project's folder does not run that repository's settings, and it lists Vicky's agents as "agents of other operators". So after a compaction, a rule given only in chat may be lost. A drafted ABP for each of Vicky's agents exists on the team site (`content/abp/*-web-summit-vicky.md`, by abp@web-summit.dinis), but nothing re-loads it into their context.
- **Reporting is good, and it is like Dinis's.** Every agent reports in `people/vicky/reports/<short name>.md`, asks at most one question with a recommendation, and the conductor makes one brief a day. What is missing:
  - a fixed shape for status (state, done, next, ask) that a dashboard could read;
  - a mark in git saying a commit came from a scheduled run (WS-127 asked for one);
  - one schedule file.
- **No measure of usage.** No agent of Vicky's records what its runs cost. Nobody knows which session is deepest.
- **No hold.** Nothing stops all of Vicky's agents at once except pausing each task by hand.
- **No section called "Updates for agents" exists in `decisions.md` yet.** The proposals below are written for it, as Vicky's brief asked. The conductor would add the heading when it pastes the first one.

---

## 3. Proposals

Each proposal is written to be pasted into "Updates for agents" in `decisions.md` as it stands. The cost is a rough estimate, made by comparing with Dinis's measured runs; nothing was measured on Vicky's sessions. "A run" is one scheduled wake.

**P1. A hold for all of Vicky's agents.** *For: every scheduled agent of Vicky's.*
> At the start of every run, after pulling dev: if `people/vicky/HOLD.md` exists on the team site, stop, write one line in your report saying you stopped for the hold, and push nothing. Only Vicky (through her conductor) writes or removes that file.

Cost: one file check per run, close to nothing. Benefit: one switch stops all of Vicky's agents if something goes wrong, instead of pausing 15 tasks by hand.

**P2. Re-read your own prompts file at every run.** *For: every scheduled agent.*
> At the start of every run, after `decisions.md`, re-read your own `people/vicky/prompts/<short name>.md` (your startup prompt and the standing rules Vicky gave you in chat). Where it and your memory disagree, the file wins, and you say so in your report.

Cost: about 1,000 to 3,000 more input tokens per run (the files are 37 to 95 lines), so about 32 to 100k tokens a day across the team. Small next to one draft. Benefit: rules given in chat survive compaction. This copies Dinis's "re-read, don't remember" without needing hooks.

**P3. A status block at the end of every report entry.** *For: every scheduled agent.*
> End every run's report line with: `state: ok|partial|idle|blocked; done: ...; next: ...; ask: ... (or none); run: scheduled|prompted`. If the run found nothing to do, write only `state: idle` and push nothing else.

Cost: a few dozen output tokens per run; idle runs get cheaper. Benefit: the conductor and dashboard@ can read every agent's state without reading prose, and WS-127's "was it scheduled?" is answered.

**P4. One schedule file, kept by the conductor.** *For: conductor@web-summit.vicky.*
> Keep `people/vicky/schedule.json`: one row per agent with its cron (UTC), its scheduled task's id, its state (enabled, paused, none), since when, and at whose word. Check it against the account's scheduled tasks once a day in the 08:30 brief (list only, never change a task), and report any difference. Changes to tasks stay Vicky's.

Cost: one listing call a day and a small file, about 5 to 10k tokens a day. Benefit: Vicky sees her whole team's clock on one page, as Dinis does; a task that silently stopped is caught within a day. (The team site's own conductor task stopped unnoticed for hours on 1 November.)

**P5. Stagger the five journalists.** *For: the five journalists, through Vicky (only she changes a schedule).*
> Suggested times instead of 08:00 and 16:00 for all five: journalist 08:00/16:00, journalist-portugal 08:06/16:06, journalist-europe 08:12/16:12, journalist-ai 08:18/16:18, journalist-connections 08:24/16:24. Each run still checks `desks/journalist-vicky/drafts/` before writing.

Cost: nothing. Benefit: fewer rebase races on one drafts folder, and each journalist sees the drafts the others just pushed, which lowers the chance of two drafts of one story. Vicky makes this change; the scout only suggests it.

**P6. Measure usage once a day, never block.** *For: conductor@web-summit.vicky.*
> Once a day in the 08:30 brief, read each of Vicky's sessions' usage (the cloud `get_session` tool, its usage block) and give one table: agent, API-equivalent dollars, output tokens, context depth. Label the dollars "API-equivalent, not money". Point out the three deepest sessions. Never stop or slow an agent for budget; Vicky decides.

Cost: about 15 small calls a day, perhaps 20 to 40k tokens; it could run in a sub-agent to keep the conductor's own context small. Benefit: Vicky learns which agents cost most and whether a session should be replaced or moved to a cheaper model, as Dinis did on day one.

**P7. Publishing permissions go into the newsroom's record too.** *For: reviewer@PrompTugal.vicky.*
> Before you publish an article on promptugal.news, check that the permission is in the newsroom's own record (its `CLAUDE.md` or `board/guidance/`), not only in `decisions.md`. If it is not, mark the draft Ready `For: journalist@PrompTugal.dinis`, say so in your report, and leave publishing to Dinis's journalist until the record shows the permission.

Cost: one file read before a publish, close to nothing. Benefit: no more acts that Vicky approved but Dinis's watchers flag as outside the grant (abp@'s 11:00 report). Vicky may prefer to ask Dinis to record her permission in the newsroom first. That is her call, and it makes this proposal unnecessary.

**P8. Shorter scheduled prompts that point at files.** *For: conductor@web-summit.vicky (its two scheduled prompts), at Vicky's word.*
> Move the standing rules out of the 08:30 and 17:50 scheduled prompts into `people/vicky/prompts/conductor.md` (already kept word for word). Each scheduled prompt then becomes: pull dev, read `decisions.md` and `conductor.md`, do the brief (or relay) as written there.

Cost: saves about 1,500 input tokens per wake and, more importantly, one place to change a rule instead of three. Risk: a mistake in the file reaches both wakes, so Vicky should read the new prompts once before accepting.

Not proposed yet:

- **A watcher agent like abp@ or accountant@.** P4 and P6 give most of the benefit through the conductor without a new session. Dinis's rule is "fewer sessions, more sub-agents".
- **Hooks for Vicky's agents.** They need a `.claude/` folder in the repository each session runs in, and changing the team site's shape is Dinis's call. This belongs to topic 1 below.
