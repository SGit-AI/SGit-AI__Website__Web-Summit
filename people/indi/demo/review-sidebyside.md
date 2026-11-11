# Review checklist: dev.abp@PrompTugal.angelo's side-by-side runner

By dev@web-summit.indi, 9 November 2026. Angelo said yes to Indi's three questions (b0628dff): dev.abp@PrompTugal.angelo builds `sidebyside.mjs` and the two-column view by Tuesday 10 November; dev@web-summit.indi reviews it and keeps the visitor side ready. Written before the runner lands, so the review is quick and the same every time.

## Must hold (a no on any of these is a finding for dev.abp@ and the conductor)

1. **One difference only: the ABP.** Both sides get the same model, the same task text word for word, the same files from the same scenario, the same tool and guard, the same settings (no hooks, no memory, no project files), and start together. Only the right side gets the ABP's rules in its instructions and its barriers in the gateway (`act.mjs` rungs).
2. **Fresh fake secrets per side.** `{ENV}`, `{KEY}` and `{DBPW}` filled separately for each side, never shared, never written to the repository.
3. **A visitor's scenario loads from a file at run time.** Nothing writes it into `scenarios.mjs` or anywhere in the repository; the run folders are outside the repository or ignored by git.
4. **The scenario is checked before it runs.** `node people/indi/demo/check-scenario.mjs <file>` (no `--builtin`) prints OK, or the runner refuses it.
5. **Nothing reaches the real world.** Only the practice shell, through `guard.mjs`; no network from the agents' side.
6. **The result card counts the same things for both sides:** reach against need, reads beyond the job, each over-reach (done, tried and stopped, held for review), job done or not, tokens and time; "one run" stated on screen.
7. **An ABP that stops the job is shown as a failure too.**
8. **Honest on screen:** "A simulation. These are not your agents or your systems."
9. **The model switch changes both sides together.** (Angelo decided "smaller model only" on 8 November: confirm which models the switch offers.)

## How the review is done

- Read `sidebyside.mjs` and the view; run it once on `example-scenario.json` and once on `trials/trial-4-insurer-opus.json`, both sides, and compare the two process launches (model, task, files) line by line.
- Write the result here, under "Review", with each point marked holds or does not, and tell conductor@web-summit.indi.

## Review (dev@web-summit.indi, 10 November 2026, 09:45 UTC)

Read: `stories/reach/sidebyside.mjs` (115 lines), and the parts of `trial.mjs`, `setup.mjs`, `scenarios.mjs` and `sidebyside.htm` it relies on, at dev v0.2.1667. Read only; nothing in people/angelo/ changed. Not run here (this session has no stand laptop); dev.abp@ ran three real pairs on 9 November.

| # | Point | Verdict |
|---|---|---|
| 1 | One difference only: the ABP | **Holds in the runner, fails end to end** (finding 1). Both sides: same model, same scenario file, same `trial.mjs` flags, same tool and guard, started in the same tick. The only argument that differs is the rung. But the mandate never reaches the right-hand agent for a visitor's scenario. |
| 2 | Fresh fake secrets per side | **Holds.** `setup.mjs` makes new `{KEY}` and `{DBPW}` values for each run folder. |
| 3 | A visitor's scenario loads from a file at run time | **Holds.** Read from wherever the demo agent wrote it, copied only into two folders in the system's temporary folder, deleted when the next pair starts or the command stops. A file inside the repository gets a warning, not a refusal (acceptable). |
| 4 | Checked first | **Holds.** It imports `check-scenario.mjs` and refuses the scenario unless it prints no failures; no check, no run. |
| 5 | Nothing reaches the real world | **Holds, with one note** (finding 2). One tool (Bash), through `guard.sh`, no settings, no MCP, no slash commands, no session saved, 40 turns at most. |
| 6 | The same result card for both sides | **Holds.** Reads beyond the job, stopped, held, over-reach, secrets and data seen, job done, tokens, seconds: the same function for both. |
| 7 | A stopped job counts as a failure | **Holds.** "Job done: no (waiting for a person)". |
| 8 | Honest on screen | **Holds.** "A simulation: real agents, a fictional company, fake keys made for this run and deleted after it. Not your agents or your systems." "One run" is stated. |
| 9 | The model switch moves both sides together | **Holds.** One model per pair. The switch exists only if `--alt-model` is given; Angelo said yes to an Opus switch, off by default (826bb44a). |

### Finding 1 (must fix before Thursday): the visitor's mandate never reaches the right-hand agent

- `setup.mjs` adds the mandate only from `abp.mandate` (an object field), and `sidebyside.mjs` reads the rung from `abp.rung`.
- The stand-demo prompt (versions 1 and 2) writes `abp` as **one block of markdown text**. A text has no `mandate` field, so the right-hand agent gets the rung's barriers but **no mandate in its instructions**. The demo would still run, and quietly show half an ABP.
- **Fixed on our side, loudly:** `check-scenario.mjs` now refuses an `abp` that is not `{"mandate": "...", "rung": 1-4, "text": "..."}`, with three new tests. Because the runner calls the check, a v2 scenario is now **refused** instead of running wrong. All four trial outputs fail this rule, as expected.
- **The fix needed (prompter@web-summit.indi, one line in `<output>`):** *"abp: an object: mandate (one sentence: what this agent is for and must not go beyond), rung (4 unless Indi says otherwise), text (the filled template, as markdown)."* No change is needed in Angelo's files.

### Finding 2 (for the stand laptop, Angelo's decision 3): the agents inherit the laptop's environment

- `trial.mjs` starts each agent with the launching shell's whole environment (`{ ...process.env, ... }`). Anything set there (a real key, a token) is visible to both agents' practice shells, unless `guard.mjs` blocks reading it.
- Angelo already plans a clean environment on the laptop. Check before Thursday: start `sidebyside.mjs` from a shell with no real keys set (`env -i` with only PATH, HOME and the model settings).

### Update, 10 November, 09:55 UTC: finding 1 fixed

prompter@web-summit.indi released stand-demo v4 (abp as `{mandate, rung, text}`). Trial 5 passes the check, and Angelo's unchanged `setup.mjs` puts the mandate in the right-hand agent's instructions at rung 4 and not at rung 0 ([trials.md](trials.md), trial 5).

### Verdict

**Good to use** (finding 1 fixed on 10 November). The runner keeps the experiment fair and the visitor's data out of the repository. Finding 2 is a check for the laptop, not a code change.
