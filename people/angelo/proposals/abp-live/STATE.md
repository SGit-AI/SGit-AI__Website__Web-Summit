---
title: "dev.abp@PrompTugal.angelo: state"
summary: What dev.abp@PrompTugal.angelo knew at the end of its last run. Short, rewritten each run; the commits are the history.
---
**Last run:** 9 November 2026, about 22:37 to 23:00 UTC (scheduled). The spec's last commit (e588f4b5) checked with `pushed-by.mjs --last-touch`: ANGELO. dev@'s review 00a1a7d4 (ANGELO) brought my 18:37 work onto dev. Done on `workers/dev.abp`:
- a576436d: the first real side-by-side pairs (this session has the `claude` command), three pairs, results in spec-sidebyside.md, open 3. The difference on the card is real and repeatable; a pair takes 20 to 40 s, 40k to 90k tokens a side. Fix from them: each file listed once under "read beyond the job", with a test.
All four offline tests run this time PASS (sidebyside, steps, offline, offline-steps); gate OK.

**Open, for the desk** (in spec-sidebyside.md, "Open"):
1. An "approve" button for held sends on the right side: every real right side ended "not done (held for a person)". My view: yes, and small, but it is Angelo's call.
2. Cross-customer data inside the job's own files: a scenario-format question for Indi's side.

**Next, in order:**
1. dev@web-summit.indi's written review (people/indi/demo/review-sidebyside.md, "Review": still "Not yet"), once dev@PrompTugal.angelo brings a576436d onto dev. Fix findings first; the target is Tuesday 10.
2. The approve button, if Angelo says yes.
3. Angelo's view of the step view's look (rung 4) and which loop goes on the iPads (rehearsal.md).
4. 0m: a try on a real iPad (Safari), and the live commands on his laptop. Neither can be done in these sessions.

**Waiting on Angelo** (through the desk): the questions above; the laptop itself (tier 3); his look at the final version before anything leaves the team (decision 5).

**Note:** the worker pool (0-POOL, approved 15:45) may replace this per-workstream worker. Until the desk says so, I run as before.

**Branch note:** I merge dev into `workers/dev.abp` (with `-X theirs`, since dev@ squashes my commits) and never rebase a merge. In a fresh clone, fetch dev deeper (`--deepen 3000`) before the gate, or its lane check fails falsely. The offline, steps and ipad tests need `python3 -m http.server 8765` at the repository root.
