# network-views: state
For the digest: d1 design done; build ON HOLD: Angelo says the view may move to Kibana on Elastic Cloud; waiting on him for the deployment's address and a key (tier 3); cost so far 5.62 USD and 78k output tokens (1 worker) + 1 sub-agent unreported.

Lead: network-views.pm@PrompTugal.angelo (session_01Xp7gj49w3HhKrhT64Gp1c1). Wake routine: trig_01D39RAzsMdheFWbiBWjttdi (BRIEF.md, b59b01a).
Last update: 2026-11-11 20:47 UTC.

## 1. The old views: what they show, what to keep (all kept unchanged; owner dashboard@)
- #live (live.js, live3d.js): hexagon graph of who wrote to whom, 48 h, from git. Keep: the "who talks to whom" picture.
- #collab (map3d.js): the team and the machine in 3D. Keep: the place of each agent.
- work view, dumbbell (work*.js, 0f2/0c5): deliveries flying from maker to one of ten destinations, typed icons. Keep: the icons, the destinations, the live flight.
- #replay (replay.js): Gantt of every commit since 2 Nov, a row per agent. Keep: time left to right, playback.
- What they all miss (why they are "outdated"): they show writes and deliveries, not hand-overs. Nobody can see who gave a task to whom, where it ran (account B, OpenRouter, a local model, another person's account), and what it cost.
- A new view links in from the command centre by one hash route and one nav link in app/app.js (a small change, For: dashboard@, five steps); the view's own files are new.

## 2. The records for each kind of hand-off
| Hand-off | Record today | Gap, and how to fill it |
|---|---|---|
| conductor.b@ to a lead | conductor-b/runs.md row (markdown) | parse the table; fine |
| lead or conductor to a worker slot | runs.md rows, pool/claims history, pool/<id> branches, pipeline/*/times.json, ledger lines, Agent:/For: trailers | none; cost is free text in runs.md (only handover-market writes it): my runs.md uses a fixed cost column |
| worker to a sub-agent | ledger "subagents" totals only; preamble asks for "Sub-agent:" lines but 0 commits carry one | the collector reads Sub-agent: lines when they come; until then, the ledger totals as one "sub-agents" hop |
| to OpenRouter | pipeline/handover-p3-openrouter/usage.jsonl (30 calls, $0.0955, model, tokens, cost) | the collector reads every pipeline/*/usage.jsonl and projects/*/**/usage.jsonl; no new rule |
| to a local model (Ollama) | none: nothing has run | same usage.jsonl shape with tier "local"; the view draws an empty lane until one runs |
| to another account (the market) | none real: 0 completed; p1 result packet unsigned, write-back waits on Angelo's go; format proposed (handover-p2-format, ledger run_on/for_account, on 0 lines) | depends on handover-market.pm@; the collector reads run_on/for_account and the p2 package files when they exist |
| scheduled helpers (digest.b, accountant.b) | runs.md rows naming the trig_ ids; ledger lines under their names | map trig ids to helpers from runs.md |

Decided by default, Angelo can reverse: the new view reads the existing records through one collector (people/angelo/projects/network-views/ for now), writing a generated handoffs.json (gitignored, built like live.json); no new habit asked of other agents except what is already proposed (Sub-agent:, run_on/for_account).

## 3. The first view to design (step d1, large, design role)
"Today's hand-offs": who gave which task to whom, where it ran, when, cost. Three forms for the designer to mock (phone 390 px, desktop 1280 px), using the app's look:
- A. Swimlanes by where work runs (account B: conductor, leads, slots; OpenRouter; local; other accounts), hand-offs as arrows across lanes over today's time. My lean: A, it answers "where did it go and when".
- B. A flow (Sankey-like) from Angelo to conductor to leads to slots to outside compute, widths by count or cost.
- C. A tree of one day: each task from Angelo's word down to every hop, with cost at each node.
Then Angelo's pick (below tier 3: if he does not pick, decided by default on the designer's recommendation). Then d2 build (collector + view, new files), d3 a small link from the command centre (For: dashboard@).

## Next
- d1 done (pool/network-views-d1, ea82463): d1-design/design.md, mocks mock/a/orbits.htm, mock/b/circuit.htm, mock/c/river.htm, sample-handoffs.json from mock/derive.mjs (69 hand-offs, 66 real, 3 placeholders). Recommends A Orbits (Angelo the sun, rings for conductor, leads, slots, sub-agents; "account B ends here"; OpenRouter, local, market worlds outside; a comet per hand-off), B Circuit as its "Timeline" tab, C's width switch (hand-offs, cost, tokens) inside A.
- Shown to Angelo for his pick. ON HOLD (Angelo, 11 Nov ~20:50: "I think this is moving to kibana on elastic cloud, can you connect to that, see what's there and share it with me?"): no default build until he says whether the view moves to Kibana. Before that hold: default was A + B tab; then d2 build (collector from derive.mjs into a gitignored handoffs.json, the view in new files), then d3 the nav link (For: dashboard@).
- Decided by default, Angelo can reverse: d2 does not ask other agents to change habits (Sub-agent: lines, leads' starts in conductor-b/runs.md); those go to conductor.b@ as a request.

## Questions for conductor.b@
- The gate's check 21 (lanes) is red for project folders: network-views.pm@ has no lane for people/angelo/projects/network-views/**, and pool workers have none for projects/*/<item>/** (d1's a8e2d9d, my 1071f504 and 95ccf113). Recommend: bring them onto dev with "Outside: people/angelo/projects/network-views/**" in your merge commit and ask policy@ for those lanes (as for prod-pipeline, if it is done there).
- Recommend asking agents for "Sub-agent:" lines and a conductor-b/runs.md row for each lead's start: without them the view lumps sub-agents into one hop and approximates handover-market.pm@'s start.

## Waiting on Angelo
- Kibana on Elastic Cloud (tier 3: a key and an outside service): the deployment's address (Kibana or Elasticsearch endpoint) and a read-only API key through the session's secure form; nothing in this repository mentions one (only Kibana-like wording in assets/obs-view.js and content/observability-pack/). Then a read-only look, shared with him.
- His pick of d1's concepts, or that the view moves to Kibana.
- Nothing tier 3 yet. Note: "done when" needs one market hand-over; none exists. It comes from handover-market.pm@'s p1 write-back, which waits on Angelo's go there, not here.

## Risks
- Market and local-model lanes will be empty at first (see above).
- Sub-agent hops are invisible until commits carry Sub-agent: lines.

## Decided
- Angelo, 11 Nov 20:05 UTC, on the first view: "We need the designer to come up with a visual approach that is as stunning as the old agent network views or what Silvio has been doing in the command centre. I don't have an idea on how this can look like, but it needs to be nicely designed." So: d1 asks for three bold concepts, the bar being his old network views and Silvio's command centre (assets/cc/, GAMMA-Ray, the Universe), keeping the command centre's look; my forms A/B/C are dropped as the frame, the designer may use them as one input.
- Angelo, 11 Nov (BRIEF.md): "I don't want to retire them because they still tell important things": old views unchanged.
