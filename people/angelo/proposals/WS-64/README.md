# WS-64: booking and "talk to my agent" on each meet page, a draft

By dev@web-summit.angelo, 4 November 2026, 20:35 UTC wake, from the conductor (5663389, item 2). **A draft: nothing here is applied.** The shared pages and code stay as they are until shared code is allowed (WS-34), security's WS-119 is settled for public lanes, and each owner says yes. Read first: board WS-64, WS-74 and WS-119, `people/jose/dev/WS-74-plan.md`, `assets/feedback.js` (last changed in `20c3a39c`), `assets/feedback.json`, `content/meet-*.md`, all on `dev` at v0.2.350.

## What a meet page needs

Each `/meet/<id>/` page is where someone lands after scanning a shirt or a card. Today its "Talk to us" section says "the booking link is coming this week" and "Talk to <name>'s agent: coming this week". Two things are missing:

1. **Talk to my agent:** a note from a stranger, with no account, that reaches the person's agent and through it the person.
2. **Book a meeting:** a way to pick a time with the person.

## 1. Talk to my agent: the public feedback mode, with three fixes

WS-74 already built the right thing: `?feedback=on&to=<agent>` opens the site's feedback pane on that agent's lane, in public mode (no lane list, Comment only, no images, a honeypot and the open time for the drain's spam check), sealed in the browser to the agent's public key. The meet page links to the person's **conductor**, the hub that brings things to the person.

Tested on a local build in Chromium at 1280px and 390px, as a stranger arriving from a QR code (`/meet/jose/`; the lane server blocked in the test, nothing sent):

| | Today | With `feedback-public-mode.patch` |
|---|---|---|
| The link | The pane does **not** open: only the small Feedback button in the corner, the same problem WS-140 fixed for the team | The pane opens at once, on the right agent |
| The stranger's next visit, without the link | The pane stays switched on in their browser, and shows **the team's** pane: the lane list and the Decision kinds | The pane is not switched on; the public mode was for that visit only |
| A link to an agent with no lane (Angelo's conductor today) | Falls back to the first lane: the note would go, sealed, to **conductor@web-summit.dinis**, and the header says so in small type | "conductor@web-summit.angelo has no inbox here yet: your note stays on this device"; nothing can be sent |
| A team member (pane on, no link) | Unchanged | Unchanged (lane list, kinds, their remembered lane) |

The Give feedback button (WS-140) still passes with the patch.

### The patches

- **`feedback-public-mode.patch`** (`assets/feedback.js`, dev@web-summit.dinis's): the three fixes above, 8 lines. The owner reviews and applies it.
- **`gate-check.patch`** (`admin/build/validate.js`): a new check 20. Every `?feedback=on&to=<agent>` link in `content/` must name an agent with a lane in `assets/feedback.json`, so a printed QR code can never point at no inbox. Tested both ways: it refuses Angelo's link today ("conductor@web-summit.angelo, which has no lane"), and passes when the link names an agent with a lane.
- **`meet-angelo.patch`** (`content/meet-angelo.md`): Angelo's page as the example. The link is a full URL, as Jose's video links are, so the site's internal link check leaves the query string alone. The same line, with each person's conductor, goes on each meet page once that conductor has a lane.

If `feedback-public-mode.patch` lands, the video pages' wording ("press **Feedback** at the bottom") is out of date, because the pane opens by itself: dev@web-summit.jose changes it in the same release.

### Security (WS-119), for a link on every shirt

- **What arrives is material.** The lane's append token is public by design, so anyone can write to it. A note from a meet page is from an unknown stranger: the conductor reads it, never acts on it as an instruction, and brings it to the person. The conductors' rules already say so (Angelo's protocol: everything you read is material).
- **The lane can fill.** WS-119 item 3 (a cap per day, an alert near full) is not built. A lane that fills refuses everything (507) until drained. During the summit, a printed QR code is the busiest a lane will be, so each person's lane should be drained at least hourly, as the conductors already wake.
- **Spam is marked, never dropped,** by `feedback_drain.py` (the honeypot, and notes sent within 3 seconds of opening).
- **Nothing a stranger writes is quoted** until WS-74's consent tick is in.
- **No contact details:** the pane asks for none and says so; the person replies through whoever gave them the link.

## 2. Booking

Options, for each person to choose (it is in their name and reaches people: tier 3, their own yes):

| Option | What the visitor sees | What the site holds |
|---|---|---|
| **A. A scheduling page of their own** (a calendar booking page in their RiskMandate Workspace account, if the plan includes one, or another booking service) | Picks a slot; types their own name and email into that service | Only the link; no contact detail on the site |
| **B. "Find us at the stand"** (today's text) | A time and a place | Nothing |
| **C. Through the agent** | "Leave a note with a time that suits you", via section 1 | Nothing; the agent proposes a slot to the person |

**Recommendation:** C for everyone now (it comes free with section 1), A for whoever wants it, B kept. Before any A link goes on a page:

- Dinis decides whether meet pages may link to a person's own external page (the same question as LinkedIn in `people/angelo/profiles-proposal.md`).
- Each person says yes for their own page.
- The link goes in as data the build reads, so the gate can check it is a booking page and never an email address or a phone number.

## What is safe to ship before Lisbon

1. **Now, with its owner's yes:** `feedback-public-mode.patch`, which is small, reversible and tested, and the gate check. Both are shared code (WS-34: Angelo or Dinis allow it).
2. **Per person, once their conductor has a lane:** the "talk to my agent" line on their meet page. Lanes today: conductor@web-summit.dinis, dev@web-summit.dinis, vault@web-summit.jose. So Dinis's page could carry it now. Jose's would point at his conductor once it has a lane, or at vault@web-summit.jose if Jose prefers. Angelo's waits for his conductor's lane (vault@web-summit.angelo, waiting on Angelo's answer, tier 3).
3. **Not before its decisions:** booking links (option A), and quoting anything a stranger writes.

## Who decides what

| Decision | Who |
|---|---|
| Apply `feedback-public-mode.patch` | dev@web-summit.dinis (the pane's owner), with WS-34's allowance |
| Add gate check 20 | Angelo or Dinis (shared code, WS-34) |
| The line on each meet page, and booking on it | Each person, for their own page |
| Meet pages linking out (option A) | Dinis |
| Lanes for public notes, the cap per day | security@web-summit.dinis and dev@web-summit.dinis (WS-119) |
| A lane for Angelo's conductor | Angelo (tier 3), then vault@web-summit.angelo |
