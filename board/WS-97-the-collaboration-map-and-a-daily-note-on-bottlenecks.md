---
id: WS-97
title: The collaboration map, and a daily note on bottlenecks
area: pm
for: angelo, vicky, dinis
due: first note Tue 3 Nov, then daily
status: picked
picked_by: Angelo, team-collaboration@web-summit.angelo
---
Who works with whom, people and agents: who hands what to whom, through which channel (a commit's `For:` trailer, the board, a stand-up item, WhatsApp), and where work waits on one person. Built from what the repository shows: the git log, the board, the pulse, `people/<id>/ack.json` and the stand-ups. Nothing private, and no contact details.

Every day, one short note to Vicky (WS-46, WS-47) and Angelo: the three biggest bottlenecks, one proposal for each, and what changed since the day before.

The first reading, 2 November, about 17:00 UTC:

- **Owners:** 86 of the 94 open issues have nobody in `picked_by:`, and 7 issues due on 2 November are not done.
- **One busy hub:** 23 of the day's 30 agent commits came from Dinis's agents, so most of the work goes through one person's agents.
- **No feedback loop yet:** nobody has a pulse check-in or an `ack.json`, so the briefings cannot say what each person has seen.
- **Meetings:** no stand-up decision has been recorded yet (WS-96).

## Daily note, Wednesday 4 November, 07:45 UTC {#note-2026-11-04}

From the repository: the board, the git log of the last 24 hours, `data/meetings/`, `people/*/pulse/` and `ack.json`.

**The three biggest bottlenecks, each with a proposal:**

1. **Decisions made in calls don't get written down.** Two decisions have ever been recorded, and neither came from a call: one was Jose to his agent, the other Dinis on WhatsApp. 26 agenda items are open, and today's 13:00 inherits most of them. *Proposal:* decide WS-107 (who records decisions) first at the 13:00. Vicky has already chosen option 2: team-collaboration drafts from the transcript and the chair confirms in one line.
2. **Everything goes through Dinis.** In 24 hours, 81 of the 222 agent commits came from Dinis's agents, and 161 `For:` trailers named Dinis or his agents, against 198 for everyone else together. 44 open issues are for Dinis, and 32 of those have nobody in `picked_by:`. *Proposal:* at the 13:00, go through the 32 and let each person say which ones they would take off Dinis. That is the team volunteering, not an agent assigning, and Dinis keeps only what needs him.
3. **The board's dates no longer mean much.** 95 of 119 open issues have no owner, 24 are past their due date, and 52 are due today. *Proposal:* Vicky (WS-46) re-dates the board in one pass, so "due today" means owned and possible. Each overdue issue either gets a new date or is closed as overtaken.

**What changed since the first reading (2 November):**

- Open issues without an owner went from 86 of 94 to 95 of 119. The board grows faster than it is picked up.
- Decisions recorded went from 0 to 2. Pulse check-ins went from 0 to 2 (Jose, Vicky), and briefings acknowledged went from 0 to 1 (Vicky).
- 30 agents committed in 24 hours, with 175 releases. The machine runs; what is scarce is human attention to read and decide.

## Daily note, Thursday 5 November, 07:45 UTC {#note-2026-11-05}

From the repository: the board, the last 24 hours of the git log, `data/meetings/`, `people/*/pulse/`, `ack.json` and WS-160. The same measures as yesterday's note, so the change shows.

**The three biggest bottlenecks, each with a proposal:**

1. **Overdue issues tripled: 24 yesterday, 73 today**, and 37 more are due today. 100 of the 143 open issues have nobody in `picked_by:`. The dates are not being moved as plans change, so "late" no longer tells anyone what matters. *Proposal:* five minutes at the 13:00. Each person moves or closes the dates on their own issues, and project-manager@web-summit.dinis marks any issue that is late with no owner as **parked**, so it drops out of "late" until someone picks it. Yesterday's re-dating pass (WS-46) has not happened.
2. **Decisions still wait on Dinis.** 16 decisions are open: five wait on him alone, and nine more include him. 64 open issues are for him, and 47 of those have no picker (yesterday: 44 and 32). *Proposal:* the 13:00 deck shows the table in WS-96 (whose word closes each decision), and Dinis answers one line per row. Each person names one of his unpicked issues to take, as volunteering, not assigning.
3. **The team produces faster than it reads.** In 24 hours there were 268 releases and 52 agents at work (the 50-agent milestone is reached), but only 2 of 9 people have a pulse check-in and 1 has acknowledged a briefing, both unchanged since yesterday. *Proposal:* the dashboards show "Needs me" first and little else (direction 2 of the 4 November 14:30). Agents put "Affects everyone:" first in a commit only when it does (conductor@web-summit.jose's rule, 088770e0).

**What changed since yesterday:**

- **The first stand-up records exist.** conductor@web-summit.jose captured both 4 November stand-ups from Jose's notes. It is settled that team-collaboration writes the record and the deck reads it. Decisions recorded went from 2 to 4, none of them yet in the decider's words from a call.
- **The machine is observable:** 9 agents log their runs (WS-160).
- **Work through Dinis's agents** fell from 36% of agent commits to 34% (137 of 408). `For:` trailers naming his side were 297 of 768.

## Daily note, Friday 6 November, 07:45 UTC {#note-2026-11-06}

Same measures as the last two notes. Three days to opening night (Mon 9 Nov).

**The three biggest bottlenecks, each with a proposal:**

1. **"Late" has stopped meaning anything: 108 overdue (73 yesterday, 24 the day before).** 70 of them have nobody in `picked_by:`. Yesterday's proposal (owners move their dates; late and unowned issues get parked) was not taken up. *Proposal, as one decision for the 12:00:* park every late, unowned issue until after the summit, in one pass by project-manager@web-summit.dinis, so the board shows only what is owned and still possible before Lisbon. Anyone can unpark one by picking it. This is for Vicky (WS-46) and Dinis to say yes or no in one line.
2. **Decisions still wait on Dinis: 21 open, 20 of them with him in.** The two decided in calls since Wednesday came from Angelo's notes, not from Dinis (the 12:00 move, the generic cards). *Proposal:* ten minutes for Dinis in his cockpit before the 12:00 (people/dinis/, "decide in one click"). The 12:00 deck opens with the five ranked items (WS-150's "What needs us today", once conductor@web-summit.dinis applies the patch routed on 5 November; not yet applied).
3. **A stand-up without notes leaves no record.** Thursday's 18:00 is still unrecorded: no notes, no transcript, and a newsroom decision visible only as a side effect (17548bfe). *Proposal:* the chair names a note-taker in the first minute of each stand-up (the 12:00's follow-up 2), and the notes go to any conductor within the hour. team-collaboration turns them into the record.

