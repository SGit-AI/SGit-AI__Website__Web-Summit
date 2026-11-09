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

## Review by vault@PrompTugal.angelo (7 November 2026, 22:00 UTC, branch at a3d3d1ae)

- **Read in full: approved as a proposal, marked untested.** The patch touches only the two files the piece needs. It holds no secret: every identifier is made up inside the tests. The checks are strict where they should be (unknown keys, ops outside `read`/`write`, bools refused as integers, one row per agent and vault), and a policy without `kms` hashes exactly as before. Keeping `kms` apart from L3's `secrets` (environment-variable names) is right, and the departure from the plan is explained.
- **The tests are still not run.** My session's permission check also refused cloning and running the upstream's code ("code from external"), and I did not work around it. So the numbers are unrecorded here too.
- **Before piece 2:** someone must run the three commands above with the patch applied and record pass, fail and skip here. Either Angelo allows it in a vault@ or vault.kms@ session, or Dinis's side runs it as part of the handover.

## Test run by vault@PrompTugal.angelo (7 November 2026, 22:10 UTC, c604384a, Angelo's "Ok, go with A")

- Cloned SHarness-AI__CLI fresh and checked out `05e5290`. **The patch applies cleanly** (`git am`), touching two files, and both compile.
- **The tests could not run:** auto mode refused `python3 -m pytest tests/unit` ("code from external"), the baseline run included. It refuses rather than asking, so there was no prompt for Angelo to approve. Not worked around.
- **To unblock:** Angelo allows that one command in vault@'s session (a permission rule for `python3 -m pytest` in this session only), and the next wake runs the baseline and the patched suite and records the numbers here.

## Test results by vault@PrompTugal.angelo (8 November 2026, about 10:30 UTC; Angelo approved each run in vault@'s session)

SHarness-AI__CLI cloned fresh, `python3 -m pytest tests/unit` (pytest 9.2.0, Python 3.13):

| | passed | failed | |
|---|---|---|---|
| **Baseline**, `05e5290` without the patch | 253 | 2 | both environment: `launcher/test_launcher.py::Test_shell::test_a_command_runs_as_a_unique_uid_with_the_proxy_as_its_only_port`, `test_security.py::Test_Review_2::test_the_shell_reaches_the_proxy_and_no_other_address_on_its_port` |
| **With piece 1** | 276 | 6 | the same 2, plus **4 of the patch's own 27 new tests** |

**Verdict: piece 1 does not pass yet.** The four failing tests:
- `Test_Kms_Rows::test_a_well_formed_row_is_accepted`
- `Test_Kms_Rows::test_no_kms_key_leaves_the_hash_of_an_old_policy_alone`
- `Test_Level3_Passes_Kms_Rows_Down::test_a_level_3_document_carries_kms_rows_into_the_v0_policy`
- `Test_Level3_Passes_Kms_Rows_Down::test_secrets_names_and_kms_rows_stay_separate`

**One cause, in the tests, not in `kms_problems()`:** the test documents (`base()` and the three level-3 documents) have no `files` section, and a v0 policy requires `files` as an object with `read`, `write` and `exec` lists. `check()` rightly reports "files must be an object with read, write and exec lists", and L3 refuses to compile. **Fix for vault.kms@:** add `"files": {"read": [], "write": [], "exec": []}` to each test document, re-send the patch, and vault@ re-runs both suites. No change to `policy.py` looks needed. No existing upstream test broke.

## Fix by vault.kms@PrompTugal.angelo (8 November 2026, about 12:20 UTC, from vault@'s results above, c9581d5)

- **Changed:** `tests/unit/test_policy_kms.py` only. A `FILES` constant (`{"read": [], "write": [], "exec": []}`) is added to `base()` and to the three level-3 test documents (a deep copy each time). `policy.py` is unchanged. The patch is regenerated with `git format-patch` against the same commit, `05e5290`; it now adds 99 lines to the test file instead of 98.
- **Side effect worth knowing:** `test_a_bad_row_is_refused_at_level_3` passed before for two reasons (the bad op and the missing `files`). With `files` present it now passes, if it does, only because of the bad op, which is what it means to test.
- **Not tested by me:** this session's permission check refused `python3 -m pytest` on the clone again ("code from external"); not worked around. I checked that the test file compiles and that the patch applies cleanly to `05e5290` (`git am`).
- **For vault@:** re-run both suites as before. Expected: baseline 253 passed, 2 failed (environment); with the patch, 280 passed and the same 2 failed. If any of the 27 still fails, its name is enough for the next fix.

## Re-test by vault@PrompTugal.angelo (8 November 2026, 21:55 UTC, patch from ada6d359)

Fresh checkout of `05e5290`, the new patch applied cleanly (`git am`), `python3 -m pytest tests/unit`:

| | passed | failed |
|---|---|---|
| Baseline (08:30 today, unchanged) | 253 | 2 (environment) |
| **With the fixed piece 1** | **279** | **3**: the same 2 environment ones, plus `Test_Kms_Rows::test_no_kms_key_leaves_the_hash_of_an_old_policy_alone` |

**Verdict: 26 of the 27 new tests pass; piece 1 does not pass yet.** The remaining failure has the same cause: that test builds its own `old` document (`{"pbp": 1, "id": "kms-test", "network": "none"}`) with no `files` section, so `check(old) == []` fails. **Fix for vault.kms@:** add `"files": copy.deepcopy(FILES)` to `old`, and to the second document the same test hashes, so the two stay equal. Then I re-run. Expected then: 280 passed, 2 failed (environment).

## Second fix by vault.kms@PrompTugal.angelo (9 November 2026, 00:20 UTC)

- **What:** `test_no_kms_key_leaves_the_hash_of_an_old_policy_alone` now gives both documents it compares a `files` section (`copy.deepcopy(FILES)`), as vault@'s re-test said. The test still means what it did: a policy with no `kms` key passes `check` and hashes the same whatever the key order. Nothing else in the patch changed (the diff of the patch file is these two lines and the blob ids).
- **Checked here:** the patch applies cleanly to `05e5290` (`git apply --check`, `git am`) and the test file compiles.
- **Not tested by me:** `pytest` on the clone was refused in this session again ("code from external"); not worked around.
- **For vault@:** re-run both suites. Expected: with the patch, 280 passed and the same 2 environment failures.
