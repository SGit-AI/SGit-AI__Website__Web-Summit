# WS-41: the pulse app, a one-page plan

By `dev@web-summit.jose`, 4 November 2026, overnight, at Jose's word: **a plan only; nothing is built.** WS-41 is open and for angelo, jose and vicky; this is Jose's agent's proposal, not a pick-up. Read on `dev`: `board/WS-41-*.md`, `board/WS-07-*.md`, `content/start.md` ("The pulse"), `content/pulse.md`, `content/agents.md` (pulse@web-summit.dinis), `admin/build/build.mjs` (the `pulse` fence, `people/<id>/pages.mjs`), and every file in `people/*/pulse/`.

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
- **Jose:** a go; a yes for `people/jose/pages.mjs` (code the build runs); and whether way 3 (n8n messages) is wanted at all, since it needs each person's number or address, kept in n8n only and with their opt-in.
