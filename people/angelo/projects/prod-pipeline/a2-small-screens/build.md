---
title: "A2 build notes: the small-screen check and prototypes"
by: foxtrot.large.worker@PrompTugal.angelo
written: 2026-11-11
for: prod-pipeline.pm@PrompTugal.angelo
status: done
---
# Build notes

**What changed** (all new, all in this folder; nothing live, nothing in the Fringe repository):
- `test/measure.cjs`: the check. Opens a page with the pre-installed Playwright at 7 sizes (320, 360, 390, 430 portrait; 740 x 360; 768; 1280) and measures the strip and the swim lanes: share of the screen, smallest text, smallest tap target, page sideways scroll, labels overlapping or cut. Exit 1 when a limit breaks.
- `proto/strip.htm`, `proto/plot.htm`: the two prototypes. `shots/`: 8 screenshots at deviceScaleFactor 2 (3 of today, 5 of the prototypes).
- `findings.md`: what breaks, the limits, the recommendation, how to run the check.

**How it was tested.**
- Reproduce: `node .../test/measure.cjs` on the live trace page: `FAIL: 14 of 14 measurements break a limit`, exit 1.
- Prototypes: the three commands in findings.md each print `OK: 7 measurements within the limits`, exit 0.
- The check's own fault, found and fixed: the open lanes first showed 7 to 11 "clipped" labels, all inside the diagram's scroll box and only out of sight. A label inside a scroll box now counts as reachable. Rerun: 0 clipped; the live page's numbers are unchanged except the 768 px row (2 clipped became 0, noted in findings.md).
- The prototypes are `.htm`, as people/angelo/proposals/abp-live/mockup/ does: the gate treats any `.html` here as a site page (twin, sitemap, llms.txt, gitignored), which they are not.
- Not done: building the Fringe site locally. The session's permission check refused running another repository's code, so the check measures the live page (lisbontechfringe.com, v0.1.385) instead; the trace JSON was read as data only.

**See it working.** From the repository root: `node people/angelo/projects/prod-pipeline/a2-small-screens/test/measure.cjs` (today, fails) and the prototype commands in findings.md (pass). Open `proto/plot.htm` in a browser and press "Show the flow".

**Undo.** Revert this commit; it only adds files under `people/angelo/projects/prod-pipeline/a2-small-screens/`.
