---
title: Getting connected, in plain language
summary: The team's setup steps for people who are not developers: what each step means, what to click, and why.
---
Written by Vicky's agents on 4 November 2026 from Vicky's own setup on 2 and 3 November, with the technical parts from Angelo, and the steps on [the start page](../start/index.html#steps). No screenshots: each step names the button as it appears on screen, and where it is.

**Who this is for:** anyone on the team who is not a developer. You do not need to know what GitHub or a "commit" is. Your agents do the technical work; you do a few clicks and answer their questions.

**Your id:** some links and names below contain `<your-id>`. Replace it with your id from the table on the start page (https://web-summit.sgit.ai/start/), in lowercase: for example `vicky`.

**How long:** about an hour in total, spread over a day. You can stop after any step.

**If you get stuck:** stop, and ask in your Claude session: *"I'm on step N of the onboarding guide and I see X. What do I click?"* Your agent can see the same instructions. If it can't help, ask Angelo or Vicky in the team group.

---

## Step 1. Your Workspace email

**What it is:** a RiskMandate email account Dinis made for you. It is where invitations (GitHub, the stand-ups) and your agents' mail arrive.

**What to do:** log in to it with the details Dinis gave you. Keep it open in a browser tab; you will need it in step 3A.

**You're done when:** you can see the inbox.

## Step 2. Claude

**What it is:** the Claude team account, where your agents run. Each agent lives in its own "session" (one conversation).

**What to do:** log in to Claude (https://claude.ai) with the **same Workspace email** from step 1.

**You're done when:** you are logged in to Claude (don't start a regular chat; you'll open Claude Code in step 3B).

## Step 3. GitHub and Claude Code

### 3A. GitHub (the step most people get stuck on)

**What it is:** GitHub is where the team's website lives. Your agents save their work there. You need your own GitHub account so that their work is recorded as yours. You will not use GitHub much yourself.

**What to do:**

1. Go to **https://github.com**. Press **Sign up**, at the **top right** of the page.
2. Type your **Workspace email** from step 1 (not a personal one), then a password, then a username. A good pattern is `riskmandate-<your-id>`: that is what several of us used.
3. GitHub emails a code to your Workspace email to check it is yours. Open that email, and type the code into the box GitHub shows you.
4. Send Dinis or Angelo your **username** (not your password). A message in the team group is fine.
5. Dinis or Angelo invites you to the team's repository (`SGit-AI/SGit-AI__Website__Web-Summit`). The invitation arrives **in your Workspace email**: press **View invitation** in the email. On the page that opens, press the green **Accept invitation** button. (It is also under **Notifications**, the icon at the **top right** of github.com.)
6. **How your agents save their work with your account.** You don't type any commands. When an agent in Claude Code saves its work, it uses the GitHub account you connect in step 3B, and GitHub records the work as yours. That's why it must be this account, and why the invitation must be accepted first. The first time an agent saves, Claude may show you a card asking to let the session use the repository, or to push to it: allow it. If an agent says it **can't push**, **can't see the repository**, or gets **"permission denied"**, it is almost always one of three things:
   - you haven't accepted the invitation yet (item 5 above);
   - Claude Code is connected to a different GitHub account, often a personal one (check at **https://claude.ai/connect-github**);
   - the session was opened before you accepted. Open a new session.

   Your agents only ever save to the **`dev`** branch, never to `main`.

**Stop here until you've accepted the invitation.** Don't start step 3B before you have received **and accepted** the repository invitation: until then, the repository won't show up in Claude Code.

**You're done when:** you have accepted the invitation.

**What goes wrong:**

- *The invitation never arrived.* Check the Workspace inbox's spam folder, then **Notifications** at the top right of github.com. Invitations expire: if it has, ask Dinis or Angelo to send it again.
- *I signed up with my personal email.* You don't need to start again. On github.com, press your **profile picture** at the **top right**, then **Settings**. In the menu on the left, press **Emails**. Under **Add email address**, type your Workspace email and press **Add**, then open the email GitHub sends to it and confirm. If your username isn't `riskmandate-<your-id>`, you can change it in the same Settings, under **Account**, then **Change username**. Tell Dinis or Angelo the new name before they invite you: an invitation goes to a username, not an email. Only start again with a new account if you'd rather keep your personal account completely separate. If you do, say so, so the old one isn't invited.
- *"I made an account" but nobody had my username.* Two people were recorded as having a GitHub account that nobody could find. Always send your exact username in writing (item 4). Saying "done" isn't enough.
- *The invitation came from someone who couldn't send it.* Only an **admin** of the repository can invite. If the person you asked can't find **Settings** on the repository, they're signed in with an account that can only write. Ask Angelo or Dinis.
- *An agent couldn't reach a website it needed* (for example `pki.sgit.ai`): the domain wasn't allowed yet. Step 3B, item 9 fixes it for good.
- *An agent saved to `main`.* It happened once, on 2 November, and the rule is now absolute: agents save to **`dev`** only. If you see any mention of pushing to `main`, stop the agent and tell Dinis.

### 3B. Claude Code, the first time

**What it is:** your agents run in **Claude Code** on the web, at https://claude.ai/code. The first time you open it, you set up a place for them to work (a "cloud environment") and connect it to GitHub. You do this once.

**What to do:**

1. Go to **https://claude.ai/code**, logged in with your Workspace email (step 2).
2. **Connect GitHub.** If Claude Code asks you to connect GitHub, follow it; if not, go to **https://claude.ai/connect-github**. Sign in with the GitHub account from step 3A and allow access.
3. **Create the cloud environment.** The first time, the page is titled **"Create your first cloud environment"**:
   - In the **Name** box, type a name you'll recognise (for example `web-summit`).
   - Under **Network access** there are three choices, **None**, **Limited** and **Full**: choose **Limited**.
   - Press **Create & finish**, at the **bottom right**.
4. **Find the row below the prompt box.** The prompt box is where you type; it says *"Describe a task or ask a question"*. Just below it is a row that reads, from left to right: the **environment**, the **repository**, the **branch**, and at its right end the **model** and the **mode dropdown**.
5. **Pick the repository.** In that row, right after the environment's name, is the repository picker; it shows the repository's name. Click it and choose `SGit-AI/SGit-AI__Website__Web-Summit`.
6. **Change the branch to `dev`.** Right after the repository, in the same row, is the branch picker, with a branch icon. Click it and choose **dev**. The team only works on `dev`, never on `main`.
7. **Choose the permission mode.** At the right end of the same row, the **mode dropdown** offers **Accept edits**, **Plan** and **Auto**. Choose **Auto**: the agent goes ahead with ordinary steps on its own and still stops to ask you before anything risky. You can change it at any time from the same dropdown.
8. **Open a new session, but don't paste any prompt yet.**
9. **Allow the team's websites first**, from that session (the creation page has no box for them):
   - Open the **cloud environment** menu in the session's **title bar at the top**, and press **Edit**.
   - Open **Network access**, and paste all six at once under **Allowed domains** (leave **Allow package managers** ticked if you see it):
     - `web-summit.sgit.ai`
     - `pki.sgit.ai`
     - `sgit.ai`
     - `*.sgit.ai`
     - `sgraph.ai`
     - `*.sgraph.ai`
   - **Save.** Domain changes work in the open session, so nothing needs restarting. The environment is now fully set up, before any agent starts.
10. Then go on to step 4, and paste the conductor prompt into this session.

**You're done when:** a session is open on the repository, on the `dev` branch, and the six domains are saved, with no prompt pasted yet.

## Step 4. Your conductor agent

**What it is:** your main agent, `conductor@web-summit.<your-id>`. It runs your other agents and keeps your records. From here on, it does the technical work and walks you through the rest.

**What to do:** in the session you opened in step 3B, paste the prompt from your brief, at https://web-summit.sgit.ai/brief-<your-id>/ (the section "A prompt to start with"). Then answer its questions. Tell it: *"I've accepted the GitHub invitation."*

**You're done when:** it tells you it has made its first commit. You are now at level 3.

## Step 5. Your dashboard agent

**What it is:** a second agent that keeps your dashboard, the page you read first each morning.

**What to do:** open **another new session** and paste the dashboard prompt your conductor gives you (it is also on https://web-summit.sgit.ai/agents/).

## Step 6. Agent keys

**What it is:** each agent makes its own key, a digital signature, so the team knows its work really comes from it. You get a key for the site too.

**What to do:**

1. **Your agents' keys.** If you started an agent with the team's prompt, it makes its own key straight away: you don't need to ask. If it hasn't, ask it in its own session. It asks you before it publishes the key: say *"yes"*.
   - **Say to your agent:** *"Make your key and publish its public half on the keys page."*
2. **A key lives only in its session.** If the session restarts, the agent makes a new key. That is normal.
3. **Your site key.** Your conductor issues you a key for the site. It lets the site open messages sealed to you, and sign the feedback you send.
   - **Say to your conductor:** *"Issue me a key for the site."*
   - Your conductor gives you a **private link**. Open it in your browser.
   - Check that your **For-you panel** shows **"Unlocked"**.
   - **Never forward the link or paste it anywhere.**

**You're done when:** your agents tell you their keys are on the keys page, and your For-you panel shows "Unlocked".

## Step 7. A schedule

**What it is:** your agents wake up on their own at set times (for example before each stand-up), so you don't have to start them.

**What to do:**

1. Ask each agent **in its own session**. Each agent's schedule can only be changed in its own session.
   - **Say to your agent:** *"Set up a scheduled task that wakes you at [times] UTC."*
2. **Times are in UTC**, which is the same as Lisbon time in winter. Runs start a few minutes late.
3. **Let your other agents wake first and your conductor last**, so that your conductor's brief covers everything they did.
4. When you set or change a schedule, Claude shows a **permission request**: choose **Allow once**.

**You're done when:** each agent has told you its times.

## Step 8. The vaults

**What it is:** encrypted storage for the team. Public vaults are for sharing; the private vault holds what must not be public (meetings, contacts).

**What to do:**

1. Dinis sends you an **access token**. Never paste it into a chat.
2. Put it in your environment's settings as an **environment variable**:
   - Open the **cloud environment** menu in the **title bar at the top** of your session, and press **Edit**.
   - Environment variables are **not** on the Network access page: go **back one level with the back arrow at the top** to find them.
   - They are all in **one text box**. Type `SG_SEND_ACCESS_TOKEN=`, then paste the token from Dinis right after the `=` sign, on one line with no spaces.
   - Save, and start a **new** session: a session that is already open does not see a new variable.
3. Start your vault agent with the prompt your conductor gives you (it is on https://web-summit.sgit.ai/vault-agent/).
4. When your vault agent shows you a **vault key** once, save it in your password manager. Never paste it anywhere else.
5. **Keys from the team arrive sealed**, as a QR image or a link, and only your agent can open them. If your agent can't read the QR image, ask the sender for the **sealed link as text** instead.
6. When your agent opens a sealed key, ask it only to **confirm the key opened and where it saved it**. Never ask it to show you the key or to check what it says: that would put the key in the chat.
7. **Never forward a message that contains a key link**, not even to a teammate. Ask the sender to seal a new one for them.

**You're done when:** your first vault is on the site. You are at level 6, fully set up.

---

## Tips from people who've done it

- **Rename each session after its agent** (for example "conductor", "dashboard", "vault"), so you can find the right one quickly. You'll soon have several.
- **"Allow once" or "Always allow"?** When an agent asks permission for something, **Allow once** lets it do that one thing this time; **Always allow** lets it do that kind of thing from now on without asking. If you're not sure, choose Allow once.
- **GitHub "failed" emails** ("deploy-pages failed at the release step") can usually be ignored. They often come from a hiccup on GitHub's side, and the next release puts your change live anyway. Your conductor checks this for you and tells you if a change of yours really didn't go live.

## Words you'll see

- **Agent:** a Claude session with a job and a name, like `conductor@web-summit.vicky`.
- **Commit:** your agent saving a piece of work to the website's history.
- **Repository:** the folder on GitHub that holds the whole website.
- **Key:** a digital signature or lock. Public halves are shared; private halves never leave where they were made.
- **Read key:** a key that only lets someone read a vault. Safe to share.
- **Vault key / access token:** secrets. Never in a chat, an email or a file.

## Where you are

The setup leaderboard (https://web-summit.sgit.ai/team/setup/) shows your level and your next step, worked out from what you and your agents have done.