**What changed since yesterday:**

- Decisions recorded: from 4 to 6, both from Angelo's notes of the 12:00. The first stand-up of the day at 12:00, by the team's vote.
- 96 of 152 open issues have no owner (100 of 143 yesterday): a little better.
- Work through Dinis's agents: 31% of agent commits (100 of 321), down from 34%. 56 agents at work, 224 releases, and 12 agents now log their runs (9 yesterday).
- Unchanged: 2 of 9 people with a pulse check-in, 1 acknowledgement.

## The whole team as one map (6 November, 11:30 UTC) {#map}

At Angelo's ask: his command centre's map, extended to everyone and their agents. `node people/angelo/tools/team-map.mjs` builds it from the repository (`admin/build/inventory.mjs`, the roster, `people/<id>/agents.json`, and every commit's `For:` lines over the last 7 days): an HTML page, or `--json` for the command centre. What it shows today:

- **9 people, 86 agents, 68 of them committing in the last 7 days; 2,086 `For:` messages between them.**
- **The hub:** conductor@web-summit.dinis is written to most (326), then Dinis himself (182), then the conductors of Vicky (152), Angelo (135) and Jose (86). The strongest pairs all run through Dinis: Dinis–Vicky 176, Angelo–Dinis 157, Dinis–Silvio 121, Dinis–Jose 111, Dinis–Indi 88. The strongest pair without him is Angelo–Vicky, at 49.
- **Dark corners:** Nimay's four agents have not committed (0 of 4), nor Daniela's (0 of 3) or Sarah's (0 of 2). Dinis–Nimay is one message in a week, which matters because Nimay carries the business side (meetings, investors, the first five companies).
- **Thin links between the others:** Jose–Vicky 2, Indi–Jose 3, Nimay–Silvio 3. The team talks through Dinis, rarely across.
