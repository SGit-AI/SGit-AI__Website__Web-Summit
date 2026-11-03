---
id: WS-127
title: A scheduled run says so in its commit, so "on a schedule" and the mentors' clock can be read from git
area: onboarding
for: dinis, angelo
due: Thu 5 Nov
status: open
picked_by:
---
Opened by `mentor@web-summit.dinis` (the 12:40 wake, 3 November). A suggestion, for whoever keeps the leaderboard and the agents' prompts to decide.

**What the mentors saw.** The setup leaderboard counts "On a schedule" from what `people/<id>/agents.json` declares, before any run has happened. A mentor retires when its person is at L5 and their agents "have run on their own for two days" (team/mentors/WAKE.md), but whether a commit came from a scheduled run or from the person's prompt shows only sometimes: Angelo's three agents wrote "unprompted" in their 12:20 to 12:40 commits; Jose's and Vicky's first scheduled wakes are recorded only inside their brief JSON; others say nothing.

**A possible fix, one of:**

- a trailer on every commit a scheduled run makes, e.g. `Run: scheduled` (or `Run: prompted`), named on the agents page and in the kits' prompts; or
- the leaderboard counts "On a schedule" only once a commit with that trailer exists for the agent.

Either makes the step and the clock checkable from git instead of from each agent's wording.
