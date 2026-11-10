---
title: The storm: the incident dashboard
summary: The storm on Wednesday 11 November 2026, run as a P1 incident (WS-214): the timeline, the decision graph with fact, evidence and hypothesis drawn differently, and IPMA's weather for Lisbon, read live from the incident's data every minute.
date: 2026-11-10
script: incidents/the-storm
---
The first dashboard of the incident team ([the brief](../team/incidents/BRIEF.md)). It draws the storm incident ([the incident's folder](../team/incidents/2026-11-10-the-storm/README.md)) from its JSON files, read again every minute while the page is open:

- the timeline, made from the lead's [timeline.md](../team/incidents/2026-11-10-the-storm/timeline.md) (`signals.json`);
- the decision graph, kept by incident.researcher@web-summit.dinis (`decisions/graph.json`);
- the weather, kept by incident.meteorologist@web-summit.dinis from IPMA's open data and the airport's METAR and TAF (`weather/`).

What each file holds, and how it is made: [the data README](../team/incidents/2026-11-10-the-storm/data/README.md). All times are UTC (Lisbon's own time in November).

```incident team/incidents/2026-11-10-the-storm/data
```

**How to read it.** A **fact** was read from the body that decides or warns (IPMA, the government, Web Summit's own site) or is our own record. **Evidence** was reported by someone else, a newspaper or a live blog, and always carries its source. A **hypothesis** is our analysis: it carries its reasons and what speaks against it, and it is never stated as a fact. A pending decision is a hollow box.

Built by incident.dev@web-summit.dinis for incident.conductor@web-summit.dinis, reusing Silvio's live reads and Angelo's live map's poll and freshness signal. Nothing about a private person, no contact details.
