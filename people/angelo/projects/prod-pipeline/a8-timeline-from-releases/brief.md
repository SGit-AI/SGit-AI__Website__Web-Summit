---
title: "A8: a small eye-catching timeline from the Fringe's own release data"
item: prod-pipeline-a8
project: prod-pipeline
by: prod-pipeline.pm@PrompTugal.angelo (intake)
written: 2026-11-11
role: design
size: large
go: "Angelo, 11 Nov about 21:2x: \"I agree on using the data that is already there, assuming it's reliable, and maybe just build a little graphical timeline that catches the eye. Thoughts?\" The lead proposed this step at 21:24; no answer by the 22:12 backstop, so started as decided by default, Angelo can reverse (a9199ce)."
---
# prod-pipeline-a8

Wake routine: trig_01MqHQ7CWqSnu5JGwYRpkQg5

**Angelo:** "I'm thinking that we are possibly repeating work that is already there. Pages already show the sequence of events that brought a page together. Rather than reinventing the wheel can you review what's there" and then "I agree on using the data that is already there, assuming it's reliable, and maybe just build a little graphical timeline that catches the eye."

**The site:** https://lisbontechfringe.com/ (public); source PrompTugal/PrompTugal__News__Fringe on dev (public; clone read only; change nothing; do not run its code). Never websummit.com.
**The data that is already there:** /api/v1/releases.json and /api/v1/releases/<version>.json, /changes/ and /changes/<version>/ (built by admin/build/releases.mjs and changes.mjs: each release with time, agents, commits and every event added, removed or changed by id and field), /api/v1/activity.json (activity.mjs: commits and deploys of the last 3 hours).
**The lead's check** (people/angelo/projects/prod-pipeline/STATE.md, section "Review of what the Tech Fringe already shows" and after): CI builds it from the last 500 commits (deploy.yml fetch-depth 500), about 8 hours at today's pace; it covers data/events.json only; a re-read is a count; a page's read time can contradict the record.
**Our reference traces:** A7 (pool/prod-pipeline-a7 at 419bdfc, people/angelo/pipeline/prod-pipeline-a7/: traces.md, data/, tool/page-trace.mjs) for six pages.
**The design to reuse:** A3's strip within A2's limits (pool/prod-pipeline-a3 at 8193766; pool/a2-small-screens at 91d6bff, measure.cjs) and A4's one-sentence rule for tiny histories (pool/prod-pipeline-a4 at 0905d30).

**Your folder:** people/angelo/pipeline/prod-pipeline-a8/ only: timeline.md, mock/, shots/, data/, STATE.md (plus your estimates and ledger lines).

## The task
1. **Is it reliable?** For the six pages A7 traced (DISTRICT 909, Storm Summit, /me/, /tip/, home, programme), set each page's history as the release data gives it (fetch the public JSON; read only) beside A7's table: what matches, what the release data misses, what it has that A7 missed. One table per page; a verdict line each.
2. **The fix for what it misses**, written as a proposal for the Fringe's owners (no change made): at least the 500-commit window (for example: CI appends each release's per-event changes to a kept file, so a page's history never falls off), and what else your table shows. Say the size and who owns each file (from its header comment).
3. **The little timeline** (Angelo: "a little graphical timeline that catches the eye"): fed only by the release data (plus activity.json for "being worked on now"), at the foot of an event page, linking each mark to its /changes/<version>/. Mock it on DISTRICT 909 and on one busy event page (the event with the most releases in the data); one sentence when the history is one step (A4's rule); a pulse when a commit in the last 15 minutes names the page. Make it catch the eye: colour, motion on load, size, within A2's limits (text at least 12 px, targets at least 44 px, at most a third of the screen, no sideways scroll). Screenshots at 320, 390 and 1280 px, injected into the live pages with Playwright (pre-installed); run measure.cjs.
4. **timeline.md:** one phone screen first (the picture at 390 px, is the data reliable in one line, the fix in one line, what building it needs and who owns the files); then the tables, the fix, the mock details.

**Not:** no change in the Fringe repository; no message to any agent or person; never websummit.com.

## Done when
timeline.md, mock/, shots/ and data/ on pool/prod-pipeline-a8; measure.cjs passes on every shot it covers; the gate prints OK; STATE.md says "ready for Angelo's read".
