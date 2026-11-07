# WS-106 ("Meet the estate's repository standard: the gaps"): item 8, the leak tripwire, a patch for its keeper

By dev@web-summit.angelo, 6 November 2026, 02:35 UTC wake, from the conductor (f4565d64, item 4). Two board files carry the number WS-106; this is the repository-standard one, not "Before sealing a vault key". Nothing is applied. Jose reviews.

## Where the nine gaps stand (dev at v0.2.702)

| # | Gap | State |
|---|---|---|
| 1 | `review/`, with `review/self/` | Open |
| 2 | The Agent Contact file, `/.well-known/sgit-agents.json` | Open |
| 3 | A row on nfrs.sgit.ai | Open (another site) |
| 4 | Tests against real things, beyond the gate | Open |
| 5 | `llms.txt` per section | Open (one at the root) |
| 6 | Versions as data | **Done** (3 November, dev@web-summit.dinis) |
| 7 | Each release says what it does not prove | Open |
| 8 | The leak tripwire against the staged diff, with the secret parts of every key held locally | **This patch** |
| 9 | Each role's rules with the mistake behind each | Open |

Item 8 first, because it is the one that stops a real harm. The gate already scans the whole tree for secret shapes (checks 5 and 15, `admin/build/secrets.cjs`). No shape can catch the secret part of a key this machine holds: an encrypted private key's body, a JWK's `d`, a raw key pasted without its header. Every agent here holds a session key in `~/.sg-send/`, and conductors also hold their people's issued keys.

## `leak-tripwire.patch` (`admin/tools/tripwire.mjs`, new; `admin/tools/release.sh`, one line)

- **What it checks:** `tripwire.mjs` reads only the lines about to be pushed (`git diff origin/dev..HEAD`, binaries skipped). It checks them for the gate's own secret shapes (`secrets.cjs`, the same list) and for any 24-character window of the secret part of every key under `~/.sg-send/` (and `$TRIPWIRE_DIRS`), wrapped or not.
- **What it prints:** which pushed file matched which local key file, **never the secret**. It exits 1 on a match.
- **`release.sh`:** runs it just before the push, and refuses on a match.

## Tested

In this session, with the shared files put back afterwards:

| Case | Result |
|---|---|
| A clean diff (negative control) | Passes |
| 40 characters from the middle of this session's signing key, split over two lines, with no header | **Refused**, naming the key's file and not the secret |
| A private-key header | **Refused** (the shared shape) |
| A 20-character fragment | Passes, by design: too short to tell from chance |
| The last 40 commits on dev, as a real range | Clean, 70 files, in 0.5 s |

The patch applies cleanly at v0.2.702, and holds no key: the test fragments were made at run time in the scratchpad and deleted.

## Next, if wanted

Item 2, the Agent Contact file, is the next cheapest: a small build step from `data/team.json`, `people/*/agents.json` and `data/keys.json`. I can draft it once the format is read from sgit.ai's Agents page.
