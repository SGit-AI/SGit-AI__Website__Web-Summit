---
title: Angelo's dashboard
summary: The page Angelo reads first, about action: what is blocked on Angelo, the decisions waiting, then links into his command centre, where the work is. Kept by dashboard@PrompTugal.angelo for Angelo's conductor.
---
**Work in [your command centre](app/index.html#kanban).** This page is the short version: what waits on you, then links. Kept by `dashboard@PrompTugal.angelo` under [the protocol](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/kit/README.md#protocol); your conductor's digest, when you ask for it in the desk session, carries the detail; its hourly runner flags anything urgent first. Stand-ups: 12:00 and 18:00 UTC from 5 November.

## 1. Blocked on you {#needs}

Your go is needed before these move:

- **Two specs to review with your desk:** [the live map](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/proposals/live-map/spec-live-map.md) (Replay inside Team and the machine, keys, sealed messages and lanes, a public version, a 3D option) and [the venues, Part B](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/proposals/WS-181/spec-venues.md) (the venue map on PrompTugal.news; Part A, the team's board, is approved). dev.map and dev.venues build only after.
- **The presence agent:** team-collaboration as the team's one presence agent, opening everyone's locations (tier 3).
- **Jose's conductor proposes** that your dev agent and Dinis's own 15 unpicked site and UI issues that name Jose; ask your desk for it.
- **Held for you by your conductor:** practising onboarding with a real person (WS-35, WS-124), and token and context optimisation (WS-148).
- **The visitors' inbox** for your meet page goes live only on your word, after security's review (WS-64, WS-119).

**Settled on 7 November:** WS-181, zones and buildings by default, an exact pin only when a person chooses it each time (your "C"); agents publish what you started, and its fixes; your agents change PrompTugal.news's dev directly. **Settled on 6 November:** your agents keep their keys under their new names; abp@'s update of their ABPs accepted; you approved your agents' ABPs as they stand (WS-34); your agent setup guide is with PrompTugal.news for review (WS-125); every agent of yours measures its tokens each run, into [your ledger](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/ledger) (WS-148); your digest carries a cost section. You joined PrompTugal.news as an editor (admin rights stay yours alone, never your agents'); [your card](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/card.md) is complete; the digest comes on demand. **Settled on 5 November:** your mentor handed over and retired (L6, two days on schedule); the lane to your conductor (made by your vault agent), the signature rule (your signed messages count for tier 1 and 2 only), WS-34, as you changed it on 6 November: your agents may change other people's files directly, with five steps against clashing, offline for your command centre, and no separate cockpit: the command centre is your one place ([the protocol](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/kit/README.md#protocol)).

## 2. My work {#work}

- **[Needs me now](app/index.html#kanban?n=1):** overdue, due today, and every issue with an open stand-up item for you.
- **[My tasks](app/index.html#kanban):** open, picked and in progress; done ones are hidden.
- **[The technical pool with Jose](app/index.html#kanban?m=0&w=pool):** who picked what.
- **[Summit days](app/index.html#summit)**, **[the collaboration board](app/index.html#collab)** and **[Replay](app/index.html#replay)** (every commit since 2 November as a timeline, filtered and played back, with who wrote to whom, each agent's runs from its own log, and a 60-second clip of any window).
- **[Dinis's notes for you](../../nights/2026-11-05/notes/index.html#angelo)** (5 November, morning).

## 3. Is the machine healthy? {#machine}

[CI failures](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions?query=is%3Afailure) · [the last releases](../../admin/versions.html) · [who is set up](../../team/setup/index.html) · [the keys page](../../keys/index.html). Main is not protected yet (WS-105).

## 4. My agents {#agents}

Nine agents, named `<role>@PrompTugal.angelo` from 6 November (the conductor as desk and runner). All but one work through your conductor; the policy agent audits them all, the conductor included, and reports to you directly. What each did is in "My agents, as the team sees them" at the top, and on [the collaboration board](app/index.html#collab).

- **conductor:** the hub, in two parts: a lean hourly runner (its last line says "URGENT for Angelo:" or "Nothing urgent."), and the desk, which writes your digest when you ask.
- **dev:** your command centre (Kanban, Team and the machine, Summit days, Replay, Where) and reviews of your guides; hourly. Writing the spec for four new agents for your review today.
- **team-collaboration:** stand-ups, debriefs, the daily note, the stand-up show; brief at 11:40 and 17:40, debrief at 13:15 and 19:15; and the whole team as one map, now also in [your command centre](app/index.html#collab).
- **vault:** your vaults and the lane to your conductor (WS-120); what the live map and venues may show, and sharness.kms, analysed; every four hours. It pushes no vault until it has its own SG/Send token.
- **crm:** your area in the team's private CRM, and the inbox agent built to its lane at your go; every three hours.
- **helper:** setup questions and the help page (WS-158); twice a day, 10:50 and 16:50 UTC.
- **writer** (new): your articles, guides and technical notes for PrompTugal.news, a session per piece that you start; its **runner** checks the newsroom every two hours and keeps the writer's state.
- **policy:** the auditor of your agents against their ABPs and your protocol; read-only, reports to you. Twice a day, 07:10 and 19:10 UTC; [the map](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/policy/map.md) and [the findings](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/policy/findings.md).
- **dashboard:** this page and your command centre; every three hours.
- **Coming (their spec approved by you, 7 November):** dev.map (Team and the machine, live), dev.venues (the venue map and our private locations, WS-181), dev.links (broken links on PrompTugal.news), research (public briefs before meetings), social-media (your LinkedIn, drafts only; you post) and vault.kms (the sharness.kms changeset). Each pushes to its own branch; dev or vault brings its work onto dev.
- **dev.app:** the Android apps from 9 November (WS-202): the shell first, then the event app, then the team app with the live map and the live wallpaper. The wallpaper's APK is with you to try on a phone ([its guide](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/angelo/app/android/README.md)). [The live graph on any screen](app/desktop/index.html) stays: the browser's pop-out, display mode, or a Home Screen app on the iPad. The desktop app is dropped; if its copy is still on your laptop, uninstall it.

Questions? [The help page](../../help/index.html), kept by helper@PrompTugal.angelo.
