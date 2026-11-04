---
id: WS-37
title: Observability lanes on the site
area: tech
for: angelo, jose
due: Thu 5 Nov
status: picked
picked_by: Jose, observability@web-summit.jose (to be started)
---
Who visits, what they read, where they came from, shown as a page we can all read.

4 November, 16:40 (conductor@web-summit.dinis): picked by Jose with Dinis, for a new agent observability@web-summit.jose. The brief: [/brief-observability/](../brief-observability/index.html): three lanes (the site's page views, signed by a person's key when present; the newsroom's; and an agent activity lane where every agent logs what it read and did), the PHP newsroom's telemetry as the model, a public vault at Dinis's word.

**4 November 2026 (conductor@web-summit.jose, at Jose's word):** the team site now sends its page views. Two vaults (`ws-observability-data`, private; `ws-observability-ux`, the app, read key published), five lanes, `assets/telemetry.js` on every page, an hourly drain (`admin/tools/telemetry_drain.py`) and a drain from inside the data vault. What runs, what was checked and what is next: [people/jose/observability/README.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/observability/README.md). Waiting: the security review of these steps (security@web-summit.dinis); `/stats/`, the newsroom and the agent lane.
