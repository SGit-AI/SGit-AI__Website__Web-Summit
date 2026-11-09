# Status, run reports and the dashboard

**The question:** how does Dinis see, at a glance, what 26 agents are doing, and how does that compare with Vicky's reports and 08:30 brief?

**Short answer:** each of Dinis's agents rewrites a small data file about itself at every wake (`status.json`) and files a run report. A dashboard page is rebuilt from those files at every release. It shows, in order:

- what waits on Dinis;
- one row per agent, in its own words, marked stale if it missed two wakes;
- a grid of where the agents fired in the last 24 hours;
- who handed work to whom.

The conductor also sends Dinis a picture of the team every three hours. Vicky's agents now end each report line with a status block (P3), which carries the same facts as `status.json`, written as text. What she lacks is the page that gathers those blocks. Her command centre lists only 9 of her 17 agents, because it reads team-site commits and her newsroom desks commit elsewhere.

By scout@web-summit.vicky, 6 November 2026, 22:10 UTC (scheduled run). Sources:

- in the newsroom (PrompTugal/PrompTugal__News__Website, dev, read at 22:05): `board/the-team-setup.md`, `board/team/journalist/status.json` (an example of the 28 status files), `board/runs/journalist/2026-11-06T20-29-16Z.json` and `board/abp/run-report.schema.json`, `content/newsroom/dashboard.md`, `board/brief-to-dinis-2026-11-06.md`, `board/the-account-move.md`;
- on the team site (dev, v0.2.887): `people/vicky/reports/*.md`, `people/vicky/dashboard.md`, `people/vicky/app/data.json`, `people/vicky/schedule.json`, `people/vicky/work-so-far/`.

The mentor has not answered the questions on this topic yet (Q1 to Q3); its latest note to Vicky is from 4 November.

---

## 1. What Dinis's agents do, and why it works

### The status file: the agent's state, in its own words

At the end of every wake, each agent rewrites `board/team/<role>/status.json` (CLAUDE.md, "Hourly runs"). The fields:

- `agent` and `focus`;
- `state`, for example "ok" or "handed over: moving to account B";
- `updated`;
- `done`, a running list;
- `next`;
- `asks`, the questions for Dinis, each linking to its decision page;
- `wakes`, one line per wake: started, outcome, release and one sentence.

28 such files exist tonight. The data-schema agent (ontologist@) wrote a schema for them, so the gate refuses a malformed status file.

**Why it works:** the state lives in one small file per agent, written by the agent itself, so the dashboard needs no guessing from commit messages. Before it existed, "state is only in commit messages" (`board/the-team-setup.md`).

### The run report: what the run did, as data

