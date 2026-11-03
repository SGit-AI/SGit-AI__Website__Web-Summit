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

1. **Before:** the agenda has its decisions at the top, each with options and a recommendation, and the meeting is on the team's calendar at 13:00 and 18:00 UTC (London and Lisbon in November). The calendar series run to Sun 8 Nov for now; whether they stop on Fri 6 or Sat 7 Nov, before Lisbon, is waiting on confirmation, and the seven going to Lisbon (Dinis, Silvio, Nimay, Angelo, Vicky, Jose and Indi) were invited on 2 November, from their workgroup accounts.
2. **Debrief, within an hour:** each decision is recorded in the decider's own words with `admin/tools/agenda.mjs decide`, and each item not reached is left open so it carries over.
3. **Follow-ups:** each action has one owner and a due time, as a board issue (`picked_by:` set) or an agenda item for the next stand-up. An action with no owner is reported at the start of the next stand-up.

To decide with Vicky (WS-46, WS-47): whether the debrief gets its own page under /meetings/, which would be a change to `admin/build/meetings.mjs` for dev@web-summit.angelo.

**Capture (added by conductor@web-summit.angelo, 3 November, at Angelo's word).** Nobody takes notes in the stand-ups yet, so team-collaboration has nothing to work from. No Claude agent can join a Google Meet call, so capture comes first and team-collaboration processes it (no separate notes agent). The options:

- **Gemini notes or Meet transcripts:** built into Workspace, a Google Doc in the organiser's Drive. Depends on the Workspace edition and the settings Dinis owns (WS-98).
- **A third-party meeting bot** (Otter, Fireflies, Fathom and the like): joins as a participant. Works without changing the edition, but the meeting's audio goes to another company, an admin may have to allow it, and everyone on the call must be told.
- **No tool:** a note-taker on a rota, or a two-minute voice memo after the call (the WS-61 loop). Works today.

Recommendation: the rota or voice memo from today, Gemini notes when WS-98 allows, a third-party bot only if Dinis accepts the trade-off. Raw notes and transcripts go to the private vault ([confidential vaults](https://web-summit.sgit.ai/vault-agent/index.html#confidential)); only decisions and actions come to this repository. Who records the decisions is still open (the 2 November 18:00 item, and WS-107).

## Debriefs {#debriefs}

One entry per stand-up, written by team-collaboration@web-summit.angelo about 40 minutes after it starts. A decision is recorded only in the decider's own words.

### 3 November, 13:00 (written 13:45 UTC)

- **Decisions recorded:** none. By 13:45 nobody had given the words of a decision to an agent or committed one, so all 20 open items carry over to the 18:00, 7 of them from 2 November.
- **Follow-ups due today, each with its owner on the board:** the print sign-off by 16:00 (WS-113) and the first LinkedIn post (WS-126). The GitHub invitations (WS-09/WS-124) are still waiting on a decision about who sends them.
- **To fix the loop:** a decision gets lost when nobody writes it down within the hour. Until WS-107 (who records the decisions) is decided, the fastest path is one line from the chair after each stand-up: "decided: <item>: <words>". That line can go to Angelo, the conductor or any agent, and is recorded with `admin/tools/agenda.mjs decide`.
