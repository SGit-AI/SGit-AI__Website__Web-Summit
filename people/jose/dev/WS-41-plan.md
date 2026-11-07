# WS-41: the pulse app, a one-page plan

By `dev@web-summit.jose`, 4 November 2026, overnight, at Jose's word: **a plan only; nothing is built.** WS-41 is open and for angelo, jose and vicky; this is Jose's agent's proposal, not a pick-up. Read on `dev`: `board/WS-41-*.md`, `board/WS-07-*.md`, `content/start.md` ("The pulse"), `content/pulse.md`, `content/agents.md` (pulse@web-summit.dinis), `admin/build/build.mjs` (the `pulse` fence, `people/<id>/pages.mjs`), and every file in `people/*/pulse/`.

## Status, 4 November 2026 (23:42 UTC): step 1 started, at Jose's word

Jose: "go on step 1 only." WS-41 stays open on the board for Angelo, Jose and Vicky; this work is linked to it (`Issue: WS-41`), not a pick-up.

- **Done:** the reminder line is in Jose's own conductor's prompts (`people/jose/kit/README.md`, conductor@web-summit.jose, both the start prompt and the scheduled-wake prompt, which re-reads the kit each wake), as the test. The same line, for every conductor, is proposed to conductor@web-summit.dinis in a commit `For: conductor@web-summit.dinis` (`people/jose/dev/WS-41-conductor-line.md`). No other person's conductor is changed.
- **Step 2 approved by Jose on 7 November (C30: *"step 2 (the pulse view) yes; step 3 (the answer page) after the summit"*) and built:** `people/jose/pages.mjs` and `people/jose/dev/pulse-view.mjs`, at https://web-summit.sgit.ai/people/jose/pulse/ , from his own pulse files only. **Step 3, the answer page, waits until after the summit.**
- **Out for now:** way 3 (n8n messages). No numbers or addresses are collected.
- **The measure:** `node people/jose/dev/pulse-count.mjs` (and `--person jose`), check-ins per day and slot from `people/*/pulse/` file names only. **Before**, on 4 November at 23:42 UTC:

| Day | Morning | Midday | Evening |
|---|---|---|---|
| 2026-11-03 | 1 (vicky) | 0 | 1 (jose) |

Total: 2 check-ins.
That is 2 of the 54 slots of 3 and 4 November for 9 people, none on 4 November, and 1 of Jose's 6. **After:** the same command from 5 November, written here by dev@web-summit.jose at each scheduled wake for a week, Jose's slots first.

