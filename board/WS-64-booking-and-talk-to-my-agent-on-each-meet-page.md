---
id: WS-64
title: Booking and talk-to-my-agent on each meet page
area: tech
for: angelo, jose, everyone
due: Thu 5 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo (a draft first)
---
Each /meet/<you>/ page (where your shirt and card QR go) has a working booking link and a way to talk to your agent.

**4 November, conductor@web-summit.angelo:** picked for Angelo. dev@web-summit.angelo drafts the change in `people/angelo/proposals/WS-64/` (what the meet pages would say and do, and the patch), coordinated with dev@web-summit.jose's WS-74 (the public feedback mode is the likely "talk to my agent"). Applied to the shared pages only once shared code is allowed (WS-34) and security's WS-119 is settled for public lanes.

**4 November, 20:35 UTC wake, dev@web-summit.angelo: the draft is in `people/angelo/proposals/WS-64/`** (README and three patches, nothing applied). "Talk to my agent" is WS-74's public mode linked to each person's conductor, with three fixes to the pane found by testing it as a stranger: the link does not open the pane; it leaves the pane on for the stranger's later visits; and a link to an agent with no lane sends the note to conductor@web-summit.dinis. Plus a gate check so a printed link can never point at no inbox. Booking: through the agent now; a booking page per person only with their yes and Dinis's on linking out. Safe before Lisbon: the pane patch and the gate check (with their owners' yes), and the line on each meet page once that person's conductor has a lane.

**4 November, 21:20, conductor@web-summit.angelo:** dev@web-summit.angelo's draft is in `people/angelo/proposals/WS-64/` (ce9200a0). Routed: the pane patch (`feedback-public-mode.patch`, 8 lines in `assets/feedback.js`: the public link opens the pane, doesn't leave it on, and never falls back to another agent's lane) to dev@web-summit.dinis, its owner; the gate check (`gate-check.patch`: every `to=` link must name an agent with a lane) to conductor@web-summit.dinis. Each person's own line on their meet page, a booking page, and links out wait on their people and Dinis.

**4 November, 22:20, conductor@web-summit.angelo:** the pane patch is applied by its owner, dev@web-summit.dinis (80663f5a): a public link now opens the pane, doesn't leave it on, and never falls back to another agent's lane. Still open: the gate check (conductor@web-summit.dinis), each person's lane and line, booking.

**5 November, conductor@web-summit.angelo, at Angelo's word ("Go ahead"), against prompt injection:** Angelo's meet page gets no "talk to my agent" line until (1) a separate public inbox exists for visitors, apart from the conductor's lane; (2) a plain script, no model, drains it and shows the notes to Angelo only, sealed to his key, in his command centre ("notes from visitors"), with agents seeing counts only; (3) limits: a length cap, a daily cap, no links shown, nothing a visitor writes in the repository in the clear, replies sent by Angelo. Until then, "find us at the stand". The design goes to security@web-summit.dinis under WS-119 before anything is live.

