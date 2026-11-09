# Proposal 1: the gate fails a release when an agent writes outside its paths

By policy@web-summit.angelo, 6 November 2026, for Angelo. Status: **approved by Angelo, 7 November 2026 ("Go ahead with both"); built by dev@PrompTugal.angelo on 7 November as check 21 (people/angelo/policy/lane-check.mjs), warnings until lanes.json says "enforce": true, which policy@ turns on.** It raises map rule R6 ("write only inside the agent's own paths") from **checked** to **technical**.

## The problem

Every ABP of Angelo's agents lists the same barrier, "Writes only `people/angelo/`, the board and the agenda", as "rule, kept by the agent": git has no per-path write control, and everyone who can push can write every file, the gate and the CI workflow included. Today an outside write is only seen after the fact (the watcher lists it, policy judges it), once it is already live on `dev`.

## The check

A new gate check in `admin/build/validate.js` (check 23, "lanes"):

1. **Input:** a lanes file per person, starting with `people/angelo/policy/lanes.json` (already kept, and used by `people/angelo/policy/audit.mjs`, the working prototype). It maps each agent to the globs it may write, from its ABP's Mandate. Shape: `{ "common": [...], "agents": { "<agent>": { "writes": [...], "tier3_paths": [...] } } }`.
2. **Range:** the commits being released. In `release.sh` (local, before the push): `origin/dev..HEAD`. In CI: the push's `before..after`. Merges and CI's `site vX.Y.Z` releases are skipped.
3. **For each commit** whose `Agent:` trailer (else subject prefix) names an agent in a lanes file: every file it touched must match `common` or its `writes`. Otherwise the gate fails with `lanes: <sha> <agent> wrote <file>, outside its ABP's paths`.
4. **Allowed exceptions, visible in the commit:** tier 2 and tier 3 writes stay possible, but must be declared with a trailer `Outside: <path>; <who asked, with a sha or a quote>`. The check passes a declared path and lists it in the gate's output, so policy and the watcher read the reasons.

## Why release.sh first

The gate in CI stops the deploy, not the push: the commit is already on `dev`. In `release.sh`, which every one of Angelo's agents uses, the same check runs before `git push`, so a wrong write never reaches `dev`. CI repeats it for anyone who pushes without the script.

## What it would have caught (run 1)

Since the protocol (4 November 17:41), with the current `lanes.json`: four commits with writes outside the Mandate paths (`11884c6e`, `5e438280`, `7a6a14e9` in tier-3 paths; `f5ec850d`, the helper's line in the dashboard's file). All four had a reason in their body; with the check they would each carry one `Outside:` line, and nothing else would change.

## Cost and risk

- About 40 lines in `validate.js`, reusing check 13's glob matcher; a few in `release.sh`. No new dependency.
- Owners: `admin/build/validate.js` and `admin/tools/release.sh` are shared code (Dinis's dev and conductor). Under Angelo's protocol (R7) dev@web-summit.angelo may only route a patch to them.
- False failures: a lanes file out of date with an ABP. Policy keeps `lanes.json` current at every run; a red gate names the file and the agent, so the fix is one line.
- It does not stop a determined pusher (the check is in files the pusher can change). It turns honest mistakes, and an agent misled by what it read, into a refusal instead of a finding.

## Next step for Angelo

Say who drafts it (recommended: dev@web-summit.angelo, as a routed patch in `people/angelo/proposals/WS-34/`, to dev@web-summit.dinis), and whether the other people's lanes join later.
