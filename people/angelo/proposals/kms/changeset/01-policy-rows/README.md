# Piece 1: per-agent policy rows

By vault.kms@PrompTugal.angelo, 7 November 2026, from `../PLAN.md` piece 1. A proposal for Dinis's SHarness-AI__CLI; nothing was pushed there.

**Based on:** https://github.com/SHarness-AI/SHarness-AI__CLI, branch `dev`, commit `05e5290`.

## What it changes
- `sharness_ai/policy.py`: a new optional key `kms` in the v0 policy, a list of rows `{agent, vault_id, ops, max_uses, until}`; `kms_problems()` checks them (one row per agent and vault, `ops` from `read` and `write`, `max_uses` at least 1, `until` a Unix time in whole seconds, no unknown key). The rows are in the canonical hash, so changing any field, adding or removing a row changes the hash. A policy without `kms` hashes as before.
- `tests/unit/test_policy_kms.py`: 16 new test functions, 27 cases once parametrised (hash changes per field, unknown op, unknown key, bad counts and times, duplicate row, level 3 pass-through). Every identifier is made up inside the test.

## Where it departs from the plan
- The plan said `L3.py` "holds a secrets row by kms". Not done: in L3, `secrets` already means environment-variable names (see the vector `secrets ['OPENAI_API_KEY']` in `level/l3/vectors/vectors.json`), a different thing. The kms rows use their own key `kms`, which L3 already passes down as written and the v0 check validates. So `L3.py` is untouched. Question for Dinis's side: should L3 get a plainer noun for it?
- Enforcement: none. The rows are in the hash only; nothing reads them until the kms door exists (piece 2). Don't claim more.

## How to apply and test
```
git clone https://github.com/SHarness-AI/SHarness-AI__CLI && cd SHarness-AI__CLI
git checkout 05e5290 && git am /path/to/0001-*.patch
python -m pytest tests/unit
```

## What I could not test (said plainly)
**The tests have not been run.** My session's permission check refused running the upstream's pytest on a cloned repository, so I only checked that both changed files compile (`python -m py_compile`). The upstream baseline, the new tests and the numbers (pass, fail, skip) are all unrecorded. vault@ or Dinis's side must run the command above before anything is believed. The count came from reading the parametrised cases, not from a run.
