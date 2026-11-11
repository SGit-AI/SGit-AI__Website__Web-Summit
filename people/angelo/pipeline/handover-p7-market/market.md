---
title: "Handover market: the prototype and what going live would take"
by: build@PrompTugal.angelo (charlie.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
for: Angelo, to review before anything goes live
status: prototype, tested on a local bare repository; nothing live, nothing on origin but this branch
---
# The handover market: prototype

## On one screen

**What works** (7 tests pass; the draft spec is people/angelo/pipeline/b3-team-offers/spec-handover-market.md, sections 1 to 3):

| Command | What it does | Output (real) |
|---|---|---|
| `capacity.mjs write --file capacity.json --environment claude --account angelo.B --rate-limit '<json>' --ledger <ledger.jsonl>` | writes this session's row | `claude:angelo.B: allowed, headroom 26.46 USD (estimate: ...)` |
| `capacity.mjs list --file capacity.json` | says who has room | `... ROOM ... 10 min old` / `... no room ... 190 min old` |
| `market.mjs offer <id> --remote R --offerer <name> --cost 2 --size large --start-within 30` | puts work on the market | `p7-demo: offered by ..., 2 USD, large, start within 30 min` |
| `market.mjs claim-offer <id> --remote R --worker <name> --account <label> [--capacity f]` | first push wins | `p7-demo: claimed by ... first commit due ... within 10 min` / `... claimed by X: take another offer` |
| `market.mjs lapse <id> --remote R --by <name>` | opens a claim with no first commit after 10 min | `p7-demo: claim by X lapsed; the offer is open again` |
| `market.mjs list --remote R` | open, claimed, started or lapsed | `p7-demo	open	claude	large	2 USD ...	1 lapse(s)` |

Tested: two claimers race and one wins; a claim lapses and is reclaimed; a stale row (over 2 hours) counts as no room; an offer to an environment with no room stays open (also under the 1.5 times margin). The market refuses `origin`.

**To go live it would take** (each marked **T3** is Angelo's own go):

1. **T3** `board/capacity.json` created on dev, and every session adding the capacity lines to its preamble (settings of Angelo's agents).
2. **T3** A branch `handover/claims` on origin, created by the first `offer`. The prototype refuses origin on purpose; going live means one change: allow a named remote.
3. **T3** Handing work to Dinis's agents (and theirs to ours): kit/README.md puts it in tier 3. Needs Angelo's standing go or one go per offer.
4. Lane changes for policy@PrompTugal.angelo: accept `Run-on:` commits for the pilot accounts, and the new files (`board/capacity.json`, `tools/market.mjs`, `tools/capacity.mjs`) in lanes.json. Policy@ is not ours to edit (**T3**).
5. Move the two scripts to `people/angelo/tools/` and add the tests beside `people/angelo/tools/tests/` (tier 1, ours).
6. Who writes what: each session its own row in `board/capacity.json` (fresh dev, small commit, at most every 30 minutes); conductors read offers at each wake; offerers write offers; claimers write claims; nobody edits another's row.
7. The preamble lines each session adds (tier 3 to change, text only here): *"Before you end: node people/angelo/tools/capacity.mjs write --file board/capacity.json --environment <env> --account <label> --rate-limit '<get_session rate_limit_info>' --ledger people/angelo/ledger/<you>.jsonl; commit it."* and, for a conductor: *"At each wake: node people/angelo/tools/market.mjs list --remote origin; claim an open offer only if your row shows room."*

**Questions for Angelo** (recommendations in the detail): (a) the rate card used for spend is assumed, not measured; (b) whether Dinis's accounts get a standing go.

## Detail

### capacity.mjs
- A row is keyed `environment:account`, e.g. `claude:angelo.B`; environments: claude, openrouter, ollama, aws. Fields: environment, account, tier, window, status, pct_used, resets_at, spend_usd, tokens, headroom_usd_est, headroom_basis, updated_at, cost_basis.
- **claude:** window, status and `resets_at` come from get_session's `rate_limit_info`, passed as JSON (`--rate-limit` or `--rate-limit-file`); `resetsAt` as epoch seconds or ISO. Spend is summed from ledger lines (`--ledger`, repeatable) over the window (the five hours before `resets_at`, or the last five hours). Ledger lines hold tokens, not dollars, so dollars use an **assumed** API-equivalent rate card in `RATES` (5, 25, 6.25 and 0.5 USD per million tokens: input, output, cache write, cache read). It is a placeholder until the accountant publishes one; the row says so (`cost_basis`).
- **Headroom** is always an estimate and says how: `declared` (ollama, aws, or any: `--declared-headroom`), `spend / pct_used x (100 - pct_used)` when a percent is given, else `--calibration-usd` (spend of a window that hit its limit) minus spend so far, else empty. A `limited` status sets headroom to 0. Today's get_session shows no percent (spec section 1), so the calibration path is the usual one.
- **openrouter:** spend so far today (UTC) from `--usage-log`, one `{"at","usd"}` per line; headroom is declared.
- **Stale rows:** `list` and `hasRoom()` judge the age when read: over 2 hours is no room, whatever the row says.

### market.mjs
- State: `offers/<id>.json` on the branch `handover/claims` (`--branch` to change) of a remote given by `--remote`. It copies pool-claim.mjs: plumbing in a temporary index, a push without force, fetch and decide again when refused (6 tries). It never touches the working tree.
- Offer fields: id, offerer, env, cost_usd, size, start_within_min, package, offered_at, claim, lapses.
- `claim-offer` with `--capacity` checks the claimer's own row for the offer's environment: fresh, not limited, headroom at least 1.5 times the cost. Otherwise it refuses and the offer stays open. Without `--capacity` it does not check (tests, and a person's call).
- **Started** means a commit on `pool/<id>` of the same remote, at or after the claim, with the trailer `Agent: <the claimer's worker>`. A claim with no such commit after 10 minutes is **lapsed**: the next `claim-offer` takes over (recorded in `lapses`), or `lapse` opens it again.
- "Start within" is stored, not enforced: telling the person when nobody claimed is the offerer's conductor's job (spec section 3).

### Not done, and limits
- The package file (spec section 2) is only a path in `--package`; its content is not built here.
- Clock: `--now` or `MARKET_NOW`, for tests. Live, the claimer's clock is used for `claimed_at`; clock differences of minutes would shift the 10-minute lapse. A live version should take the time from the commit instead.
- `node --test` prints one harmless-looking git line, `fatal: expected 'acknowledgments', received 'packfile'`, from a fetch in the test that makes a worker commit; all 7 tests pass. Not chased.

### How to run the tests
`node --test people/angelo/pipeline/handover-p7-market/market.test.mjs`: 7 tests, 7 pass, about 3 seconds.

### To undo
The whole prototype is `people/angelo/pipeline/handover-p7-market/` on `pool/handover-p7-market`; delete the branch or the folder. Nothing else is touched.
