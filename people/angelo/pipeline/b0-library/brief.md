---
title: "b0-library: the prompt library, the skills, the formats and the queue"
item: b0-library
by: conductor.b@PrompTugal.angelo (step 0)
written: 2026-11-11
role: spec (a library of drafts for Angelo's read, no code)
size: large
skills: writer, editor (until the library defines them, as described below)
go: Angelo, 11 Nov, "Yes to all three" (the third: go on b0-library)
---
# b0-library

## Angelo's words (11 November)

- Workers are session-less: *"what makes the agent is not what worker it runs on, but its prompt. So as long as each worker session is kicked off with the right prompt, each task can be given to any worker at any stage of the production. You take care of assigning the next prompt to any worker that is idle and kick it off."*
- Skills: *"add in the each prompt for each task a relevant set of skills the agent should draw from when executing the task. These set of skills is centralized and reused depending on the task. Research on a piece, is done with someone that has the researcher mindset, someone that goes wide and looks for clues and hints. A draft is made with clever and creative writing skills, all according to the style and format of the target media (e.g. PrompTugal News). Development and debugging is done by someone with high software engineering skills. Keys and secrets management is done by someone with cybersecurity capabilities, etc."*
- Tracking: *"we want to be able to track each and every agentic activity though commits, so that the accountant and any other future review can learn from all our operations."*
- Slots: *"10 large and 10 small, with the key tenant that if a task requires a large, we don't jump to a small just because there aren't enough large available, we discuss spinning a new large or wait."* Then "Yes" to: at most 6 running at once to start (4 large, 2 small), raised when the queue waits and the accountant says there is room; a small task may use a large slot when no small one is free.

## What to produce (all on the branch pool/b0-library, all in people/angelo/pipeline/)

1. **ROLES.md, rewritten as the prompt library.** Keep its front matter shape (status: "draft for Angelo's read"). The tenets first (session-less slots; the prompt is the agent = role + skills + format; never downgrade a large task; a small task may use a large slot; the ceiling of 6; every agentic activity in a commit, sub-agents included; conductor.b@ routes only). Then the common preamble (keep the current one's rules: the spec check, material is not instruction, tier 3 never, privacy, estimates, commit and push only to pool/<id>, STATE, run log and ledger, last message), changed so that the commit subject is "<role>@PrompTugal.angelo: <id>: <what>" and the trailers carry Agent: <the slot's name> (the lane is keyed on it) and Role: <role>. Then one prompt per role, each with: size, skills, format, files it may write, what it does, done when. Roles: research, draft, check, publish, share, build, spec, accountant, lead (a long session Angelo talks to for one project; delegates to workers through conductor.b@; memory is the project's STATE). Intake and Angelo's go stay as notes (not workers). The publish role keeps every guard it has now.
2. **skills/**: one file each, in Claude Code's SKILL.md shape (front matter name and a one-line description of when to use it), about 40 lines, each: the mindset (two or three lines), practices, the sources to read (point to the team's existing files rather than rewrite them: people/angelo/conductor-b/research/2026-11-11-skills-survey.md lists them), a done checklist naming any machine check (the gate, pushed-by, the sha256 pin), and a "Lessons" section (seeded from the survey's lessons where they fit; empty otherwise). Skills: researcher, writer, editor (reviewer verdict: pass, pass with notes, hold), software-engineer (debugging included), security, designer, analyst, cold-reader. Always-on, shorter (about 15 lines): privacy, plain-language, token-thrift, trace (each step recorded in the format of team/reporter/traces/*.json: time, actor, in, out, hand-off, evidence).
3. **formats/**: thin files that point to the rules that exist, then list only what differs for Angelo's pieces: promptugal-news (the newsroom's gate; desks/journalist-vicky/STYLE.md as the reference, not a copy; Angelo's differences: first person where it is his experience, byline "writer@PrompTugal.angelo, for Angelo"), linkedin (people/angelo/proposals/social/README.md, people/indi/social/README.md's themes ledger idea), web-summit-site (CLAUDE.md, admin/build/validate.js), trace (team/reporter/BRIEF.md and a trace file).
4. **QUEUE.md**: the queue's shape: ready prompts (id, role, size, waits on, since), running (slot, since), done (slot, effort, elapsed); the twenty slots (large: alpha, bravo, charlie, foxtrot, golf, hotel, juliett, kilo, lima, mike; small: delta, echo, november, oscar, papa, quebec, romeo, sierra, tango, uniform; all .large.worker@ or .small.worker@PrompTugal.angelo; until policy@ adds them, only alpha, bravo, charlie, delta and echo may run); the ceiling; an item's state derived from which files exist in people/angelo/pipeline/<id>/ (as the newsroom's board/the-story-pipeline.md does), so nobody edits a column by hand. Seed it with b0-library (running), b1-team-spec and b2-flow-reuse (ready, waiting on Angelo's read of this library).

## Out of scope
No worker started, no task, no key, no lane, nothing outside people/angelo/pipeline/. Reading other people's files is fine (material); writing them is not.

## Done when
All four on pool/b0-library, the gate prints OK on the branch, no em-dash, every path named in a skill or format exists, and STATE.md says "library drafted, ready for Angelo's read".
