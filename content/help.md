---
title: Setup help
summary: The team's setup questions, each answered once so it helps the next person. Newest first, with where each answer comes from. Kept by helper@web-summit.angelo; ask by committing with "For: helper@web-summit.angelo", or ask Angelo.
---
The questions people on the team have asked while getting set up, answered once so the next person finds the answer here. Newest first. Each answer says where it comes from; where nobody knows yet, it says so.

**Ask a question:** tell your agent *"ask Angelo's helper: ..."*. It commits the question with the line `For: helper@web-summit.angelo`, and the answer comes back in a commit for your agent, then appears here. Or ask Angelo. The steps themselves are on [the start page](../start/index.html#steps) and, in plain language, in [the onboarding guide](../onboarding-guide/index.html).

## How do I add my key to the site, and where do I send the signed message? {#site-key}

*4 November 2026. Asked by several people's conductors while doing WS-136 (Dinis asked everyone to do it first, by 18:00 on 4 November).*

1. **Ask your conductor**, in its own session: *"Issue me a key for the site."* It makes the key and gives you a **private link** in your chat.
2. **Open the site** (any page shows a big **Add your key** box until you have one). Tap the link, or copy it and press **Paste my key**.
3. **Check** that your **For-you panel** shows **Unlocked**, with a first message from your conductor.
4. **Send one message** from the **Feedback** pane. It is signed with your key. If the pane offers no lane for your own conductor, send it to the lane it does offer (conductor@web-summit.dinis's): that completes the step. Vicky's went there on 4 November and was verified and answered.
5. **Never forward the link** or paste it anywhere else.

If your conductor's session is replaced, the new session issues a new key and the old one is marked replaced: open the new link.

*Sources: [WS-136](../briefs/index.html#issues) (board/WS-136), [issuing a person's key](../agents/index.html#person-key), the onboarding guide's step 6, the mentor notes of 4 November.*

## I have two sessions of the same agent, or a new session made a new key. Is something wrong? {#two-sessions}

*4 November 2026. Asked by conductor@web-summit.indi, when a second conductor session was started while the first was still running.*

- **A new key in a new session is normal.** An agent's key lives only in its session; when the session ends, the key ends with it, and the new session makes a new one and publishes it on the keys page.
- **Two sessions under one name is a problem**: both wake, both work, and they double up. **Choose one to keep, and close the other.** Keep the one that holds what you need: Indi kept the conductor session that had issued her site key, so her site-key link still worked.
- **Rename each session after its agent** ("conductor", "dashboard", "vault") so you open the right one next time.

*Sources: [the start page](../start/index.html#steps), step 6; conductor@web-summit.indi's brief 4 (commit 2a0ce5f); Indi's mentor notes, 4 November 11:41 and 14:41; the onboarding guide's tips.*

## My agent can't reach a website ("refused by the network policy", or CONNECT 403) {#network}

*3 and 4 November 2026. Asked by dev@web-summit.indi and conductor@web-summit.indi (pki.sgit.ai and web-summit.sgit.ai refused, so no key could be made), by Jose in his pulse (newsroom.sgit.ai, WS-139), and by vault agents (the vault server).*

The site is not down: your **cloud environment** only lets agents reach the websites you allow.

1. In your session, open the **cloud environment** menu in the **title bar at the top**, press **Edit**, then open **Network access**.
2. Under **Allowed domains**, add all six: `web-summit.sgit.ai`, `pki.sgit.ai`, `sgit.ai`, `*.sgit.ai`, `sgraph.ai`, `*.sgraph.ai`. (`*.sgit.ai` covers newsroom.sgit.ai and pki.sgit.ai, but not `sgit.ai` itself, which is why both are listed.) **Save.**
3. Ask the agent to try again. The onboarding guide says a domain change works in the session that is already open; the vault guide says to start a new session. If the open session still can't reach it, start a new one.

Do this **before** an agent makes its key: a key made in a session you then replace is wasted. Jose's case (WS-139) is not fully explained: newsroom.sgit.ai was refused on 3 November and reached by two of his agents on 4 November.

*Sources: the onboarding guide's step 3B, item 9; [the vault guide](../vault-agent/index.html#token), step 1; commits 5eac229 and 799d37c; [WS-139](../briefs/index.html#issues).*

## Where does the SG/Send access token go, and why does my vault agent say "no access token configured"? {#token}

*3 November 2026. Asked by vault@web-summit.jose, whose session had no token and could not reach the vault server.*

- **Never paste the token into a chat**, a file or a message. It goes in the environment's settings.
- Open the **cloud environment** menu in the **title bar at the top**, press **Edit**. Environment variables are **not** on the Network access page: go **back one level with the back arrow at the top**. They are all in **one text box**: type `SG_SEND_ACCESS_TOKEN=` and paste the token right after the `=`, on one line, no spaces. **Save.**
- **Start a new session.** A session that is already open does not see a new variable; that is why the agent still says "no access token configured".
- **Give the vault agent an environment of its own** (WS-129): every session in an environment can read its variables, so keep the token where only the vault agent runs.
- The vault agent checks first, without printing the token: is it set, and does `dev.send.sgraph.ai` answer? If not, fix the environment before it makes its key.

*Sources: the onboarding guide's step 8; [the vault guide](../vault-agent/index.html#token), step 1, and [when something goes wrong](../vault-agent/index.html#help).*

## My agent can't push, or can't see the repository. Who sends the invitation? {#push}

*2 to 4 November 2026. The step most people got stuck on: asked by the mentors of Jose, Nimay and Indi ("has the invitation arrived?"), and in WS-09 and WS-124.*

It is almost always one of three things:

1. **The invitation isn't accepted yet.** Send your **exact GitHub username** in writing to Angelo (he sends the invitations now, WS-124; Dinis can too). It arrives in your **Workspace email**: press **View invitation**, then the green **Accept invitation**. Not there? Check spam, then **Notifications** at the top right of github.com. Invitations expire: ask for a new one.
2. **Claude Code is connected to a different GitHub account**, often a personal one. Check at https://claude.ai/connect-github.
3. **The session was opened before you accepted.** Open a new session.

Saying "done" is not enough: twice, someone was recorded as having a GitHub account that nobody could find. Only an **admin** of a repository can invite; another repository (the newsroom's, for example) has its own admins (WS-141).

*Sources: the onboarding guide's step 3A and "What goes wrong"; [WS-09 and WS-124](../briefs/index.html#issues); commit 575d48b (Indi invited by Angelo); commit a6c8a91 (WS-141).*
