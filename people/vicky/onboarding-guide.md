# Getting connected, in plain language (draft, WS-100)

**Draft for Vicky to check.** Written by conductor@web-summit.vicky on 4 November 2026 from Vicky's own setup on 2 and 3 November and the steps on the start page (/start/, the section "The steps"). Angelo adds the technical parts; places marked **[Angelo]** need him. Nothing here is final until Vicky and Angelo say so.

**Who this is for:** anyone on the team who is not a developer. You do not need to know what GitHub or a "commit" is. Your agents do the technical work; you do a few clicks and answer their questions.

**How long:** about an hour in total, spread over a day. You can stop after any step.

**If you get stuck:** stop, and ask in your Claude session: *"I'm on step N of the onboarding guide and I see X. What do I click?"* Your agent can see the same instructions. If it can't help, ask Angelo or Vicky in the team group.

---

## Step 1. Your Workspace email

**What it is:** a RiskMandate email account Dinis made for you. It is where invitations (GitHub, the stand-ups) and your agents' mail arrive.

**What to do:** log in to it with the details Dinis gave you. Keep it open in a browser tab; you will need it in step 3.

**You're done when:** you can see the inbox.

## Step 2. Claude

**What it is:** the Claude team account, where your agents run. Each agent lives in its own "session" (one conversation).

**What to do:** log in to Claude with the **same Workspace email** from step 1.

**You're done when:** you can start a new session.

## Step 3. GitHub (the step most people get stuck on)

**What it is:** GitHub is where the team's website lives. Your agents save their work there. You need your own GitHub account so that their work is recorded as yours. You will not use GitHub much yourself.

**What to do:**

1. Go to github.com and choose **Sign up**. Use your **Workspace email** from step 1, not a personal one.
2. Pick a username. A good pattern is `riskmandate-<yourname>` (that is what several of us used).
3. GitHub sends a code to your Workspace email to check it is yours. Open the email and type the code in.
4. Send Dinis your **username** (not your password). A message in the team group is fine.
5. Dinis invites you to the team's repository (`SGit-AI/SGit-AI__Website__Web-Summit`). The invitation arrives **in your Workspace email** and in GitHub's notifications (the bell, top right on github.com). Open it and choose **Accept invitation**.
6. **[Angelo]** How your agents use your account to save work (what Claude asks for the first time, and what to click), with a screenshot.

**You're done when:** you have accepted the invitation. Tell your conductor agent (step 4): *"I've accepted the GitHub invitation."*

**What goes wrong:**

- *The invitation never arrived.* Check the Workspace inbox's spam folder, then the bell on github.com. Invitations expire: if it has, ask Dinis to send it again.
- *I signed up with my personal email.* **[Angelo]** what to do (add the Workspace email to the account, or start again).
- **[Angelo]** anything else that went wrong for people on 2 and 3 November.

## Step 4. Your conductor agent

**What it is:** your main agent, `conductor@web-summit.<you>`. It runs your other agents and keeps your records. From here on, it does the technical work and walks you through the rest.

**What to do:** in Claude, open a **new session** and paste the prompt from your brief (/brief-<you>/, the section "A prompt to start with"). Then answer its questions.

**You're done when:** it tells you it has made its first commit. You are now at level 3.

## Step 5. Your dashboard agent

**What it is:** a second agent that keeps your dashboard, the page you read first each morning.

**What to do:** open **another new session** and paste the dashboard prompt your conductor gives you (it is also on /agents/).

## Step 6. Agent keys

**What it is:** each agent makes its own key, a digital signature, so the team knows its work really comes from it.

**What to do:** nothing by hand. Your agents do this themselves. Some agents first need the **network settings** in step 6a.

### Step 6a. The network settings (the other step people get stuck on)

**What it is:** your Claude sessions can only reach the websites you allow. Agents need a few of ours.

**What to do:**

1. In your Claude session, find the **cloud environment** menu in the session's title bar, and choose **Edit**.
2. Under network access, add these to the allowed domains: `web-summit.sgit.ai`, `pki.sgit.ai`, `sgit.ai`, `*.sgit.ai`, `sgraph.ai`, `*.sgraph.ai`.
3. Save. **Start a new session** for the change to take effect: a session that is already open does not pick it up.
4. **[Angelo]** a screenshot of the menu.

**You're done when:** your agent says it can reach those sites.

## Step 7. A schedule

**What it is:** your agents wake up on their own at set times (for example before each stand-up), so you don't have to start them.

**What to do:** say *"yes"* when your agent proposes times, or give it the times you want. It sets them up.

## Step 8. The vaults

**What it is:** encrypted storage for the team. Public vaults are for sharing; the private vault holds what must not be public (meetings, contacts).

**What to do:**

1. Dinis sends you an **access token**. Never paste it into a chat.
2. Put it in the same environment settings as step 6a (Edit), as a variable named `SG_SEND_ACCESS_TOKEN`, and start a new session.
3. Start your vault agent with the prompt your conductor gives you (it is on /vault-agent/).
4. When your vault agent shows you a **vault key** once, save it in your password manager. Never paste it anywhere else.

**You're done when:** your first vault is on the site. You are at level 6, fully set up.

---

## Words you'll see

- **Agent:** a Claude session with a job and a name, like `conductor@web-summit.vicky`.
- **Commit:** your agent saving a piece of work to the website's history.
- **Repository:** the folder on GitHub that holds the whole website.
- **Key:** a digital signature or lock. Public halves are shared; private halves never leave where they were made.
- **Read key:** a key that only lets someone read a vault. Safe to share.
- **Vault key / access token:** secrets. Never in a chat, an email or a file.

## Where you are

The setup leaderboard (/team/setup/) shows your level and your next step, worked out from what you and your agents have done.
