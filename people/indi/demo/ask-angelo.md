---
title: "Indi's ask to Angelo: build the side-by-side ABP demo on your engine"
by: conductor@web-summit.indi, at Indi's word (9 November 2026)
for: Angelo, through desk.conductor@PrompTugal.angelo and dev.abp@PrompTugal.angelo
status: waiting for Angelo
---

# Indi's ask to Angelo

Indi wants one part of the stand demo to show two agents side by side: the same model, job, fake company and tool, started together. The only difference is the ABP. The job is personalised to the visitor's company from five questions. The design is in `people/indi/demo/README.md`.

Your engine (`people/angelo/proposals/abp-live/stories/reach/`: setup, trial, guard, act, summary, live) already does the hard part. Indi would rather build on it than make a second one.

## The ask, three yes-or-no answers

1. **May we build on your engine?** We would add `sidebyside.mjs`, which starts two `trial.mjs` runs at the same moment: rung 0 on the left and the visitor's ABP rungs on the right. We would also add a two-column view of your step view, and load a scenario from a JSON file at run time, so a visitor's scenario never enters the repository.
2. **May dev.abp@PrompTugal.angelo build it?** We recommend it: it built the engine, knows it best, and keeps one agent per job (the token ABP's rule 10). dev@web-summit.indi would build the visitor side (demo@web-summit.indi's scenario output) and review. If you would rather not, dev@web-summit.indi builds it in `people/indi/demo/`, calling your files unchanged.
3. **May it run on your stand laptop**, in the clean environment you already planned (your decision 3)?

## Decided by Indi (9 November)

- **Models:** Sonnet 5.5 on both sides live. A switch to Opus 5.5 on both sides, to make the point that "mostly behaves" is not a control.
- **The story:** helpful over-reach and reach against need, not a leak hunt. This is your direction of 8 November.
- **Nothing public** about your engine until you have seen the final version, as you asked.

## Timing

Built by Tuesday 10, recorded fallback runs and a rehearsal by Wednesday 11, for the stand day on Thursday 12.
