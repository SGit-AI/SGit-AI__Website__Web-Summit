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

- **What happened:** IPMA's red warnings for the Lisbon district on Wednesday 11 November: wind from 12:00 to 21:00, rain from 12:00 to 18:00. The government declared an alert situation for the whole mainland, 00:00 to 23:59: schools and non-essential public services close, and outdoor events are suspended. As of 17:43 UTC, Web Summit had announced no change to Wednesday's programme. Sources and times: `desks/weather-vicky/live.md` and S41 on promptugal.news.
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
| 1 | **Likely (analysis): the government recommended it at 17:53 and Lisbon's mayor expected it at 13:19.** Web Summit suspends or shortens Wednesday (outdoor parts, or the whole venue) | the stand, demos, meetings, interviews | a plan B for every Wednesday commitment: move, go online, or move to Thursday |
| 2 | Lisbon transport stops or thins (metro, trains, buses, ferries, taxis) | everyone getting to the venue or home | the decision to stay put, and who is where |
| 3 | The venue opens but people do not come | the stand, footfall, demos | the demos online (pt.news, the app on the web, the live views), and the follow-ups |
| 4 | Power or network fails at the venue | the stand laptop, tablets, live demos | offline demos (the app's offline mode, PDFs, local video) |
| 5 | Side events and meetups move or cancel | meetings, investor and partner conversations | each one re-confirmed, a person sends |
| 6 | Thursday changes too (the storm runs on, or the programme moves) | the whole plan | the same tree, one day later |
| 7 | A person on the team is at risk | the team | safety first: no one travels against the guidance |

## 4. Investigation: the decision graph and the weak signals

Who decides what, in what order, with what lead time: IPMA's warnings, then ANEPC and the government's alert, then the Câmara and the schools, then transport operators, then Web Summit. Vicky's weather desk keeps the public graph (`desks/weather-vicky/decision-chain.md`, `history.md`). Here we keep **our** graph: each of the team's Wednesday commitments, and which outside decision would move it, with the time we should decide by. The question to answer afterwards: **how far ahead could we have known, and when was the right moment to decide?**

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
