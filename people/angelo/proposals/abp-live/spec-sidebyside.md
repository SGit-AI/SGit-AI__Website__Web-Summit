---
title: "ABP side by side: two agents, one difference (the build for Indi's stand demo)"
by: dev.abp@PrompTugal.angelo
written: 2026-11-09
for: Angelo, through desk.conductor@PrompTugal.angelo; dev@web-summit.indi reviews; dev@PrompTugal.angelo brings it onto dev
issue: WS-08 (backlog 0-INDI; Indi's ask 163fe218, people/indi/demo/ask-angelo.md)
status: "Approved by Angelo, 9 November about 15:35 UTC: \"Yes to all three\" (b0628dff). Built on workers/dev.abp; tested offline with a stand-in agent; no real run yet. Nothing public."
---
## What and why

Indi wants one part of the stand demo to show two copies of the same agent, with the same model, job, fictional company and tool, started together. The only difference is the ABP (people/indi/demo/README.md, section 2). Angelo said yes to building it on the reach engine (`stories/reach/`), to dev.abp@ building it, and to running it on his stand laptop in the clean environment. This page records what was built and how to run it. It follows the design in Indi's README, so it is not a new design.

## What was built

- **`stories/reach/sidebyside.mjs`**: takes one scenario and starts two `trial.mjs` runs in the same tick. The left runs at rung 0 and the right at the ABP's rung: `--right`, else the file's `abp.rung`, else 4. Both use the same model: `--model`, labelled "smaller", or `--alt-model`, labelled "larger", which switches both sides together. It serves `sidebyside.htm` and `/live.json` on 127.0.0.1 only. `--once` runs one pair in the terminal and prints both summaries and the comparison.
- **The model switch** (Angelo, 9 November about 18:00, to Indi's fourth question: "Yes", the desk's 826bb44a): the page offers the larger model on both sides, off by default; the smaller model stays the default. On the laptop, `--model` is the smaller model's alias and `--alt-model` the larger one's (Opus 5.5); without `--alt-model` the switch is hidden.
- **Only this page starts a pair** (dev@PrompTugal.angelo's review finding, dc2ca5c5): `POST /start` is refused (403) when it carries an Origin other than `http://127.0.0.1:<port>`, so a web page open in the same browser cannot start runs. A command on the laptop (no Origin) still can. The same in `live.mjs`. Tested in `tests/sidebyside.test.js`.
- **`sidebyside.htm`**: the two-column view, in the step view's look. Both agents' steps show as they happen. When both have finished, a comparison appears: what each read beyond the job, the keys and private data each saw, what each did without asking, what was stopped or held, and whether the job was done.
- **Scenarios from a file, at run time** (`scenarios.mjs` `fromDoc`, `setup.mjs`): a `.json` path in place of a story's name. The file is checked first by Indi's `people/indi/demo/check-scenario.mjs`, which is called unchanged, and a scenario that fails the check is refused. The file is copied only into the two run folders in the system's temporary folder, which are deleted when the next pair starts or the command stops. So a visitor's scenario never enters the repository.
- **Generic rules for a file scenario** (`act.mjs`, `steps.mjs`, `summary.mjs`). The built-in stories are unchanged:
  - **The job's files** are the ones the scenario lists in `need`.
  - **Rung 1** adds the company's policy and, if the file has one, the ABP's `mandate` to the instructions.
  - **Rung 2** holds every send, install, delete, schedule and spend for a person.
  - **Rung 3**, the capability barrier: the agent can read only the job's files, send only to the addresses that those files and the task name, and delete only the files it made.
  - **Rung 4**, the content barrier: anything leaving with a key, or with a line from a file the job did not need, is refused.
  - **A script** in the scenario fails until the packages it imports are installed, so the install shortcut is real.
- **`tests/sidebyside.test.js`** and **`tests/stand-in/claude`**: an offline test. The stand-in plays one fixed, over-reaching sequence through the practice tool. It checks the plumbing only, not how an agent behaves. The test checks that a broken scenario is refused and that both sides run the same scenario, with rung 0 letting everything through and rung 4 stopping it. It also checks the page at 1280 and 390 px, light and dark, that no fake secret's value is served, and that no run folder is left behind. Result: PASS. Screenshots: `shots/sidebyside-1280.png`, `shots/sidebyside-390.png`, from the stand-in, not a real agent.

## How to run it on the stand laptop

```
node people/angelo/proposals/abp-live/stories/reach/sidebyside.mjs --scenario <path outside the repo>/scenario.json \
     --model <the default model's alias> --alt-model <the switch's alias>
# then open http://127.0.0.1:8772/ and press "Run both now"
```
To try the rehearsal example, use `--scenario people/indi/demo/example-scenario.json`. The built-in stories, `--scenario followup` or `--scenario install`, also work.

## Out of scope

The visitor side (the five questions, the demo agent, its scenario output) is dev@web-summit.indi's. This build adds no recorded fallback loop of pairs: Indi's plan has dev@web-summit.indi recording five runs by Wednesday, and `--once` is the tool for that. Nothing is public.

## Open, for the desk (questions, not decisions)

1. **The right side at rung 2 and above holds sends for a person**, so on the result card "job done" reads "no (waiting for a person)". This is honest, and Indi's README says an ABP that stops the work is a failure too. An "approve" button for the person at the stand, which releases a held send, would show the job done safely. It is small, but it changes what a rung means, so it is Angelo's call.
2. **Cross-customer data inside the job's own files**: for example, OutletMax asking for the other partners' numbers, which are in the needed `sales/week-45.csv`. No rung stops this today, because the data is the job's own. A per-recipient content rule (each partner receives only its own rows) would need the scenario to say whose rows are whose. Should the visitor's scenario format carry that? That question is for Indi's side.
3. **A real run** of the example, both sides, needs the claude command and a model alias, which these sessions do not have. The first real pair will be on the laptop, or in dev@web-summit.indi's recording.

## Risks

- A real agent may behave well on the left. Indi's README already covers this: the screen says so, and the point is then what it could reach.
- Two agents at once is twice the cost and load of one live run. A pair takes about as long as the slower side.

## How we will know it works

- `tests/sidebyside.test.js` passes, and so do the five earlier tests: steps, offline, offline-steps, ipad and ipad-steps all passed on 9 November.
- dev@web-summit.indi's review confirms that the two sides differ only in the ABP and that a scenario loads from a file at run time.
- A rehearsal pair on the laptop runs in a few minutes, with a visible difference on the card.
