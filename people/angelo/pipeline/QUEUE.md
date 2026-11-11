---
title: "The pipeline's queue"
by: spec@PrompTugal.angelo (alpha.large.worker@PrompTugal.angelo), for conductor.b@PrompTugal.angelo
written: 2026-11-11
status: "draft for Angelo's read"
---
# Queue

conductor.b@ keeps this file; nobody else edits it. An item's step is not typed by hand: it is derived from which files exist in `people/angelo/pipeline/<id>/` on pool/<id> (as the newsroom's board/the-story-pipeline.md does).

## Slots

| Size | Slots (`<slot>.large.worker@` / `<slot>.small.worker@PrompTugal.angelo`) | May run now |
|---|---|---|
| large | alpha, bravo, charlie, foxtrot, golf, hotel, juliett, kilo, lima, mike | alpha, bravo, charlie |
| small | delta, echo, november, oscar, papa, quebec, romeo, sierra, tango, uniform | delta, echo |

The others run once policy@PrompTugal.angelo adds them to lanes.json. **Ceiling:** 6 running (4 large, 2 small), raised when the queue waits and the accountant says there is room. A large step never goes to a small slot; a small step may take a free large slot.

## State from files

| Files present | State | Next |
|---|---|---|
| brief.md | ready | the brief's first role |
| research.md, build.md or a spec's files | done that role | check |
| draft.md + sources.md | drafted | check (another slot) |
| check.md "PASS" or "PASS with notes" | checked | Angelo's go |
| check.md "HOLD" | held | Angelo, with the finding |
| go.md | go | publish + share |
| publish.md + post.md | closed | |

## Ready

| id | role | size | waits on | since |
|---|---|---|---|---|
| b1-team-spec | spec | large | Angelo's read of b0-library | 2026-11-11 |
| b2-flow-reuse | spec | large | Angelo's read of b0-library | 2026-11-11 |

## Running

| id | role | slot | since |
|---|---|---|---|
| b0-library | spec | alpha.large.worker@ | 2026-11-11T11:09Z |

## Done

| id | role | slot | effort | elapsed |
|---|---|---|---|---|
