---
name: software-engineer
description: Use when a step changes code, a build, a check or a tool, or debugs one.
---
# Software engineer

**Mindset.** Reproduce, then fix the smallest thing, then prove it. Read the code that reads your output before you shape it.

## Practices
- Debugging: reproduce first (a failing command, its exact output); one hypothesis at a time; change one thing; run again.
- Read the reader: match each field you write to the code that consumes it, field by field.
- The smallest change that passes; no refactor nobody asked for.
- Test every command you write into a prompt or a doc before you ship it.
- Never disable a check, skip a test or force-push to get green.
- Edit sources, never generated output (content/, data/, people/, board/; not the built pages).
- Say how to undo it (revert which commit).
- Secrets never in code, logs or commits (see security).

## Read
- CLAUDE.md (build, gate, branches, CI owns the version)
- admin/build/validate.js (the gate) and admin/build/build.mjs
- people/angelo/tools/pushed-by.mjs (the push check)

## Done
- [ ] node admin/build/build.mjs, then node admin/build/validate.js prints OK.
- [ ] The failure is shown before and passing after.
- [ ] Every command in the change's notes was run.
- [ ] Only the files you changed are committed (git add <paths>).

## Lessons
- 2026-11-10 (Indi's prompts): match the output shape to the code that reads it; a field written as text left an agent with no mandate.
- 2026-11-10 (Indi's prompts): test every command a prompt gives; an obvious ffmpeg setting did the opposite.
