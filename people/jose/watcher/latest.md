# Watcher: latest run

**Run:** 2026-11-14 12:18 UTC (the 12:15 wake), by watcher@web-summit.jose. **Scope:** the whole team, read-only (decided by Jose on 5 November 2026, WS-134). The feed is `activity.json`; the actions are `actions.json`, both beside this file. **Addressed to:** Jose and conductor@web-summit.jose, which reads it at every wake.

**Range:** `dev` from `c8a239e` to `b8a8b01` (the 07:15 run was idle and committed nothing).

## What to look at

1. **A-28, third run: four of your scheduled tasks are still disabled.** They are your conductor (the one that reads these reports), helper, vault and the Fringe conductor. Only you can turn them back on: the conductor first, then helper and vault.
2. **An ask for you from Dinis: archive your Claude Code sessions.**
   - What it is: `admin/tools/session-archive/FOR-EVERYONE.md` asks every team member to archive their sessions into their own encrypted vaults.
   - What it needs: a new session with your `SG_SEND_ACCESS_TOKEN` and `sgit-ai` 0.27.0. You send Dinis your archive agent's key fingerprint.
   - What it costs: about 50,000 tokens per session.
   - Safeguards: the build redacts secrets, and the ship step refuses to push if its exact-secret or key-pattern check finds anything left.
   - Why it matters: Dinis says his own run found vault keys committed to public repositories, without naming them.
   - It's your choice.
3. **Medium: two stretches of `dev` are unreviewed by any security agent.**
   - The first runs from 11:51 on 7 November to 10:58 on 8 November.
   - The second is everything after `4a4f30d` (12:19 on 12 November), now 365 commits. It includes the new session-archive tools and four new entries on the keys page.
   - I checked the key entries: all four (`conductor-vicky-3`, `internal-vicky`, `maestro-dinis`, `reporter-vicky-promptugal`) hold public halves only.
   - Dinis's security agent hasn't run since the hand brake.
4. **A-29, second run: Silvio's agents haven't committed since 22:13 on 12 November** (about 38 hours).
5. **High, still open:** `content/family-riskmandate-agent.md` lines 6, 18 and 32 (from `f20d264`) still match the rule "an email address". **Medium, still open:** the public session branch `claude/optimistic-feynman-7pkot9` (`dc306d7`), `board/WS-26-*` line 16.
6. **Low:** a new agent of Dinis's is named `maestro@dinis` (`b3a1e88`), outside the `<agent>@web-summit.<person>` convention in CLAUDE.md.

## The morning

- **Vicky's team** rewrote its prompt files to point at one shared rules file and changed three roles (127 commits).
- **The gate went red** for releases after the stand-up schedule ended on 13 November. Indi's conductor fixed it (`d9cd109`), and it prints OK now.

## Who committed

181 commits: 47 CI releases (counted), 1 by the watcher itself, none without an agent name, and 133 by agents: Vicky 127, Dinis 3, Indi 2, Angelo 1. None by Silvio's or Jose's agents.

## Open actions

1. **A-28, third run:** four of your tasks are still disabled (above).
2. **A-29, second run:** Silvio's agents are quiet since the hold (above).
3. **A-06, thirty-second run: only dev is left.** Its task still runs the 3 November text at 09:30 and 15:30. For you: paste its pointer and set it to every two hours, 07:30 to 21:30.
4. **A-21, twenty-second run (with A-14, twenty-ninth):** Dinis's older agents and his security agent. `security.repos` has been quiet about 48 hours.
5. **A-23, twenty-first run: inbox@web-summit.silvio**, about 162 hours; part of A-29.

## The checks

- **Your agents on this site:** no commits in this range. Designer, automation, dev and dashboard are enabled and fired this morning.
- **Email rule:** 138 lines in 46 commits by my own scan (lines added by every commit in the range that match an address pattern, leaving out web-summit agent names, noreply headers and example domains). They are agent names and CI's version rows. None is a person's contact detail by shape.
- **The kit, ROLE and policy:** unchanged. No hold file is in place.
- **Other branches:** nothing new on `main`.
- **The Sonnet trial for the watcher has not started:** this run ran on Opus (its ledger line).

## Could not check

- Other people's accounts and scheduled tasks; work in other repositories.
- The agents' run logs in the public vault `aym98gsm`: no `sgit` client yet.
