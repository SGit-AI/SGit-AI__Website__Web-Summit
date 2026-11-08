---
id: WS-194
title: "X-ray: the booth request path (a name typed at the booth becomes a request the agent runs at its next wake)"
area: riskmandate
for: dinis, silvio
due: Mon 9 Nov
status: picked
picked_by: dev@web-summit.silvio (with conductor@web-summit.silvio)
agents: proposed by conductor@web-summit.silvio (people/silvio/promptugal/joining-xray.md); xray@web-summit.dinis reviews
---
Part of WS-191. The site is static and the OpenRouter key can never be in a page, so a name typed at the booth cannot run live. It must become a request (a write-only lane, as the feedback pane does with a vault: WS-114) that the agent with the key picks up at its next wake, runs (`admin/tools/xray-search.mjs`, then the reading of sources), and publishes as `/xray/<slug>/` with status `prepared`. The stand sees a status per request (queued, running, ready). The page calls one function, `requestXray(subject)` in `assets/xray.js`, which today stores nothing and says the path is coming: wire it there. A subject is a company, a use case or an industry: no person's name, and never an email. How a visitor's email is kept for the follow-up pack is Dinis's decision and is not part of this issue.

The rules for every X-ray task: public facts only, each with its URL and the date read; what a model says is a lead until its source is read; no claim for RiskMandate beyond riskmandate.ai (it "measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record", and is "never in the request path: read-only by design"), so a simulation never shows RiskMandate blocking an action; no visitor's email in the repository or in a page's storage (how to keep it is Dinis's call); the OpenRouter key never in a page.

**7 November, 19:25 UTC, conductor@web-summit.silvio:** picked for Silvio's team, at Dinis's "Yes keep going" (WS-191) and Silvio's "go with the three areas". dev@web-summit.silvio wires `requestXray(subject)` in `assets/xray.js` to a write-only lane (the WS-114 pattern), with a job per request (queued, running, ready) and a status for the stand. The plan: `people/silvio/xray/booth-pipeline.md`. No visitor email anywhere; the key never in a page.

**8 November, dev@web-summit.silvio, at Silvio's yes (step 1 of 3: the request reaches xray@):**

- **The lane:** `admin/tools/lane_for.py xray@web-summit.dinis --as dev@web-summit.silvio` made xray@'s inbox vault `daq2zzam` with a write-only append lane, sealed its credentials to `xray-dinis` (`data/inbox/lane-xray-dinis.json`; only xray@ can open it, dev@ kept no copy) and added the lane to `assets/feedback.json`.
- **The page** (`assets/xray.js`, a small change For: xray@web-summit.dinis): a subject that is not prepared now shows **Request an X-ray of …**. Pressed by a team member whose key is in the browser, `requestXray(subject)` signs `{v, id, subject, at, by_booth}` with that key, seals it to xray@'s public key as the feedback pane does, and appends it (`type: web-summit.xray-request/v1`). Refused: under 2 or over 80 characters, anything like an email, a phone number or a link, and any browser without a team key. Nothing is sent before the button, nothing is kept in the browser, no readable key in the page. Checked in Chromium: the button shows, and without a key it refuses with no request to the lane.
- **For xray@web-summit.dinis:** open `data/inbox/lane-xray-dinis.json` with your key, write the creds file, and drain with `admin/tools/feedback_drain.py`; act only on requests with a verified team signature.

**Left:** step 2, a job per request (`data/xray/jobs/<id>.json`: queued, running, ready, failed, refused) written by xray@ at its wake; step 3, the stand's status view (one line per job, the link when ready). **For Dinis:** the wake speed on 12 November (hourly, or every 15 to 20 minutes), and whether a visitor may type a subject or only the team (today: only the team, by the key rule).
