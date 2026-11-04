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

### 3 November, 13:00 (pending: waiting for the transcript, checked 14:16 UTC)

- **Not yet written.** The 13:40 run came while the stand-up was still going, so it records nothing yet; all items stay open until then. Dinis's transcription of the call is the source: once it is shared, team-collaboration@web-summit.angelo drafts each decision from the decider's own words, lists the follow-ups with an owner and a due time, and the chair confirms.
- **Due today in the meantime, each with its owner on the board:** the print sign-off by 16:00 (WS-113) and the first LinkedIn post (WS-126).
- **Checked at 14:16 UTC:** no decision from the 13:00 recorded in `data/meetings/`, and no transcript shared with Angelo's account yet. Every item stays open and goes to the 18:00 agenda.
- **Learned:** the stand-ups run longer than 30 minutes, so a debrief at 40 minutes past is too early. It waits for the transcript instead.

### 3 November, 18:00 (pending: waiting for the transcript, checked 19:16 UTC)

- **Not yet written.** By 19:16 UTC no decision from the 18:00 was recorded in `data/meetings/`, and no transcript had reached Angelo's account. Every open item carries over to Wednesday's 13:00.
- **Moved since the 17:40 brief (from the repository, not the call):** the sizes sync was closed because WS-130 is done (project-manager@web-summit.dinis). Vicky gave her view on who records the decisions (WS-107): option 2, team-collaboration drafts and the chair confirms. That is one view, not yet the decision. WS-23: Vicky and Nimay go through the booked meetings on Wednesday, before the 18:00.
- **The pattern:** across two days and four stand-ups, no decision taken in a call has reached the repository. Decisions that were written down came by other routes (WhatsApp, a person to their own agent). Deciding WS-107 at the Wednesday 13:00 would close that gap.

### 4 November, 13:00, held at 14:30 (pending: waiting for the transcript, checked 15:17 UTC)

- **Moved for today only:** 14:30 to 15:00 UTC, at Angelo's word. Dinis was at lunch, and some found 13:00 inconvenient. Whether to move it for good is a decision on this agenda, for everyone.
- **Not yet written.** By 15:17 UTC no decision from the call was recorded in `data/meetings/`, and no transcript had reached Angelo's account. Every open item carries over.
- **Moved outside the call (from the repository):** Silvio confirmed the order with the chosen printer, asked it for collection on Monday 9 November, and kept the first printer as the fallback (WS-48). Silvio is still waiting for the printer's written answer. The conductor put the stand-up's presentation on the site (/meetings/2026-11-04-1300/show/).

### 4 November, 18:00 (pending: checked 19:20 UTC)

- **Not yet written.** By 19:20 UTC no decision from the call was recorded in `data/meetings/`. conductor@web-summit.dinis's 18:00 deck was built at about 17:10, before the call, so its "decisions and follow-ups" slide is the agenda, not the outcome. Every open item carries over to Thursday's 13:00.
- **Out of date on the agenda:** WS-23's item ("cannot be done today: a new date") is still open, but Vicky marked WS-23 done for now at 17:3x (five booked meetings in the private vault). Its owner can close the item in one line.
- **The gap, day three:** six stand-ups, and not one decision taken in a call has reached the repository. WS-107 (who records) is still open, 1 day late.
