# The sharness.kms changeset: the plan

By vault@PrompTugal.angelo, 7 November 2026, from `../spec-kms.md`, at Angelo's word (130fe1c4: "so that we go to Dinis with a proposal rather than a request ... I'd like this to progress on now"). **vault.kms@PrompTugal.angelo** builds it, piece by piece, as patches and tests in this folder (`changeset/<piece>/`). It pushes only to `workers/vault.kms`. vault@PrompTugal.angelo reviews each piece and brings it onto dev as one commit.

**Nothing is pushed to SHarness's or sgit's repositories.** They are Dinis's. Going to Dinis with the changeset is a handover (tier 3): the desk asks Angelo when it is ready.

## The codebases, as read on 7 November 2026

- **SHarness CLI:** https://github.com/SHarness-AI/SHarness-AI__CLI, branch `dev` at `05e5290` (29 October). Python 3.11+, standard library only. Tests are in `tests/unit/` (door, fs, launcher, net). The protocol it must follow is https://sharness.ai/design/keys/index.md §3; its status page says the kms is "designed, not built", and E08 is "planned".
- **sgit:** the `sgit_ai` package, v0.27.0 (`pip install sgit-ai`). Clone keys live in `storage/Vault__Storage.py` (`VAULT_KEY_FILE = 'vault_key'`, `vault_key_path`), `show-key` is in `cli/CLI__Vault.py`, the token store in `cli/CLI__Token_Store.py`, the envelopes in `crypto/PKI__Crypto.py`.

**Base each patch on a named commit of each upstream,** and say which in its README. Neither upstream is vendored here: a patch is a `git format-patch` file plus its tests.

## The pieces, in build order

| # | Piece | Size | Files it touches | The tests that prove it |
|---|---|---|---|---|
| 1 | **Per-agent policy rows**: `{agent, vault_id, ops: [read, write], max_uses, until}`, compiled into the policy v0 hash | M | SHarness: `sharness_ai/policy.py` (schema, canonical hash), `sharness_ai/level/l3/L3.py` (a secrets row is held by kms) | the hash changes when any row changes; an unknown agent or op is refused; existing policy tests still pass (`tests/unit/test_policy.py`) |
| 2 | **The kms door, v0 (E08)**: `init`, `GET /v0/identity`, `GET /v0/policy`, `POST /v0/unwrap`, `POST /v0/seal_to`, `destroy`, with the check order of §3 (TLS peer net, signature, ts ±60 s, nonce, policy hash, op allowed, sender chain, derive, scrub, limits, audit) | L | SHarness: new `sharness_ai/kms/KMS.py` on `sharness_ai/door/Door.py`, its `ACCEPTS.json`, `sharness_ai/cli/CLI__Components.py` (the `kms` verb stops exiting 69) | one test per check, each refused with the right verdict; unwrap returns keys sealed to the one-time key and never a clear vault key; a replayed nonce is refused; the audit line holds no secret (grep the line for the test key); new `tests/unit/kms/test_kms.py` |
| 3 | **Audit to our agents' lane**: each audit line also appended, signed, to the WS-160 lane | S | ours: `admin/tools/agent-log.mjs` gains a `--from-kms` record kind; SHarness: an optional audit sink in `KMS.py` | a kms call produces exactly one record; the record holds time, op, vault id, caller and result only |
| 4 | **`sign`**: sign bytes with the session identity, return the signature (articles' `.sig`, run logs) | M | SHarness: `KMS.py` (a new op), and the protocol text proposed for `/design/keys/` | the signature verifies with `sgit pki verify`; policy can forbid it per agent; a key never leaves |
| 5 | **`unseal_secret`**: open a sealed SG/Send token and use it for one request, or return it sealed to the caller's one-time key | M | SHarness: `KMS.py`; ours: `content/vault-agent.md` step 1 (the token arrives sealed to the kms, not to the agent) | a token sealed to the kms opens only for the agent its policy row names, and is never in clear outside the call |
| 6 | **A grant signed by the person** as the proof of which agent a session is ("session X may unwrap vault V read-only, 20 times, until 18:00") | M | SHarness: `KMS.py` (grant check), `sharness_ai/door/Session.py` (the session id in the grant); ours: a `grant` command for `admin/tools/person-key.mjs` | an unsigned, expired, wrongly scoped or replayed grant is refused; a grant from a key not in `data/person-keys.json` is refused |
| 7 | **The path for agent tools**: the agent cannot call kms, so sharness.net's `/v0/vault/pull` and a small client that pki-agent, `seal.mjs` and `feedback_drain.py` call | M | SHarness: `sharness_ai/net/NET.py` (the route), `sharness_ai/door/Client.py`; ours: a client in `admin/tools/` | `feedback_drain.py` drains a lane with the private key never on disk; `seal.mjs --from-vault` seals with no `show-key` |
| 8 | **Sealed clones in sgit**: `vault_key.sealed` and `token.sealed` in `.sg_vault/local/`, `show-key` refused, keys asked of kms per operation | L | sgit: `storage/Vault__Storage.py`, `cli/CLI__Vault.py`, `cli/CLI__Token_Store.py`, `crypto/PKI__Crypto.py` | a sealed clone pulls and pushes through kms; `show-key` exits with a refusal; no file in `.sg_vault/local/` holds a clear key (a test greps for the key) |
| 9 | **Keys that outlive a session**: a written design only, not code: a lasting or recovery identity the kms key is also sealed to, so a restart needs no person | M (design) | a note in this folder, proposed for `/design/keys/` | reviewed by security@web-summit.dinis before anyone builds it |

**Why this order:** 1 and 2 are the core, which nothing else works without. 3 is small and ours, and makes every later test visible. 4 and 5 add what we need that the design lacks. 6 and 7 make it usable by real agents. 8 is the largest and touches sgit. 9 is the open question the spec says to decide before building.

## Rules for vault.kms@

- One piece per branch push, with its patch, its tests and a README naming the upstream commit it is based on and how to run the tests.
- Run the upstream's own tests with the patch applied. Report the numbers (pass, fail, skip) in the README, and never disable a failing test.
- No real key, token or vault id in a test: generate them inside the test.
- The stronger model for this code (the spec of the new agents); vault@ reviews every piece for secret handling before it reaches dev.
- When a piece reveals that the design is wrong, write that down in the piece's README and stop. Don't work around the design.

## What vault@ checks in each review

1. No secret in the patch, the tests or the README.
2. The §3 check order is kept, and each refusal has a test.
3. Nothing returns or logs a clear key.
4. The upstream's tests still pass.
5. The patch touches only the files this plan names; any other file is explained.
