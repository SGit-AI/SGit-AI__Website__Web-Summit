---
title: "conductor.b@PrompTugal.angelo: state"
summary: Account B's conductor. Main control of Angelo's backlog from 10 November 2026 (Angelo, about 17:15 UTC). Short: what is open, what waits, the last run. The commits are the history.
---
# conductor.b@PrompTugal.angelo: state

**Role:** account B's conductor, a long session Angelo talks to; main control (the desk, desk.conductor@PrompTugal.angelo, is on standby). Runs the article pipeline (people/angelo/proposals/account-move/spec-pipeline-b.md) and routes the backlog (people/angelo/backlog.md). Key: conductor-b-angelo in data/keys.json (session key, sha256:e662d76812739fbd; signing sha256:813a640bff3c423d).

## Open

- **prod-pipeline.pm@** (lead, session_01Xp7gj4eqarFrTq3M9S7GjH): read people/angelo/projects/prod-pipeline/ASKS.md on project/prod-pipeline at each exchange with Angelo; start what it asks; bring its branch onto dev.
- **b1 questions 2 to 5** wait for Angelo (Fringe lead name, budget unit, accountant cadence, sharing with Indi).

- **conductor.fringe@** is running an experiment on one Fringe article at Angelo's ask (11 Nov): no worker duplicates or touches it.
- **conductor.fringe@** (Lisbon Fringe, item 05): read its team/angelo/status.json asks "conductor.b@:" in the Fringe repository when Angelo checks in.

- **ROLES.md** (people/angelo/pipeline/ROLES.md): waiting for Angelo's read before any worker runs.
- **First pipeline item:** Angelo's interview with an exhibitor on agentic governance in construction (the desk's HANDOVER.md, job 2). Waits on Angelo's notes and the consent he recorded.
- **THE RESTART (WS-208), Angelo's piece (RiskMandate demos):** waits on what Dinis said at 09:00.
- **Decisions open with Angelo** (from HANDOVER.md, to bring one at a time): Indi's demo approve button (recommend yes); drafts gw1 and pr1 for his review and the setup-guide correction; LinkedIn drafts' three questions; later items 0-FOLLOW, 0r, 0g, the registration page.
- **Account A:** three app-created tasks (dev.work@, runner.writer@, runner.conductor@) wait for Angelo to pause them.

## Decided by Angelo (11 Nov)

- **Twenty worker slots** ("What about 10 large and 10 small, with the key tenant that if a task requires a large, we don't jump to a small just because there aren't enough large available, we discuss spinning a new large or wait."). Large: alpha, bravo, charlie, foxtrot, golf, hotel, juliett, kilo, lima, mike. Small: delta, echo, november, oscar, papa, quebec, romeo, sierra, tango, uniform (india and xray skipped). A large task never goes to a small slot: no large free means ask Angelo (a new slot) or wait.
- **Lanes:** "I'm happy for opening all 20 lanes immediately but not give wildcards, let's keep the policy agent do its job." policy@ adds the fifteen new names one by one; Angelo asks it in its session.
- **Every agentic activity in commits** ("we want to be able to track each and every agentic activity though commits"): an in-session sub-agent gets its runs.md line, its result and its ledger line in one commit.
- Workers are session-less slots; the prompt (role + skills + format) is the agent; conductor.b@ routes only and stays reactive.

- **Yes to all three** (11 Nov): at most 6 running at once (4 large, 2 small) to start; a small task may use a large slot when no small one is free; go on b0-library.
- **Archive finished workers** ("Yes, please go ahead."): once a worker's commits are on its branch and logged in runs.md, conductor.b@ archives its session (read-only; the record is the commits). A worker is never sent a second message: each job is a new session.
- **Lanes open for all twenty** by policy@ (36a2a0d0, pushed-by ANGELO), named in full.
- **Lisbon Fringe (WS-215, Dinis, due Thu 12 Nov):** "Go ahead, I think I already have access." conductor.b@ started conductor.fringe@PrompTugal.angelo (its own session, its own key, hourly wake to Friday, item 05 the graph), with Angelo's rules added: every activity in commits (team/angelo/runs.md in the Fringe repository), no extra sessions (asks to conductor.b@ in its status.json), tier 3 to Angelo.
- **No automated reading of websummit.com** (Dinis's incident lead, 05:25, Web Summit's Terms 48.2, 52.1): for every worker prompt and the researcher skill.
- **The prompt library approved** ("That's A LOT of text to read. Let's assume it's fine and will refine as we go."): in use from now; corrections go in each skill's Lessons. A rendered page for the library was offered and not taken.

## Waiting on


- Angelo: his read of ROLES.md; the interview notes; what Dinis said at 09:00; whether to tell Jose's conductor about the follow links.
- (done) The push check: this session's first commit 7acabbef6 (live in v0.2.1835) was pushed by riskmandate-angelo; pushed-by says ANGELO.

## Workers

Twenty slots, all in the lane. Ceiling: 6 at once (4 large, 2 small). Running: see runs.md. Log: people/angelo/conductor-b/runs.md.

last_run: 2026-11-10T17:30Z (first run: key, STATE, runs.md, ROLES.md); released 2026-11-11 once policy@ added the lanes (c9c7398)
