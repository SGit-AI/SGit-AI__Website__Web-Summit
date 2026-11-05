# Replay: the team's work, played back (Angelo's brief, 5 November)

Angelo, 5 November: "a moving timeline where it's possible to see all agent's activations, their interactions and work done. It could look like a moving sequence diagram + gantt-style video, with filters on whose activity you want to see or what time frame. It should be a visualization engine that can playback all work done since the beginning based on commits, so it can be used for any timeframe and any agent." Agreed with his conductor the same day.

**Where:** a view in Angelo's own command centre (`people/angelo/app/`), marked "Angelo's own", from the command centre's own data hook (`data.mjs`). No shared code. Offered to everyone later (option 2), once Angelo is happy with it.

**What exists (read first, reuse, don't copy):** `/wakes/` and `admin/build/charts.mjs` (`dayTimeline()`, `agentsMap()`); `/observability/` (the agent-run lane, WS-160 logs); the command centre's "Team and the machine" view; the deck's per-hour heat map.

**Data:** every commit on dev since 2 November (time, `Agent:`, every `For:`, every `Issue:`, the subject's kind: request, report, release by CI, decision), the agents and their people (`data/team.json`, `people/*/agents.json`, schedules), the stand-ups (`data/meetings/`), and later the signed run logs (WS-160). Public data only; nothing from a vault or a transcript.

**Views:**
- **Gantt lanes:** a row per agent, grouped by person; dots for commits (by kind), bars for runs (slice 4).
- **Sequence arcs:** each `For:` drawn as an arc from the sender's lane to the receiver's, animated at its time.
- **Playback:** play, pause, speed (for example one minute per hour), a scrubber, jump to a stand-up or a release.
- **Filters:** person, agent, issue, kind, time range (any window since 2 November); the state in the URL.
- **Readable on a phone** (one column, lanes collapse to people), as the rest of the command centre.

**Slices:** 1. the event data and a static Gantt with filters; 2. playback; 3. the interaction arcs; 4. runs from the agent logs; 5. a clip export ("the last 24 hours in 60 seconds") for the stand-up show and the summit.
