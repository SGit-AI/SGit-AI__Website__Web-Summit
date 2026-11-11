# The incident site: a newsroom for people and a data source for agents (roadmap, in priority order)

> By incident.conductor@web-summit.dinis, 10 November 2026, ~19:20 UTC, from Dinis's direction in his session (close to his words): a separate repository that publishes "super fast"; **"a proxy of the flows of this activity"**, so that we become "a data source for a lot of agencies and a lot of people about what is actually going on"; a full news site ("this should look like CNN") **and** a site that serves data to agents, with provenance, "the data set and the materials for others to consume"; agents in a loop "until the storm is over", capturing "everything now is a signal"; **everything bulky in vaults, GitHub kept strict and fast, and its speed measured**; third-party and open-weight models through OpenRouter, **every call stored and its spend tracked**, as evals. The pipeline it rests on: [PIPELINE.md](PIPELINE.md).

## The shape in one picture

```
 sources (official, press, social, Wikipedia, sensors, imagery)
    |  researcher finds them -> collectors capture them (raw, hashed, timed)
    v
 RAW VAULT (everything: HTML, PDFs, screenshots, API responses, model calls)   <- never on GitHub
    |  curator: dedupe, translate, classify fact / evidence / hypothesis, link to actors and places
    v
 CURATED VAULT (signals.jsonl, facts.json, graph.json, series/*.json)          <- the live data lane, seconds
    |                                   |
    v                                   v
 THE NEWSROOM (people)              THE DATA SITE (agents)
 live page, map, ticker,            /api/v1/*.json, feeds (JSON Feed, Atom, CAP),
 stories, explainers, imagery       datasets with schemas, hourly snapshots, llms.txt
    \___________________ both carry provenance on every item ___________________/
 GitHub: code, schemas, small signed indexes (hashes and vault pointers). Nothing bulky.
```

Every item, everywhere, carries one **provenance record**: source URL, time published (if stated), time captured, sha256 of the raw capture, its vault object, the agent, the model (if a model touched it), and its label (fact, evidence, hypothesis; FACT-Ray band). A reader, human or agent, can walk from any sentence on the site to the raw bytes we saw.

## P0: tonight, before the storm arrives (Wednesday 05:00, IPMA's orange rain)

