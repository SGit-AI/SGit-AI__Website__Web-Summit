---
title: "A2: small and portrait screens, a dev task (asked 2026-11-11)"
item: a2-small-screens
project: prod-pipeline
by: prod-pipeline.pm@PrompTugal.angelo (intake, from ASKS.md)
written: 2026-11-11
role: build
size: large
go: "Angelo, 11 Nov, in the lead's session: \"Start A1 and A2 yourself, as ROLES.md's lead role now says\" (ROLES.md lead role: 21a8214, pushed by riskmandate-angelo)"
---
# a2-small-screens

The project's brief, with Angelo's words: people/angelo/projects/prod-pipeline/BRIEF.md (section "Angelo's change, 11 November").
Your folder is people/angelo/projects/prod-pipeline/a2-small-screens/ (where the library says people/angelo/pipeline/{ID}/, read this folder).

- **Angelo, 11 Nov:** "We should be careful in small or portrait screens that the image doesn't take too much space or gets really small, we need some thoughts on how to best address this, maybe that's the job of a dedicated dev agent?" Then: "I wasn't thinking of a dedicated role, just a task."
- **Role:** build (large), as a prototype and measurement: nothing goes live. Runs in parallel with A1; not the slot that does A1.
- **Skills:** software-engineer, designer, cold-reader (+ always-on).
- **Reads (read only):** PrompTugal/PrompTugal__News__Fringe on dev: admin/build/trace-strip.mjs (438f9f5), admin/build/trace-page.mjs (f6dbece), the Wexio trace (team/angelo/traces/, 893d4e6), its tokens.css. Build the Fringe site locally in a scratch copy to render them; change nothing in that repository.
- **Writes:** people/angelo/projects/prod-pipeline/a2-small-screens/ only: findings.md, shots/ (screenshots), test/ (the measuring script), STATE.md. Branch pool/a2-small-screens.
- **Brief:**
  1. Render today's strip and trace page at 320, 360, 390 and 430 px portrait, a small landscape phone (about 740 x 360), a tablet (768) and 1280 px, with Playwright (pre-installed; screenshots at deviceScaleFactor 2).
  2. Measure each: share of the first screen the diagram takes, smallest rendered text, smallest tap target, horizontal scroll, labels clipped or overlapping.
  3. Propose the limits (a share of the first screen; text at least 12 px; tap targets at least 44 px; no page-level horizontal scroll) and what gives way first when space runs out (fewer stations, folded groups, vertical layout, a "show the flow" toggle, a scroll inside the diagram), with a prototype of the best one or two as static HTML at the same widths.
  4. Leave the measuring script runnable as the later build's check (one command, fails when a limit breaks).
- **findings.md:** one phone screen first (what breaks today, at which width, the limits and the fix recommended, with two screenshots); then the table of measurements; then the prototypes; then how to run the check.
- **Not:** no change in the Fringe repository; no message to any agent or person; nothing published.
- **Done when:** findings.md, shots/ and test/ are on pool/a2-small-screens, the check runs with one command and its output is in findings.md, the gate prints OK, and STATE.md says "ready for Angelo's read".
