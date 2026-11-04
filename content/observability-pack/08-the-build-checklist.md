---
title: "Observability pack 8: the build checklist for observability@web-summit.jose"
summary: Step by step, with what done looks like: the agent and its key, the vault and its lanes, the sender on the teams site, the drain, the stats page, the newsroom, the agent lane, the app, and the security review.
---
For **observability@web-summit.jose**, from [its brief](../brief-observability/index.html). Each step is released and said in one line to Jose (and a commit `For: conductor@web-summit.dinis`).

| # | Step | Done when |
|---|---|---|
| 1 | **Read this pack in order**, then the PHP site's public code (`assets/telemetry.js`, `admin/build/telemetry_drain.py`, `telemetry_classes.py`, `telemetry_publish.py`) | you can say in five lines how an event gets from a page to a count |
| 2 | **Your session key** (`pki-agent.mjs keygen --session`), its public half in `data/keys.json` | listed on /keys/ |
| 3 | **The data vault** on dev.send.sgraph.ai (`sgit create`, with the SG/Send access token from your environment), the drain key pair in it (`identity/`), three lanes configured in one call (site, newsroom, agents) and the same layout as [pack 3](../observability-pack/03-the-vault-and-the-lanes/index.html) | a self-test: write, list, fetch, open, mark processed, on each lane |
| 4 | **`assets/telemetry.json` and `assets/telemetry.js`** on the team's site (copy the PHP script; the envelope from `assets/feedback.js`; add `person` and `sig` when `window.WSKeyring.person` is set), loaded on every page from the page template in `admin/build/build.mjs` (ask conductor@web-summit.dinis, which owns it, or send the one-line change) | an event from your own test browser reaches the lane, and one signed by a team key verifies |
| 5 | **The drain** (`admin/tools/telemetry_drain.py`, from the PHP one plus `verify()` from `feedback_drain.py`), run at each of your wakes | `drain/` and `reports/` in the vault; the report copied to `data/telemetry-report.json` |
| 6 | **`/stats/`** (`content/stats.md`, built from `data/telemetry-report.json`) | Dinis can see who on the team read the newsroom's brief |
| 7 | **The newsroom**: the same script and config there (a patch to newsroom@web-summit.dinis, or Indi's and Vicky's agents once they can push) | newsroom counts on its about page |
| 8 | **The agent lane**: `admin/tools/agent-log.mjs`, and one paragraph for every agent on the agents page (through conductor@web-summit.dinis) | ten agents reporting their runs |
| 9 | **The app**: link the app vault read-only from the data vault (`telemetry-ux.link.json`, `index.html`, `.vault/app.json`), extend `model` and `classes` for `person` | the views over our data, in the vault |
| 10 | **Security review** of steps 4 to 9 by security@web-summit.dinis before each is announced | a verdict in the review |
