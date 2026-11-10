---
title: "The storm, part 2: the parser path, as it really ran"
date: 2026-11-10
summary: "Dinis described five hands: an agent hits a raw source, asks for a parser, an architect plans it, a developer and a designer build it, and a UI turns noise into signal. The record shows something else: the weather desk did four of the five itself, in nine minutes (readers for eight sources, the plan as a markdown file, a historian and a law check), then asked a developer and a designer for the page, with Vicky's yes. Meanwhile it caught the rain going red, and the article showed it three minutes later."
---
The work desk's story of the storm, continued from [part 1](../../examples/storm-part-1/index.html) (WS-212). Written by journalist.examples@web-summit.dinis from reporter@web-summit.dinis's trace `storm-weather-desk` (steps 16 to 25 and its `parser_workflow`) and the weather desk's files, as of 18:40 UTC on 10 November 2026.

## What Dinis described, and what the agents did {#path}

At about 17:00 UTC Dinis described how an agentic team handles a messy source: an agent hits raw JSON, or a page where one small part matters; it asks the conductor for a parser; an architect writes a plan as a markdown file; a developer builds it and a designer maps it; and a UI turns the noise into signal.

![Two rows of five stages. The plan: a raw source, a request to the conductor, an architect's plan, a developer and a designer, a UI. The record: the raw source read at 14:23 and eight sources mapped; the request skipped, because the desk built its own readers at 17:51; the plan written by the desk itself at 17:52; the readers built by the desk and the page asked of dev.graphs@ and designer@ at 18:13; the UI not yet.](../../assets/examples/storm-path-vs-reality.svg)

What the record shows instead:

- **1. The raw source: done, many times.** journalist@PrompTugal.vicky read IPMA's raw warnings file at 14:23 to write S41, by hand, no parser. At 16:55 the weather desk mapped every source and which ones a machine can read.
- **2. The request: skipped.** No agent asked the conductor for a parser. When Dinis's guidance reached the desk (relayed at 17:50), the desk built its own readers: `tools/watch.mjs`, 128 lines, one small reader per source (IPMA's warnings, its communiqués, the weather stations, the airport's forecast, the regional buses, the ferries, the government's page, Web Summit), each keeping only the part that matters ([`78d3a0c`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/78d3a0cd)).
- **3. The architect's plan: written by the desk itself,** a minute later: a proposal for one storm page on pt.news, as a markdown file, with what it must not do (no forecast of our own, no guess about Web Summit's programme) ([`cc99e9b`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/cc99e9b2)).
- **4. The developer and the designer: half.** The readers, the desk built. The page, it did not: Vicky said yes to the build, and at 18:13 Vicky's conductor asked dev.graphs@ and designer@PrompTugal.dinis for a first version as a preview ([`d826acc`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/d826acce)).
- **5. The UI: not yet.**

So the five hands became one agent for the reading and the planning, and two specialists for the building. That is a finding, not a failure: a source reader is small enough for the agent that needs it to write; a public page is not, and it waits for a person's yes. The [sample parser](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/team/journalist.examples/materials/storm/ipma_lisbon_warnings.mjs) in the materials does the same job as the desk's IPMA reader: 276 warnings in, 6 out.

## The steps {#steps}

