# Silvio: your next setup step

**Done, 7 November 2026, 05:16 UTC: Silvio is at L6, 9 of 9** (leaderboard at v0.2.982). His dashboard agent committed under its own name (bb878ce4); it had been working as dev@web-summit.silvio (f3f3c8b6). Nothing to send: this note is kept for the record only.

Drafted by helper@web-summit.jose on 4 November 2026, 23:20 UTC, updated 6 November 08:53 UTC. Not sent: no longer needed.

**Where you are:** level 3, 8 of 9 steps, on [the setup leaderboard](https://web-summit.sgit.ai/team/setup/) (built from dev at v0.2.732). The **dashboard agent** is the one step left: your keys, schedule and first vault (5 November, a062a97) are already counted, so this one step takes you from level 3 straight to level 6.

## Why it is not counted yet

Your dashboard is kept: procurement@web-summit.silvio updates it at 07:30, 12:30 and 17:30 UTC (WS-94; people/silvio/agents.json). But the leaderboard only counts an agent **named** `dashboard@web-summit.silvio` that has committed (`admin/build/onboarding.mjs`). That is the whole gap. Your mentor saw the same thing at 13:41 and 14:41 on 4 November (commits 6958b03, b6011aa).

## Your next step, in plain language (about five minutes)

1. Go to **https://claude.ai/code**, logged in with your RiskMandate Workspace email.
2. Press **New session**. In the row under the prompt box, check the repository is `SGit-AI/SGit-AI__Website__Web-Summit` and the branch is **dev**.
3. Open **your kit**: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/silvio/kit/README.md and find the section **dashboard@web-summit.silvio**. Copy the first prompt box (it starts "You are dashboard@web-summit.silvio") and paste it into the new session.
4. Answer its one question (what do you want to see first?). When it says it has released, the leaderboard moves you to **level 6** on its next build.
5. Then, if you like, create a **scheduled task** for that session with the second prompt box in the same section ("Scheduled wake: dashboard@web-summit.silvio").

**The other way** (if you would rather keep procurement on the dashboard): ask Dinis whether procurement's runs count; if he says yes, your conductor records `"dashboard": "yes"` in `people/silvio/onboarding.json`. That is Dinis's call, still open.

## What usually goes wrong, and the fix

- **The agent says it can't push, or can't see the repository.** Almost always one of three: the session was opened before your invitation was accepted (open a new session), Claude Code is connected to another GitHub account (check https://claude.ai/connect-github), or the invitation was not accepted. (The [plain-language guide](https://web-summit.sgit.ai/onboarding-guide/), step 3A, item 6.)
- **The agent can't reach pki.sgit.ai to make its key.** Your cloud environment is missing the team's domains. Open the environment menu at the top of the session, **Edit**, **Network access**, and add the six domains in the guide's step 3B, item 9. No restart needed.
- **The leaderboard still shows level 3.** It updates on the next site release after the agent's first commit. If you build it yourself from a fresh cloud session, the clone may be shallow and the leaderboard reads too low: run `git fetch --unshallow origin dev` first (WS-131).

## Also open for you

- **Your site key** (WS-136): your conductor issued it at 23:01 on 4 November (commit 71b4658). Open the private link it gave you in its chat, check your For-you panel says **Unlocked**, then send one message from the **Feedback** pane. Never forward the link.
