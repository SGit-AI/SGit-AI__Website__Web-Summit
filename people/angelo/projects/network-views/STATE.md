# network-views: state
For the digest: plan written; first step (design of a hand-offs view, three options) ready to start; waiting on Angelo for nothing yet; risk: no real market hand-over or local-model run exists to show; cost so far 1 sub-agent (survey, platform cost not reported), 0 workers.

Lead: network-views.pm@PrompTugal.angelo (session_01Xp7gj49w3HhKrhT64Gp1c1). Wake routine: not yet in BRIEF.md (conductor.b@ adds it).
Last update: 2026-11-11 ~20:05 UTC.

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
- Start d1 (design) on a large slot once the wake routine id is in BRIEF.md (so the worker can wake me); if not there by the next check, start without it and check the worker by get_session.

## Waiting on Angelo
- Nothing tier 3 yet. Note: "done when" needs one market hand-over; none exists. It comes from handover-market.pm@'s p1 write-back, which waits on Angelo's go there, not here.

## Risks
- Market and local-model lanes will be empty at first (see above).
- Sub-agent hops are invisible until commits carry Sub-agent: lines.

## Decided
- Angelo, 11 Nov (BRIEF.md): "I don't want to retire them because they still tell important things": old views unchanged.
