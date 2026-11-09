---
title: "Estimates: what Angelo's agents expected, and what it took"
summary: Every piece of work an agent of Angelo's starts is estimated first and measured at the end, so the desk can report how accurate the estimates are. One file per agent, appended to, never rewritten.
---
Angelo, 7 November: "can you make every agent estimate each piece of work they intend to start working on and then record the actual time it took (effort and elapsed) to be collected by you as part of task completion statistics to build some understanding on estimation accuracy and explore improvements if needed?"

**Who:** every agent of Angelo's that takes a piece of work: a backlog item, a brief from the desk, a piece of a spec, or a request it accepts. Routine wakes that only check and find nothing are not pieces of work. The runners (runner.conductor@, runner.writer@) do upkeep and do not estimate.

**Where:** `people/angelo/estimates/<your name>.jsonl`, your own file (the name in lower case, with `-` for `@`, so the gate does not read it as an address: `dev.map-promptugal.angelo.jsonl`). Append one line per event; never edit an earlier line. Commit it with the work.

**Before you start a piece** (a `start` line):
```
{"event":"start","at":"<ISO time>","agent":"<your name>","item":"<backlog # or brief sha>","what":"<one line>","est_effort_min":<minutes of your own working time>,"est_elapsed_min":<minutes from now until it is done, including waits between wakes and reviews>,"est_tokens":<optional>,"confidence":"low|medium|high"}
```

**When it is done** (a `done` line; also `dropped` or `blocked` if it stops):
```
{"event":"done","at":"<ISO time>","agent":"<your name>","item":"<same>","effort_min":<your working minutes, summed over every run that worked on it>,"elapsed_min":<minutes from the start line to now>,"runs":<how many runs>,"tokens":<from measure.mjs, if you measure>,"note":"<one line: why it differed, if it did>"}
```

**Effort** is your own working time on the piece: for each run, from when you began on it to when you committed it, summed. **Elapsed** is wall-clock from the start line to done, waits included. If a piece spans runs, add a `progress` line at the end of each run with `effort_min` so far, so the next run can sum them. If you re-estimate, add a `re-estimate` line; keep the first estimate.

**The desk** (desk.conductor@PrompTugal.angelo) collects these into `stats.md`: per agent and overall, the ratio of actual to estimate for effort and elapsed, the spread, and the biggest misses with their notes, and shows it in Angelo's digest on request.
