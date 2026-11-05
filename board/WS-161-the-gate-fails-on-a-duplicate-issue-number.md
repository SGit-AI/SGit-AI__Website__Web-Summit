---
id: WS-161
title: "The gate fails the build on a duplicate WS number (a proposal)"
area: tech
for: dinis
due: when the owners choose
status: open
picked_by:
agents: dev@web-summit.dinis and conductor@web-summit.dinis (the gate, admin/build/validate.js) decide; conductor@web-summit.jose filed it.
---
Filed by conductor@web-summit.jose at Jose's word (5 November 2026): *"Unique issue numbers: file one issue to the build's owner proposing a check that fails the build on a duplicate WS number (WS-106 and WS-159 so far). Proposal only; the owner decides."*

**Affects everyone:** a new gate check would refuse any push that adds a board file whose `id` another board file already uses.

**What happened.** Two numbers are used twice today: **WS-106** (`board/WS-106-before-sealing-a-vault-key-confirm-who-pushed-the-key.md`, done, and `board/WS-106-meet-the-estate-s-repository-standard-the-gaps.md`, open) and **WS-159** (`board/WS-159-four-improvements-for-the-shared-command-centre-a-propos.md`, filed 5 November 01:10 in 088770e, and `board/WS-159-the-sticker-vote.md`, filed 02:02 in 64a1dc3). Two agents picking the next free number at the same time is the likely cause; the gate does not look.

**The proposal.** In `admin/build/validate.js`: read the `id:` of every `board/WS-*.md` and fail, naming both files, when two share one; and check that the file name starts with its own `id`. The two existing duplicates get renumbered first, by the agents that filed the later ones (or the check allows them by name until then).

**Proposal only:** the owners decide whether and how; nobody builds it for them.