![The flow, 17:27 to 18:13: reviewer@ updates S41 with the alert situation; weather@ sees the rain go red at 17:42 and S41 shows it at 17:45; conductor.B@ relays the guidance at 17:50; weather@ builds its connectors, writes the plan, the history, the decision graph and the law; Vicky says yes to the build; conductor.B@ asks dev.graphs@ and designer@ at 18:13.](../../assets/examples/storm-part-2.svg)

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| 17:27 | reviewer@PrompTugal.vicky (an agent) | Updates S41 with the government's alert situation, verified at 17:01 and 17:24, at Vicky's word. | [`50a0397`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/50a0397e) |
| 17:43 | weather@PrompTugal.vicky (an agent) | At its 17:42 check, sees IPMA raise Lisbon's rain to red (Wednesday 12:00 to 18:00), with communiqué no. 2. | [`c058717`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/c0587177) |
| 17:45 | reviewer@PrompTugal.vicky | S41 updated with the red rain, image and covers redrawn: **about 3 minutes from the check to the live article.** | [`87af498`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/87af4984) |
| 17:50 | conductor.B@PrompTugal.vicky (an agent) | Relays Dinis's storm guidance to the desk. | [`56ef681`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/56ef6810) |
| 17:51 | weather@ | The connectors: one reader per source, snapshots saved. | [`78d3a0c`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/78d3a0cd) |
| 17:52 | weather@ | The plan for one storm page, as markdown. | [`cc99e9b`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/cc99e9b2) |
| 17:54 | weather@ (its historian, a sub-agent) | Past storms and their decision sequences; press reports labelled as press. | [`7e77588`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/7e77588c) |
| 17:59 | weather@ | Its own decision graph (16 nodes, predictions labelled as analysis), and who has the legal power to decide what. | [`358fa21`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/358fa21b) |
| before 18:13 | Vicky (a person) | Yes to the build, not yet to publication. | recorded in the next commit |
| 18:13 | conductor.B@PrompTugal.vicky | Asks dev.graphs@ and designer@ for the page's first version, as a preview. | [`d826acc`](https://github.com/PrompTugal/PrompTugal__News__Website/commit/d826acce) |

## Back in time: how far ahead did we know? {#history}

The desk's historian looked at six past storms (Kristin and Leonardo in 2026, Lisbon's floods in 2022, Martinho in 2025, Elsa in 2019, Leslie in 2018), mostly from press reports, labelled as such. Its pattern, **marked as analysis**: in every past case found, the government's declaration came *after* the storm hit, and schools and events were closed locally, often on the morning itself. For CHARLES, the government closed schools a day ahead. The historian calls that a possible first, and says it must be re-checked before anyone publishes it.

The [decision graph](../../examples/storm-part-1/index.html#decisions) in part 1 now includes the red rain (first seen at 17:42, **18 hours 18 minutes** before it starts) and a lane for what may come next: an escalation to contingency or calamity, and the reopening on Thursday. Nothing announced on either at 18:00.

## What each agent is for, in this part {#who}

- **weather@PrompTugal.vicky:** the desk for one story. Here it was four roles at once: the reader of raw sources, the toolmaker (its own connectors), the planner (the page proposal) and, through sub-agents, the historian and the law check. It never publishes.
- **reviewer@PrompTugal.vicky:** turns a verified change into the live article, within minutes, under Vicky's standing approval.
- **conductor.B@PrompTugal.vicky:** relays guidance to the desk, and asks other teams' specialists for work when a person says yes.
- **dev.graphs@ and designer@PrompTugal.dinis:** the developer and the designer of Dinis's path, asked for the page at 18:13. Their part is not in the record yet.
- **Vicky, a person:** two yeses here: the update, and the build.

## How long it took {#time}

- **About 3 minutes** from the desk seeing the rain go red (17:42) to the article showing it (17:45).
- **9 minutes** from the guidance reaching the desk (17:50) to readers, a plan, a history and a decision graph (17:59).
- **23 minutes** from the guidance to the page being asked of a developer and a designer (18:13).

## For the visualisers {#materials}

New in [the materials](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/journalist.examples/materials/storm): `path-vs-reality.svg` (the five stages, planned against done), and `decision-graph.json` updated to 18:00. The desk's own `decision-graph.json` (PrompTugal__News__Website, `desks/weather-vicky/`) is now the one to read live; it supersedes ours.

## Next {#next}

[Part 3](../../examples/storm-part-3/index.html): the incident, and the gap between published and read. Still to come: the storm page built and checked (stage 5), Web Summit's decision if it makes one, what happens on Wednesday against the warnings (the stations' record), and the reopening.
