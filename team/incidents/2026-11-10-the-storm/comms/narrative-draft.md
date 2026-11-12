# Draft: the post-incident narrative (WS-214)

**A draft, not the close-out.** Written by journalist.examples@web-summit.dinis at 21:40 UTC on Wednesday 11 November, from reporter@web-summit.dinis's trace (`team/reporter/traces/2026-11-10-the-storm-incident.json`, close-out draft of 21:25) and this folder. The lead (incident.conductor@web-summit.dinis) closes the incident, not before the 03:47 Thursday read; this draft is then finished with the lead's runbooks and one improvement per role, and published on /examples/ and offered to pt.news's newsroom (it decides). Times UTC (= Lisbon). Press items are labelled.

## What happened

A storm named Charles crossed Portugal on Wednesday 11 November, the third day of Web Summit Lisbon. IPMA put Lisbon under red warnings for wind and rain; the government declared an alert situation for the whole mainland, closing schools and suspending outdoor events; and on Tuesday evening Web Summit called off its Wednesday, on the government's formal advice. The storm then took the path only a tenth of the forecasts had given it, just north of Lisbon, and came in weaker: the strongest gust we recorded at the airport was 74 km/h, below even the orange threshold. IPMA lowered and ended its warnings early. ANEPC, as relayed, counted 1,630 occurrences on the mainland, mostly floods, and called it "much less serious than forecast". No deaths in the sources we read. The alert situation ran its course and ended at 23:59 on Wednesday. Thursday was reported to go ahead.

Our team ran it as an incident from 18:35 on Tuesday, on Dinis's word: P1, on our own account, by his incident-handling method.

## How far ahead could we have known?

| Signal | Published | Before Web Summit's decision (19:09 Tue) | Our first read |
|---|---|---|---|
| AEMET (Spain) names the storm | Mon 10:20 | 32 h 49 min | Wed 02:39 |
| IPMA names the storm | Mon 13:17 | 29 h 52 min | 27 h 36 min later |
| IPMA's red wind for Lisbon | Tue 07:18 | 11 h 50 min | 7 h 4 min later (the press had it at 08:05) |
| The government's alert | Tue 12:10 | 6 h 59 min | 4 h 51 min later |
| Lisbon's mayor: the summit likely cannot run (press) | Tue 13:19 | 5 h 50 min | 5 h 31 min later |
| The government recommends suspending it (press) | Tue 17:53 | 1 h 16 min | 57 min later |
| Web Summit's own decision page | Tue 19:09 | | 39 min (the email, relayed); 1 h 49 min (the page) |

The answer: **the decision was knowable most of a working day ahead.** The red warning, the alert and the mayor's word were all public before lunch on Tuesday. We read each of them hours late, because nothing was watching for them until the incident began.

## What got faster

Once the incident team had a reader for IPMA's CAP feed (from 23:52 Tuesday), IPMA's changes reached us in **13 to 22 minutes** (07:16, 12:33, 15:55 on Wednesday), against 66 to 88 minutes through IPMA's own open data and **2 h 23 min** through the press, which also repeatedly reported IPMA's state of an hour or two before.

## What we got wrong

- **Before the incident, nobody was watching** the government, the city or the mayor: the gap of Tuesday 12:10 to 17:01.
- **The organisers' page was in a section of their site our watch did not read:** 1 h 49 min late.
- **This desk** wrote twice that Web Summit's site was silent when its page had been up since 19:09; and the drafts said "Thursday is on" for ten minutes before the lead corrected it to the organisers' word, an aim.
- **The press as a source:** fast on some facts, behind and looser on IPMA's warnings. The drafts kept to IPMA.

## What went right

- **One source, many audiences.** Every draft (the team, the people we were meeting, the public, Dinis) came from one numbered list of sourced facts, rewritten within ten minutes of each change. No agent sent anything; a person sends.
- **Simulate first.** Plan B for Thursday was written down before anyone acted.
- **Stopping is a decision too.** At 05:25 the lead read Web Summit's terms and stopped every automated read of its site in under two minutes, for Dinis to confirm or undo.
- **"How come this was possible?"** security.repos@ found two MEDIUM issues in the incident's own tools during the incident; both were fixed the same night or flagged.

## The probability question

At 12:01 on Wednesday, 51 ensemble forecasts gave the storm's centre 10% north of Lisbon, 41% near, 49% south. It passed just north. No source in the record put a probability on the summit's closure.

## To finish at close-out (from the lead)

- The runbooks the incident produced (items 1 to 4: unprepared to operationalised).
- One systemic improvement per role (the 5x multiplier).
- Thursday: what happened at the venue, and the full stations' record against the warnings.
