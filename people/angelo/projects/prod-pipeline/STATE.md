# prod-pipeline: state
- **Lead:** prod-pipeline.pm@PrompTugal.angelo, started 2026-11-11 about 12:30 UTC. Instruction commit 94dfabc6: pushed-by says ANGELO (checked at start).
- **Done:** b0-library, b1-team-spec, b2-flow-reuse (conductor.b@, before this project).
- **Goal (BRIEF.md):** the flow page of a real deliverable, note to live, generated from the records; the next deliverable gets one with no extra work.

## Plan
Plan (revised at Angelo's word, 11 Nov: Tech Fringe first, a draft before anything):
1. **A1: the proposal draft** (design, large): one concept for the Fringe's trace page and its strip, live and in progress, on every page and the app; one data shape that our records fill too.
2. **Angelo reads it**; changes go back to the designer; he decides who in the team gets it.
3. **Then, at his word:** agree with conductor.fringe@ (through Angelo) who builds it in the Fringe repository; a check by another slot.
4. **Fill our record gaps** (note_at, intake and review ledger lines) so our deliverables fit the same shape.
5. **Later:** the stand and the demo screens.

## Open
- Fringe repository: Angelo, 11 Nov: "Clone the repository PrompTugal/PrompTugal__News__Fringe into this session." Cloned read only (public, anonymous git read; nothing attached) at /home/user/promptugal/promptugal__news__fringe, dev at 6b079db. Read: team/angelo/traces/README.md (lisbon-fringe-trace/1, method), admin/build/trace-page.mjs header (f6dbece: swim lanes by kind of actor, time left to right, hand-offs only on shared evidence, idle folds, no JS for layout).
- Angelo's direction, 11 Nov: "I think we should integrate Dinis's idea with the work conductor.fringe has progressed on the draft horizontal sequence diagram."
- **Decided (Angelo, 11 Nov), quoted in full in BRIEF.md:** "Let's focus on the Tech Fringe (it's the new name coming up), so we can build it its repo"; "a proposal so that both the page that is already there and the little piece in each page align and draw from the same concept and design"; updated on every page update, "an in-progress gif when work is actually in progress", on "each and every page of the website, desktop and phone, and the app that will come soon"; "the first step of something bigger for the stand and the demo screens"; "before we do anything we need to get to a good draft to share with the team."
- **Angelo, 11 Nov:** "We should be careful in small or portrait screens that the image doesn't take too much space or gets really small, we need some thoughts on how to best address this, maybe that's the job of a dedicated dev agent? Thoughts?" Lead's answer: a section of A1 (point 6) now, with mocks at each width; a responsive check in the later build and check steps; a dedicated role only if the stand, the app and the sites keep needing it. Angelo: "I wasn't thinking of a dedicated role, just a task." So: A2, a dev task (build role as prototype and measurement), in parallel with A1; A1 takes its limits if ready.
- **Angelo, 11 Nov:** "Start A1 and A2 yourself, as ROLES.md's lead role now says". ROLES.md's lead role changed in 21a8214 (pushed-by: riskmandate-angelo, ANGELO): leads claim a slot, start a fresh session with the library's prompt, log it in runs.md, archive it, release the claim.
- **Done 17:15 to 17:16 UTC, ready for Angelo's read** (results on the pool branches, not yet on dev): A1 proposal.md recommends option A, one line in two sizes (69fe661); A2 findings.md: today's strip and lanes fail on every size measured, two prototypes pass all seven (aff772d). Their questions: who builds in the Fringe repository (tier 3 for Angelo), the shape's name, a running[] list in the Fringe's status.json, tokens on the Fringe.
- **Started 17:06 UTC:** A1 on charlie.large (design, session_01Xp7gj2bPg7BSn5BnGJ2siJ), A2 on foxtrot.large (build as prototype, session_01Xp7gj6hV9PqWCwwdRuDUJA); briefs in a1-flow-proposal/brief.md and a2-small-screens/brief.md; runs.md logs the sessions. Results on pool/a1-flow-proposal and pool/a2-small-screens, for conductor.b@ to review onto dev.
- **Gap for conductor.b@:** pushed-by.mjs reads dev's pushes only, so it cannot vouch for a lead's commit on project/*. The workers check the lead's instruction commit through GitHub's activity API for refs/heads/project/prod-pipeline instead (all pushes there so far by riskmandate-angelo). Recommend a --ref option in pushed-by.mjs.
- **Open:** (a) building in the Fringe repository later means conductor.fringe@'s repo; its dev also has commits by conductor.fringe@PrompTugal.dinis (251b5c9), so Dinis's agents work there too: who builds there is for Angelo. (b) "the team" for the draft: who, decided by Angelo after he reads it. (c) b2's questions 1 and 3 folded into A1 (drawing: reuse the Fringe's, borrow the newsroom's ideas; cost: tokens until money can be read).
## Spend
- Worker runs: A2 188,518 tokens without cache reads (ledger); A1 ledger line pending. Dollars from the platform when conductor.b@ records them.
- Sub-agents of the lead: none.
