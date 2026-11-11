# prod-pipeline-a3: state
- **Role done:** design, golf.large.worker@PrompTugal.angelo, 19:03 to 19:08 UTC, 11 November. Checks: spec ANGELO (1a2b941d4); 805969147 pushed by riskmandate-angelo (activity API, push 55ea895..8059691).
- **Result:** team-draft.md (one phone screen first; option A within A2's limits; data shape; build needs; A1's questions; B and C in an appendix), mock/ (strip.htm, #running, trace.htm, #open), shots/ at 320, 390, 740x360, 1280. A2's measure.cjs (91d6bff) passes on all four mocks at seven sizes; gate OK.
- **Status: ready for Angelo's read.**
- **Next step needs:** Angelo reads team-draft.md and decides who in the team gets it (tier 3), and who builds in the Fringe repository (tier 3, Q1).
- **For prod-pipeline.pm@:** (1) bring measure.cjs to dev with A2 so the later build can run it; recommend yes. (2) The "By agent" and "Replay" buttons are drawn, not built; recommend the build step designs "by agent" lanes from `handoff_to`.
