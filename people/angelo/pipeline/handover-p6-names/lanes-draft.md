---
title: "lanes-draft: what lanes.json needs for the new names"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo)
written: 2026-11-11
for: policy@PrompTugal.angelo (a proposal, not an edit)
status: "draft; lanes.json and lane-check.mjs are policy@'s and untouched"
---
# Can the lane check match a pattern today? No.

**What I read:** people/angelo/policy/lanes.json (entry `alpha.large.worker@PrompTugal.angelo`, lines 206 to 233) and people/angelo/policy/lane-check.mjs, which admin/build/validate.js runs as check 21.

- lane-check.mjs builds a map `lanes[name.toLowerCase()]` from each agent key and each `aliases` entry (line 25), then looks up the commit's `Agent:` name (or the subject's) exactly (line 37). **No pattern, no wildcard: an unlisted name is not in a lane.** (Only the *paths* use globs, via `toRe`.)
- The `Agent:` regex (line 34) is `[a-z0-9.-]+@(web-summit|promptugal).angelo`: it already accepts `bravo.sonnet-5-5.claude.worker@PrompTugal.angelo` (dots, dashes, digits).
- The 19 worker names are listed in full as aliases of alpha. The source line quotes Angelo, 11 Nov: "I'm happy for opening all 20 lanes immediately but not give wildcards".
- `enforce` is true, so an unlisted new name is refused at release (not a warning).
- pool-claim.mjs accepts the new names (its regex `^[a-z0-9.-]+@PrompTugal\.angelo$`); other tools I grep'd (agent-log.mjs, validate.js) do not hard-code `.large.worker`.

## Options for policy@

| | Change | Cost | Risk |
|---|---|---|---|
| A. Enumerate | one alias per slot x model x environment | 20 slots x ~4 models x 5 environments = 400 aliases; grows with each model | keeps "no wildcards" literally; unmaintainable |
| B. Closed sets (recommended) | lanes.json gets `"worker_slots": [..20 words..]`, `"worker_models": [..]`, `"worker_environments": [..5..]`; lane-check.mjs resolves `<slot>.<model>.<env>.worker@PrompTugal.angelo` to alpha's lane when all three parts are in the sets (about 8 lines) | a model or environment needs a line in lanes.json (policy@ keeps control) | it is a pattern, though over closed sets; Angelo said "no wildcards", so ask him |
| C. Prefix | match `<slot>.*.worker@` | smallest | any model string passes: a typo or an impostor model name is accepted |

## Recommendation

B, after Angelo's yes (the question is whether closed sets count as the wildcards he refused). Meanwhile: keep the 19 old aliases and add, per slot actually used, the one new full name, which needs no code change:

```
"bravo.sonnet-5-5.claude.worker@PrompTugal.angelo"   (alias of alpha.large.worker@, as now)
"alpha.sonnet-5-5.claude.worker@PrompTugal.angelo"
```
Inner agents on other environments write nothing to the repository themselves (the worker commits for them), so they need no lane today; if one ever commits, it needs its own alias or option B.

## Also to decide (policy@)

- Rename the lane key from `alpha.large.worker@` to a neutral key (the keys are only labels; aliases carry the names).
- Tests: add a case to people/angelo/tools/tests or policy's own tests for a three-part name that must pass and a four-part unknown environment that must be refused.
- Gate check: lane-check.mjs on a branch that adds names must still print warnings only until enforce says otherwise; policy@ decides the order of the two commits (lane first, then the first commit under the new name; kit lesson, 11 Nov: "ask for the lane before the first commit").
