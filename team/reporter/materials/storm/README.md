# The storm: materials for the visualisers

From reporter@web-summit.dinis (the work desk, WS-212), for dashboard@PrompTugal.angelo and Jose's and Silvio's dashboard agents. The data is in [`../../traces/storm-weather-desk.json`](../../traces/storm-weather-desk.json). As of 17:25 UTC on 10 November 2026. Public sources only.

## 1. Two lanes: what we did, and what the authorities did

The story has two timelines. **Ours** is made of commits by the team's agents and people (`steps[]`, `lane: "ours"`). **Theirs** is the authorities' decisions (`decision_graph[]`), each read from a public source by weather@PrompTugal.vicky. Draw them one above the other on the same time axis. The gap between a decision and the moment we first read it is the story.

```mermaid
flowchart LR
  subgraph theirs[The authorities]
    I1[IPMA names CHARLES<br/>9 Nov] --> A1[ANEPC Aviso 21<br/>9 Nov 20:30]
    I2[IPMA red wind, Lisbon<br/>Wed 12:00-21:00] --> G[Government: situacao de alerta<br/>10 Nov 12:10<br/>a) schools close b) outdoor events suspended]
    G --> L[District and city commissions<br/>not read: 403]
    G --> WS[Web Summit / venue<br/>no notice at 16:55]
    G --> T[Transport operators<br/>no suspension at 16:59]
  end
  subgraph ours[Our team]
    C[curator@ commissions S41<br/>14:08] --> J[journalist@ drafts from IPMA JSON<br/>14:25]
    J --> V((Vicky: yes<br/>14:36)) --> R[reviewer@ publishes S41<br/>14:36]
    R --> W[hourly watch<br/>IPMA + Web Summit only]
    D((Dinis: a weather agent<br/>~16:50)) --> CB[conductor.B@ starts weather@<br/>16:52]
    CB --> WD[weather@: source map, live page<br/>16:56] --> DC[weather@: decision chain<br/>17:02]
    DC --> S43[curator@ commissions S43<br/>17:06]
    D2((Dinis: the storm is the case study<br/>~17:15)) --> GU[conductor@ guidance<br/>17:11]
  end
  I2 -. first read 14:23 .-> J
  G -. first read 17:01, 4 h 51 min later .-> DC
```

Circles are a person acting. Boxes are agents. Dotted lines are "we read it", and their length is the lead time.

## 2. The lead-time strip (the "how far ahead" view)

| Signal | Published (UTC) | We first read it | Lag |
|---|---|---|---|
| IPMA names storm CHARLES | 9 Nov (date only) | not in our record | |
| ANEPC Aviso 21 to the population | 9 Nov 20:30 | 10 Nov ~17:00 (desk) | about 20 h 30 min |
| IPMA red wind for Lisbon, Wednesday | 10 Nov 07:18 (its CAP message, found at 23:52) | 10 Nov 14:23 | about 7 h 4 min |
| Government alert: schools close, outdoor events suspended | 10 Nov 12:10 | 10 Nov 17:01 | about 4 h 51 min |
| Web Summit's own decision | none at 16:55 | | |

UI idea: one horizontal bar per signal, from "published" to "first read". The bar is red while nobody on the team has read the source. Under it, a second bar from "first read" to "published by us". This shows where a new source watcher, the connector Dinis asked for, would have saved hours. Here it is the government's news page, which was outside the S41 watch.

## 3. The parser workflow: what really happened (18:25 UTC)

Dinis's five stages, against the record (`parser_workflow[]` in the trace):

| Stage | What happened | Evidence |
|---|---|---|
| 1. a raw source | many: IPMA's `warnings_www.json` (one area, `idAreaAviso: "LSB"`, of all of Portugal's warnings), the communiqué RSS, the government's page | the desk's README source map |
| 2. a request for a parser | **skipped**: weather@ built its own readers, one per source, on the guidance | `78d3a0cd` (17:52) |
| 3. the plan as markdown | written by the desk itself, for the storm page, not by an architect | `cc99e9b2` (17:52) |
| 4. developer and designer | asked at 18:13 (dev.graphs@, designer@), after Vicky's yes to build | `d826acce` (18:13) |
| 5. checked; the UI | not yet | |

What this shows: a capable desk agent does stages 1, 2 and 4 itself, in one commit, about 40 minutes after the guidance. The hand-off to the specialists comes only for the public page. Draw stage 2 as a skipped slot, not an empty one.

## 4. A code sample: read the trace into nodes and edges

```js
// node: turns team/reporter/traces/<id>.json into nodes and edges for a graph view
import fs from 'node:fs'
const t = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const nodes = new Map(), edges = []
for (const s of t.steps) {
  nodes.set(s.actor.name, { id: s.actor.name, kind: s.actor.kind })   // person | agent | ci | authority
  for (const to of [].concat(s.handoff?.to ?? [])) {
    edges.push({ from: s.actor.name, to, at: s.at, what: s.out, via: s.handoff.via, evidence: s.evidence.map(e => e.url) })
  }
}
for (const d of t.decision_graph ?? []) nodes.set(d.node, { id: d.node, kind: 'authority', at: d.at, status: d.status })
console.log(JSON.stringify({ nodes: [...nodes.values()], edges }, null, 2))
```

Every trace in `team/reporter/traces/` has the same `steps[]` shape (`shape` at the top of each file), so the same reader draws the badge photo, the decks, GAMMA-Ray and the storm.
