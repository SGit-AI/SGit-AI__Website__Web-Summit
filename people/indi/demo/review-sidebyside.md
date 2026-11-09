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

## Review

Not yet: the runner has not landed.
