# Nimay: your next setup step

Drafted by helper@web-summit.jose on 4 November 2026, 23:20 UTC, for Jose to send. A draft: nothing here has been sent.

**Where you are:** level 1, 3 of 9 steps, on [the setup leaderboard](https://web-summit.sgit.ai/team/setup/) (built from dev at v0.2.385). Workspace email and Claude are done. Your next step is **Can push**: being invited to the team's repository on GitHub and accepting it. Everything after it (your conductor, your dashboard, your keys) is ready in your kit and takes minutes once this is done.

## Why you are stuck here

Your GitHub account was recorded as made on 2 November, but nobody on the team has your GitHub **username** in writing, so nobody could invite you. The roster has no GitHub account for you (`data/team.json`), and on 3 November Angelo's note said `riskmandate-nimay` was still to be created (data/meetings/2026-11-03-1800, the item on Indi's invitation). This is the most common setup problem on the team: the guide calls it *"I made an account" but nobody had my username*.

## Your next step, in plain language (about ten minutes)

1. Go to **https://github.com**. If you already have an account made with your **RiskMandate Workspace email**, sign in and note the username (your **profile picture**, top right, shows it). If not, press **Sign up**, top right, use your Workspace email, and pick the username `riskmandate-nimay`.
2. **Send Angelo (or Dinis) your exact username, in writing**, in the team group. Only the username, never the password. Angelo sends the invitations now.
3. The invitation arrives **in your Workspace email**: press **View invitation**, then the green **Accept invitation**. (It is also under **Notifications**, the bell at the top right of github.com.)
4. Go to **https://claude.ai/code**, connect GitHub when it asks (or at https://claude.ai/connect-github) with that same account, and set up the cloud environment as in the [guide, step 3B](https://web-summit.sgit.ai/onboarding-guide/): network **Limited**, then add the six team domains under **Allowed domains**.
5. Open a **new** session on `SGit-AI/SGit-AI__Website__Web-Summit`, branch **dev**, and paste the first prompt from your kit: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/nimay/kit/README.md (section **conductor@web-summit.nimay**). Its first commit puts you at level 3.

## What usually goes wrong, and the fix

- **The invitation never arrived.** Check the Workspace inbox's spam folder, then GitHub's **Notifications**. Invitations expire: ask Angelo to send it again.
- **I signed up with my personal email.** No need to start again: GitHub, **Settings**, **Emails**, add your Workspace email and confirm it. Tell Angelo your username before he invites you: an invitation goes to a username, not an email.
- **The repository doesn't show in Claude Code.** You opened the session before accepting the invitation, or Claude Code is connected to a different GitHub account. Accept first, check https://claude.ai/connect-github, then open a new session.

(From the [plain-language guide](https://web-summit.sgit.ai/onboarding-guide/), step 3A, and WS-124.)
