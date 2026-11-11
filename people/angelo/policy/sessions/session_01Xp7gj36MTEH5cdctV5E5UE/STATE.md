# policy@PrompTugal.angelo: this session's state

The account-B session of policy@PrompTugal.angelo (Claude Code session `session_01Xp7gj36MTEH5cdctV5E5UE`). From 11 November 2026 it is the only policy@ session: Angelo retired the account-A session that day. It takes work only from Angelo and reports only to him; the desk (desk.conductor@PrompTugal.angelo) and account B's conductor (conductor.b@PrompTugal.angelo) are copied on its commits.

## Key

- `policy-angelo-2` in `data/keys.json`: encryption `sha256:e3ba83496058888c`, signing `sha256:e80b06bd4218b306`. It was made in this session on 11 November 2026 at 11:52 UTC with `pki-agent.mjs keygen --session`. The tool's sha256 matched the pin in `admin/tools/seal.mjs`.
- It is linked locally to the operator's key `sha256:db7f79fdd87e030a`. It is not submitted to or confirmed on pki.sgit.ai.
- The private halves stay in this session (`~/.sg-send/keys/`) and die with it. A later session makes its own key and marks this one superseded.
- The account-A key, `policy-angelo` (`sha256:a1310b3a70f44df5`), is marked superseded with the time and signs nothing from then on.

## What this session has done

- 10 November: added `conductor.b@PrompTugal.angelo` (`people/angelo/**`) and the pipeline workers' entry (`alpha.large.worker@PrompTugal.angelo`, `people/angelo/pipeline/**`) to `../../lanes.json`, at Angelo's word (`c9c73984`).
- 11 November: added fifteen more worker aliases to that entry: twenty slots, ten large and ten small, each named in full, no wildcard (`36a2a0d0`).
- 11 November: this hand-over.

## Earlier state, read on 11 November 2026 from `people/angelo/policy/`

- **Last audit recorded:** run 8, 10 November 2026, 07:25 UTC (`../../findings.md`), range `69ec064b..335f7f28`, with no violation. **The next audit starts after `335f7f28`.** The ledger (`../../ledger.jsonl`) also ends at run 8. Nothing shows a run on the evening of 10 November.
- **Open finding:** P-12 (low, for Angelo): a session the desk creates should name its environment in the commit (R22).
- **Open since 8 November:** P-11 was closed on 9 November (the desktop app was dropped). P-05/P-02 (session branches) is recommendation only. The barrier against `claude/**` pushes is Dinis's setting and is not done.
- **Watched files:** `../../watched.json`, three hashes, last read on 9 November at 07:25 UTC. The next audit checks them.
- **Map:** `../../map.md`, rules R1 to R35, last changed on 9 November (R35, the desk's wakes). Not yet in it: account B (conductor.b@ and the twenty pipeline slots), conductor.b@'s main control from 10 November about 17:15 UTC, and the never-downgrade rule for large and small workers (conductor.b@'s STATE, `e81d02df`).
- **Lanes:** `../../lanes.json`, with `"enforce": true` since 8 November at 07:30 UTC. The gate's check 21 (`lane-check.mjs`) runs it. `people/angelo/policy/**` is reserved to policy@.
- **Decisions:** `../../decisions.md`, last entry 7 November.

## Next, when Angelo asks or a run is due

1. Audit from `335f7f28` to `dev`: the lane check's refused and declared writes, the watched files, and the branches. Do it under account B's names.
2. Add account B to the map: the new agents, conductor.b@'s main control, and the workers' rules from `spec-pipeline-b.md`.
3. Ask Angelo whether this session's key should be confirmed on pki.sgit.ai (his step), as the account-A key never was.
