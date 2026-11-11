---
title: "b4-how-it-works: the whole workflow, explained visually"
item: b4-how-it-works
by: conductor.b@PrompTugal.angelo (intake)
written: 2026-11-11
role: design, then build (one run)
size: large
skills: designer, writer, software-engineer, plain-language (+ always-on)
format: web-summit-site
go: Angelo, 11 Nov (his words below)
---
# b4-how-it-works

## Angelo's words (11 November)
*"We need to clarify the whole workflow in a visual way, including what's in each prompt, the session-less part, why and how we're retiring most schedules, why we need pms, etc."* He reads little text (*"That's A LOT of text to read."*): pictures first, a few words each.

## What the page must show (each a picture with at most three short lines under it)
1. **Who is who:** Angelo; conductor.b@ (routes, never builds); project managers `<project>.pm@` (one per project, Angelo talks to them, they start their own workers); workers (session-less slots by size: 10 large, 10 small); the scheduled helpers (digest.b@ hourly, accountant.b@ every 4 hours); conductor.fringe@ (the Fringe's lead in Dinis's swarm).
2. **The flow of one piece of work:** Angelo's note, intake (brief.md), a worker per step on its own branch pool/<id> (research, draft, check, design, build, publish, share), review onto dev, live on our site; Angelo's go before anything public. A swimlane timeline (actors as lanes, steps as blocks) using a real example: b0-library or b1-team-spec, with their real times and costs (people/angelo/conductor-b/runs.md, people/angelo/pipeline/*/times.json).
3. **What is in each prompt:** the common preamble + a craft (role) + skills (from one library, plus the four always-on: privacy, plain language, token thrift, trace) + a format + a name. Show it as building blocks; name the files (people/angelo/pipeline/ROLES.md, skills/, formats/).
4. **Session-less, and why:** a fresh session per step, never a second message; context never grows; any free slot can take any step; archived when its commits are in; the record is the commits, not the session.
5. **Why most schedules are retired, and how:** the old way, one scheduled agent per workstream waking whether or not there was work (people/angelo/proposals/worker-pool/spec-worker-pool.md: 67 runs on 8 November, at least 9 with nothing to do; account A's agents stopped on 10 November); the new way, on demand; what stays scheduled and why (the hourly digest, the accountant, the Fringe's hourly wake until Friday).
6. **Why project managers:** Angelo talks to one place per project; the conductor stays free to route; a PM plans, starts its own workers, keeps the project's STATE.md, and retires with a debrief when the project ends.
7. **Everything tracked:** every step and sub-agent in a commit; costs in dollars and tokens (runs.md, the ledger).
8. **When usage runs short:** the capacity board and the handover market (people/angelo/pipeline/b3-team-offers/spec-handover-market.md), drawn as offer, claim, run, return.

## Where and how
- One static page: people/angelo/pipeline/how-it-works/index.html (it is served at https://web-summit.sgit.ai/people/angelo/pipeline/how-it-works/), plain HTML, CSS and inline SVG, no external scripts; phone first (390 px), then desktop; light and dark. Look at people/angelo/app/ for the look to keep, and skills/designer.md for the forms.
- First, in design.md: what the reader must grasp in five seconds, and the form for each of the eight sections (one paragraph). Then build.
- Screenshots at 390 px and 1280 px in people/angelo/pipeline/b4-how-it-works/ (Playwright is installed: require('playwright'), chromium.launch()).
- Every fact from the files named above; nothing invented. No em-dash.

## Done when
The page and its screenshots on pool/b4-how-it-works, the gate OK on the branch, design.md and STATE.md written, STATE.md says "ready for Angelo's look".
