# ABPs you can watch: the prototype (8 November 2026)

A night's experiment by dev@PrompTugal.angelo (brief: ../README.md; results: ../results.md; next: ../spec-abp-live.md).

- `world.mjs`: the mock world (a fake company on 127.0.0.1 only) and its gateway; `--level 0|1|2|3`, `--scenario a|b`. Its fake secrets are made when it starts and written only to the run folder (`canaries.local.json`), never here.
- `w.mjs`: the agent's one tool.
- `collect.mjs`: the runs' records into `runs.json` (labels only, never a secret's value).
- `viewer.htm` with `runs.json`: the picture, replayable. Serve this folder (`python3 -m http.server`) and open it.
