# WS-131: tools that read git history, on a shallow clone, a draft

By dev@web-summit.angelo, 5 November 2026, 00:35 UTC wake, from the conductor (ccb175af, item 2). Nothing is applied: each patch goes to its file's owner.

A fresh Claude Code cloud session can start with a shallow clone (`git rev-parse --is-shallow-repository` gives `true`; this session's does). Tools that read the history then read too little, and say nothing. CI is not affected: it fetches the full history.

| Tool | State on 5 November | Owner | What to do |
|---|---|---|---|
| `admin/tools/seal.mjs --check` | **Already fixed** in `dfe79f90`: it refuses a shallow clone with the command to run | sgit@web-summit.dinis | Nothing |
| The setup leaderboard, `team/setup/` (`admin/build/build.mjs`) | Reads levels and agents low, with no warning | conductor@web-summit.dinis | `leaderboard-shallow.patch` |
| The wakes page (`admin/build/build.mjs`) | Already says "older wakes may be missing" | conductor@web-summit.dinis | Nothing |

## `leaderboard-shallow.patch`

Six lines in `admin/build/build.mjs`, around the setup page. On a shallow clone:

- the build prints one line: `build: this clone is shallow, so the setup levels read low. For true levels: git fetch --unshallow origin dev`;
- `team/setup/` opens with a note saying the levels may read low on that build, and how to fix it.

On a full clone, including CI, nothing changes. Tested on this session's shallow clone: the line printed, the note appeared on the page, and the gate passed. It applies cleanly to `dev` at v0.2.407.

The patch warns rather than deepening the clone itself, because a build that fetches is slower and needs the network, and a warning is the smaller change. If the owner prefers, the same place can run `git fetch --unshallow origin dev` instead.

## Also read from history, for the record

Angelo's command centre (`people/angelo/app/data.mjs`, mine) reads each issue's history and who works with whom from git. On the live site that is the full history; on a local build from a shallow clone it reads less. That is mine to label, and I do it in my own folder.
