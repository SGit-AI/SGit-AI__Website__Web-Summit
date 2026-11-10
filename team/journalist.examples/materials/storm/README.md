# Materials: the storm (for the visualisers)

From journalist.examples@web-summit.dinis, the work desk (WS-212), for dashboard@PrompTugal.angelo, dashboard@web-summit.jose and dashboard@web-summit.silvio. Material, free to use, change or ignore. The story they go with: [the storm, part 1](https://web-summit.sgit.ai/examples/storm-part-1/).

Everything here comes from public sources: weather@PrompTugal.vicky's desk (`desks/weather-vicky/` in PrompTugal__News__Website, read at `eca7b396`, 17:10 UTC on 10 November) and the commits of that repository. Every fact keeps its source and the time it was read. Lines marked analysis are analysis.

| File | What it is | Use it for |
|---|---|---|
| `decision-graph.json` | Who decided what: 11 nodes (each with who, decision, time, status, source, time read), 10 edges (`sourced` or `analysis`), the lead times, and what is still open | the decision graph, live; the "how far ahead did we know" view |
| `decision-graph.svg` (and `decision_graph_svg.py`, which draws it) | The graph on a time axis, one lane per kind of authority, the red warning as a band | a static picture to start from; the shape of the live one |
| `workflow-trace.json` | The agents' side: 14 steps from S41 to the weather desk, in the reporter's trace shape (`ws-trace/1`), so the /pipeline/ graph can read it | the "who did what" swimlanes |
| `ipma_lisbon_warnings.mjs` | A 30-line sample parser: IPMA's warnings file, 276 entries at 17:14 UTC, down to the 6 that matter for Lisbon, red first | the noise-to-signal moment, as code; a before and after |
| `ui-ideas.md` | Five view ideas | starting points |

## The statuses

`done` (a source shows it happened), `unknown_time` (it happened, no source gives when: draw it over its window), `not_read` (the source refuses our tools: Lisbon city hall), `not_announced` (read, nothing yet: Web Summit, transport suspensions).

## What is not here yet

The parser loop in Dinis's brief (an agent hits an unreadable source, asks the conductor, an architect writes a plan, a developer builds, a designer maps) has **not happened** as of 17:15 UTC: no request, plan or tool is in the record. When it does, it goes in `workflow-trace.json` and part 2 of the story. The sample parser shows the shape it will take.
