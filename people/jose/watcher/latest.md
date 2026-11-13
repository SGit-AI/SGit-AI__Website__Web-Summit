# Watcher: latest run

**Run:** 2026-11-13 22:17 UTC (the 22:15 wake), by watcher@web-summit.jose. **Scope:** the whole team, read-only (decided by Jose on 5 November 2026, WS-134). The feed is `activity.json`; the actions are `actions.json`, both beside this file. **Addressed to:** Jose and conductor@web-summit.jose, which reads it at every wake.

**Range:** `dev` from `3b655b5` to `c8a239e`. No hold file is in place.

## What to look at

1. **A-28, second run: four of your scheduled tasks are still disabled.** They are your conductor (the one that reads these reports), helper, vault and the Fringe conductor, all switched off during the hold. Only you can turn them back on: the conductor first, then helper and vault.
2. **New, A-29: Silvio's agents haven't committed since 22:13 on 12 November** (about 24 hours). Vicky's, Angelo's and Indi's agents have all committed since the hold lifted. Silvio's tasks were probably switched off during the hold like yours; for Silvio to turn them back on, or say they stay off.
3. **Medium: two stretches of `dev` are unreviewed by any security agent.** One runs from 11:51 on 7 November to 10:58 on 8 November. The other is everything after `4a4f30d` (12:19 on 12 November), 184 commits so far. Dinis's security agent hasn't run since the hand brake.
4. **High, open for the thirty-second run:** `content/family-riskmandate-agent.md` lines 6, 18 and 32 (from `f20d264`) still match the rule "an email address".
5. **Medium, still open:** the public session branch `claude/optimistic-feynman-7pkot9` (`dc306d7`), `board/WS-26-*` line 16.
6. **Note: a token-rule hit that is public by design.** Indi's conductor published the follow-up page's write-only append token (`cf1aa15`, `assets/crm-follow-ups.json` line 6) so that the page can save. The drain (`admin/tools/crm_followups.mjs`) files only saves that are sealed to the record's audience and signed by a member's key, and only logs anything else. So a stranger holding the token can fill nothing but the log. The drain's own credentials stay off the repository. It's the same pattern as your vault lane's token, and no security agent has reviewed it yet.

## Who committed

69 commits: 25 CI releases (counted), 1 by the watcher itself, none without an agent name, and 43 by agents: Vicky 31, Angelo 6, Indi 5, Jose 1. None by Silvio's or Dinis's agents.

## Open actions

1. **A-28, second run:** four of your tasks are still disabled (above).
2. **A-29, new:** Silvio's agents are quiet since the hold (above).
3. **A-06, thirty-first run: only dev is left.** Its task still runs the 3 November text at 09:30 and 15:30. For you: paste its pointer and set it to every two hours, 07:30 to 21:30.
4. **A-21, twenty-first run (with A-14, twenty-eighth): Dinis's older agents and his security agent.** His conductor committed at 15:53 and not since, and `security.repos` has been quiet since 12:19 on 12 November.
5. **A-23, twentieth run: inbox@web-summit.silvio**, about 148 hours; now part of A-29.

## The checks

- **Your agents on this site:** 1 commit (the dashboard at 17:33), whose trailers git reads. Designer, automation, dev and dashboard are enabled and fired.
- **Email rule:** 48 lines in 29 commits by my own scan (lines added by every commit in the range that match an address pattern, leaving out web-summit agent names, noreply headers and example domains). They are agent names and CI's version rows. None is a person's contact detail by shape.
- **The kit, ROLE and policy:** unchanged.
- **Other branches:** nothing new on `main`.
- **The Sonnet trial for the watcher has not started:** this run ran on Opus (its ledger line).

## Could not check

- Other people's accounts and scheduled tasks; work in other repositories.
- The agents' run logs in the public vault `aym98gsm`: no `sgit` client yet.
