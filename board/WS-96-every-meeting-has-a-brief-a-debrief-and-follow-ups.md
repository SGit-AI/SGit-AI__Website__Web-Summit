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

### Recorded since the last debrief (5 November, 03:50 UTC)

- **WS-134, Jose's security watcher: how far does it watch?** Decided by Jose, 00:54 UTC, in his words: "WS-134, my security watcher: the whole team, read-only, as recommended. It reads what is already public in the repository and writes only to its own folder." (On the 4 November 13:00 agenda.) Follow-up: none named.

### Yesterday's open decisions: whose word closes each (5 November, 06:55 UTC, for the 13:00)

At Dinis's note of 5 November (via conductor@web-summit.angelo, fe778310): close what can be closed from the decider's own words before 12:40. None of the 17 open decisions from 2 to 4 November has all its deciders' words in the repository, so none is marked decided. One is closed as **overtaken**: WS-23's new date (Vicky did WS-23 on 4 November, 17:30, e7ff1865). For each of the rest, the words already given, and what would close it:

| Decision | Words already given | Closes it |
|---|---|---|
| WS-107 who records the decisions | Vicky: option 2 (dd767b7b). Settled between the agents: team-collaboration writes the record, the deck reads it (1b60a458) | Dinis and Angelo, one line each |
| WS-34 may dev@web-summit.angelo change shared code through a picked issue | Jose: yes (1c0fc837) | Dinis and Angelo |
| WS-129 agents talk through commits only, in CLAUDE.md | Jose: yes (1c0fc837) | Dinis (CLAUDE.md is his) and Angelo |
| WS-126 LinkedIn: owner, voice, first post | Silvio: "3 Indi" (0fdfc91a); Jose's 18:00 notes: Dinis adds the team as page operators | Dinis, Nimay, Indi, Angelo |
| WS-141 the newsroom: Indi's patch, push access, desks | Indi: "not yet" (no desk before Dinis decides the split, feda6ff1) | Dinis |
| WS-09 / WS-124 who sends the GitHub invitations | conductor@web-summit.angelo: Angelo sends, from the-neuronin (56633899), not in Angelo's quoted words | Angelo in his words, then Dinis |
| WS-25 the first five companies | none (Vicky's 4 Nov meeting with Nimay left it unchanged, 6d22fa75) | Nimay proposes five; Silvio, Vicky |
| WS-64 Vicky's agents' inbox in the Feedback pane | none | Dinis, Angelo, Vicky |
| WS-125 Daniela's setup | none | Dinis, Angelo, Indi, Daniela |
| Move the midday stand-up from 13:00 | none | everyone |
| WS-15 who writes the RiskMandate paragraph | none | Nimay, Dinis, Indi |
| WS-90 who reviews the gate and release script | none | Dinis |
| Protect main on GitHub; the start page to WhatsApp; the OKRs; one priority this week | none | Dinis |

Five of the 16 wait on Dinis alone, and nine more include him. A one-line answer per row, said as "decided: <item>: <words>", closes them all.

### 5 November, 12:00 (the first at 12:00; written 13:55 UTC, from Angelo's notes)

**Present:** Angelo, Jose, Silvio, Vicky. Dinis, Nimay and Indi were not there. **Source:** Angelo's notes, quoted in conductor@web-summit.angelo's 1fd27ba3. No transcript: Dinis's tool was not on the call.

**Decided:** personal business cards: in Angelo's words, "present team members are ok with generic business cards". That is for those present only: the three team cards, no personal cards for Angelo, Jose, Silvio and Vicky. Recorded on the item.

**Not decided:** the garments stay open, with the new facts: only whoever holds the confirmation or receipt collects them (who that is, still to clarify), and they are ready Monday or Tuesday, not known yet (WS-48).

**Follow-ups (one owner each; due):**

| # | What | Owner | Due | Issue |
|---|---|---|---|---|
| 1 | The last stand-ups' notes were not turned into actions. From now on, within an hour of each stand-up, every note becomes an owned follow-up here, and the next stand-up opens with them | team-collaboration@web-summit.angelo | each stand-up | WS-96 |
| 1a | The deck's second slide, easier to use | conductor@web-summit.dinis | the 18:00 | WS-150 |
| 2 | No transcription when Dinis is not on the call. Meanwhile the chair asks at the start who takes notes | Dinis (WS-98); the chair, each stand-up | today | WS-98 |
| 3 | How we write an article on the spot after talking to a lead | Dinis (with Nimay, Indi) | not given | WS-168 |
| 4 | Hot leads: the process, and what it is for | Vicky (with Nimay) | not given | WS-29 |
| 5 | The commercial offers we have up our sleeve | Dinis (with Nimay) | not given | WS-21 |
| 6 | Our strategy for the Web Summit app | Nimay (with Indi, Silvio) | not given | WS-169 |
| 7 | Pending decisions and follow-ups lack context: each decision on the deck with two lines of context, options and a recommendation, and follow-ups with owner and due | conductor@web-summit.dinis, with team-collaboration@web-summit.angelo | the 18:00 | WS-150 |
| 8 | Garments: who holds the receipt, and the ready day | procurement@web-summit.silvio | before Monday | WS-48 |
| 9 | The printer's brief still lists personal cards; those present want team cards only | designer@web-summit.indi, procurement@web-summit.silvio | before printing | WS-155 |

**Transcripts (WS-98):** conductor@web-summit.jose proposes, for the 18:00, that Dinis turns on Meet transcripts and that the writer of the record reads them through a Claude Google Drive connector (ad383223). Its open question, whether a scheduled session has the connector: team-collaboration@web-summit.angelo's does. Its scheduled debrief runs on 3 and 4 November searched Angelo's Drive and mail for a transcript. Angelo organises both stand-up series, so Meet saves their transcripts to his Drive, which this agent reads. Nothing of a transcript goes into the repository; only decisions in the decider's words and follow-ups.


### 5 November, 18:00 (pending: checked 19:17 UTC)

- **Not yet written.** By 19:17 UTC no decision from the call was recorded in `data/meetings/`. No notes were passed on, and no Meet transcript is in Angelo's Drive (searched; he organises the series, so a Meet transcript would land there). Every open item carries over to Friday's 12:00.
- **Moved before the call:** project-manager@web-summit.dinis made each duplicate pair one item (b44c6294): the outreach claim (WS-26) and the Monday merch collection (WS-48).
- **The 12:00's nine follow-ups** stay as written above until someone reports progress.
- **A lead (21:45):** curator@web-summit.vicky put sources under every storyline on the candidates page "at the 18:00 stand-up's word" (17548bfe, WS-14). So the 18:00 decided something about the newsroom, but no words are recorded. Asked of conductor@web-summit.vicky.
- **What would close this:** Angelo's or anyone's notes of the call, passed to conductor@web-summit.angelo or committed (as on 4 and 5 November), or Dinis's transcript.

### 6 November, 12:00 (written 13:20 UTC, from Angelo's notes)

**Present:** Angelo, Dinis, Indi. **Source:** Angelo's notes, routed by conductor@web-summit.angelo (d7e29b42), each quoted in its issue. No transcript (none in Angelo's Drive).

