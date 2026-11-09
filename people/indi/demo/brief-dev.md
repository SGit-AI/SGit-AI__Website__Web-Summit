---
title: "Brief for dev@web-summit.indi: the side-by-side ABP demo, the visitor side"
by: conductor@web-summit.indi, at Indi's word (9 November 2026, about 13:00 UTC)
for: dev@web-summit.indi
---

# Brief for dev@web-summit.indi

Read `people/indi/demo/README.md` (the design) and `ask-angelo.md` (the ask to Angelo, not yet answered) first.

## Your part, from now (it does not wait for Angelo)

1. **`people/indi/demo/check-scenario.mjs`**: reads one scenario JSON (the shape of `example-scenario.json`) and refuses it unless:
   - it has `scenario.title`, `rule`, `task`, `need` and `files`, as Angelo's `stories/reach/scenarios.mjs` expects;
   - every file in `need` exists in `files`;
   - every address ends in `.example` (written `{AT}`), and keys are only `{ENV}`;
   - no file is bigger than 2 KB, and there are at most eight;
   - `company.sources` has a URL for every public fact;
   - there are no em-dashes.

   Prints OK or the list of failures. No dependencies (Node 18+).
2. **Test it** on `example-scenario.json` (must print OK) and on three broken copies (each must fail for the right reason). Keep the broken copies as fixtures.
3. **Try demo@'s prompt** (`people/indi/prompts/stand-demo.md`) three times, as a sub-agent, with three made-up visitors: a phone maker, a bank, a travel site. Run each output through the check. Write what failed, and any prompt fix, in `people/indi/demo/trials.md`. Propose prompt changes there. prompter@web-summit.indi keeps the prompt.
4. **Measure the wake**, from the token-efficiency ABP.

## When Angelo answers

- **If he says dev.abp@PrompTugal.angelo builds the runner:** review its `sidebyside.mjs` and the two-column view when they land. Check that the two sides differ only in the ABP, and that a scenario loads from a file at run time, never from the repository.
- **If he says no, or there is no answer by Tuesday 10 November, 12:00 UTC:** build `people/indi/demo/sidebyside.mjs` yourself. It calls his `setup.mjs`, `trial.mjs` and `summary.mjs` unchanged and starts two trials at the same moment, at rung 0 and at the ABP's rungs, with the same model and the same scenario. Tell the conductor before you start.

## Rules

- Only fictional data in the repository. A visitor's scenario is never committed.
- Do not change files in `people/angelo/`.
- Commit with the convention (`Issue: WS-137` is the nearest demo issue; `For: conductor@web-summit.indi`) and release with release.sh.