1. **The repository's strict rule, enforced by the gate.** GitHub holds code, schemas, markdown, and JSON indexes that point into vaults. The gate refuses: any file over 256 KB, any binary (images, PDFs, video, archives), any raw capture, any `node_modules`, any key. Screenshots and raw pages go to the raw vault and are referenced by hash. **Why first:** every byte in git slows every clone, every CI run, every agent's pull, for the life of the repo.
2. **Speed measured on every push.** CI writes `push_at`, `deployed_at` and `first_served_at` (polled from the live URL) into `data/speed.jsonl` in the vault, and the site shows the last 50 pushes. Targets: shell lane ≤ 40 s push to served, data lane ≤ 30 s write to visible. A push over the target opens a board item. (Today's baseline: 3 min 02 s; see PIPELINE.md §0.)
3. **The signal pipeline, as roles with one job each** (sessions or sub-agents, Dinis decides which):
   - **researcher** finds sources and keeps `sources.json` (exists: incident.researcher@);
   - **collector** captures raw into the raw vault on a schedule, per source (connectors; incident.dev@ builds them);
   - **curator** (new) turns raw into signals: dedupe, translate PT to EN, label F/E/H, link actors and places, never invent;
   - **editor/journalist** writes stories from curated signals only (the work desk);
   - **publisher** is the build: it never edits content, it renders it.
4. **The model ledger, from the first call.** One wrapper (`tools/llm.mjs`) for every model call, ours or OpenRouter's. It stores in the raw vault the request, the response, the model and provider, tokens in and out, cost, latency and the task id; and appends one line per call to `ledger.jsonl` (curated vault). The site's `/models/` page shows spend by model, by agent, by hour. No call goes around the wrapper. (The repo already calls OpenRouter in `admin/tools/xray-ask.mjs`; that path joins the ledger.)
5. **The first datasets, live on the data lane:** IPMA warnings (Lisboa and all districts, every change), station observations hourly, LPPT METAR/TAF, the decision graph, the signals stream, the timeline. Each with a JSON Schema and a README.

## P1: Wednesday, while the storm is on

6. **The newsroom front page ("CNN"):**
   - a **live banner**: what is decided now (schools closed, Web Summit open/suspended/unknown, transport), each with time and source;
   - a **hero map**: IPMA warnings by district, coloured and timed, stations with observed gusts, the storm's track from IPMA's communiqués;
   - **imagery**: satellite and radar loops **only where the licence allows reuse** (EUMETSAT, Copernicus and IPMA terms to be read by the researcher first); otherwise a link and a still we are allowed to show;
   - a **live blog** of curated signals, newest first, each with its provenance chip;
   - **status boards**: schools, Metro, Carris, CP, Fertagus, ferries, bridges, the airport, Web Summit and side events;
   - **"what we know / what we don't"** and **"the storm explained"**, with the Wikipedia article linked;
   - the **Flow** (Angelo's live map) and the **Graph** (Silvio's Universe) panes, as PIPELINE.md §5.
   A permanent line on every page: **"Not a warning service. Follow IPMA, ANEPC and your local authorities."** We aggregate; we never advise beyond them.
7. **Everything is a signal, from public sources only:**
   - official: IPMA (warnings, communiqués, observations), ANEPC, government, Câmara (a person reads lisboa.pt; we do not get round its bot check), operators;
   - press: live blogs and agency copy, captured raw (private vault), quoted only in short excerpts with a link;
   - **Wikipedia**: the storm's article and its **edit history** (the MediaWiki API) as a timeline of what the world believed, when;
   - social: platforms readable without a login (Mastodon, Bluesky's public API, YouTube titles). Aggregated by theme and place; **no profiles of private people**; a post is quoted only if public and newsworthy, never to identify someone;
   - sensors: stations, METAR, sea buoys, river levels where public.
8. **The data site for agents:**
   - a static JSON API on the shell lane (`/api/v1/warnings.json`, `/api/v1/signals.json`, ...), each file's latest snapshot plus hourly history;
   - the live data straight from the curated vault (public read key);
   - feeds: JSON Feed and Atom of signals, and **CAP (Common Alerting Protocol)** for the warnings, the format agencies already read;
   - a catalogue (`/datasets/`, schema.org `Dataset`, `llms.txt`) so agents find it without reading pages;
   - per-consumer **API keys** only with a small server in front (a Cloudflare Worker or Lambda: counts use, rate-limits, never needed to read). P1 if Dinis wants usage numbers by agency; otherwise P2.
9. **Models in the loop as evals.** The same curator tasks run on several models in parallel through OpenRouter: Claude, plus open-weight ones (Llama, Qwen, Mistral, DeepSeek, Gemma) and others. Tasks with checkable answers: extract a warning (level, area, window) from a Portuguese news paragraph; translate; label F/E/H; find the actor and time. The curator's accepted output is the reference; each model is scored on accuracy, cost and latency, and `/models/` shows the table as it fills. Only outputs that passed the curator reach the site.

## P2: after the storm

10. **Close-out as a dataset:** the whole incident frozen (raw and curated vaults, signed index), citable (a DOI, e.g. Zenodo), replayable on the Flow pane from the first signal (9 Nov 13:17, IPMA communiqué no. 1).
11. **"How far ahead could we have known":** the lead-time analysis from the meteorologist's and researcher's data, with the model evals' answers beside it.
12. **Contradiction detection:** when two sources disagree on a fact (a time, a figure), the curator flags it and the site shows both, labelled.
13. **The template:** the next incident is `incidents/<date-slug>/` and a scheduled loop, not a new project.

## Rules this direction needs (to agree before P1)

- **Licences:** IPMA's open data allows reuse with attribution; press articles do not. Raw press captures stay in a **private** vault; the site shows excerpts and links. Imagery only under its licence.
- **Safety:** we are an aggregator, not an authority. No forecasts of our own on the newsroom; analysis labelled as analysis; nobody told to travel or not beyond what the authorities say.
- **People:** public sources only; no contact details; no tracking of private individuals; the team's whereabouts never on the site.
- **Keys:** the OpenRouter key goes in the session's environment secrets (never in git or a vault in clear); spend capped per day, with the cap in `ledger.jsonl`.

## Questions for Dinis

1. The repository's name and domain (e.g. `storm.sgit.ai`, or `incidents.sgit.ai` so the next incident fits).
2. The OpenRouter key: add it as this environment's secret for `openrouter.ai`, and give a daily spend cap.
3. Which roles become sessions now (curator, collector) and which stay sub-agents.
4. Raw vault public or private? (Proposed: private for press and screenshots, public for official open data and everything curated.)
5. Per-agency API keys on Wednesday (needs a small server and its credential), or open read-only data for now?
