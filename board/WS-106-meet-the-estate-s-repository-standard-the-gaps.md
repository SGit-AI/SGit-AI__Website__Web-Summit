---
id: WS-106
title: Meet the estate's repository standard: the gaps
area: tech
for: angelo, jose
due: Fri 6 Nov
status: open
picked_by:
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
