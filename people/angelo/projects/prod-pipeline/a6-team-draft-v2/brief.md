---
title: "A6: the team draft, second version (A3 with A4's and A5's rules)"
item: prod-pipeline-a6
project: prod-pipeline
by: prod-pipeline.pm@PrompTugal.angelo (intake)
written: 2026-11-11
role: design
size: large
go: "Decided by default, Angelo can reverse (a9199ce: below tier 3 the lead decides); recommended by both A4 and A5. Angelo's ask behind A4 and A5: \"Can you spawn a couple workers to simulate how a few diagrams would look like on various pages from the website, choosing some small and some big pages?\""
---
# prod-pipeline-a6

Wake routine: trig_01MqHQ7CWqSnu5JGwYRpkQg5

**Your folder:** people/angelo/pipeline/prod-pipeline-a6/ (the workers' lane): team-draft.md, mock/, shots/, STATE.md there only, plus your estimates and ledger lines. Nothing in people/angelo/projects/.

**Start from A3's team draft** (pool/prod-pipeline-a3 at 8193766, people/angelo/pipeline/prod-pipeline-a3/) and make version 2 by folding in, without redesigning:
- **A4, small pages** (pool/prod-pipeline-a4 at 0905d30, people/angelo/pipeline/prod-pipeline-a4/sim.md): the rule "one sentence, no line, when a trace has one agent and at most five steps (template changes and Now not counted); a running page always gets the line", and its trace-page fixes (content span, folded template column, no empty lanes).
- **A5, big pages** (pool/prod-pipeline-a5 at 3af1628, people/angelo/pipeline/prod-pipeline-a5/sim.md): its nine rules (the strip shows the last change, the history one link; fold by minute; at most 7 agent lanes plus "+N more"; a trace file under 200 KB; a "How this page was made" link near the top of pages over 10 screens; the strip's own style reset; and the rest as written there).
- **The site's address** is https://lisbontechfringe.com/ (fringe.promptugal.news answers 404; A4 and A5 found it).

**The draft:** the same shape as A3's (one phone screen first: the idea, one picture, what changes, what it needs), now with **one small page and one big page shown** (reuse A4's and A5's screenshots, or retake them at 390 and 1280 with the rules applied: DISTRICT 909 and the home page), a short "Rules" section (small, normal, big: when each form shows, with its threshold), the data shape, what the build needs, and the open questions with a recommendation each (who builds in the Fringe repository and who gets the draft are Angelo's, tier 3; reading the Fringe's deploy runs goes to the build step). Options B and C stay in the appendix. Every screenshot passes A2's measure.cjs (pool/a2-small-screens at 91d6bff).

**Not:** no change in the Fringe repository; no message to any agent or person; never websummit.com.

## Done when
team-draft.md, mock/ and shots/ on pool/prod-pipeline-a6; measure.cjs passes on every shot it covers; the gate prints OK; STATE.md says "ready for Angelo's read".
