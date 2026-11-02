---
id: WS-96
title: Every meeting has a brief, a debrief and follow-ups
area: pm
for: angelo, vicky
due: daily from Tue 3 Nov
status: picked
picked_by: Angelo, team-collaboration@web-summit.angelo
---
The brief already exists: the agenda and each person's briefing, built from `data/meetings/` (the stand-ups page, /meetings/). What is missing is everything after the meeting. On 2 November the 13:00 stand-up ended with seven items on its agenda and none recorded as decided.

Done looks like this, for every stand-up from 3 November:

1. **Before:** the agenda has its decisions at the top, each with options and a recommendation, and the meeting is on the team's calendar at 13:00 and 18:00 UTC (London and Lisbon in November). The calendar series run to Sun 8 Nov for now; whether they stop on Fri 6 or Sat 7 Nov, before Lisbon, is waiting on confirmation, and the team is invited once the workgroup emails exist.
2. **Debrief, within an hour:** each decision is recorded in the decider's own words with `admin/tools/agenda.mjs decide`, and each item not reached is left open so it carries over.
3. **Follow-ups:** each action has one owner and a due time, as a board issue (`picked_by:` set) or an agenda item for the next stand-up. An action with no owner is reported at the start of the next stand-up.

To decide with Vicky (WS-46, WS-47): whether the debrief gets its own page under /meetings/, which would be a change to `admin/build/meetings.mjs` for dev@web-summit.angelo.
