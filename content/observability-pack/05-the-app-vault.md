---
title: "Observability pack 5: the app vault, the interactive view"
summary: The telemetry application lives in a vault of its own, code only and versioned: nine modules on window.TelemetryApp, one render call, filters like Kibanas, a Sankey of journeys, live checks on focus, and a browser drain. How to load it, and its tests.
---
Vault `5wnsr5h8`, "Who reads PHP October 2026: the application", version 0.4.3 (27 October 2026). **It holds code and no data; its read key can be published.** Every data vault that links it runs its latest version over its own data.

## How it loads {#load}

`app/telemetry-app.js` loads `app/telemetry-app.css` and the modules in order, each registering on `window.TelemetryApp.mod` (classic scripts: the vault host's `sg.loadJs` injects files, so there are no ES imports between files). The data vault's `index.html` calls:

```
await sg.loadJs('telemetry-ux/app/telemetry-app.js')
TelemetryApp.render({ sg, mount: document.getElementById('app'), ux: 'telemetry-ux/' })
```

## The nine modules {#modules}

| Module | Does |
|---|---|
| `core` | shared constants, DOM and SVG builders that **only ever set text** (every event string is untrusted), formats, the event bus |
| `classes` | who sent each session (the rules of [pack 4](../observability-pack/04-the-drain-and-the-reports/index.html#classes)); pure |
| `model` | rows to what every view reads: time (the lane's clock), page, section, group; the filter pills (field = value, negatable) |
| `journeys` | sessions to flows: the Sankey, the page network, paths, what works per page and section; pure |
| `charts` | every chart as SVG from text nodes; every mark is a filter (click to filter, shift-click to exclude); a table beside every chart |
| `live` | reads the vault, the lane and its history; on focus, at most once a minute, lists the lane and pulls the vault |
| `drain` | the Queue and drain page: drain from the browser (list, fetch four batches at a time, open, append, push, then mark) |
| `pages` | the views: Overview, Journeys, What works, One page, Map, When, Audience, Events, About |
| `shell` | the frame, the query bar (time range, pills, colour by), tabs, and per-device state via `sg.state` |

## Tests {#tests}

`node tests/run.mjs <a clone of the data vault>` runs the pure modules (`classes`, `model`, `journeys`, `drain.pool`) over the real drained events: 43 checks at 0.4.3, including that `classes.js` and `telemetry_classes.py` agree on every session.

## For us {#us}

Reuse it as it is: our data vault links the same app vault read-only (or a copy of it, versioned the same way), and gets the views for free. The fields we add (`person`, `sig`, and the agent lane's records) need a small change in `model` and `classes`: a signed, verified `person` is a **declared** team member, ahead of every inferred rule.
