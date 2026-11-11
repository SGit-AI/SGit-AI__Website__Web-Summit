---
title: "conductor.b@PrompTugal.angelo: the workers it starts"
summary: One line per worker session conductor.b@ starts, appended, never rewritten. Each item's step times are in people/angelo/pipeline/<id>/times.json.
---
# Worker runs

| Started (UTC) | Worker | Item | Role | Session | Ended (UTC) | Result |
|---|---|---|---|---|---|---|
| 2026-11-11 ~10:30 | (in-session sub-agent, read-only search) | survey | research: skills, roles and formats across the team | in conductor.b's own session | 2026-11-11 ~10:33 | report in conductor-b/research/2026-11-11-skills-survey.md; 23 calls, about 170k tokens before cache reads |
| 2026-11-11 11:09 | alpha.large.worker@PrompTugal.angelo | b0-library | spec | session_01Xp7gj5LcFzmQaB7VZ9ucuy (from fd3bed899) | 11:13 | done: the library (ROLES.md, 12 skills, 4 formats, QUEUE.md) on pool/b0-library, 3 commits; reviewed onto dev; session archived; cost 1.40 USD API-equivalent |
| 2026-11-11 11:20 | conductor.fringe@PrompTugal.angelo (a lead, long session, hourly wake to Fri 13 Nov) | WS-215 Lisbon Fringe, item 05 the graph | lead | session_01Xp7gj33JtyMMidyp2h5NBS, on PrompTugal/PrompTugal__News__Fringe | | running |
| 2026-11-11 11:56 | bravo.large.worker@PrompTugal.angelo | b1-team-spec | spec | session_01Xp7gj348WHqUtmBB2ugPy4 (from be800c76) | 12:00 | done: spec-account-b-team.md and a one-screen summary, 3 commits; reviewed onto dev; session archived; cost 1.54 USD API-equivalent |
| 2026-11-11 12:06 | charlie.large.worker@PrompTugal.angelo | b2-flow-reuse | research | session_01Xp7gj4DGwdGSVFWsyRowii (from bb753865) | ~12:14 | done: research.md (build on the newsroom's piece drawing, fed by our records in ws-trace/1); reviewed onto dev; session archived; cost 2.10 USD API-equivalent |
| 2026-11-11 12:28 | prod-pipeline.pm@PrompTugal.angelo (a lead, long session) | project prod-pipeline | lead | session_01Xp7gj4eqarFrTq3M9S7GjH (from 94dfabc6) | | running |
| 2026-11-11 12:58 | digest.b@PrompTugal.angelo (scheduled task trig_019P5mmH76wN24vNXQTvbU5C, hourly at :58, smaller model, a fresh session per fire) | ops-digest | digest | first fire 13:58 | | scheduled |
| 2026-11-11 12:58 | accountant.b@PrompTugal.angelo (scheduled task trig_01CvoEzp8UjqACZ2EXV3hnFW, every 4 hours at :58, smaller model, a fresh session per fire) | ops-accounts | accountant | fired now for a baseline (cse_01Xp7gj5JYEeQkQpi9s74yB7) | | running |
| 2026-11-11 13:34 | alpha.large.worker@PrompTugal.angelo | b3-team-offers | spec | session_01Xp7gj72uwKSo14DwxG8SnC (from b5593420) | | running |

**Costs** (Angelo, 11 Nov, "Both?"): each finished worker's row gives the platform's API-equivalent dollars; tokens are in people/angelo/ledger/.

**Rule from 11 Nov (Angelo):** every agentic activity is tracked through commits. An in-session sub-agent gets a line here, its result committed and its tokens in the ledger, in the same commit; work that can wait goes to a worker session, which commits for itself.
