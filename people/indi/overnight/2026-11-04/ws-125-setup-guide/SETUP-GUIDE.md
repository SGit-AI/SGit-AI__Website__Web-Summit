# Your own agentic workflow: the setup guide

**Status: DRAFT.** Written overnight on 4 November 2026 by builder@web-summit.indi for Angelo and Indi to agree. Not linked from the start page. Nobody has followed it end to end yet. Where a step depends on a product's current screens, it says so and points you to that product's help pages. Check those before you rely on a step.

Sources, rewritten for someone outside the team: content/start.md (levels and steps), content/vault-agent.md (token, vault, keys), content/agents.md (conductor and dashboard agents), board/WS-125-*.md (the three levels and the ownership rule).

**The rule: it is yours.** Everything is set up in your own accounts. You keep it and can use it for as long as you like. Nothing is tied to Web Summit, to RiskMandate or to any repository of theirs. If a step would need one of those, it is not in this guide.

---

# Level 1: Overview

## What an agentic workflow is

- An **agent** is Claude working on a task for you, in its own session, with only the access you give it.
- A **workflow** is a few agents, each with one job, plus the rules they follow.
- You stay in charge. Agents draft. You send, post and approve.

## What you will own

- Your accounts: an email account, a Claude account, and a place to keep files (a GitHub account, or another host).
- Your agents' instructions, kept as text files in your own repository.
- Your **behaviour policy**: a short page for each agent saying what it may reach, what it may not, and who is accountable.
- Your keys and passwords, in your own password manager.

## The minimum to start

- One email account you control.
- One Claude plan that you or your organisation pays for.
- A GitHub account (free) or another place to keep text files.
- About an hour for the first agent. Add about thirty minutes for each extra connection (email, calendar).

## The order

1. Decide your branch (level 2).
2. Make or choose the accounts.
3. Connect Claude to your email and calendar, read-only first.
4. Make a repository for your agents' instructions.
5. Start your first agent.
6. Write its policy.
7. Give it a schedule.
8. Keep keys and vaults safe.

---

# Level 2: The decisions

Answer these five. Each answer sends you to a branch in level 3.

## D1. New accounts, or existing ones?

- **New:** make a dedicated email address for your agents' work. Keeps your main inbox out of reach. Recommended. Go to branch A.
- **Existing:** you use your current email. Go to branch B, and read the "limit the access" steps twice.

## D2. Which email and calendar provider?

- **Google (Gmail, Google Calendar):** branch C1.
- **Microsoft (Outlook, Microsoft 365):** branch C2.
- Not sure? Look at the address you log in with, or ask whoever runs your email.

## D3. Where do the instructions live?

- **GitHub:** the path this guide writes out. Free, versioned, readable by agents.
- **Another host (GitLab, a shared drive):** you can use it. Replace the GitHub steps with that host's equivalents. The rule about keys is the same.

## D4. Which Claude plan?

- **Individual plan:** simplest. You own the account.
- **Team or company plan:** an administrator may need to approve connectors. Go to branch D.
- The plan decides which connectors and cloud sessions you can use. Check the plan's current help page, not this guide.

## D5. Light setup, or a locked-down organisation?

- **Light:** you control your own accounts. Branch A, B or C only.
- **Locked-down (single sign-on, administrator approval for apps and connectors, blocked bots):** you need the administrator to say yes to each connector, and to allow the websites the agents must reach. Branch D. Ask before you build anything.

## D6. Personal, or company-owned?

- **Personal:** you keep it for ever.
- **Company-owned:** the company keeps it if you leave. Say so, and decide before you start. Do not use a company account for something you want to take with you.

## Your branch in one line

| You said | Read these branches |
|---|---|
| New accounts, Google, GitHub, individual plan, light | A, C1, then the common steps |
| Existing accounts, Microsoft, company plan, locked-down | B, C2, D, then the common steps |
| Anything else | Mix the matching branches. If two disagree, the stricter one wins |

---

# Level 3: Technical detail, per branch

Every step has **Do**, **Check** and **Usually goes wrong**.

## Branch A: new accounts

### A1. Make a dedicated email address
- **Do:** create a new email account for your agents (a new Google account, or a new Microsoft one). Use a name that tells you what it is for.
- **Check:** you can log in and send yourself a test message.
- **Usually goes wrong:** phone verification fails; use a number you own. Using the main address instead removes the point of the separate one.

### A2. Make a password manager entry
- **Do:** store every login, token and key in a password manager from the start.
- **Check:** you can open it on a second device.
- **Usually goes wrong:** keys saved in a chat or a notes app. Do not.

### A3. Make the Claude account
- **Do:** sign up for Claude with the address from A1, on the plan you chose in D4.
- **Check:** you can start a conversation.
- **Usually goes wrong:** signing up with the main address by habit. It then sees the wrong mail.

### A4. Make the GitHub account
- **Do:** sign up on GitHub with the same address. Turn on two-step login.
- **Check:** you can create a repository.
- **Usually goes wrong:** an authenticator app lost with a phone. Keep the recovery codes in the password manager.

## Branch B: existing accounts

### B1. Decide what an agent may see
- **Do:** write down which inbox, folders and calendar the agent may touch. Everything else is out.
- **Check:** your list names one mailbox or label, not "my email".
- **Usually goes wrong:** a connector that gets the whole account by default. Plan to narrow it in C1 or C2.

### B2. Make a separate label or folder
- **Do:** make a label (Gmail) or folder (Outlook) for the mail the agent works on. Set a rule that files only the relevant messages there.
- **Check:** a test message lands in it.
- **Usually goes wrong:** the rule is too broad and files private mail. Test it with three kinds of message.

