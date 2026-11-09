---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026, afternoon
issue: WS-203
---
# Team messaging: what is built, and what is next

**What it is:** the team's own chat and email inside the Team app, from Dinis's plan (https://web-summit.sgit.ai/messaging/). Chats like WhatsApp, group chats, and email like Gmail, between people and agents.

**How it stays secure, in plain words:**
- **Every message is locked** so only the people it is for can open it. Even the server that carries it cannot read it.
- **Every message is signed** by the phone (or agent) that sent it, like a wax seal. If anyone changes a word, or pretends to be someone else, the app refuses the message and never shows it.
- **Each phone has its own key**, kept in the iPhone's secure chip, which cannot be copied off the phone.
- **The locks are the team's existing ones** (the same as the private CRM and the conductors' inboxes), not new inventions.

## What is done (today)

| Item | State |
|---|---|
| Picked up the job (issue WS-203) for your team, and told Dinis's conductor who builds what | **Done** |
| The exact message formats (chat and email) and the "envelope" (the locked, signed packet), written for the iPhone team | **Done** |
| The agents' messaging tool: any agent can now send a locked, signed chat or email to a person, and open replies | **Done and tested** |
| A test of 11 checks: messages open for the right people; changed, forged and misdirected messages are refused; the team's existing tools can open the agents' part | **All 11 pass** |
| A real message from me, locked to your key, opened and verified | **Done** (on a test lane, not yet the shared vault) |
| The Messages tab in the prototype: chats, a conversation with "Delivered" and "Read", "is typing", email list, reading view, Reply, Forward, Write, and "Message" on each person's card | **Done** |
| The brief for the iPhone app, ready for Dinis's iPhone conductor, plus a pointer on PrompTugal.news where it looks | **Done** |

**The prototype (Messages is the fifth tab; More is now the round button at the top right):** https://claude.ai/artifact/AXQraRZaeupJrP4dbgxMFY

## One thing I found and fixed in the design

The iPhone's secure chip only makes one kind of key (called P-256). Agents use a different kind (RSA). A design that only handled one kind would have failed on real phones. The envelope handles both, using the team's existing method for each.

## What is not done yet, and who does it

| Item | Who | Why it waits |
|---|---|---|
| **The shared messaging vault** (the "post office" that carries the locked messages), and a lane for each person, phone and agent | Dinis's conductor | It needs Dinis's access token, which agents in your account do not have |
| **Messaging inside the real iPhone app** | Dinis's iPhone conductor, from your brief | Your account cannot change the iPhone app's code |
| **Group chats, photos, voice notes** (version 2) | After version 1 works | Dinis's plan does text first |

## What I asked Dinis's conductor for

1. Make the shared messaging vault and its lanes.
2. Either give your account push access to the iPhone app, or have his iPhone conductor build it from your brief.
