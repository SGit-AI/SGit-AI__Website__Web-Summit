# Traces: the work desk's digest of what the agents did

From reporter@web-summit.dinis (WS-212). Read these JSON files instead of the raw commits: each one is a workflow, from an input (a photo, a voice brief, documents, raw data) to an output (a live page, a deck, a repository), as steps with evidence. Written JSON first, for visualisers and other agents to consume as data (Dinis, 10 November, about 17:35 UTC: agents that save other agents' tokens).

## The shape (ws-trace/1)

Every file has `id`, `size`, `title`, `input`, `output`, `status`, `duration`, `steps[]`, `people_acted`, `agents_acted` and `shape` (the step's fields, spelled out). A step: `n`, `at` (UTC), `actor {name, kind: person|agent|ci|authority}`, `in`, `out`, `handoff {to, via}`, `kind`, `repo`, `sha`, `issue`, `brief`, `for[]`, `evidence[]` (commit, version, url, file, source). `evidence: []` with `evidence_note` means the record holds none. A person's step is where a human acted: those hand-offs are the point. A reader for all of them: [`../materials/storm/README.md`](../materials/storm/README.md#4-a-code-sample-read-the-trace-into-nodes-and-edges).

## The files

| File | Size | What | Steps | In, out | Status |
|---|---|---|---|---|---|
| [`conductor-voice-to-investor-decks.json`](conductor-voice-to-investor-decks.json) | small | The conductor's own work: two spoken asks to two meeting decks in under 15 minutes each | 10 | voice brief, deck | captured to live; the meetings themselves have no evidence yet |
| [`large-documents-to-repository-and-site.json`](large-documents-to-repository-and-site.json) | large | Documents to a new repository and site: GAMMA-Ray, from two documents and a spoken brief to gamma-ray.sgit.ai, the first signed card and FACT-Ray | 17 | documents and voice, repository and site | captured to FACT-Ray (10:20); the site goes on (v0.0.44 at 10:20; about 250 commits by 16:20) |
| [`medium-voice-brief-to-deck.json`](medium-voice-brief-to-deck.json) | medium | A voice brief to a deck: THE RESTART (02:40 UTC) to Dinis's 09:00 team briefing | 9 | voice brief, deck | in progress: the steps to the final deck are captured; the presentation at 09:00 has no evidence yet |
| [`pt-news-newsroom-workflow.json`](pt-news-newsroom-workflow.json) | medium | WS-211: pt.news is about agents. A voice brief to one newsroom workflow, its infographic and a map spec | 6 | voice brief, live page | in progress: the infographic is live; the pt.news redesign waits on PrompTugal's team |
| [`small-badge-photo-to-live-page.json`](small-badge-photo-to-live-page.json) | small | A picture: two badge photos to a live page, the map of 'the individual' | 6 | photo, live page | captured from the record; the page's next stages (unit, research, Kanban) are open under WS-210 |
| [`storm-weather-desk.json`](storm-weather-desk.json) | large | The storm: a red wind warning to a dynamic weather desk, a decision chain and the work desk's first story (plus `decision_graph[]`, `lead_times`, `parser_workflow[]`) | 25 | raw official data, live pages | open: the desk built its own connectors (stages 1, 2 and 4 in one agent), its plan for the page is written and the build asked; the UI is not yet |
| [`2026-11-10-the-storm-incident.json`](2026-11-10-the-storm-incident.json) | incident | The storm as a P1 incident (WS-214): each outside signal (IPMA, government, ANEPC, Câmara, transport, Web Summit) with its own time and the time we first read it, our decisions and hand-offs, each tagged with the 'could happen' items it affects. Shape ws-incident-trace/1: `events[]`, not `steps[]` | 108 events | signals, decisions | open |
| [`medium-yes-to-gamma-ray-scan.json`](medium-yes-to-gamma-ray-scan.json) | medium | A one-word yes to a published GAMMA-Ray scan of 13 agents (Jose's team; offered by conductor@web-summit.jose) | 10 | question and a yes, live page | done |

## Cost

Each run's tokens are in [`../ledger.jsonl`](../ledger.jsonl), for accountant@ to compare with what the readers of these files would have spent on the raw record.
