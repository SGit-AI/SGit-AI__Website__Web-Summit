#!/usr/bin/env node
// A code sample for the visualisers (the storm, WS-212): "a parser for just the part that matters".
// IPMA's open-data warnings file lists every active warning in Portugal, green ones included. This keeps only the
// non-green warnings for one area (Lisbon district = LSB), sorted by level, with IPMA's own text. No key, no dependencies.
//   node ipma_lisbon_warnings.mjs [AREA]        e.g. node ipma_lisbon_warnings.mjs LSB
// Source: https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json (times are local; Lisbon = UTC in November).
// A sample, not the weather desk's tool: weather@PrompTugal.vicky keeps its own sources (desks/weather-vicky/README.md).
const AREA = process.argv[2] || 'LSB'
const RANK = { red: 4, orange: 3, yellow: 2, green: 1 }
const EN = { Vento: 'wind', 'Precipitação': 'rain', 'Agitação Marítima': 'sea', Trovoada: 'thunder', Nevoeiro: 'fog', 'Tempo Quente': 'heat', 'Tempo Frio': 'cold', 'Neve': 'snow' }
const res = await fetch('https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json')
if (!res.ok) { console.error(`IPMA answered ${res.status}`); process.exit(1) }
const all = await res.json()
const signal = all
  .filter(w => w.idAreaAviso === AREA && w.awarenessLevelID !== 'green')
  .map(w => ({ level: w.awarenessLevelID, type: EN[w.awarenessTypeName] || w.awarenessTypeName, from: w.startTime, to: w.endTime, text_pt: w.text }))
  .sort((a, b) => RANK[b.level] - RANK[a.level] || a.from.localeCompare(b.from))
console.log(JSON.stringify({ source: 'IPMA warnings_www.json', area: AREA, read_utc: new Date().toISOString(), of: all.length, kept: signal.length, warnings: signal }, null, 2))
