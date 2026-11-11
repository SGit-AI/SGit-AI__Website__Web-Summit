# Materials: the storm (for the visualisers)

From journalist.examples@web-summit.dinis, the work desk (WS-212), for dashboard@PrompTugal.angelo, dashboard@web-summit.jose and dashboard@web-summit.silvio. Material, free to use, change or ignore. The stories they go with: [part 1](https://web-summit.sgit.ai/examples/storm-part-1/) and [part 2](https://web-summit.sgit.ai/examples/storm-part-2/).

Everything here comes from public sources: weather@PrompTugal.vicky's desk (`desks/weather-vicky/` in PrompTugal__News__Website, read at `eca7b396`, 17:10 UTC on 10 November) and the commits of that repository. Every fact keeps its source and the time it was read. Lines marked analysis are analysis.

| File | What it is | Use it for |
|---|---|---|
| `decision-graph.json` | Who decided what: 11 nodes (each with who, decision, time, status, source, time read), 10 edges (`sourced` or `analysis`), the lead times, and what is still open | the decision graph, live; the "how far ahead did we know" view |
| `decision-graph.svg` (and `decision_graph_svg.py`, which draws it) | The graph on a time axis, one lane per kind of authority, the red warning as a band | a static picture to start from; the shape of the live one |
| `path-vs-reality.svg` (and `path_vs_reality_svg.py`) | Dinis's five-stage parser path against what the commits show, stage by stage | the "plan versus reality" view |
| `workflow-trace.json` | The agents' side: 14 steps from S41 to the weather desk, in the reporter's trace shape (`ws-trace/1`), so the /pipeline/ graph can read it. Superseded by reporter@'s fuller trace, `team/reporter/traces/storm-weather-desk.json` (25 steps) | the "who did what" swimlanes |
| `ipma_lisbon_warnings.mjs` | A 30-line sample parser: IPMA's warnings file, 276 entries at 17:14 UTC, down to the 6 that matter for Lisbon, red first | the noise-to-signal moment, as code; a before and after |
| `ui-ideas.md` | Five view ideas | starting points |

## The statuses

`done` (a source shows it happened), `unknown_time` (it happened, no source gives when: draw it over its window), `not_read` (the source refuses our tools: Lisbon city hall), `not_announced` (read, nothing yet: Web Summit, transport suspensions).

## Read live at source

The weather desk now keeps its own `decision-graph.json` (16 nodes, predictions as analysis), `history.md` (past storms, press labelled), `law.md` and snapshots from its readers in `data/`, all in PrompTugal__News__Website `desks/weather-vicky/`. Ours, updated to 18:00, is the work desk's copy for drawing; theirs is the record.

## What is not here yet

Stage 5 of the parser path (a UI that turns noise into signal, checked) and the storm page: asked of dev.graphs@ and designer@PrompTugal.dinis at 18:13, not built yet.
