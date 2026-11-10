# Incident: the storm on Wednesday 11 November (run as P1)

> Declared (board WS-214) by conductor@web-summit.dinis at Dinis's word ("I want to run this weather situation as an incident, only here in our account", in his own session, 10 November 2026, about 18:35 UTC). Run on account A, by Dinis's agents only. Vicky's weather desk (`desks/weather-vicky/` in PrompTugal__News__Website) covers the storm as news. This incident reads its public outputs and never writes to them.
>
> **Method:** Dinis's incident-handling series (February 2026), in DinisCruz/NotebookLM__Infographics-and-slides, `by-date/2026/Feb/12/`:
> 1. P3-as-P1 philosophy;
> 2. running P3-as-P1 in practice: the seven steps;
> 3. the best time to fix things: the 5x multiplier;
> 4. simulation, communication, escalation;
> 5. the football team: practice and preparation.
>
> Also his "Second stories: from Three Mile Island to cybersecurity" (docs.diniscruz.ai, 10 February 2025).

## 1. Declaration

- **What happened:** IPMA's red warnings for the Lisbon district on Wednesday 11 November: wind from 12:00 to 21:00, rain from 12:00 to 18:00. The government declared an alert situation for the whole mainland, 00:00 to 23:59: schools and non-essential public services close, and outdoor events are suspended. At 19:38 UTC Web Summit told attendees that Day 2 (Wednesday) will not take place, on the government's formal advice; Day 3 (Thursday) aimed to go ahead. Sources and times: `desks/weather-vicky/live.md` and S41 on promptugal.news.
- **Why it is a P1 for us:** Wednesday is the team's main day at the summit (the stand, the RiskMandate demos, interviews, meetings). **P3-as-P1:** we analyse the whole union of what could happen, not only what has happened.
- **Severity, as run:** P1. **Status:** open. **Lead:** incident.conductor@web-summit.dinis (from 18:58, taken over from conductor@web-summit.dinis at Dinis's word). **Owner:** Dinis.

## 2. Assembly (account A only)

| Role | Agent | In this incident |
|---|---|---|
| Lead | incident.conductor@web-summit.dinis (from 18:58; conductor@web-summit.dinis before) | runs the steps, the timeline, the decisions log, the comms to Dinis; routes the incident team (meteorologist, researcher, dev: `team/incidents/agents/`) |
| Reporter (on the ground) | reporter@web-summit.dinis | the evidence trace of the incident: each signal, decision and hand-off, as it happens (`traces/2026-11-10-the-storm-incident.json`) |
| Journalist | journalist.examples@web-summit.dinis | the communication drafts per audience, and the post-incident narrative |
| Signals | social.watch@PrompTugal.dinis (confirmed by Dinis, ~18:42; writes in PrompTugal__News__Website, the lead copies into the timeline) | what people at the summit are saying: closures, transport, side events |
| Security | security.repos@web-summit.dinis | "how come this was possible" for our own systems: what fails if the stand, the venue's network or travel fail |
| Cost | accountant@PrompTugal.dinis | what the incident costs in tokens, and what it saves (the case of 17:15) |

"How come this was possible?" is a valid question from every role.

## 3. Situation awareness: the union of what could happen

| # | Could happen | Who it touches | What we would need |
|---|---|---|---|
| 1 | **HAPPENED, 19:38 UTC: Web Summit's Day 2 will not take place (its email to attendees; Day 3 aimed as planned).** Web Summit suspends or shortens Wednesday (outdoor parts, or the whole venue) | the stand, demos, meetings, interviews | a plan B for every Wednesday commitment: move, go online, or move to Thursday |
| 2 | Lisbon transport stops or thins (metro, trains, buses, ferries, taxis) | everyone getting to the venue or home | the decision to stay put, and who is where |
| 3 | The venue opens but people do not come | the stand, footfall, demos | the demos online (pt.news, the app on the web, the live views), and the follow-ups |
| 4 | Power or network fails at the venue | the stand laptop, tablets, live demos | offline demos (the app's offline mode, PDFs, local video) |
| 5 | Side events and meetups move or cancel | meetings, investor and partner conversations | each one re-confirmed, a person sends |
| 6 | Thursday changes too (the storm runs on, or the programme moves) | the whole plan | the same tree, one day later |
| 7 | A person on the team is at risk | the team | safety first: no one travels against the guidance |

## 4. Investigation: the decision graph and the weak signals

Who decides what, in what order, with what lead time: IPMA's warnings, then ANEPC and the government's alert, then the Câmara and the schools, then transport operators, then Web Summit. Vicky's weather desk keeps the public graph (`desks/weather-vicky/decision-chain.md`, `history.md`). Here we keep **our** graph: each of the team's Wednesday commitments, and which outside decision would move it, with the time we should decide by. The question to answer afterwards: **how far ahead could we have known, and when was the right moment to decide?**


**How far ahead could we have known? (ANALYSIS; recomputed 21:00 UTC against the primary source: Web Summit's page published 19:09 UTC, not the 19:38 email)**

| Earlier signal | UTC | Lead time to the decision (19:09) |
|---|---|---|
| IPMA communiqué no. 1 names CHARLES (orange warnings expected) | 9 Nov 13:17 | ~29 h 52 min |
| IPMA red wind for Lisbon (Lusa) | 10 Nov 08:31 | 10 h 38 min |
| The government's alert situation (outdoor events suspended) | 10 Nov 12:10 | 6 h 59 min |
| Lisbon's mayor: "Tudo indica que a Web Summit não poderá funcionar amanhã" (press) | 10 Nov 13:19 (13:23 in the weather desk's record; both from press, unresolved) | 5 h 50 min (5 h 46 min) |
| The government recommends suspending Web Summit | 10 Nov 17:53 | 1 h 16 min |

First reading (analysis, not fact): by 13:19 the chain IPMA red → national alert → the mayor's public expectation pointed one way, almost six hours before the organisers decided; a plan B for Wednesday was decidable on Tuesday early afternoon. The full answer, with the meteorologist's lead times (storm ~47 h, red wind ~27.5 h, red rain ~18.5 h before their start), goes in the close-out.

**Lesson (for the close-out, one systemic improvement):** the decision was public on Web Summit's own site at 19:09, on a path we did not watch (`/blog/web-summit/`, outside the news list and the paths we checked). We learned it at 19:52 from an email and the press, 43 minutes later, and found the page at 20:58. Watch every section of an organiser's site (its sitemap and every blog category), not only the pages a person would open. Connector asked of incident.dev@ (J6).

## 5. Runbook assessment (the preparation spectrum)

For each item in section 3, where are we: **unprepared, practised, operationalised or automated**? Today all seven are unprepared. The incident moves at least the first four to operationalised: a runbook and a named person.

## 6. Documentation and timeline

- `timeline.md`: every signal and decision, UTC, with its source.
- `decisions.md`: what we decided, when, by whom, and on what evidence.
- **Simulate before acting:** every change of plan is written here first and checked by the lead before anyone acts or sends.
- **Communications, one source, many audiences:** the team (WhatsApp, a person sends), the people we are meeting (a person sends), the public (pt.news through the newsroom), Dinis (the conductor's brief). The journalist drafts them; a person sends.

## 7. Close-out and learning

When Wednesday is over, the incident closes with:
- the timeline;
- the answer to "how far ahead could we have known";
- the runbooks it produced;
- one systemic improvement per role (the 5x multiplier);
- the post-incident narrative (journalist.examples@) for pt.news and /examples/ (WS-212).

Nothing about a person's private details, and no contact details. Where people are, and their safety, stay in the team's private channels.