**Directions, in Angelo's notes' words** (not answers to agenda items, so no item is closed):

- "we need to find people to operate a backoffice, they need to support operations from outside the summit" (WS-180)
- "we should have a way to coordinate the team and our logistics using the page Angelo has been putting together in the command center, we need to know where everybody is, and coordination"; "the above should be done in 2 vaults, one public, one private" (WS-181)
- "on the promptugal news we should have enough data to support participants with the summit logistics" (WS-182)
- "we should be able to beat the other agencies reporting on the web summit with our newsroom, and we can leverage what other agencies publish" (WS-183)
- "we should enable a lot more models through OpenRouter" (WS-115)

**Not decided (carried):** parking the late, unowned issues (project-manager@web-summit.dinis has the list ready: 45 to park, 21 kept, d3742cc1); Silvio's PromptUGAL push access (WS-177, per mentor@web-summit.dinis 1d0601fe); the ranked five (WS-48, WS-26, WS-09, WS-107, WS-125).

**Follow-ups (owner; due):**

| What | Owner | Due | Issue |
|---|---|---|---|
| Who runs a back office from outside the summit | Dinis | before Mon 9 Nov | WS-180 |
| A design for team coordination and logistics in the command centre (two vaults; no location in the repository or a public vault; security review before real locations) | dev@web-summit.angelo with vault@web-summit.angelo; Angelo's go before building | design first | WS-181 |
| PrompTugal.news with the summit's logistics for participants | the newsroom, with logistics@web-summit.vicky's facts | before Mon 9 Nov | WS-182 |
| PrompTugal.news ahead of the other agencies, citing them, never copying | the newsroom | during the summit | WS-183 |
| More models through OpenRouter: which, for whom, keys and budgets | Dinis (keys and money) | not given | WS-115 |
| Park the late, unowned issues: yes or no | Vicky and Dinis | the 18:00 | WS-46 |

### 6 November, 18:00 (pending: checked 19:20 UTC)

- **Not yet written.** By 19:20 UTC no decision from the call was recorded in `data/meetings/`. No notes were routed by a conductor, and there is no Meet transcript in Angelo's Drive. Every open item carries over to Saturday.
- **Still open from today:** the garment files (Dinis's yes, or Monday's collection slips, WS-48), parking the late, unowned issues (the list is ready), the outreach claim (WS-26), WS-177, and the rest of the ranked list.
- **What would close this:** notes from whoever took them, routed by any conductor (as on 5 and 6 November).

### Recorded since the last debrief (7 November, 03:50 UTC)

- **WS-48, the merch on Monday 9 November: who collects it, and how** (on the 5 November 18:00 agenda, for Dinis, Silvio and Vicky). Recorded as decided by Silvio, 01:11 UTC, in his words: "I already said I go on Monday with Dinis; we go to Web Summit together, so we go straight to pick it up, if everything is done." Follow-up: Silvio and Dinis collect on Monday on the way to Lisbon, if the order is ready. The garment files (Dinis's yes, from the 6 November 18:00) are still open.

### 7 November, 12:00: did not happen

No stand-up at 12:00 (conductor@web-summit.dinis 7aca7dd0; Angelo, relayed in a074e47f). Its agenda carries to the 18:00. Nothing decided; the parking, WS-48, WS-26 and WS-170 stay open.

### 7 November, 18:00 (pending: checked 19:17 UTC)

- **Not written.** By 19:17 UTC nothing from the call was recorded in `data/meetings/`: no conductor had routed notes, and there was no Meet transcript in Angelo's Drive. No commit says whether the call took place. Every open item carries over, and the next stand-up is Sunday's 12:00.
- **Still open:** parking the late issues nobody owns (the list is ready), WS-48's garment files before Monday's collection, the outreach claim (WS-26), the per-agent tokens (WS-170), then WS-09, WS-107 and WS-125. Angelo's back-office proposal (WS-180) is with Dinis.
- **What would close this:** notes from whoever took them, routed by any conductor.
