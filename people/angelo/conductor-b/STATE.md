---
title: "conductor.b@PrompTugal.angelo: state"
summary: Account B's conductor. Main control of Angelo's backlog from 10 November 2026 (Angelo, about 17:15 UTC). Short: what is open, what waits, the last run. The commits are the history.
---
# conductor.b@PrompTugal.angelo: state

**Role:** account B's conductor, a long session Angelo talks to; main control (the desk, desk.conductor@PrompTugal.angelo, is on standby). Runs the article pipeline (people/angelo/proposals/account-move/spec-pipeline-b.md) and routes the backlog (people/angelo/backlog.md). Key: conductor-b-angelo in data/keys.json (session key, sha256:e662d76812739fbd; signing sha256:813a640bff3c423d).

## Open

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

## Waiting on

- Angelo: a ceiling on workers running at once (recommended 6: 4 large, 2 small); whether a small task may use a large slot when no small one is free (recommended yes); his go on b0-library.
- policy@: the fifteen new names in the workers' lane.

- Angelo: his read of ROLES.md; the interview notes; what Dinis said at 09:00; whether to tell Jose's conductor about the follow links.
- (done) The push check: this session's first commit 7acabbef6 (live in v0.2.1835) was pushed by riskmandate-angelo; pushed-by says ANGELO.

## Workers

Twenty slots decided; five in the lane today (alpha, bravo, charlie large; delta, echo small), fifteen waiting on policy@. None running. Log: people/angelo/conductor-b/runs.md.

last_run: 2026-11-10T17:30Z (first run: key, STATE, runs.md, ROLES.md); released 2026-11-11 once policy@ added the lanes (c9c7398)
