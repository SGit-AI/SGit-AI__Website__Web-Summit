---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest, from the builder template, is kept by Jose's dashboard agent (dashboard@web-summit.jose) and answers what needs Jose, what happened, and what Jose and Jose's agents are doing.
---
**Updated Thu 5 Nov, 12:35 UTC by `dashboard@web-summit.jose`; next update 17:30 UTC.** Built for action, at your word (4 November): what needs you as a list to work down, your lanes, and your agents only when something is wrong. [Your command centre](app/index.html) is becoming your first view (below).

## Needs me {#needs}

Soonest first, one action per line; done ones drop off at the next update. From your conductor's [brief 9](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/briefs/2026-11-05T1225Z.pdf) (12:25), the stand-up's open items and the board.

| Do | What | Due | Takes | Who waits |
|---|---|---|---|---|
| **Do** | **Vote on the stickers** in the browser that holds your site key: [the vote](../../stickers/vote/index.html), rank your top 10 of 23, Submit, check your initial says "voted". If the "Add your key" box shows, first add the key your conductor sent at 02:08. The 12:28 drain counted two ballots (Silvio's and Angelo's), so yours is not in yet | **Before 14:30** | 5 min | conductor@web-summit.dinis, the team |
| **Do** | **Switch your helper to Sonnet** in the helper's own session (your answer 4; only you can change a session's model) | Before its 14:50 wake | 2 min | the accountant, Saturday |
| **Do** | **Paste your site key on every device you will use** (WS-136, WS-166): your key is issued, and the board has no line saying it is pasted | Before Monday | 2 min each | Dinis |
| **Say** | **Still open on the stand-up for you:** your 15 site and UI issues to Angelo's and Dinis's dev agents (your yes is recorded as your position; Angelo and Dinis decide with you), and your navy garments instead of orange (Dinis decides; orange stands until he says yes). The 12:00 stand-up was held and its record is due about 13:15, so both may be settled there | 18:00 if not settled at 12:00 | 1 min | Angelo, Dinis, Silvio |

**Due today:** test the observability workflow end to end with Angelo (WS-37) and compare [the second observability page](../../observability/index.html) with yours. **Also on your list, no deadline today:** import the WS-39 n8n workflow and fill in your credential and number ([how](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/dev/n8n-guide.md)); share your contacts for the "who do we know there" maps (WS-24); your daily interview with your conductor in Claude voice mode (WS-41); try your command centre as your first view (your answer 7); ask Indi about a named business card only if today's personal-cards item does not settle it.

**Goal (4 November stand-up):** the pipeline, Portugal mapped first, by Friday or Monday (WS-26, WS-27); 50 active agents across the team.

**Settled since you last looked:** the votes are drained by Dinis's conductor (12:28 at Angelo's word, again at 14:27 and after 14:30), so your own drain is no longer needed to count them; Dinis's note had also asked for it as a test of the in-browser drain, so it is optional; your eight answers are recorded by your conductor (23bc4fb): the observability vault keys stay held until WS-156 names a custodian (WS-154), your vault agent counts the WS-74 answers and n8n never holds the key, the helper on Sonnet in agents.json, your watcher writes its own ledger file only, and your designer runs the reviewer before every release; your watcher now reports to your conductor at every wake, at your word; the midday stand-up is at 12:00 from now on; your mentor handed over and retired (08:41, L6 and two days on schedule).

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

On schedule: conductor, dashboard, dev, watcher and automation; the reviewer runs on every push, and each run is logged from today (WS-160). Needing a look:

- **vault@ and helper@web-summit.jose look late by one slot** (vault's 11:40, helper's 08:50; last commits about 01:30), per your watcher's 12:15 run ([its latest](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/watcher/latest.md)); a run with nothing to commit looks the same, so it is a look, not an alarm.
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
