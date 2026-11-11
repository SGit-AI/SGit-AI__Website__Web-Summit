# prod-pipeline: asks for conductor.b@ (one block per step: role, size, skills, files, brief, done when)

## A1: the flow view proposal, a draft for the team (asked 2026-11-11)
- **Role:** design (large). Never the slot that builds it later.
- **Skills:** designer, cold-reader, analyst (+ always-on: privacy, plain-language, token-thrift, trace).
- **Format:** web-summit-site for the files; the Tech Fringe's own look (its tokens.css) for the mocks.
- **Instruction:** Angelo's words in people/angelo/projects/prod-pipeline/BRIEF.md, section "Angelo's change, 11 November", quoted there.
- **Reads (material, read only; change nothing there):** PrompTugal/PrompTugal__News__Fringe on dev (public, clone read only): team/angelo/traces/README.md and the Wexio trace (893d4e6), admin/build/trace-page.mjs (f6dbece, the full page /traces/<event_id>/), admin/build/trace-strip.mjs (438f9f5, the one-line strip), admin/tools/trace-event.mjs, team/angelo/status.json and runs.md. The newsroom's lanes and Replay (https://promptugal.news/newsroom/pieces/, assets/newsroom/flow.js in PrompTugal/PrompTugal__News__Website). people/angelo/pipeline/b2-flow-reuse/research.md. Our records for one real example: people/angelo/pipeline/b0-library/ (times.json, its commits on pool/b0-library), people/angelo/ledger/, people/angelo/estimates/.
- **Writes:** people/angelo/projects/prod-pipeline/a1-flow-proposal/ only: proposal.md, mock/ (static HTML or SVG, and screenshots at 390 px and 1280 px), STATE.md. Branch pool/a1-flow-proposal.
- **Brief:** one concept, two sizes, kept live:
  1. The page and the strip draw from the same concept and design (Angelo: "align and draw from the same concept and design"): say what each keeps from the Fringe drafts and what it takes from the newsroom's (one lane per agent as an option, Replay, a hand-off arrow), and what changes in either.
  2. Always up to date: the trace is regenerated on every page update (in the build or the deploy), with no hand step; say where the hand steps of today's method (people's steps, sub-agents) come from instead, or how they show as gaps.
  3. In progress: when work on a page is running, the diagram shows it moving (Angelo: "an in-progress gif"). Say what signal tells "running" (an open branch, a run without an end, status.json, a CI run in progress), how fresh it can be on a static site, and the cost of each.
  4. Everywhere: the strip at the foot of every page, phone and desktop, and how the coming app would take the same data (one JSON per page, its URL).
  5. One data shape: lisbon-fringe-trace/1 plus what is missing (slot, minutes, tokens per step; live moment), so our records (b0-library) can fill it too. Mock both the Wexio trace and b0-library in it.
  6. Small and portrait screens: A2 (below) does this as its own task, in parallel. If A2's result is on pool/a2-small-screens when you write, take its limits and show them in your mocks; if not, leave a short section pointing to A2.
  7. Bigger later, named only: the stand and the demo screens (a wall view of work in progress). Out of scope to design now; a paragraph on what this concept gives them.
- **proposal.md:** first one phone screen a team member can read cold (the idea, one picture, what changes, what it needs); then the options with mocks; then the data shape; then open questions with a recommendation each. No em-dash. No contact detail; private people by role.
- **Not:** no change in the Fringe repository or to its agents' files; no message to any agent or person; no build; no automated reading of websummit.com.
- **Done when:** proposal.md and the mocks are on pool/a1-flow-proposal, every claim about existing code names its file and commit, the gate prints OK, and STATE.md says "ready for Angelo's read". Angelo reads it, then decides who in the team gets it.

## A2: small and portrait screens, a dev task (asked 2026-11-11)
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

## A3: one draft for the team (written 2026-11-11 18:55; started 19:03 on golf.large: no budget, Angelo)
- **Role:** design (large), not charlie or foxtrot (they made A1 and A2; a fresh eye merges them). Brief: people/angelo/projects/prod-pipeline/a3-team-draft/brief.md (the lead's folder). Writes: people/angelo/pipeline/prod-pipeline-a3/ (inside the workers' lane), branch pool/prod-pipeline-a3.
- **Wake routine:** trig_01MqHQ7CWqSnu5JGwYRpkQg5
- **Reads:** A1 (pool/a1-flow-proposal, 991ae24: proposal.md, mock/), A2 (pool/a2-small-screens, 91d6bff: findings.md, proto/, shots/), the project's BRIEF.md (Angelo's words), the prior-art copy (prior-art/fringe-6b079db/).
- **Brief:** one draft a team member reads cold, on option A (decided by default, Angelo can reverse): one phone screen first (the idea, one picture, what changes, what it needs); A1's option A redrawn within A2's limits (at most a third of the screen for the strip, text at least 12 px, targets at least 44 px, no sideways page scroll), the "Show the flow" toggle on the trace page; screenshots at 320, 390, 740x360 and 1280 px, measured with A2's measure.cjs; the data shape and the open questions from A1. Options B and C go to an appendix of two lines each.
- **Done when:** team-draft.md, its mocks and screenshots on pool/prod-pipeline-a3; measure.cjs passes on the mocks; the gate prints OK; STATE.md says "ready for Angelo's read".

## A4 and A5: simulate the diagram on small and big pages (asked and started 2026-11-11 19:13)
- **Angelo, 11 Nov:** "Can you spawn a couple workers to simulate how a few diagrams would look like on various pages from the website, choosing some small and some big pages?"
- **A4** (small pages): design, large, juliett.large; brief a4-sim-small/brief.md; writes people/angelo/pipeline/prod-pipeline-a4/.
- **A5** (big pages): design, large, kilo.large; brief a5-sim-big/brief.md; writes people/angelo/pipeline/prod-pipeline-a5/.
- Both: A3's design on real Tech Fringe pages, traces from git history only, screenshots at 320, 390, 740 x 360 and 1280, A2's check; a rule for tiny traces (A4) and for huge ones (A5). Done when sim.md is on their pool branch and STATE.md says "ready for Angelo's read".

## A6: the team draft, version 2 (started 2026-11-11 19:48, session_01Xp7gj3T5setN3YtbMbiDEo)
- Decided by default, Angelo can reverse: fold A4's small-page rule and A5's nine big-page rules into A3's draft before the team sees it (both workers recommend it). Design, large, lima.large; brief a6-team-draft-v2/brief.md; writes people/angelo/pipeline/prod-pipeline-a6/.

## A7: every commit and interaction behind a page (asked 2026-11-11 20:1x)
- Angelo: "I would like to see each and every commit (and other interactions?) that have contributed to get the page to the current state, let's leave the template changes to their own pages." Build (a read-only tool and its traces), large, mike.large; brief a7-full-traces/brief.md; writes people/angelo/pipeline/prod-pipeline-a7/. Six pages: DISTRICT 909, Storm Summit, /me/, /tip/, home, programme.
