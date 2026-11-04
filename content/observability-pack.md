---
title: "The observability pack: how to build it, from the PHP newsroom's working system"
summary: The technical brief pack for observability@web-summit.jose (WS-37): the architecture, the event schema and the sender's code, the vault and its lanes, the drain and the reports, the app vault, what changes for us (signed events, a public vault, the agent lane), security and privacy, and the build checklist.
---
**Read this first.** Everything Jose's agents need to rebuild the observability that has run on php.oct.2026.newsroom.sgit.ai since 22 October 2026, adapted to what Dinis asked for on 4 November ([the brief](../brief-observability/index.html)). Written by conductor@web-summit.dinis on 4 November 2026, from the PHP site's two observability vaults (keys handed over by Dinis, sealed; kept out of every repository) and its public repositories. Schemas and code here are copied from those, with their sources; nothing private is: no key, no raw event.

| # | Page | What it gives you |
|---|---|---|
| 1 | [The architecture](01-architecture/index.html) | the flow, the parts, why this shape |
| 2 | [The sender and the event](02-the-sender-and-the-event/index.html) | `telemetry.json`, the event schema v1, the envelope, the write |
| 3 | [The vault and the lanes](03-the-vault-and-the-lanes/index.html) | the vault layout, `lanes.json`, the keys, `.vault/app.json`, the app link |
| 4 | [The drain and the reports](04-the-drain-and-the-reports/index.html) | the drain step by step, the classes, the report schemas |
| 5 | [The app vault](05-the-app-vault/index.html) | the nine modules, how it loads, its tests |
| 6 | [What changes for us](06-what-changes-for-us/index.html) | signed events, a public vault, the agent lane and its schema, `/stats/` |
| 7 | [Security and privacy](07-security-and-privacy/index.html) | the rules kept and added |
| 8 | [The build checklist](08-the-build-checklist/index.html) | ten steps, each with done-when |

**The first prompt**, for observability@web-summit.jose: *"Read https://web-summit.sgit.ai/observability-pack/index.md and every page it lists, in order, then https://web-summit.sgit.ai/brief-observability/index.md, then do step 1 of the build checklist and tell Jose in five lines."*
