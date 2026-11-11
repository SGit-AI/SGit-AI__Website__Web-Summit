---
title: "Project: the production pipeline (prod-pipeline)"
lead: prod-pipeline.pm@PrompTugal.angelo
started: 2026-11-11, by conductor.b@PrompTugal.angelo at Angelo's word
status: running
---
**Wake routine:** trig_01MqHQ7CWqSnu5JGwYRpkQg5 (fires into this lead's session when a worker fires it, and every 2 hours at :12 as a backstop; Angelo, 11 Nov: "Go on all three, 2 hours is fine"). Put "Wake routine: trig_01MqHQ7CWqSnu5JGwYRpkQg5" in every worker's brief.md.

# The production pipeline

**Angelo, 11 November:** "I've been using conductor.fringe to work on the flow, but that's not ideal, we need a production-pipeline lead now." Earlier: "I need to nail down the approach of getting a voice note or content notes and getting an article in the shortest amount of time" (spec-pipeline-b.md); "what I want to focus for the demos is a way to see the flow of operations that are behind the production of each deliverable"; "we want to be able to track each and every agentic activity though commits."

## Goal
A working production pipeline for Angelo's deliverables (note to live, through the prompt library's roles) and **the flow view**: for any deliverable, one page showing every step behind it (who, which slot, when, minutes, tokens, the hand-offs, to the live result). The view is the demo.

## Done when
Angelo sees, on our own site, the flow of a real deliverable from his note to live, generated from the records (not drawn by hand), and the next deliverable gets its flow page without extra work.

## Start from
- people/angelo/pipeline/b2-flow-reuse/research.md: build on the newsroom's piece drawing (promptugal.news/newsroom/pieces/, dev.graphs@PrompTugal.dinis), fed by our own records in the reporter's ws-trace/1 shape; first version: b0-library. Its three questions for Angelo are yours to bring him.
- **A frozen copy of the Fringe flow drafts** is in people/angelo/projects/prod-pipeline/prior-art/fringe-6b079db/ (README lists each file and its maker); build on it there once the Fringe ends.
- Lisbon Fringe (read only; PrompTugal/PrompTugal__News__Fringe): Angelo had conductor.fringe@ work on the flow there: tracer.fringe@'s trace of one event page (77 steps, 893d4e6) and designer.fringe@'s draft swim lanes at /traces/<event_id>/ (f6dbece). Build on them; never change or duplicate them; agree the shared format through Angelo.
- people/angelo/pipeline/ (ROLES.md, QUEUE.md, skills/, formats/), people/angelo/conductor-b/runs.md, each item's times.json, people/angelo/ledger/.
- people/angelo/proposals/account-move/spec-pipeline-b.md (the article pipeline and its target times).

## Budget
None. The running cost (dollars and tokens) goes in STATE.md's "For the digest:" line (Angelo, 11 Nov, to "a running cost in each PM's For the digest line, no threshold": "Yeah, c works."; the 10 USD set by conductor.b@ at the start was never Angelo's, and is withdrawn).
Also, in the lead's session: None. Angelo, 11 Nov 18:5x, in the lead's session: "Where does this budget come from? I've not set any budget to be honest." The 10 USD figure was conductor.b@'s, written at intake (94dfabc), not Angelo's. His standing word (ROLES.md tenet 5): "we don't need to put ceilings, as long as we have usage let's go to town." Spend is recorded per run in runs.md, never a gate.

## Angelo's change, 11 November (after the lead's first points)
*"Let's focus on the Tech Fringe (it's the new name coming up), so we can build it its repo and the we can move it later if we want to expand it. But this is only the first step of something bigger for the stand and the demo screens."*
*"Agreed on making a proposal so that both the page that is already there and the little piece in each page align and draw from the same concept and design. Ideally the diagram is updated each time a page is updated, so it's always up-to-date and even shows an in-progress gif when work is actually in progress. It would be nice to have this diagram always available in each and every page of the website, desktop and phone, and the app that will come soon."*
*"But before we do anything we need to get to a good draft to share with the team."*

So, until Angelo says otherwise: the flow view is built for the Tech Fringe (today PrompTugal/PrompTugal__News__Fringe, "Lisbon Fringe"), on its existing trace page (/traces/<event_id>/, f6dbece) and its strip (admin/build/trace-strip.mjs, 438f9f5); the first deliverable is **a proposal draft for the team**, not a build. "Done when" above now reads: the team has the draft Angelo approved; building waits for his next word.
