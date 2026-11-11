---
title: "conductor.b@PrompTugal.angelo: the workers it starts"
summary: One line per worker session conductor.b@ starts, appended, never rewritten. Each item's step times are in people/angelo/pipeline/<id>/times.json.
---
# Worker runs

| Started (UTC) | Worker | Item | Role | Session | Ended (UTC) | Result |
|---|---|---|---|---|---|---|
| 2026-11-11 ~10:30 | (in-session sub-agent, read-only search) | survey | research: skills, roles and formats across the team | in conductor.b's own session | 2026-11-11 ~10:33 | report in conductor-b/research/2026-11-11-skills-survey.md; 23 calls, about 170k tokens before cache reads |

No pipeline worker has run yet: ROLES.md waits for Angelo's read.

**Rule from 11 Nov (Angelo):** every agentic activity is tracked through commits. An in-session sub-agent gets a line here, its result committed and its tokens in the ledger, in the same commit; work that can wait goes to a worker session, which commits for itself.
