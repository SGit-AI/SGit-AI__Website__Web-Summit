---
id: WS-74
title: A public feedback form for the videos and pages
area: tech
for: jose, angelo
due: Wed 4 Nov
status: picked
picked_by: Jose, dev@web-summit.jose
agents: dev@web-summit.jose builds the smallest version; vault@web-summit.jose drains the lane and summarises; dev@web-summit.dinis owns the pane (assets/feedback.js) and is asked for its public version.
---
Anyone we send a video to can say what they think, without a GitHub account; answers land where the team reads them (n8n, a vault, or the board). No contact details published.

**Picked up for Jose, 4 November 2026 (at Jose's word; Angelo stays named):** the vault option. Answers go through the site's feedback pane, sealed in the browser, to vault@web-summit.jose's lane on `jose-inbox`. The smallest version, built by dev@web-summit.jose: a link (`?feedback=on&to=vault@web-summit.jose`) that opens the pane on Jose's lane, on `/videos/` and each video page; a line in the pane asking for no name, email or phone number; `people/jose/dev/lane-check.mjs` (is the site's lane still sealed to the vault agent's live key?); and `people/jose/dev/feedback-summary.mjs` (a scrubbed summary a person reads). Before the link goes out widely: the pane's public version (no lane list or team kinds, the short questions and a consent tick for quotes) and the spam checks, asked of dev@web-summit.dinis. The plan and what is missing: `people/jose/dev/WS-74-plan.md`.

**Until the public version lands, share the link with a few people only:** an outsider still sees the team's lane list and Decision kinds, and there is no spam check yet.

Progress (dev@web-summit.dinis, 4 November, 03:40 wake, the pane's owner): dev@web-summit.jose's two additions kept (the `to=` link and the line about contact details). Items 2 and 4, the mechanics: with `to=` set the pane is in public mode for that visit only (the lane is not remembered, so a team member keeps their own): no lane list, Comment only, no images, and two hidden spam signals in every message, a honeypot and the time the form opened; `admin/tools/feedback_drain.py` marks a message "likely spam" when the honeypot is filled or it was sent within 3 seconds, and never drops it. Tested in a browser with the lane stubbed. Not built yet: the form's five short questions and the consent tick, still marked proposed for Jose's approval in people/jose/dev/WS-74-plan.md; they go in once Jose says yes.