Each run also files `board/runs/<role>/<run>.json` (core rule R10, from abp@'s schema). It records:

- start and end, and a one-line summary;
- the policy version in force;
- session events, such as resumes and compactions, and whether the policy was re-anchored after each;
- tool calls counted by kind;
- the commits made and the paths they touched;
- anything outside the grant, and breaches.

It is for abp@'s hourly check more than for Dinis. One detail matters for anyone copying it: the report keeps the first 200 or so characters of every prompt the session received, in the public repository. Tonight's journalist report starts with a notification and a message from another session.

### The dashboard: one page, built from those files

`/newsroom/dashboard/` (`content/newsroom/dashboard.md`) is rebuilt at every release. It reads `schedule.json`, every `status.json`, the hold file, the run records and the git log, and has five parts:

1. **Now:** a hold if there is one, then "what waits on Dinis, oldest first", from every agent's `asks` and the story board.
2. **The agents:** one row each, in the agent's own words: focus, minute and next wake, last wake, state, done and next. "An agent marked stale has not rewritten its status within two of its wakes."
3. **Where they fire:** the last 24 hours, one column per hour, one row per agent: ● went well, ◐ partial, ○ idle, ✕ failed, H held, and • a commit outside a recorded wake.
4. **How they coordinate:** who addressed work to whom, from the `For:` and `To:` trailers of each commit.
5. **The record:** every scheduled task as `schedule.json` keeps it.

The clock and the next wakes run live in the browser.

### The brief: a picture every three hours

The conductor checks hourly and sends Dinis a brief every three hours (05:52, 08:52 and so on), "as an ASCII picture, drawn from the same files", or at once when something needs him. Bigger asks become decision pages, and briefs only link to them. Stand-up brief PDFs go out before 12:00 and 18:00 London time.

### Why it works

- **Each agent writes its own line,** so the agent closest to the work says what happened.
- **The page shows asks first,** so Dinis's attention goes where he is blocking someone.
- **Stale is computed, not noticed:** missing two wakes turns a row stale without anyone reading anything.
- **The same files feed the dashboard, the brief and abp@'s check,** so they cannot disagree.

### Also seen today: the team is running hot

At 21:10 the conductor wrote a plan to move agents to a second account (`board/the-account-move.md`). The reasons it gives:

- every session on the account shows a warning on the subscription's seven-day limit;
- the team has spent about 711 API-equivalent dollars today, about 43 an hour, with the Opus sessions about 92% of it.

**Who moves:** agents that work only through the repository and the inboxes. **Who stays:** the conductor, security@ and accountant@, because they read the account's sessions, and dev@ with its workers. This adds to notes 01 and 03: Dinis's answer to running hot was a second account, after Sonnet workers and slower wakes.

---

## 2. How Vicky's agents do it today

- **Reports:** each agent appends a line to `people/vicky/reports/<short name>.md`. Since P3 was accepted, 14 of the 17 report files carry the status block (state, done, next, ask, run). The files only grow: the curator's is 122 lines and the dashboard's 132. So the latest state is the last block of a long file.
- **The brief:** one PDF a day at 08:30 UTC, plus a relay at 17:50 if something is urgent. Every agent's questions go into one list. This is close to Dinis's three-hourly brief, at a slower pace that Vicky chose (no midday relay).
- **The dashboard:** `people/vicky/dashboard.md` (dashboard@, twice a day) shows "Needs me" from the board, the agendas and the briefs. It does not show the agents' own asks or states.
- **The command centre:** `people/vicky/app/` lists agents with their commits in the last 24 hours and their last commit. It shows 9 agents, because it reads the team site's git log. The newsroom desks, which commit to the newsroom repository, are missing: curator, programme, the five journalists, reviewer and checker.
- **The schedule:** `people/vicky/schedule.json` (P4) lists every task, so "stale" could be computed, but nothing does it yet.
- **The overview:** `people/vicky/work-so-far/` (the conductor, today) explains who works for Vicky and what is live, for people.
- **Nothing like a run report, and no grid** of who fired when.

---

## 3. Proposals

Numbered after note 05. Each is ready to paste into "Updates for agents".

**P25. An "agents" table on Vicky's dashboard, built from the status blocks.** *For: dashboard@web-summit.vicky.*
> At each run, add a section "My agents" to `people/vicky/dashboard.md`: one row per agent in `people/vicky/agents.json`, from the last status block (P3) in its `people/vicky/reports/<short name>.md`: state, when (the line's time), next, its open ask, and run (scheduled or prompted). Mark a row **stale** if the agent has a task in `people/vicky/schedule.json` and its last report line is older than two of its scheduled runs. List the open asks, oldest first, at the top of "Needs me", each with the agent's name. Read only the last block of each file; change no agent's file.

Cost: about 15 to 30k more tokens per dashboard run (17 short reads and one table), twice a day. Benefit: Dinis's "Now" and "The agents" in one place, with the newsroom desks included, because their reports are on the team site even though their commits are not. Stale detection replaces someone noticing a quiet agent.

**P26. A small picture of today's runs at the top of the 08:30 brief.** *For: conductor@web-summit.vicky.*
> At the top of the 08:30 brief, a grid of yesterday's and today's scheduled runs, one row per agent with a task in `schedule.json`, one mark per scheduled time: ✓ ran and reported, ○ ran with nothing to do (state: idle), ✗ ran and failed or blocked, · no report. Then the one list of questions as now.

Cost: a few thousand tokens per brief, read from files the conductor already reads. Benefit: Vicky sees in five seconds who ran and who didn't, as Dinis does with his grid. It answers WS-127's "was it scheduled?" from the `run:` field.

**P27. Keep run reports out; keep prompts private.** *For: every agent of Vicky's (a rule, for when anyone suggests copying Dinis's run reports).*
> Do not copy any prompt you received, even its first words, into a public file. Reports and status blocks say what you did and what blocks you, in your own words.

Cost: none. Benefit: Dinis's run reports store the start of every prompt a session received in the public repository. Vicky's chat prompts can hold private names, such as the interview shortlist, which must never be public, so this part should not be copied. The P3 block already gives Vicky the useful part of a run report.

Not proposed:

- **A status JSON file per agent.** The P3 block carries the same fields, and a second file per agent doubles the writing for little gain at Vicky's pace of 1 to 4 runs a day. If a page ever needs to read the blocks as data, dashboard@ can parse them (P25).
- **Fixing the command centre's missing desks myself:** its build is not in Vicky's folders. P25 covers the gap on her own dashboard. If she wants the command centre fixed, that is a request for its owner.
