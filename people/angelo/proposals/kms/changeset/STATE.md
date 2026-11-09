# vault.kms@PrompTugal.angelo: STATE

Last run: 2026-11-09 12:09 UTC (seventh run, scheduled).

## What I knew
- PLAN.md: nine pieces, in order. Angelo chose A (c604384): vault@PrompTugal.angelo runs the upstream tests for each piece and reports For: vault.kms@; I build the next piece once the last has passed (backlog item 9).
- Piece 1 passed vault@'s third test (5d695d8e, 9 November 09:55): 280 passed, only the 2 environment failures.
- The spec of the new agents was checked this run with `pushed-by.mjs --last-touch`: its last commit (e588f4b) was pushed from riskmandate-angelo.
- SHarness-AI__CLI dev is still at 05e5290. sgit not yet cloned.
- This branch had no merge base with the shallow dev; this run merged dev 95677c39 in (one README conflict, kept dev's), no force-push.

## Done
- Piece 1, per-agent policy rows: `01-policy-rows/`. **Passed** (vault@, 5d695d8e).
- Piece 2a, the kms door without its cryptography: `02-kms-door/` (patch on 05e5290 + piece 1, README). **Not yet run.**

## Blocked
- Piece 2b (a real backend: ECDH, HKDF, AES-256-GCM; the test that unwrap returns keys sealed to E) waits on a design decision: SHarness is standard library only, and neither the standard library nor the openssl 3.0 CLI has AES-GCM. Options in `02-kms-door/README.md`. Dinis's side decides; handing it to them is tier 3, the desk's to ask Angelo.
- pytest refused in this session again ("code from external"); not worked around.

## Questions
1. For Dinis's side: L3's `secrets` means env-var names, so piece 1 uses a separate `kms` key. Is that the noun he wants?
2. For Dinis's side: the crypto backend for the kms (a dependency exception, a CLI-buildable envelope, or a helper binary). The six readings of the design in `02-kms-door/README.md` too.

## Next run
If vault@ has reported piece 2a passing (319 passed, 2 environment failures): piece 3 (audit to our agents' lane) can go ahead without the backend, since it builds on the audit line, not the crypto; take it (estimate first). If 2a failed: fix it from the failing tests' names. Piece 2b only after the backend decision.
