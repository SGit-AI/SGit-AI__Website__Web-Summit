---
title: "Observability pack 1: the architecture"
summary: The whole system on one page: the browser seals one event per page view and writes it to a write-only append lane; a drain opens the lane into a private vault; counts are published; a separate app vault reads the data vault. As built for php.oct.2026.newsroom.sgit.ai, and what changes for us.
---
From the PHP newsroom's observability, as it runs since 22 October 2026 (built by observability@php.newsroom, editor Dinis Cruz). Studied by conductor@web-summit.dinis on 4 November 2026 from its two vaults (keys handed over by Dinis, sealed) and the site's public repository.

## The flow {#flow}

```
 reader's browser                         dev.send.sgraph.ai                      the drain (an agent, or the app)
 ┌──────────────────────────┐            ┌──────────────────────────────┐        ┌──────────────────────────────────┐
 │ assets/telemetry.js      │  POST      │ telemetry vault 84wr8mib     │  list  │ admin/build/telemetry_drain.py    │
 │ 1 event / page / session ├──write───►│  lane 1..5 (append tokens)   ├─fetch─►│ or the app's Queue & drain page   │
 │ sealed to the drain key  │  (blind)   │  bare/append/<token>/pending │  mark  │ opens each with the drain key     │
 └──────────────────────────┘            └──────────────────────────────┘        │ -> drain/<date>.jsonl (private)   │
                                                                                 │ -> reports/<date>.json (counts)   │
                                                                                 │ -> site data/telemetry-report.json│
                                                                                 └──────────────────────────────────┘
 the app vault 5wnsr5h8 (code only) ── linked read-only at telemetry-ux/ ──► the telemetry vault's index.html renders it
```

## The parts {#parts}

| Part | Where | What it is |
|---|---|---|
| **The sender** | the site: `assets/telemetry.js`, `data/telemetry.json` | ~100 lines; seals the event in the browser ([pack 2](../observability-pack/02-the-sender-and-the-event/index.html)) |
| **The lanes** | the telemetry vault's append lanes | write-only; the token is published; the write response is blind ([pack 3](../observability-pack/03-the-vault-and-the-lanes/index.html)) |
| **The data vault** | `84wr8mib`, private | identity (keys), `drain/`, `reports/`, a link to the app ([pack 3](../observability-pack/03-the-vault-and-the-lanes/index.html)) |
| **The drain** | `admin/build/telemetry_drain.py` (Python) and the app's `drain.js` (browser) | list, fetch, open, append, mark processed, count ([pack 4](../observability-pack/04-the-drain-and-the-reports/index.html)) |
| **The classes** | `admin/build/telemetry_classes.py` and the app's `classes.js` | who sent a session: reader, team, synthetic, crawler ([pack 4](../observability-pack/04-the-drain-and-the-reports/index.html)) |
| **The public report** | the site's `data/telemetry-report.json` and `data/telemetry-public.json`, rendered at `/admin/telemetry/` | counts only ([pack 4](../observability-pack/04-the-drain-and-the-reports/index.html)) |
| **The app** | vault `5wnsr5h8`, code only, versioned | the interactive view over the data vault ([pack 5](../observability-pack/05-the-app-vault/index.html)) |

## Why this shape {#why}

- **No server of our own**: the site is static (GitHub Pages); the only server is the vault host, which stores ciphertext.
- **Write-only from the web**: the append token can write and nothing else; it cannot list, read or delete, and every write returns exactly `{"ok": true}`. So it is safe to publish.
- **Encrypted at the source**: the browser seals each event to the drain's public key; the host never sees an event.
- **Data and code apart**: the data vault holds keys and rows; the app vault holds only code (its read key can be published), so one app version serves every data vault that links it.

## What changes for us {#ours}

[Pack 6](../observability-pack/06-what-changes-for-us/index.html): a person's signature on the event, a public vault (at Dinis's word), and a third lane for agents' runs.
