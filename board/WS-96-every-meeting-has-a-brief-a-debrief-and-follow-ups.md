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

**Who writes the record (settled between the agents, 4 November 20:35):** conductor@web-summit.dinis answered (a) (1b60a458, on WS-150), and conductor@web-summit.angelo confirmed it (79f3cb77). The conductor's deck shows what is to decide and the follow-ups before each stand-up. team-collaboration@web-summit.angelo writes the record after it: each decision in the chair's or decider's own words with `agenda.mjs decide`, and the follow-ups here. The next deck reads that record. One writer for the agenda, one for the record. WS-107 itself (who confirms, the chair) is still for Dinis, Angelo and Vicky to decide in their own words.

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

### 4 November, 13:00, held at 14:30 (from Jose's notes; written 5 November, 01:00 UTC)

**The record:** `data/meetings/2026-11-04-1300/20261104T2338-captured-the-14-30-stand-up-s-direction-a.json`, captured by conductor@web-summit.jose at Dinis's ask, from Jose's notes. These are Jose's words, not a transcript. They give **directions** (Dinis) and **action items** (owners named by Jose). No agenda decision is closed by them: each still needs its decider's own words (WS-107).

**Directions:** a 'best of' briefing before each meeting, so the meeting is for decisions (WS-96, WS-150); dashboards about action, with blockers and decisions first (WS-94, WS-06); an accountant agent per person for token use (WS-148); keys are an experiment for now (WS-136); the pipeline to design partners and customers, Portugal mapped first, by Friday or Monday (WS-26, WS-27, WS-30); 50 active agents (WS-95).

**Follow-ups (owner; due):**

| What | Owner | Due | Issue |
|---|---|---|---|
| Write access to the newsroom repository for Indi | Dinis or Angelo | not given | WS-145, WS-151 |
| Vault-to-vault lanes | Silvio and Angelo | not given | WS-120, WS-114 |
| Business cards: each person's agent makes theirs from Indi's prompt | everyone; Indi collects | Thu 5 Nov | WS-155, WS-113 |
| Which target companies should meet, and who we know at each | Indi, with the team | not given | WS-27, WS-69 |
| Share contacts (Web Summit app, LinkedIn) for a "who do we know there" map | everyone | not given | WS-24 (no issue for the map itself) |
| The accountant agent, proposed | Jose | until Jose says yes | WS-148 |

### 4 November, 18:00 (from Jose's notes; written 5 November, 01:00 UTC)

**The record:** `data/meetings/2026-11-04-1800/20261104T2359-captured-the-18-00-daily-sync-s-direction.json`, captured by conductor@web-summit.jose at Jose's word, from Jose's notes. These are Jose's words, not a transcript, and no agenda decision is closed by them (WS-107).

**Directions:** a daily interview of each person by their conductor, by voice, written up (WS-41, WS-47, WS-07); business cards: three summit designs with no names, about 200 each, one per audience (WS-155, WS-142, WS-146); routine observability through scheduled agents, with a real notification for urgent work (WS-37); the newsroom pipeline: researcher, curator, journalist, correspondent (WS-14, WS-141).

**Follow-ups (owner; due):**

| What | Owner | Due | Issue |
|---|---|---|---|
| The observability workflow, end to end | Jose with Angelo | not given | WS-37 |
| Public slides on LinkedIn; the team as operators of the page | Dinis | not given | WS-126 |
| Taglines for approval; print the cards; QR stickers, three concepts | Indi | not given | WS-155 |
| Token and context optimisation; practise onboarding someone; help/FAQ on the site | Angelo | not given | WS-148, WS-35, WS-124 (the help page: helper@web-summit.angelo's /help/) |
| The newsroom researcher, the pipeline running | Vicky | Fri 6 Nov | WS-14, WS-141 |

**Still open (to decide):** tagline and sticker approval (WS-155); who manages the LinkedIn page (WS-126); how vault entries are never left unprocessed (WS-114); two people still without a key (WS-136); easier briefs with one-way and two-way decisions (WS-112). **No issue yet:** the urgent notification (WS-37's note), and the "who do we know there" map.
