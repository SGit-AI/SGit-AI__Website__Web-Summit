# The client pipeline: UI and UX, a first start

conductor@web-summit.indi for Indi, 14 November 2026. Indi is picking up the client pipeline (Angelo's crm-pipeline project, `people/angelo/projects/crm-pipeline/BRIEF.md`; its STATE says the lead had not started). This is a start on the design only: no build, no change to the private CRM. Names in examples are made up.

## The ask, in one line

One place where the team records each new connection, moves it through the stages, and always knows who owns it and what happens next. Angelo, 13 November: "to contact", "to follow up", "in conversation", "call booked", "proposal", "won", "parked", with follow-up, conversation and call booked looping until won or parked. Dinis: "yes we need a CRM for that".

## Who uses it, and for what

| Who | When | What they need in that moment |
|---|---|---|
| A team member, just after a chat | at a stand or event, on a phone, one hand | Add a person in under 10 seconds: name, company, stage, a short note. Nothing else is required. |
| The owner of a contact | each morning | "Who do I need to chase today?" One list, oldest first. |
| The owner, after a call or email | at a desk | Move the contact on, write what happened, set the next date. |
| The team, at a weekly review | on a laptop or a shared screen | See the whole funnel: how many at each stage, what is stuck, who owns what. |
| An agent (inbox, outreach) | when it drafts or reads mail | Read who owns a contact and the last note; suggest a stage change for a person to accept. |

## The stages, as a model

```
to contact ──> to follow up ──> in conversation ──> call booked ──> proposal ──> won
                    ^                  │                 │              │
                    └──────────────────┴─────────────────┘              │
                          (the loop: back to follow up)                 │
   any stage ──────────────────────────────────────────────────> parked (with a reason)
```

- Every contact has exactly one stage and one owner.
- **Every open contact has a next step and a date.** That one rule is what makes the "today" list work. Won and parked need none.
- Parked asks for a reason (one tap: no budget, wrong fit, no reply, timing, other) and an optional "revisit on" date, so parked is not a graveyard.
- Each change writes a line to the contact's history: from, to, who, when.

## The four screens

**1. Quick add (phone first)**
- One field open: name. Below it: company, stage (defaults to "to follow up"), owner (defaults to me), note, next date (defaults to in 2 days).
- One tap to save. Target: 3 taps and some typing.
- Same rule as the follow-up list today: names and roles only, no email or phone. The form blocks anything that looks like one.

**2. Today (the home screen)**
- "Due today and overdue", for me first, then for everyone.
- Each row: name, company, stage pill, the last note in one line, and three actions on the row itself: **Done, next...** (moves the stage on and asks for the next date), **Snooze** (+2 days, +1 week), **Open**.
- Target: chase-and-update in 2 taps, without opening the record.

**3. Board (the funnel)**
- One column per stage, cards grouped or filtered by owner.
- Drag a card to move it on a laptop. On a phone, the board becomes stage tabs with a count each, and "move" is a button.
- Column headers show counts and how many are overdue.
- Won and parked fold away by default.

**4. The record**
- Header: name, company, role, owner, stage, next step and date, all editable in place.
- Timeline: notes, stage changes and follow-ups in one list, newest first.
- Agents' suggestions show as "suggested by inbox-vicky: move to call booked" with Accept and Dismiss.

## Click budget (targets to test against)

| Task | Target |
|---|---|
| Add a contact after a chat | 3 taps |
| Chase someone due today and set the next date | 2 taps |
| Move a contact to the next stage | 1 tap (plus a date) |
| Park a contact | 2 taps (park, reason) |
| Find a contact by name | 1 tap into search, then type |

## Three directions to choose from

| | A. Board first | B. Today first | C. Capture first |
|---|---|---|---|
| Home screen | the funnel board | my list for today | a big "Add" button and recent adds |
| Best for | weekly reviews, seeing the whole pipeline | daily chasing, owners | events and stands |
| Weak at | daily follow-ups on a phone | the big picture | everything after capture |

**Recommendation: B, with A one tap away and C as a button on every screen.** Most of the work in a pipeline is chasing on time; the board is for looking, not doing. Quick add stays on every screen, so capture at an event is never more than one tap away.

## How it sits on the private CRM (to settle with the spec)

- Contacts as sealed records in `ws-team-crm-private`, readable by the team, the way the follow-up list already works.
- Saving through a drop box: the browser seals and signs each change; a collector files it. This already works for /crm/follow-ups/.
- **The big open choice:** one sealed file for the whole pipeline (simple, but the later save wins when two people save at once) or one sealed file per contact (no clashes, more files). Per contact is the safer choice for a team.
- Indi's 19 follow-ups would be the first contacts moved in (stage "to follow up").

## What is open

1. Owner names: people only, or agents too?
2. Must a stage change by an agent always need a person's yes? (Recommended: yes.)
3. Do won and parked contacts stay visible, or archive after 30 days?
4. Who else's lists come in first: Silvio's 50 ranked companies, Vicky's Web Summit contacts?
5. Phone app or web only for now? (Recommended: web page that works well on a phone.)

## Next steps (not started)

1. Indi and Angelo pick a direction (A, B or C) and answer the open questions.
2. Mocks at phone and desktop width for the chosen direction.
3. A spec: record layout in the vault, the save path, the checks.
4. Then a build.
