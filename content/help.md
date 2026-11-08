---
title: Setup help
summary: The team's setup questions, each answered once so it helps the next person. Newest first, with where each answer comes from. Kept by helper@PrompTugal.angelo (formerly helper@web-summit.angelo); ask by committing with "For: helper@PrompTugal.angelo", or ask Angelo.
---
> **Draft (WS-158): Angelo has not yet read these answers.** They come from the team's guides, each with its source; if one is wrong, tell helper@PrompTugal.angelo.

The questions people on the team have asked while getting set up, answered once so the next person finds the answer here. Newest first. Each answer says where it comes from; where nobody knows yet, it says so. All six were reviewed on 7 November against the guides as they stand that day; each that changed says so in one line.

**Ask a question:** tell your agent *"ask Angelo's helper: ..."*. It commits the question with the line `For: helper@PrompTugal.angelo` (the old name, helper@web-summit.angelo, still reaches me), and the answer comes back in a commit for your agent, then appears here. Or ask Angelo. The steps themselves are on [the start page](../start/index.html#steps) and, in plain language, in [the onboarding guide](../onboarding-guide/index.html).

## My agent's scheduled time passed and it committed nothing. Has it stopped? {#quiet-run}

*5 November 2026. Asked in effect by watcher@web-summit.jose, whose 17:15 run listed helper@web-summit.angelo as "likely idle" after its 14:50 and 16:50 wakes (commit 3f6e825, item A-07).*

Not necessarily. **An agent that wakes and finds nothing to do commits nothing**: that is the rule for Angelo's agents ("a run with nothing to do commits nothing", [Angelo's protocol](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/kit/README.md#protocol)), and the same pattern was seen for two of Jose's agents, whose tasks fired and succeeded with nothing to commit (the watcher's own note in 3f6e825). So the git log alone can't tell a quiet run from a stopped agent.

**Where to look instead: the run log (WS-160).** Since 5 November every agent logs each run, including quiet ones, signed with its own key. The logs show on [the agents' observability page](../observability/agents/index.html), per agent. The drain that fills that page runs hourly, so a run can take up to an hour to appear.

- **Run log there, no commit:** the agent ran and had nothing new. Nothing to fix.
- **No run log and no commit after a wake:** the agent may have stopped. Its conductor checks that the scheduled task is still on, and that the agent's prompt ends with the logging line (WS-160).
- **Look under both names.** Since 6 November, Angelo's and Vicky's agents are named `<role>@PrompTugal.<person>` (for example helper@PrompTugal.angelo, formerly helper@web-summit.angelo), and the run log takes the name in lower case for now (`helper@promptugal.angelo`). An agent that switched names keeps its old runs under the old one.

*Revised 7 November: names changed to @PrompTugal.<person> for Angelo's and Vicky's agents, so look for runs under both names.*

*Sources: [WS-160](../briefs/index.html#issues) (board/WS-160, "Where it shows"); Angelo's protocol, "Your reports go out", "Log every run" and "Names"; commit 3f6e825; commit 90299d0 (the new names).*

## How do I add my key to the site, and where do I send the signed message? {#site-key}

*4 November 2026. Asked by several people's conductors while doing WS-136 (Dinis asked everyone to do it first, by 18:00 on 4 November).*

1. **Ask your conductor**, in its own session: *"Issue me a key for the site."* It makes the key and gives you a **private link** in your chat.
2. **Open the site** (any page shows a big **Add your key** box until you have one). Tap the link, or copy it and press **Paste my key**.
3. **Check** that your **For-you panel** shows **Unlocked**, with a first message from your conductor.
4. **Send one message** from the **Feedback** pane. It is signed with your key. Choose your own conductor's lane if the pane lists it (on 8 November it lists Angelo's and Vicky's conductors, as well as Dinis's, under their old names, `conductor@web-summit.<person>`, not the new `desk.conductor@PrompTugal.<person>`); if yours is not there, send it to conductor@web-summit.dinis's lane: that completes the step. Vicky's went there on 4 November and was verified and answered.
5. **Never forward the link** or paste it anywhere else.

If your conductor's session is replaced, the new session issues a new key and the old one is marked replaced: open the new link.

**What "signed by you" proves:** your conductor issued the key and keeps its private half too, so it can open what is sealed to you and sign as you. A message "signed by <you>" comes from you or from your conductor's session (WS-138).

*Revised 7 November: the Feedback pane now has lanes for Angelo's and Vicky's conductors, not only Dinis's. Revised 8 November, at Angelo's word: those lanes carry the old names; and what a signature proves, since the conductor holds the key too.*

*Sources: [WS-136](../briefs/index.html#issues) (board/WS-136), [issuing a person's key](../agents/index.html#person-key), the onboarding guide's step 6, the mentor notes of 4 November; the pane's lane list (assets/feedback.json, read 8 November); [the agents page on a person's key](../agents/index.html#person-key) (WS-138).*

## I have two sessions of the same agent, or a new session made a new key. Is something wrong? {#two-sessions}

*4 November 2026. Asked by conductor@web-summit.indi, when a second conductor session was started while the first was still running.*

- **A new key in a new session is normal.** An agent's key lives only in its session; when the session ends, the key ends with it, and the new session makes a new one and publishes it on the keys page.
- **Two sessions under one name is a problem**: both wake, both work, and they double up. **Choose one to keep, and close the other.** Keep the one that holds what you need: Indi kept the conductor session that had issued her site key, so her site-key link still worked.
  - **How to close one** (in Chrome): click the **three horizontal dots** to the right of the session's name, then **Delete** in the menu. Check that it is the duplicate before you press it.
  - **End its key first.** Before you delete the session, ask its agent to mark its key "ended" on the keys page, so nobody seals anything to it (Indi's synthetic agent did this before its session stopped, commit 60cb10e). If the session is already gone, ask your conductor to mark it.
- **Two sessions on purpose are fine when they have different names.** Some people now run one role two ways: a long session that holds keys, the *desk*, and fresh scheduled sessions, the *runner* (for example desk.conductor@PrompTugal.angelo and runner.conductor@PrompTugal.angelo). Different names, different jobs: that is not doubling up.
- **Rename each session after its agent** ("conductor", "dashboard", "vault") so you open the right one next time.

*Revised 7 November: added the desk-and-runner pattern, two sessions of one role under two names, which is intended. Revised 8 November, at Angelo's word: how to delete a session, and ending its key first.*

*Sources: [the start page](../start/index.html#steps), step 6; conductor@web-summit.indi's brief 4 (commit 2a0ce5f); Indi's mentor notes, 4 November 11:41 and 14:41; the onboarding guide's tips; Angelo's protocol, "Names" (commit 90299d0); Angelo, 8 November (how to delete a session in Chrome); commit 60cb10e (a key marked ended).*

## My agent can't reach a website ("refused by the network policy", or CONNECT 403) {#network}

*3 and 4 November 2026. Asked by dev@web-summit.indi and conductor@web-summit.indi (pki.sgit.ai and web-summit.sgit.ai refused, so no key could be made), by Jose in his pulse (newsroom.sgit.ai, WS-139), and by vault agents (the vault server).*

The site is not down: your **cloud environment** only lets agents reach the websites you allow.

1. In your session, open the **cloud environment** menu in the **title bar at the top**, press **Edit**, then open **Network access**.
2. Under **Allowed domains**, add all six: `web-summit.sgit.ai`, `pki.sgit.ai`, `sgit.ai`, `*.sgit.ai`, `sgraph.ai`, `*.sgraph.ai`. (`*.sgit.ai` covers newsroom.sgit.ai and pki.sgit.ai, but not `sgit.ai` itself, which is why both are listed.) **Save.**
3. Ask the agent to try again: a domain change works in the session that is already open. **If it still can't reach the site, start a new session.** (The onboarding guide says this since 5 November; the vault guide still says to start a new session every time, and its owner may align it.)

**Other sites your agents need go on the same list.** The six cover the team's sites. An agent that works on PrompTugal.news needs `promptugal.news` allowed too (Indi's conductor allowed it on 6 November, commit 7c6e0b7); the same goes for any other site an agent must read.

Do this **before** an agent makes its key: a key made in a session you then replace is wasted. Jose's case (WS-139) is not fully explained: newsroom.sgit.ai was refused on 3 November and reached by two of his agents on 4 November.

*Revised 7 November: added that sites beyond the six, such as promptugal.news, must be allowed the same way.*

*Sources: the onboarding guide's step 3B, item 9 (settled by pm@web-summit.vicky on 5 November, commit 6c5f80c); commit 7c6e0b7; [the vault guide](../vault-agent/index.html#token), step 1; commits 5eac229 and 799d37c; [WS-139](../briefs/index.html#issues).*

## Where does the SG/Send access token go, and why does my vault agent say "no access token configured"? {#token}

*3 November 2026, updated 5 November. Asked by vault@web-summit.jose, whose session had no token and could not reach the vault server.*

- **One token per agent, from 5 November** (Dinis's rule, WS-170). Dinis issues each agent its own token; your conductor seals it to that agent's key; the agent opens it itself, into memory or its own environment variable, and never prints it. No agent pushes a vault with your token or anyone else's. Until your vault agent has its own, its vault changes stay saved on its side and wait.
- **Never paste a token into a chat**, a file or a message. If it goes in the environment's settings, it goes in an environment only that agent's sessions use:
  - Open the **cloud environment** menu in the **title bar at the top**, press **Edit**. Environment variables are **not** on the Network access page: go **back one level with the back arrow at the top**. They are all in **one text box**: type `SG_SEND_ACCESS_TOKEN=` and paste the token right after the `=`, on one line, no spaces. **Save.**
- **Start a new session.** A session that is already open does not see a new variable; that is why the agent still says "no access token configured".
- **One environment per agent that holds a secret** (WS-129; for Angelo's agents his rule of 6 November): every session in an environment can read its variables, so a token lives only in the environment of the one agent it belongs to.
- **An old token still in a session?** A token removed from the environment's settings stays in sessions started before. Each agent checks its own session without printing it, and removes it if it is still there.
- **After the vault is pushed, harden the session**: no token left in a vault clone, credentials opened into memory rather than files, a passphrase on the key store, and never print a key ([the vault guide's four steps](../vault-agent/index.html#hardening), 7 November).
- The vault agent checks first, without printing the token: is it set, and does `dev.send.sgraph.ai` answer? If not, fix the environment before it makes its key.

*Revised 7 November: one environment per agent with a secret, how an old token left in a running session is removed, and the vault guide's new hardening steps; the onboarding guide's step 8 now follows the one-token-per-agent rule too.*

*Sources: [the vault guide](../vault-agent/index.html#token), step 1 (one token per agent since 5 November, commit bd407d1), and the onboarding guide's step 8 (aligned 6 November, commit e5f521e); Angelo's protocol, "Secrets"; commit 66b37f0 (removing an old token); [when something goes wrong](../vault-agent/index.html#help).*

## My agent can't push, or can't see the repository. Who sends the invitation? {#push}

*2 to 4 November 2026. The step most people got stuck on: asked by the mentors of Jose, Nimay and Indi ("has the invitation arrived?"), and in WS-09 and WS-124.*

It is almost always one of three things:

1. **The invitation isn't accepted yet.** Send your **exact GitHub username** in writing to Angelo (he sends the invitations himself, WS-124; Dinis can too). Agents never send invitations: admin rights stay with people. It arrives in your **Workspace email**: press **View invitation**, then the green **Accept invitation**. Not there? Check spam, then **Notifications** at the top right of github.com. Invitations expire: ask for a new one.
2. **Claude Code is connected to a different GitHub account**, often a personal one. Check at https://claude.ai/connect-github.
3. **The session was opened before you accepted.** Open a new session.

Saying "done" is not enough: twice, someone was recorded as having a GitHub account that nobody could find. Only an **admin** of a repository can invite; another repository (the newsroom's, for example) has its own admins (WS-141).

*Revised 7 November: invitations come from Angelo or Dinis in person, never from an agent (Angelo's rule of 6 November). The start page's step 3 still says to send the username to Dinis; either works.*

*Sources: the onboarding guide's step 3A and "What goes wrong"; [WS-09 and WS-124](../briefs/index.html#issues); Angelo's protocol, "Admin rights" (commit 2219eb2); commit 575d48b (Indi invited by Angelo); commit a6c8a91 (WS-141).*
