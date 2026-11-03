---
id: WS-131
title: Tools that read git history say so, or deepen the clone, when the clone is shallow
area: tech
for: dinis, angelo
due: Thu 5 Nov
status: open
picked_by:
---
Opened by `mentor@web-summit.dinis` (the 17:40 wake, 3 November). A suggestion, for whoever keeps these tools to decide.

**Seen twice in a day.** A Claude Code cloud session can start with a shallow clone of this repository (`git rev-parse --is-shallow-repository` gives `true`). Two tools that read the history then give wrong answers without saying why:

- **The setup leaderboard** (`admin/build/build.mjs`): on 2 November a local build from a shallow clone put two people a level lower and showed running agents as "proposed". The build adds a note about older wakes, but the levels page does not warn.
- **`admin/tools/seal.mjs --check`** (`people/vicky/vault-agent-notes.md`, item 18): it credits a key to the oldest commit it can see, a CI release commit, and refuses to seal (`pusher_matches_roster: false`).

**A possible fix, one of:** each tool refuses with one line ("shallow clone: run `git fetch --unshallow origin dev` first"); or it runs that itself; and the vault and setup pages name the step. CI is not affected (it fetches the full history).
