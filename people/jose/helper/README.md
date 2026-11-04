# Jose's setup helper: what went wrong, for whom, and the fix

Kept by helper@web-summit.jose (WS-35: everyone at L4, and what went wrong written down for the next person). Each run reads [the setup leaderboard](https://web-summit.sgit.ai/team/setup/) and each stuck person's `people/<id>/onboarding.json`, and writes `people/jose/helper/<id>.md`: that person's next step in plain language, for Jose to send. **The helper never sends.** Sources are this repository's own record (commits, board issues, the start page, [the plain-language guide](https://web-summit.sgit.ai/onboarding-guide/)).

## Where everyone is (4 November 2026, 23:20 UTC, built from dev at v0.2.385)

| Person | Level | Stuck on | Since | Note |
|---|---|---|---|---|
| Dinis, Indi, Vicky, Angelo, Jose | L6 | nothing | | all nine steps |
| Silvio | L3 | Dashboard agent | 2 Nov (L3 since his conductor joined) | [silvio.md](silvio.md) |
| Nimay | L1 | Can push (the repository invitation) | 2 Nov evening | [nimay.md](nimay.md) |
| Daniela | L0 | not started; not core | | waits on a decision: [daniela.md](daniela.md) |
| Sarah | L0 | not started; not core, "if they want" (WS-09) | | [sarah.md](sarah.md) |

## What went wrong, and how it was fixed

1. **The leaderboard read too low from a fresh cloud session.** A Claude Code cloud session can start with a shallow clone (52 commits here); the build then cannot see most agents' commits and showed Dinis, Angelo and Jose at L3 and Indi and Vicky at L2, when all five are at L6. **Fix:** `git fetch --unshallow origin dev` before `node admin/build/build.mjs`. Seen again by this helper on its first run; the issue is WS-131 (open). The live site is right: CI fetches the full history.
2. **"I made a GitHub account" but nobody had the username** (Nimay; the guide says two people were recorded with an account nobody could find). Nobody can invite an account they cannot name. **Fix:** send the exact username in writing to Angelo or Dinis. Still open for Nimay.
3. **Who sends the GitHub invitations** (WS-09, WS-124, the 3 November 13:00 decision item). **Fixed by practice, 3 November:** Angelo sends them from `the-neuronin`, admin on the repository (Indi's, 575d48b). The start page still says "send Dinis the username"; either works.
4. **Signed up with a personal email** (the guide, step 3A). **Fix:** add the Workspace email under GitHub Settings, Emails; no new account needed.
5. **An agent could not push or see the repository.** One of three: the invitation not accepted, Claude Code connected to another GitHub account (https://claude.ai/connect-github), or the session opened before the invitation was accepted (open a new one). The guide, step 3A, item 6, written by Angelo (17dafc4).
6. **An agent could not reach pki.sgit.ai** to make its key. **Fix:** the six team domains under the environment's Allowed domains (the guide, step 3B, item 9); works without a restart.
7. **The dashboard is kept, but the step is not counted** (Silvio). Procurement keeps his dashboard; the leaderboard counts only an agent named `dashboard@web-summit.<id>` (`admin/build/onboarding.mjs`). **Two ways**, from his mentor (b6011aa): start a dashboard agent from his kit, or Dinis agrees procurement counts and the step is recorded by hand. Open.
8. **An agent pushed to `main`** (2 November). **Fixed by rule:** `dev` only, absolute (CLAUDE.md).

## Runs

- **4 November 2026, 23:20 UTC:** first run. Notes for Silvio and Nimay; Daniela and Sarah noted as outside the core seven. Stand-up items for Silvio and Nimay (each stuck on the same step for more than a day) on the 5 November 13:00 agenda.
