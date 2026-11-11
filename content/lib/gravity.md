---
title: "Gravity: a universe visualization library"
date: 2026-11-11
summary: "Centres of gravity, what orbits them, and the traffic between them: a 3D constellation, a lens over one centre, and the detail of one item. Versioned, with a latest folder."
author: dashboard@web-summit.silvio
---
Gravity draws any system as a universe. At the top is a **core**; around it, **centres of gravity**; around each centre, the **nodes** that belong to it; between nodes, the **flows** that travel. You fly into a centre and see it through a **lens** (cards that aggregate its nodes, with gold lines to each one), then open one node's **detail**. Every element is a button; the path at the top leads back; + / − and a pinch zoom; PT and EN; full screen; extra views come in as **plugins**.

It began as the Universe of the RiskMandate team on this site (people as centres, their agents as nodes, the agents' messages as flows, an agent's behaviour policy as its detail). The same library can draw the Lisbon Tech Fringe (venues, sessions, events), or workloads spread across clouds and environments.

## Versions

- Latest, always the newest: `https://web-summit.sgit.ai/lib/gravity/latest/gravity.js`
- Pinned, never changes: `https://web-summit.sgit.ai/lib/gravity/v0/v0.1/v0.1.0/gravity.js`

A new version adds a folder (`v0/v0.1/v0.1.1/`, `v0/v0.2/v0.2.0/`) and updates `latest/`; old folders stay as they are.

## Use

```html
<div id="universe" style="min-height: 80vh"></div>
<script src="https://web-summit.sgit.ai/lib/gravity/latest/gravity.js"></script>
<script>
Gravity.mount(document.getElementById('universe'), {
  lang: 'en',
  data: {
    core: { label: 'Lisbon Tech Fringe' },
    centres: [ { id: 'lx-factory', label: 'LX Factory', color: '#43D9C6' }, { id: 'beato', label: 'Hub Criativo do Beato', color: '#FF7FB0' } ],
    nodes: [ { id: 'talk-ai-agents', centre: 'lx-factory', label: 'AI agents at work', ok: true }, { id: 'meetup-rust', centre: 'beato', label: 'Rust meetup', ok: false } ],
    flows: [ { from: 'talk-ai-agents', to: 'meetup-rust', count: 12, at: '2026-11-12T10:00:00Z' } ],
    feed: [ { at: '2026-11-12T10:00:00Z', from: 'talk-ai-agents', to: ['meetup-rust'], text: '12 people walked from one to the other' } ]
  },
  strings: { agents: ['Sessões', 'Sessions'], noPol: ['Por confirmar', 'Unconfirmed'], withPol: ['Confirmadas', 'Confirmed'] },
  detail: (id, api) => '<div class="ai"><b>' + api.esc(id) + '</b>…</div>',
  views: []
})
</script>
```

## The data

| Field | What it is |
|---|---|
| `core.label` | the name at the centre |
| `centres[]` | `id`, `label`, `color`: the centres of gravity |
| `nodes[]` | `id`, `centre` (a centre's id), `label`, `ok` (true or false: drawn teal or red, counted in the lens), `last` (optional text) |
| `flows[]` | `from`, `to` (node or centre ids), `count`, `at` (ISO time): the traffic, drawn as arcs with travelling light |
| `feed[]` | `at`, `from`, `to[]`, `text`, `tag`: the latest traffic, listed in the Conversation view |

## The options

| Option | What it does |
|---|---|
| `lang` | `'pt'` or `'en'` (the viewer can switch) |
| `strings` | `{ key: [pt, en] }`, to name things in the system's own words (for example `agents`, `noPol`, `withPol`, `people`, `msgsN`) |
| `detail(id, api)` | the HTML of a node's detail, shown in the panel |
| `metric` | `{ pct, of, total }`: one headline figure in the panel (for example the share of barriers that really stop an agent) |
| `views[]` | plugins: `{ id, label: [pt, en], icon (an SVG path), mount(host, api), show(anim), frame(ms), zoom(k), resize() }` |
| `tourCentre` | the centre the Stand tour flies into |

`api` gives a plugin the library's parts: `t` (strings), `esc`, `ico`, `Fan` (the lens), `orb`, `go`, `openNode`, `lang`, and `$` (an element by id inside the view).

## Where it runs

It runs in a Shadow DOM, so it never touches the page around it. It loads three.js (0.147.0) and its bloom pass from jsDelivr, and two Google fonts. A classic script: no build step, no modules.

The RiskMandate adapter (`assets/cc/stand.js`) is the first user: it reads the team live and adds three plugin views (Three shields, X-Ray, GAMMA-Ray).
