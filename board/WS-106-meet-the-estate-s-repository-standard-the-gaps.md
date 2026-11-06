---
id: WS-106
title: Meet the estate's repository standard: the gaps
area: tech
for: angelo, jose
due: Fri 6 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo (drafts, routed to the owners; Jose reviews)
agents: dev@web-summit.dinis takes one per refactoring pass; dev@web-summit.angelo welcome.
---
Read against https://sgit.ai/docs/guidance/repositories.md and /docs/guidance/index.md on 2 November, at Dinis's word. Done on 2 November (v0.2.2): the version in the top bar of every page, linked to its own row, each release recording the commit it was built from and its tag; the gate checks em-dashes in prose (17) and that every script parses (18). Still missing, one per pass, each into REALITY.md when done:

1. **review/**, with review/self/: the project as layered graphs, intent from the brief, code from the tree, every commit read upwards (the review brief on sgit.ai).
2. **The Agent Contact file** at /.well-known/sgit-agents.json (sgit.ai, Agents).
3. **A row on nfrs.sgit.ai**: the honest column, what this site meets and what it does not.
4. **Tests against real things**, beyond the gate: the build, the release step (as the 2 November simulation did), the onboarding levels, the meetings carry-over.
5. **llms.txt per section**, not only at the root.
6. **Versions as data**: versions/index.json and one file per version (version, date, commit), as /docs/guidance/index.md shows.
7. **Each release says what it does not prove**, in its versions row.
8. **The leak tripwire against the staged diff** in release.sh, including the secret parts of every key held locally (the session keys).
9. **The roles file per role with the mistake behind each rule** (team/<role>/ROLE.md).

Progress (dev@web-summit.dinis, 3 November, 00:41 wake): item 6 done. The build writes `versions/index.json` (site, latest, every version with its date, commit, tag, author and sentence) and one `versions/<version>.json` per release, from `admin/versions.json`, which CI alone writes; linked from /admin/versions.html. Note for the conductor: two board files carry the id WS-106 (this one and security's "confirm who pushed the recipient's key"); one needs a new number.

3 November, 07:50 (project-manager@web-summit.dinis): **two issues carry the number WS-106**, opened two minutes apart on 2 November: "Meet the estate's repository standard: the gaps" (conductor, 23:51, open) and "Before sealing a vault key, confirm who pushed the recipient's key" (security, 23:53, done). Commits cite both as WS-106. When citing one, name it by title as well. Renumbering the done one to the next free number is on the board-health note for Dinis (WS-124 is now taken).

**5 November, conductor@web-summit.angelo:** picked for Angelo from Jose's proposal on the 13:00 agenda (his site and UI issues to Angelo's and Dinis's dev agents, Jose reviewing), at Angelo's word. dev@web-summit.angelo drafts in `people/angelo/proposals/<issue>/` and routes each patch to the file's owner (Angelo's option 1 for shared code); Jose reviews.

**6 November, 02:35 UTC wake, dev@web-summit.angelo: item 8, the leak tripwire, drafted in `people/angelo/proposals/WS-106/`** (with the nine gaps' state: only item 6 is done). `admin/tools/tripwire.mjs` checks what is about to be pushed for the gate's secret shapes and for the secret part of every key held locally (`~/.sg-send/`), which no shape can catch; `release.sh` runs it before the push. It names the file and the local key, never the secret. Tested: a 40-character fragment of a session key, wrapped, is refused; a clean diff passes; 40 real commits in 0.5 s. Routed to conductor@web-summit.dinis. Item 2 (the Agent Contact file) next, if wanted.
