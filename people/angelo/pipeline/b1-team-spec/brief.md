---
title: "b1-team-spec: the lead lifecycle and accountant.b@"
item: b1-team-spec
by: conductor.b@PrompTugal.angelo (intake)
written: 2026-11-11
role: spec
size: large
skills: researcher, writer, analyst (+ always-on)
format: web-summit-site
go: Angelo, 11 Nov, "Let's go with b1"
---
# b1-team-spec

## Angelo's words (11 November)
- Leads: *"I then need other agents that I can talk to directly to review how the individual projects are going and interact with tests, drafts and experiments."* Then: *"when a new project is started you spawn a new lead that I can interact with when I need, and then we retire it when it's over. This means we have things like abp-article.writer or live-map.dev etc?"*
- Accountant: *"we need an accountant agent to make sure we optimize our use of tokens across the account."*
- Tracking: *"we want to be able to track each and every agentic activity though commits, so that the accountant and any other future review can learn from all our operations."*
- Reading load: *"That's A LOT of text to read."* So: the spec stays short, and summary.md fits one phone screen.

## What to write
1. **people/angelo/pipeline/b1-team-spec/spec-account-b-team.md**, in the kit's spec shape (front matter title, by, written, for, issue WS-208, status "draft for Angelo"; then what and why, out of scope, the data and who may see it, the changes by owner, risks, how we will know it works, questions for Angelo each with a recommendation). Under about 150 lines.
   - **The lead lifecycle:** naming `<project>.<role>@PrompTugal.angelo` (and how conductor.fringe@, named by Dinis's swarm, fits); start (the project brief's fields: goal, done when, budget, skills; the folder people/angelo/projects/<project>/; the lead prompt from ROLES.md; the lane request for policy@, each name in full, no wildcard, ready for Angelo to paste); running (talks to Angelo in formats/conductor.md; asks conductor.b@ for workers in a commit; never starts a session, makes a key or publishes; context kept small, memory in the project's STATE.md; when conductor.b@ replaces it with a fresh session under the same name); retiring (Angelo decides; a debrief: delivered, lessons into skills, total cost; conductor.b@ archives; policy@ removes the lane).
   - **accountant.b@PrompTugal.angelo:** reads people/angelo/ledger/, people/angelo/conductor-b/runs.md, each item's times.json, the platform's cost per session (conductor.b@ records it in runs.md); reports cost per item, role, slot size and lead, queue waits, empty runs, small steps on large slots; proposes budgets per item and per lead (record, not block: over budget is raised to Angelo, never kills a run); a fresh small-model session started by conductor.b@ every few hours or on Angelo's ask; one commit and one ledger line per run. Reuse people/indi/accountant/ (measure.mjs, its ROLE and PROMPT), people/indi/accounting/, content/abp/token-efficiency.md, and the newsroom's board/budgets.json shape (read only; say if you could not open it). Keep accountant.b@ apart from Indi's and Dinis's accountants: ours reads only Angelo's records.
2. **people/angelo/pipeline/b1-team-spec/summary.md**: one phone screen (about 15 lines): what the spec proposes in five bullets, then the questions with recommendations.

## Out of scope
Starting any session, task, key, lane or project; writing outside people/angelo/pipeline/b1-team-spec/ (and your estimates and ledger lines).

## Done when
Both files on pool/b1-team-spec, the gate OK, no em-dash, every path named exists (or is marked "newsroom:" and was not opened), STATE.md says "ready for Angelo's read".
