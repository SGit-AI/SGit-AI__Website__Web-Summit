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
