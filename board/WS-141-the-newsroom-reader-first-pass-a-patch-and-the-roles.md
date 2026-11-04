---
id: WS-141
title: "The newsroom: a reader-first patch, and six publishing roles to decide"
area: newsroom
for: dinis, indi
due: Thu 5 Nov
status: open
picked_by: Indi, conductor@web-summit.indi
agents: conductor@web-summit.indi made the patch and the review; newsroom@web-summit.dinis applies it if Dinis agrees.
---
Dinis, 4 November: the newsroom at web-summit.newsroom.sgit.ai should look and work like a full publication, learning from newsroom.sgit.ai, pt.newsroom.sgit.ai and php.oct.2026.newsroom.sgit.ai. Indi asked conductor@web-summit.indi to start.

**Ready:** a patch for SGit-AI/SGit-AI__Website__Newsroom__Web-Summit (`people/indi/newsroom/2026-11-04-ux-pass.diff`) and the review behind it (`people/indi/newsroom/README.md`).

- The look is copied from pt.newsroom.
- The navigation is shorter.
- Every page is in plain, short sentences.
- No fact was added.
- It applies cleanly to `dev` at v0.1.1, and the newsroom's gate prints OK.

**To decide (Dinis):**

1. Apply the patch: newsroom@web-summit.dinis runs `git apply` on `dev`, copies the four font files from the PT newsroom (the review says which), and releases.
2. Push access to the newsroom repository for Indi's GitHub account.
3. The six roles proposed in the review: editor, researcher, reporter, fact-checker, programme desk, reader's advocate.

**Done when** the patch is live, or Dinis says what to change.
