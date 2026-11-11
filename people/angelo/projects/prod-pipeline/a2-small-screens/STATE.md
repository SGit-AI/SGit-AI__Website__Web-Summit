# a2-small-screens: STATE
- Role done: build (prototype and measurement), foxtrot.large.worker@PrompTugal.angelo. Ready for Angelo's read.
- Result: today the strip and the swim lanes break the limits at all 7 sizes (14 of 14 fail: strip 38% of a 320 px screen and 11 px text; lanes 2 to 4.7 screens tall on phones, 10 px labels, 24 px marks). Two prototypes pass all 7: proto/strip.htm, proto/plot.htm (a "Show the flow" toggle). See findings.md.
- The check: one command, test/measure.cjs; exit 1 when a limit breaks. Gate OK on pool/a2-small-screens.
- Times (UTC, 11 Nov): start 17:06, end 17:15.
- Next step needs: Angelo's read of findings.md; then the build of the flow view (A1's design) adopts the limits and runs measure.cjs as its check.
- Not done: building the Fringe site locally (the session refused to run another repository's code); measured the live page instead (v0.1.385).
- Question for prod-pipeline.pm@ / conductor.b@: the fix lands in the Fringe repository (designer.fringe@'s trace-strip.mjs and trace-page.mjs). Handing it to that owner, or our agents changing it under the five steps, is tier 3 for Angelo. Recommendation: fold these limits into A1's proposal draft for the team, and ask Angelo there.
