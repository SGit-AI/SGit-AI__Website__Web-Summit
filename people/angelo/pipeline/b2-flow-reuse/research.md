---
title: "b2-flow-reuse: what the flow view of each deliverable can reuse"
by: charlie.large.worker@PrompTugal.angelo (research)
written: 2026-11-11
for: conductor.b@PrompTugal.angelo, then Angelo
status: ready for Angelo's read
---
# The answer, on one screen

**Build on the newsroom's piece drawing, fed by our own records in the reporter's trace shape.**
- **The picture:** the visual newsroom's lanes-and-steps drawing (promptugal.news/newsroom/pieces/): one row per actor, one column per step, a thick arrow where work changes hands, a Replay button. It already answers "who did what, in order".
- **The data:** a small generator in people/angelo/ that reads one item's commits (the `Agent:`, `Role:`, `Item:` trailers), times.json, the ledger and estimates lines, and finds the release that put it live. It writes one file per deliverable in ws-trace/1, the shape Dinis's reporter and the Fringe tracer already use.
- **First version:** one page, one real deliverable, b0-library: Angelo's "Yes to all three", intake, alpha's three commits (11:09 to 11:13), the review (11:26), live in v0.2.1849 (11:29). Each step shows who, slot, when, minutes, tokens.
- **Size:** two large slots: one software-engineer (generator plus page, in people/angelo/), one check. All inside Angelo's own folder, so tier 1.

**Questions for Angelo (recommendation first):**
1. Copy the newsroom's drawing idea into our own page (recommended), or ask dev.graphs@PrompTugal.dinis to add our repository to the newsroom's view? Asking Dinis's agent is tier 3.
2. Show it first as its own page (recommended), and later as "tap a delivery" in the work view (0f2)?
3. Money per step: we only have tokens. Show tokens only (recommended) until the platform's cost per session can be read?

# The sources

**1. Our work view, live map and dumbbell** (people/angelo/app/; owners dev.work@, dev.map@, dashboard@; read 2026-11-11, 12:07 to 12:10 UTC)
- Shows deliveries flying from a maker to one of ten destinations (deliveries.json), and every exchange of the last 48 hours (live.json). Built by data.mjs `extras()` (people/angelo/app/data.mjs:557) from people/angelo/tools/deliveries.mjs. Ready and live (https://web-summit.sgit.ai/people/angelo/app/deliveries.json, 200).
- Format: packed rows `[minute, maker, icon, destination, repository, short sha]`; by design it keeps **no subject, no step, no hand-off** (deliveries.mjs header). It shows the end of a flow, never the steps.
- Reuse: its commit reader and name canon (`declaredNames`, `viewId`) and the backfill idea. Later, a delivery's sha is the natural link into its flow page. Backlog 0f2 and 0c5 (people/angelo/backlog.md:30, :44) set the work view's scope; the flow view is not in them.

**2. Dinis's reporter traces** (team/reporter/; owner reporter@web-summit.dinis; read 12:08 UTC)
- Eight traces, schema ws-trace/1 (team/reporter/traces/README.md): steps with `at`, `actor {name, kind}`, `in`, `out`, `handoff`, `sha`, `evidence[]`; people's steps marked. Written by hand by an agent, per workflow.
- Drawn as hand-made SVGs per example (assets/examples/*.svg, on /examples/), not by a reusable renderer.
- Reuse: **the shape**, as-is. Our formats/trace.md already points to it. Nothing to reuse for drawing.

**3. The newsroom's visual newsroom** (PrompTugal/PrompTugal__News__Website, dev at e5ce2ff; owner dev.graphs@PrompTugal.dinis; cloned read only, read 12:09 UTC)
- Brief: board/guidance/2026-11-10-pt-news-is-about-agents.md ("the workflow is the picture", 10 Nov 12:40).
- Built: newsroom/build/features/piece-flows.mjs (every commit touching a piece is a step: actor from `Agent:`, stage from the path), drawn by assets/newsroom/flow.js (plain SVG, no dependency, lanes by actor, Replay). Live: https://promptugal.news/newsroom/pieces/ (200) and /api/v1/newsroom/piece-flows.json (200, 74 flows, built 11:56 UTC, open to other sites).
- Step format: `{t, a, st, sha, s, brief, unit, forr}`: no duration, no cost, no live moment.
- Reuse: **the drawing**. Its open items (people's steps, pipelines by Issue) are ours too (board/team/dev.graphs/debriefs/2026-11-11-handover.md).

**4. Lisbon Fringe** (PrompTugal/PrompTugal__News__Fringe, dev at 7f26e60; owner conductor.fringe@PrompTugal.angelo; read only, 12:09 UTC)
- /graph/ (https://fringe.promptugal.news/graph/, 200) is a map of events, communities, topics and places (work/05-graph.md), not of work. Its next line names "the runs behind each deliverable as a layer".
- Angelo's experiment there (tracer.fringe@, commit 893d4e6, 12:06 UTC): one event page traced in 77 steps (humans, agents, sub-agents, source reads, CI, deploy), format lisbon-fringe-trace/1 "adapted from ws-trace/1", with `gaps[]` and a generator admin/tools/trace-event.mjs that finds the first deploy that published each commit. Bears directly on this view: **its method answers "when did it go live"**. Not touched, not duplicated; a later step should compare notes with it through conductor.b@.

**5. What our pipeline records per deliverable** (read 12:08 to 12:10 UTC)
- people/angelo/pipeline/<id>/times.json: per step, role, slot, session, start, end (written by hand by conductor.b@).
- Commits: workers carry `Agent:`, `Role:`, `Item:`, `For:` (e.g. 2f2766c on pool/b0-library); conductor.b@'s review brings them onto dev as one commit naming the worker's shas (5c6f4c8).
- people/angelo/ledger/<slot>.jsonl: tokens per run (alpha: 83,330 without cache reads); people/angelo/estimates/: estimate against actual (alpha: 45 min estimated, 6 taken).
- people/angelo/conductor-b/runs.md: one line per worker session. admin/versions.json: version, `from` sha.
- b0-library is complete end to end and is the right first example; b1-team-spec is still running (times.json has no end).

# The gaps, and the smallest change for each

| Gap | Evidence | Smallest change |
|---|---|---|
| Angelo's note has no time | b0's brief quotes "Yes to all three" with no time | a `note_at` line in brief.md front matter, from the session |
| Intake and review have no cost | conductor.b@'s ledger line covers a whole session run (ledger, 10:41 line) | conductor.b@ appends a ledger line per item step |
| times.json and commits disagree | b0 review in times.json 11:30 to 11:35; the review commit 5c6f4c8 is 11:26 | the generator takes commit times; times.json keeps session and slot |
| "Live" is not recorded | v0.2.1849 (from 8eebb24bb, another team's subject) is the first release containing 5c6f4c8; versions.json names only the newest commit | compute by ancestry (git merge-base), as Fringe's trace-event.mjs does with deploy runs |
| Worker steps only on pool/<id> | dev holds one review commit | keep pool branches (they are kept today) and keep listing shas in the review |
| Money per session | ledger has tokens only | question 3 above |

# Looked for, not found
- A reusable renderer for ws-trace/1 files: none (the examples' SVGs are hand-made).
- A per-step duration or cost in any of the three outside formats: none.
- websummit.com: not read, by rule.
