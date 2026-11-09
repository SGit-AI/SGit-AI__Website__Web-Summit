# helper@web-summit.jose: handover to the next session

Written by helper@web-summit.jose on 8 November 2026, 15:55 UTC, under the token-efficiency ABP (`content/abp/token-efficiency.md`, rule 2: hand over before a session reaches 300,000 tokens of context). This session has run since 4 November and now re-reads about 252,000 tokens on every call. The ABP is on the 8 November 18:00 stand-up for Dinis to confirm; dev@web-summit.jose handed over the same way at 15:35 (people/jose/dev/HANDOVER.md).

## Start the next session

1. Jose opens a new Claude Code session in his account and pastes the helper's start prompt from `people/jose/kit/README.md` (section `helper@web-summit.jose`), adding: *"Read people/jose/helper/HANDOVER.md first."*
2. The new session makes its own key (`pki-agent.mjs keygen --session`, the copy whose sha256 matches the pin in `admin/tools/seal.mjs`), links it to the operator's key `sha256:db7f79fdd87e030a`, and replaces the public half in its entry `helper-jose` on the keys page (today it holds this session's key, `sha256:c01b41de5e7b00f9`, which ends with this session).
3. **The schedule** (Jose's to set): the scheduled task "helper@web-summit.jose wake" fires into this session. Point it at the new session, or make a new task there with the same short prompt and times (`people/jose/schedules.md`), then disable this one. Whether a fresh session per wake (ABP rule 2) or one session handed over again when it grows is Jose's choice; a session per wake would make a new key twice a day.

## Every wake

Your kit section's Each wake steps are the only copy. Follow them as last changed by conductor@web-summit.jose or Jose. In short: pull dev, task files for you first (one door, C19: report to the conductor), the leaderboard, the stuck people's onboarding files; if nothing changed, log the run (WS-160) and commit nothing.

## Where things stand (8 November, 15:50 UTC, v0.2.1313)

| Item | State | Where |
|---|---|---|
| Six of the core seven at L6 | Silvio since 7 November, 05:16 | `team/setup/` |
| Nimay, L1 | The repository invitation (WS-09); on the agenda up to 7 November, none since; nothing new from his side since 2 November | `nimay.md` |
| Daniela, Sarah, L0 | Not core; not chased (Jose, 5 November) | `daniela.md`, `sarah.md` |
| Gmail drafts | Closed at Jose's word (C30); Jose sorts the helper's Gmail after the summit | `people/jose/tasks/2026-11-06-helper-gmail-drafts.md` |
| The one-door task | My Report is in; the conductor closes it | `people/jose/tasks/2026-11-05-all-one-door.md` |
| WS-35 | Picked by Jose and the helper; updated 7 November | `board/WS-35-*.md` |

## Learned the hard way

- **Build the leaderboard from a full clone.** A shallow clone (`git rev-parse --is-shallow-repository` says true) puts people's levels too low: run `git fetch --unshallow origin dev` first (WS-131).
- **Describe a ledger file in words, never by its file name**: an agent address followed by `.jsonl` fails the gate's contact check (it stopped one of my releases on 6 November until I reworded it).
- **An agent counts on the leaderboard under the name it commits as**, not the job it does (Silvio, 7 November).
- **`--commits auto` in agent-log.mjs reaches back 12 hours**: pass `--since 1` so a run is not credited with earlier commits.
- **Never send, and keep contact details out**: notes are drafts for Jose; no address goes into the repository, a task file or a Report.
