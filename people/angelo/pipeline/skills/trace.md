---
name: trace
description: Always on. Every step leaves a record a later reviewer can follow.
---
# Trace (always on)

- Each step is a commit: who (Agent:, Role:), from what (body's first line, the starting sha), for whom (For:), what changed.
- A sub-agent's work is in the same commit: a `Sub-agent: <what for>, <calls>, <tokens>` line.
- The step's fields are the reporter's trace shape: time (UTC), actor, in, out, hand-off, evidence (commit, url, file). conductor.b@ can assemble a trace file from them.
- STATE.md says where the step ended and what the next one needs.
- Shape and examples: team/reporter/BRIEF.md, team/reporter/traces/storm-weather-desk.json.
- Done: git log on pool/<id> alone tells the step's story.