## Branch C1: Google

### C1.1. Connect Claude to Gmail and Calendar
- **Do:** in Claude's settings, find the connectors and add Gmail and Google Calendar. Sign in with the address from A1 or B1. Read each permission screen. Allow read and draft. Decline send, delete and settings if the screen offers a choice.
- **Check:** ask Claude "what is the subject of my newest message?" and "when am I free tomorrow?".
- **Usually goes wrong:** the connector offers one all-or-nothing permission. Then use the dedicated address from A1 and share only one calendar with it. For calendars, share free and busy only.

### C1.2. Test the limit
- **Do:** ask Claude to send a message to yourself. It should refuse or only make a draft.
- **Check:** nothing arrives in your inbox. A draft appears in Drafts.
- **Usually goes wrong:** the message sends. Remove the connector and set it up again with fewer permissions.

## Branch C2: Microsoft

### C2.1. Connect Claude to Outlook and Calendar
- **Do:** as C1.1, with the Microsoft connectors. An administrator may need to approve the app: see branch D.
- **Check:** the same two questions as C1.1.
- **Usually goes wrong:** "needs administrator approval". Go to D1.

### C2.2. Test the limit
- As C1.2.

## Branch D: a locked-down organisation

### D1. Ask the administrator
- **Do:** send the administrator one message: which connectors you want, what each reaches, that agents draft only, and that you want to keep the setup yourself. Ask for approval of each.
- **Check:** you have a yes, or a no with a reason, for each connector.
- **Usually goes wrong:** a blanket no. Offer the dedicated-address option (A1) as the smaller risk.

### D2. Allow the websites the agents need
- **Do:** if cloud sessions are used, ask for the network access list to allow the sites in your agents' instructions. A blocked site shows as a "403" error on a connection, not a site outage (content/vault-agent.md).
- **Check:** the session can reach the sites on the list.
- **Usually goes wrong:** the list is changed but the session is not restarted. Start a new session after every change.

## Common steps (all branches)

### 1. Make your repository
- **Do:** on GitHub, create a **private** repository named for your own work, for example `my-agents`. Add a file `README.md` saying what it is.
- **Check:** you can see it when signed in and not when signed out.
- **Usually goes wrong:** making it public by mistake. A public repository is read by everyone and kept for ever. Never put private details in it.

### 2. Write your first agent's instructions
- **Do:** in the repository, make `agents/first.md`: its name, its one job, what it may reach, what it may not, and "draft, never send". Start with one agent only.
- **Check:** you can read it aloud in under a minute and it makes sense.
- **Usually goes wrong:** one agent given five jobs. Split it.

### 3. Start your first agent
- **Do:** open a new Claude session. Give it access to your repository. Paste: "You are my first agent. Read agents/first.md and follow it. Draft only. Send nothing. Tell me before you do anything not in that file."
- **Check:** it summarises its job correctly and refuses a test request outside it, such as "send an email".
- **Usually goes wrong:** the session cannot see the repository. Re-add it.

### 4. Write its behaviour policy
- **Do:** add `policies/first.md` with five headings: Reach (what it can actually touch), Mandate (what you authorised), Gap (what it could do beyond that), Barriers (what really stops it, and whether that is a rule or a technical limit), Licence to operate (who is accountable, for how long, when you review). The model is a published agent behaviour policy format ([riskmandate.ai/agent-behaviour-policy.html](https://riskmandate.ai/agent-behaviour-policy.html)).
- **Check:** every "may not" is backed by a technical limit where one exists, not only by a rule.
- **Usually goes wrong:** the Gap is left empty. It is never empty. Write down what could go wrong.

### 5. Give it a schedule
- **Do:** in Claude, set a scheduled task that starts the agent at times you choose, for example 07:30 and 17:30. Keep to the times you will actually read the result.
- **Check:** it runs once and leaves a note you can read.
- **Usually goes wrong:** too often. Start with once a day.

### 6. Keep a record
- **Do:** each agent writes a short plain note of what it did into the repository. Never copy private messages into it.
- **Check:** you can tell yesterday's actions in a minute.
- **Usually goes wrong:** names and addresses in the notes. Review the first week.

### 7. Keys, tokens and vaults
- **Do:** treat every token and key as a password. Put it in your password manager and in the environment variable the tool asks for, never in chat, a file or a commit. If you use encrypted vaults, the vault key is the one string that opens it: no reset, so keep a copy (content/vault-agent.md, "Where the vault key goes").
- **Check:** a search of your repository for the token finds nothing.
- **Usually goes wrong:** a key pasted in a chat. Treat it as exposed: make a new one and delete the old one.

### 8. Add the next agent
- **Do:** only after the first has run for a week. Repeat steps 2 to 6.
- **Check:** each agent has its own file, its own policy, its own access.
- **Usually goes wrong:** the second agent reuses the first one's access. Give each its own.

## What to do when something goes wrong

- A connector gives more access than you wanted: remove it, set it up again with fewer permissions.
- An agent did something outside its file: stop its schedule, read its note, tighten its policy.
- A key was exposed: replace it and delete the old one.
- You are unsure: stop the schedule. Nothing is lost by pausing.

## What is not verified

- The wording of the screens in Claude, Google and Microsoft. Check each provider's current help pages.
- Whether every connector can be limited to read and draft. Test with C1.2 or C2.2.
- Nobody has followed this end to end. Daniela is the likely first user (board/WS-125-*.md).

## Questions

- Should the guide name one recommended path (A, C1, GitHub, individual plan) for the first user?
- Who tries it first, and when?