**After, 1 (5 November, 09:35 UTC, dev@web-summit.jose's scheduled wake):** still 2 check-ins in total, the same two as before; no new file in `people/*/pulse/` since the test started at 23:42 on 4 November, for anyone. The only slot due since then for Jose is 5 November morning; his conductor's 07:20 wake was the first with the reminder line. Its brief 8 (`57c685ae`, 07:24) does not mention the pulse; whether it asked Jose in its session report can't be seen from the repository. Too early to judge: the next counts are at 15:30 today and at each wake until 11 November.

**Changed at Jose's word, 5 November (C19, `2191c0b2`): the reminder is replaced.** Jose's conductor no longer asks at each wake; Jose does one interview a day (Claude Chat voice mode) and the conductor turns it into `people/jose/pulse/<date>-evening.md`. So from 6 November the measure for Jose is **one check-in a day, the evening slot**, and a day without it is the miss to look for; his morning and midday slots are no longer expected. The measure itself needs no change (`pulse-count.mjs --person jose` shows the evening column). The comparison for the reminder line still holds for the other eight people only if their conductors take the proposed line (`WS-41-conductor-line.md`, a proposal to conductor@web-summit.dinis, unchanged).

**After, 2 (5 November, 15:35 UTC, scheduled wake):** still 2 check-ins in total, the same two; no new pulse file for anyone since 23:42 on 4 November. The reminder ran at two of Jose's conductor's wakes before C19 replaced it: 07:20 (brief 8 doesn't mention the pulse) and 12:20 (brief 9, `people/jose/briefs/2026-11-05T1225Z.json`, "Due today for you": *"WS-41: your pulse for today: none yet in people/jose/pulse/. One line: how it felt."*). No check-in followed by 15:35.

**After, 3 (6 November, 09:35 UTC, scheduled wake):** still 2 check-ins in total, no new pulse file for anyone since 23:42 on 4 November. Under the new way, Jose's first expected check-in is this evening's (from his daily interview); the next count is at 15:30.

**After, 4 (6 November, 15:34 UTC, scheduled wake):** still 2 check-ins in total, no new pulse file for anyone. Jose's evening slot hasn't come yet; the first count that can show it is 7 November at 09:30.

**After, 5 (7 November, 09:34 UTC, scheduled wake):** still 2 check-ins in total. **Jose's first interview-based evening pulse (6 November) did not come:** his conductor's brief 14 (`c421d53c`, 07:22) says *"Your daily interview: none came in last night"* and his Drive folder has had no new file since the morning of 6 November, so there was nothing to turn into a pulse. Not a fault in the measure. Team-wide, pulse@web-summit.dinis's 08:40 run (`2df42d66`) reports no check-ins since 3 November. Next count at 15:30.

## The problem, in numbers

WS-41 asks for "the agent interview prompt, a reminder at each slot, and a view of the team's pulse over time." The files version works, but on the morning of 4 November there are **2 check-ins** in `people/*/pulse/` (Vicky, 3 November morning; Jose, 3 November evening), out of about 36 slots due since check-ins started on 3 November (WS-07; 9 people, the slots of 3 November and the morning of 4 November). Nobody is reminded (the pulse agent lists who hasn't checked in today in `content/pulse-summary.md`, but nobody is told) and it takes an agent session to answer. **So the first thing to build is the reminder, and the second is a way to answer in under two minutes without opening a session.** The view over time matters only once there is data.

## The slots

Three a day, with the six questions from the start page. Proposed reminder times, before the pulse agent reads (`pulse@web-summit.dinis`, `cron 40 8,12,17 * * *` in its quick-start section of `content/agents.md`; the same page says 08:40, 13:10 and 19:40 in two other places, its table and its own section. The reminders below follow the cron; if the other two are right, the midday and evening reminders move to 12:45 and 19:15. The owner should settle which is true):

| Slot | Reminder (UTC; Lisbon is UTC in November) | Why then |
|---|---|---|
| morning | 08:15 | before the 08:40 read |
| midday | 12:15 | before the 12:40 read and the 13:00 stand-up |
| evening | 17:15 | before the 17:40 read and the 18:00 stand-up |

## Reminders at each slot: three ways, cheapest first

1. **Each person's conductor asks** at its own wake, which is already close to the slots (Jose's conductor runs at 07:20, 12:20 and 17:20). It asks the six questions, or offers a one-line "same as last time, plus …", and commits the file. *Needs:* one line in every conductor's prompt (`content/agents.md`, "The two agents everyone runs"), which conductor@web-summit.dinis keeps. No new code, no contact details.
2. **A nudge on the site.** The For-you panel (`assets/me.js`) already knows who is looking. It could show "your midday pulse is open: two minutes" when the slot has no file. *Needs:* `assets/me.js`'s owner, and a small JSON at build time of which slots are filled.
3. **A message by n8n** (WhatsApp or email) at each slot, with a link. Needs each person's number or address *in n8n only*, and each person's opt-in. It's the most reliable nudge and the most to set up; worth it only if 1 and 2 don't move the numbers.

## Answering without a session

A page with the six questions (each optional, with the feeling question first because it is the quickest) that **sends the answers over an append lane to the person's own conductor**, signed with the person's key in the browser (`assets/keyring.js`; `feedback_drain.py` already verifies such signatures against `data/person-keys.json`). The conductor drains it and commits `people/<you>/pulse/<date>-<slot>.md` as now, so the files format and the `pulse` fence don't change. It is the same transport as WS-74, which is live. *Needs:* a lane per person's conductor (each conductor makes its own, as vault@web-summit.jose did), and the person's key in their browser (the "Add your key" box on every page, `6dd0b1bd`). The pulse is public by design, so sealing protects only the path, which is fine.

## A view over time

A page built from `people/*/pulse/` at build time: a grid of people × days × slots (answered, or empty), the blockers (question 2) of the last 24 hours in one list, and each person's feeling line over the days, as written. No score is invented from the feelings. If the pulse agent tags a mood, that tag is shown, labelled as derived. Hosted first as Jose's own page (`people/jose/pages.mjs`, the per-person pages Indi's agent already uses), so it needs no change to the shared build. If the team likes it, it moves to `/pulse/` with conductor@web-summit.dinis's agreement.

## What I would build first

1. **This week, the reminder (way 1):** propose the conductor prompt line as a commit `For: conductor@web-summit.dinis`, and add it to Jose's own conductor first (people/jose/kit/README.md, at Jose's word) as the test. Measure: check-ins per slot in `people/*/pulse/`, before and after.
2. **Then, the view:** `people/jose/pages.mjs` with the grid and the blockers list, tested on the two real files. It shows the gap honestly from day one. `pages.mjs` is code the build runs, so it needs Jose's yes before the reviewer passes it (WS-133).
3. **Then, the answer page** on Jose's conductor's lane, once Jose's conductor has a lane and Jose's key is in his browser. Jose first, then whoever wants it.

## What it needs from others

- **conductor@web-summit.dinis:** the prompt line for every conductor (way 1); the pulse agent's real schedule settled in `content/agents.md`; a yes before the view moves to `/pulse/`.
- **Angelo and Vicky** (WS-41 is also theirs): who picks it up, and whether Vicky's pm agent wants the view for WS-46.
- **Each person's conductor:** its own append lane, for the answer page.
- **Owners of `assets/me.js`:** the site nudge (way 2), if wanted.
- **Jose:** answered on 7 November (C30): step 2 yes (built), step 3 after the summit; way 3 is out (4 November).
