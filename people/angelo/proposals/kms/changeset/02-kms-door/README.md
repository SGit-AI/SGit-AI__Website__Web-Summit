# Piece 2a: the kms door, v0 (E08), without its cryptography

By vault.kms@PrompTugal.angelo, 9 November 2026, from `../PLAN.md` piece 2, after vault@'s third test passed piece 1 (`5d695d8e`). A proposal for Dinis's SHarness-AI__CLI; nothing was pushed there.

**Based on:** https://github.com/SHarness-AI/SHarness-AI__CLI, branch `dev`, commit `05e5290`, **with piece 1 applied first** (`../01-policy-rows/`; on that clone it became `f6ec373`). Piece 2 reads piece 1's `kms` rows and `kms_problems()`, so it does not apply without it.

## The design problem first (the plan says: write it down and stop)

The design's response envelope (design/keys §3, "Sealing to E") is ECDH P-256, then HKDF-SHA256, then **AES-256-GCM**. SHarness is standard library only ("dependency exceptions taken: none"). The standard library has no ECDH, no ECDSA and no AES. The `openssl` command line, which `Session.py` already uses, does ECDH and ECDSA, but **OpenSSL 3.0 refuses AEAD ciphers** (`openssl enc -aes-256-gcm` says `enc: AEAD ciphers not supported`, checked in this session with OpenSSL 3.0.13). So the envelope cannot be built as designed without one of these:

1. a dependency exception for the kms only (for example the `cryptography` package), or
2. a different envelope that the openssl CLI can build (for example AES-256-CTR plus HMAC-SHA256), which changes the design and needs a security review, or
3. a newer openssl or a small helper binary, which is a dependency in another form.

This is the upstream's decision (Dinis's side), not this patch's. So I built the part that does not depend on it and stopped there. **Piece 2b**, a real backend and the test that unwrap returns keys sealed to E, waits for that decision.

## What it changes (piece 2a)
- `sharness_ai/kms/KMS.py`: the kms on the door kit (`Door`). Routes: `POST /v0/init`, `GET /v0/identity`, `POST /v0/unwrap`, `POST /v0/seal_to`, `POST /v0/destroy`, plus `GET /v0/policy` and `/v0/hello` from `Door`. The checks of §3 in their order:
  1. the TLS peer role (unwrap and seal_to: `net` only; init and destroy: `launcher` only; the door kit already refuses `app`);
  2. `sig`, when `init` bound a session auth key;
  3. `ts` within ±60 s; the nonce not seen before, kept until `ts` + 2 min, and recorded even when a later check refuses;
  4. `policy_hash` equals the kms's own; a `kms` row for **this session's agent** allows `op` for `vault_id`, and its `until` has not passed;
  5. open `sealed` (the backend: addressed to us, sender pinned, not expired);
  6. the vault id inside must be the one asked for; derive; zero the vault key;
  7. `max_uses` (only successes count); `write` and every `seal_to` need a fresh approval (an `approve` callback; none is given by default, so they are refused);
  8. the audit line: the door kit's own line, whose `row` names the op, the vault id, the agent and the use count, never a key.
- `sharness_ai/kms/Crypto.py`: the backend interface (`identity`, `make_identity`, `verify`, `open`, `derive`, `seal_to_eph`, `seal_to`, `scrub`). Clear keys pass as `bytearray`s so the door zeroes them in place. The only backend, `NoCrypto`, answers 501 with the reason above.
- `sharness_ai/kms/ACCEPTS.json`, `EMITS.json`, `__init__.py`: the contract (16 KiB body cap, the callers per route), as for `fs` and `net`.
- `tests/unit/kms/test_kms.py`: 30 test functions, 39 cases once parametrised (counted by reading, not by a run). There is one test per check, each refused with its verdict: a replayed nonce, a nonce refused later and then replayed, no sig, a wrong sig, the wrong peer, the wrong policy hash, no row, another agent's row, an op not allowed, a row past `until`, a key sealed to someone else, an unpinned sender, an expired sealed key, the vault inside not matching, `max_uses`, and write or seal_to without approval. Then: unwrap answers only `{v, sealed_to_eph, expires_in}`, with no key in the answer or the audit line (the test greps for the key and the read key, hex and base64); a read carries no write key; the vault key's bytearray is all zeros afterwards; and with no backend the checks still run before the 501. One test runs over mutual TLS (needs openssl). The cryptography in the tests is a test backend, `Fake`, defined in the test. It proves the door's logic, **not the primitives**. Every key is made inside the test.

## Where it departs from the plan
- **`CLI__Components.py` is untouched.** The plan says "the `kms` verb stops exiting 69". With no backend, unwrap cannot work, so saying "runnable" would not be true. That change belongs with piece 2b.
- **Two files that the plan does not name:** `Crypto.py` (the backend seam, the reason above) and `EMITS.json` (`Contract` requires it).
- **Readings of the design, as questions for Dinis's side:** (a) the unwrap request names no agent, so one kms serves one session's one agent, named at start; (b) `seal_to` hands a key to another identity, so I made it need a fresh approval every time, and I gave it the same ts, nonce and policy checks as unwrap; (c) "fresh approval for write" has no channel yet, so write is refused unless the launcher passes an `approve` callback; (d) the design's HKDF `info` ends with `K.pub`, which only the backend knows, so the door passes the prefix and the backend appends `K.pub`; (e) the associated data is the SHA-256 of the canonical request; (f) `destroy` scrubs and refuses every later call with 410, but does not stop the process (the launcher does that).
- **Not done:** check 2 for a local kms is skipped when no auth key is bound (the design: "locally optional, since mutual TLS already binds"); rate limits (only counts); `memfd_secret`, `mlockall` and the other memory hygiene of §7; "the session CA matches the manifest" in check 1 (the door kit has no manifest yet).

## How to apply and test
```
git clone https://github.com/SHarness-AI/SHarness-AI__CLI && cd SHarness-AI__CLI
git checkout 05e5290
git am /path/to/01-policy-rows/0001-*.patch /path/to/02-kms-door/0001-*.patch
python3 -m pytest tests/unit
```
Expected: the baseline's 253 + piece 1's 27 + this piece's 39 = **319 passed**, and the same 2 environment failures. A count that differs means my reading of the parametrised cases was wrong; the names of the failing tests are enough for the fix.

## What I could not test (said plainly)
**The tests have not been run.** This session's permission check refused `python3 -m pytest` on the clone again ("code from external"); not worked around. I checked that the five Python files compile, that the two JSON files parse, and that the patch was made with `git format-patch` from a clone where both pieces were committed. Under Angelo's choice A, vault@PrompTugal.angelo runs the tests and reports For: vault.kms@.
