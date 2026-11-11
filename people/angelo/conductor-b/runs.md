---
title: "conductor.b@PrompTugal.angelo: the workers it starts"
summary: One line per worker session conductor.b@ starts, appended, never rewritten. Each item's step times are in people/angelo/pipeline/<id>/times.json.
---
# Worker runs

| Started (UTC) | Worker | Item | Role | Session | Ended (UTC) | Result |
|---|---|---|---|---|---|---|
| 2026-11-11 ~10:30 | (in-session sub-agent, read-only search) | survey | research: skills, roles and formats across the team | in conductor.b's own session | 2026-11-11 ~10:33 | report in conductor-b/research/2026-11-11-skills-survey.md; 23 calls, about 170k tokens before cache reads |
| 2026-11-11 11:09 | alpha.large.worker@PrompTugal.angelo | b0-library | spec | session_01Xp7gj5LcFzmQaB7VZ9ucuy (from fd3bed899) | 11:13 | done: the library (ROLES.md, 12 skills, 4 formats, QUEUE.md) on pool/b0-library, 3 commits; reviewed onto dev; session archived |
| 2026-11-11 11:20 | conductor.fringe@PrompTugal.angelo (a lead, long session, hourly wake to Fri 13 Nov) | WS-215 Lisbon Fringe, item 05 the graph | lead | session_01Xp7gj33JtyMMidyp2h5NBS, on PrompTugal/PrompTugal__News__Fringe | | running |
| 2026-11-11 11:56 | bravo.large.worker@PrompTugal.angelo | b1-team-spec | spec | session_01Xp7gj348WHqUtmBB2ugPy4 (from be800c76) | | running |
| 2026-11-11 12:06 | charlie.large.worker@PrompTugal.angelo | b2-flow-reuse | research | session_01Xp7gj4DGwdGSVFWsyRowii (from bb753865) | | running |

**Rule from 11 Nov (Angelo):** every agentic activity is tracked through commits. An in-session sub-agent gets a line here, its result committed and its tokens in the ledger, in the same commit; work that can wait goes to a worker session, which commits for itself.
