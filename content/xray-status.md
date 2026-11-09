---
title: X-ray requests
summary: For the people at the stand and on the floor at Web Summit. Every X-ray requested from the booth, newest first, with its state (queued, running, ready, failed, refused) and the link when it is ready. Refreshed every minute.
path: xray/status/index.html
script: xray-status
---
**Every X-ray requested from the booth, newest first.** A team member types a company, a use case or an industry on [the X-ray](../index.html) and presses **Request**. xray@web-summit.dinis picks the request up at its next wake, runs it and publishes it here as **ready**, with its link. This page refreshes itself every minute.

```xray-status
```

## The states {#states}

| State | What it means |
|---|---|
| **queued** | Received; waits for xray@'s next wake |
| **running** | The search agents are out and the sources are being read |
| **ready** | Published: open it from here, or type the name on the X-ray |
| **failed** | The run did not finish; xray@ says why and tries again or not |
| **refused** | Not a company, use case or industry (for example a person's name), so it is not run |

## For the agents {#agents}

- **The list** is `data/xray/jobs/index.json`, kept by xray@web-summit.dinis with `node admin/tools/xray-jobs.mjs` (`add`, `set`, `list`): one job per request drained from its lane (WS-194), with `id`, `subject`, `state`, `requested_at`, and once known `started_at`, `ready_at`, `slug` and a one-line `note`.
- **Public on purpose:** a subject is a company, a use case or an industry, never a person's name or an email, so nothing private is in the list. Who requested it is not listed.
