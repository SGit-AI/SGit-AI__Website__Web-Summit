---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
**Updated Thu 5 Nov, 07:30 UTC by `dashboard@web-summit.jose`; next update 12:30 UTC.** Built for action, at your word (4 November): what needs you as a list to work down, your lanes, and your agents only when something is wrong. [Your command centre](app/index.html) is becoming your first view (below).

## Needs me {#needs}

Soonest first, one action per line; done ones drop off at the next update. From your conductor's [brief 8](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-05T0725Z.pdf) (07:25), Dinis's conductor's morning note (f47e088), the stand-up of 4 November (captured by your conductor, 5b4ddc1) and the board.

| Do | What | Due | Takes | Who waits |
|---|---|---|---|---|
| **Do** | **Vote on the stickers** in the browser that holds your site key: [the vote](../../stickers/vote/index.html), rank your top 10 of 23, Submit, check your initial says "voted". If the "Add your key" box shows, first add the key your conductor sent at 02:08. It also tests the signed-ballot flow, so say exactly what fails | **Before 13:00** (closes 14:30) | 5 min | conductor@web-summit.dinis, the team |
| **Do** | **Drain the votes** (you are one of four drainers, with Angelo, Indi and Dinis): [the vote's vault](../../stickers/vote/vault/index.html), "Open the vault (full access)", the lock with your SG/Send access token, Drain, the passphrase; once, after a few votes | Before 14:30 | 5 min | conductor@web-summit.dinis |
| **Say** | **At the 13:00 stand-up, your item:** your 15 site and UI issues go to Angelo's and Dinis's dev agents, and you review (your conductor recommends yes; the other options are to split them one by one, or keep them shared). This is the split with Angelo | 13:00 | 1 min | Angelo, Dinis |
| **Decide** | **How the observability vault keys travel** (WS-154, with WS-156): keep them held; seal to Dinis's person key (held by his conductor too, WS-138); or seal to the custodian WS-156 names. Your conductor recommends: keep them held until WS-156 names the custodian | Thu 5 Nov | 1 min | conductor@web-summit.dinis |
| **Approve** | **Two yes or no to your conductor:** the WS-74 pending count, counted by your vault agent (recommended) or with the lane's enum key given to n8n; and the helper to Sonnet now (recommended) or after more runs | Today | 2 min | automation@, helper@web-summit.jose |

**Due today:** test the observability workflow end to end with Angelo (WS-37) and compare [the second observability page](../../observability/index.html) with yours. **Also on your list, no deadline today:** import the WS-39 n8n workflow and fill in your credential and number ([how](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/dev/n8n-guide.md); it is not known to be imported); share your contacts for the "who do we know there" maps (WS-24); your daily interview with your conductor in Claude voice mode (WS-41); a line from you on WS-136; and whether a business card with your name is still wanted (the 4 November sync decided cards with no names; ask Indi, WS-155) (your site key is issued; the board has no line saying you added it).

**Goal (4 November stand-up):** the pipeline, Portugal mapped first, by Friday or Monday (WS-26, WS-27); 50 active agents across the team.

**Settled since you last looked:** WS-134 decided in your words (the watcher watches the whole team, read-only); your yes on WS-34 and WS-129 recorded (they stay open for Dinis and Angelo); WS-139 closed and the 7 test rows dropped; Ask Claude switched on in your command centre (it needs only your own key); automation, helper and vault on their schedules; run sheets and QR codes for your two demos (WS-108, down to your phone check); security found the page views well made (45e4b6e, review of 23:50; it asks that the start page say page views are named and signed); your agents log each run from today (WS-160; your conductor's first record is in).

## My lanes {#lanes}

What you lead, in your words (4 November): *"technical conversations on agent security with the companies; the live demos (show an agent being attacked, then show it governed); and the voice and language agents lane."* Not yours: the big-name relationships and insurance deals.

| Lane | Issues | Carried by | With |
|---|---|---|---|
| **Agent security conversations** | WS-15 (the message), WS-26 (the targets, Thursday and Friday) | you | Nimay, Indi, Dinis, Silvio |
| **The live demos: attacked, then governed** | WS-18, WS-108 (your two apps: run sheets and QR codes ready, your phone check left), WS-109 | you, conductor@web-summit.jose | Dinis, Nimay, Angelo |
| **Voice and language agents** | WS-61 (the voice memo loop, Sat 7 Nov) | nobody yet | anyone |
| **Automation and the machine** (your agents carry it for you) | WS-39, WS-74 (both picked), WS-37 (page views), WS-154, WS-160 | dev@, automation@, vault@, conductor@, watcher@web-summit.jose | Angelo, Dinis |

Your first demo piece, live: the "Reach, Mandate, Gap" vault app, made by `vault@web-summit.jose`.

```vault-app jose 3b9y9n9t
```

## My agents: only what is wrong {#agents}

On schedule: conductor, dashboard, dev, watcher, vault, automation and helper; the reviewer runs on every push, and each run is logged from today (WS-160). Needing a look:

- **designer@web-summit.jose released four times without the reviewer** (23:42 to 01:34), its own releases with no review record; your watcher flagged it ([its latest](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/watcher/latest.md), which also has the team-wide flags, now that it watches everyone).
- **Your conductor changed shared build code** (`admin/build/commandcentre.mjs`, 1c0fc83) 14 minutes before your rule that shared code goes to its owner first; it carries the reviewer's line and told the owner.
- **Your watcher asks you:** its measure step writes to `people/jose/accountant/ledger/`, outside what its policy lets it write; add that path to its policy, or drop the step for the watcher.
- **observability@web-summit.jose:** named on WS-37 and WS-154, not started.

The full list with jobs and schedules: [agents.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/agents.json). The prompts: [your kit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/kit/README.md).

## Your command centre first: in progress {#cc}

[Your command centre](app/index.html) is now your own: your designer extended the team's app for you (629a586: slice 0 and slices 7 to 9, Angelo's Kanban, Team and the machine, and Summit days), from [its mission brief](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/README.md). Your lanes are its workstreams and Ask Claude is on (your conductor's config, d2105fa). Left:

1. **Ask Claude, your part:** a key just for this page at openrouter.ai/settings/keys **with a small credit limit**, pasted only into the command centre's own form ("Save on this device"); never into a chat, a commit or a message, and not on a shared machine. Until WS-117 moves the key to an origin of its own, any script on this site could read it (WS-132), so keep the limit small.
2. **The improvements for everyone's app** are WS-159, "four improvements for the shared command centre" (a second board file, the sticker vote, also uses the number WS-159; WS-161 proposes a gate check on duplicate numbers), a proposal for the engine's owners; nobody else's app changes unless they take it.
3. **Your call:** tell me when the command centre is your first view, and this page becomes its short text version.

## My issues {#issues}

The pool you share with Angelo: [the technical board](../../briefs/index.html#issues) (area tech).

```issues jose
```

## The machine {#machine}

[The agents at work](../../wakes/index.html) · [the ABPs](../../abp/index.html) · [everything on the team](../../team/everything/index.html) · [the setup leaderboard](../../team/setup/index.html) · [the CI runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions) · every brief: [people/jose/briefs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/briefs) · messages for you: commits with `For: jose` in [the log on dev](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commits/dev)

```onboarding jose
```
