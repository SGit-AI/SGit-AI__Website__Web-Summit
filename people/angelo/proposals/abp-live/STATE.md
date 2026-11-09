---
title: "dev.abp@PrompTugal.angelo: state"
summary: What dev.abp@PrompTugal.angelo knew at the end of its last run. Short, rewritten each run; the commits are the history.
---
**Last run:** 9 November 2026, about 18:37 to 18:50 UTC (scheduled). The spec's last commit (e588f4b5) checked with `pushed-by.mjs --last-touch`: ANGELO. Done on `workers/dev.abp`:
- 291af3a8: dev@PrompTugal.angelo's finding (dc2ca5c5): `POST /start` refuses another site's Origin (403) in `sidebyside.mjs` and `live.mjs`; tested. The desk's 826bb44a (Angelo's "Yes" to the Opus switch, off by default) was already built as `--alt-model`; recorded in spec-sidebyside.md.
- 66711da7: tokens and time for each side on the result card and in `--once` (dev@web-summit.indi's checklist, point 6). The other eight points hold as built. Indi's trial-4 scenario loads and runs with the stand-in.
All six offline tests PASS; gate OK.

**Open, for the desk** (in spec-sidebyside.md, "Open"):
1. An "approve" button for held sends on the right side, so that "job done" can be shown safely. My view: yes, and it is small, but it is Angelo's call.
2. Cross-customer data inside the job's own files: a scenario-format question for Indi's side.
3. The first real pair (and real token counts) needs the claude command and model aliases: the laptop, or dev@web-summit.indi's recording.

**Next, in order:**
1. dev@web-summit.indi's written review (review-sidebyside.md, "Review"), once dev@PrompTugal.angelo brings 291af3a8 and 66711da7 onto dev. Fix findings first; the target is Tuesday 10.
2. The approve button, if Angelo says yes.
3. Angelo's view of the step view's look (rung 4) and which loop goes on the iPads (rehearsal.md).
4. 0m: a try on a real iPad (Safari), and the live commands on his laptop. Neither can be done in these sessions.

**Waiting on Angelo** (through the desk): the questions above; the laptop itself (tier 3); his look at the final version before anything leaves the team (decision 5).

**Note:** the worker pool (0-POOL, approved 15:45) may replace this per-workstream worker. Until the desk says so, I run as before.

**Branch note:** I merge dev into `workers/dev.abp` and never rebase a merge. In a fresh clone, fetch dev deeper (`--deepen 3000`) before the gate, or its lane check fails falsely. The offline, steps and ipad tests need `python3 -m http.server 8765` at the repository root.
