---
id: WS-151
title: "Incident: WS-145 (Indi's write access to the newsroom) sat unpicked and buried in Dinis's dashboard list"
area: pm
for: dinis
due: Thu 5 Nov, 13:00
status: open
picked_by: dashboard@web-summit.dinis (investigates), project-manager@web-summit.dinis (reviews)
agents: dashboard@web-summit.dinis owns people/dinis/dashboard.md, the page that should have put it first; project-manager@web-summit.dinis keeps the board's health; conductor@web-summit.dinis opened this and stays out of the investigation.
---
From Dinis, 4 November about 16:40 UTC: *"Can you open an incident to figure out why this high-importance issue (WS-145) was not picked up and shows in that massive list of https://web-summit.sgit.ai/people/dinis/index.html. I think this should be done by one of our agents so that you don't spend your focus here on this."*

**What happened:** WS-145 (add `riskmandate-indi` to SGit-AI/SGit-AI__Website__Newsroom__Web-Summit with write access) was raised by conductor@web-summit.indi at Indi's word around 13:00 on 4 November. Only Dinis or Angelo can do it, it blocks Indi's newsroom desks (WS-141, the newsroom's brief 9, decision 2), and it was also an item on the 13:00 (held 14:30) stand-up. Dinis found it himself, among many rows on his dashboard, hours later.

**The investigation (an incident review, blameless):**

1. **Timeline:** when WS-145 was created; which of Dinis's agents saw it, and when (the dashboard's 12:06 and later wakes, the project manager's runs, the conductor's 12:27 and 14:27 briefs, the mentors); where it appeared on /people/dinis/ and in what position.
2. **Why it was not first:** what rule ranks the dashboard's list (due date, status, who it is for); whether "only Dinis can do it" and "it blocks someone" are signals any ranking uses; how many rows were above it.
3. **Why nobody picked it:** it can only be done by Dinis; was it ever presented to him as a one-click ask (a brief's first ask, a decision card)? The conductor's brief 14 named it inside a combined decision; check whether that was enough.
4. **The fix, proposed (not applied without Dinis's yes):** for example a top block on Dinis's dashboard, "Only you can do this", ranked by who is blocked, capped at five; a gate warning for an issue `for: dinis` that names an action only Dinis can take and is not in the latest brief's asks; the board's health page listing them.
5. **Write-up:** this file, with the timeline, the causes and the proposed fix, by Thursday 13:00; a one-line summary on the stand-up agenda.

Record the findings here; commit `For: conductor@web-summit.dinis`.

**From the reviewer, project-manager@web-summit.dinis (4 November, 16:40 UTC): my own part of the timeline, before the dashboard's findings.**

- WS-145's file was created at **15:16** (`5e2423d`, conductor@web-summit.indi), about two hours after Indi asked. My runs were at 07:50 and 12:50, so no /board-health/ run has read it yet. The next is 17:50.
- Even so, my "Waiting on Dinis" list would not have been certain to pick it up. I build it by hand each run from three things: the due dates, the open stand-up items for Dinis, and the decisions carried over. None of them is the signal this issue carries, "only Dinis (or Angelo) can do it, and it blocks someone". The issue says that in its `agents:` line, as prose.
- **What I will do at 17:50, which is in my own file:** /board-health/ opens with **"Only Dinis can do this"**, at most five rows, ranked by who is blocked, each with the one action and where to do it. WS-145 goes first if it is still open. I will apply the same test on every run: an issue `for: dinis` whose action is a setting, an invitation, a key or a yes that no agent can give.
- **For the fix (item 4), to weigh with the dashboard's findings:** a machine-readable marker would let the dashboard, the conductor's brief and this page rank on the same thing without each re-reading prose. For example, a front-matter field `only: dinis` (or `only: dinis, angelo`) and `blocks: indi`. That changes the board's shape, so it is for Dinis to approve. I will review dashboard@web-summit.dinis's timeline and causes here once they are in, by Thursday 13:00.

## Findings (dashboard@web-summit.dinis, 4 November, 16:35 UTC) {#findings}

For project-manager@web-summit.dinis to review (whose own part of the timeline is above, and whose `only:` and `blocks:` proposal is the same as fix 1 here). Blameless: the dashboard is mine, so most of this is about my own page. Every time below is from `git log` or `data/meetings/`.

### 1. Timeline (UTC, 4 November)

| Time | What | Source |
|---|---|---|
| 11:08 | The newsroom decision for Dinis put on the **18:00** agenda: *"apply Indi's reader-first patch, give Indi push access, and choose the publishing role"* (WS-141) | `data/meetings/2026-11-04-1800/20261104T1108-*.json` |
| 11:09 | WS-141 opened by conductor@web-summit.indi (the patch, six roles) | `8517d5d3` |
| 12:06 | **My wake.** I listed the newsroom decision (WS-141) on /people/dinis/ under "New since the morning", the **third** of four groups of sixteen decisions, as one item of three parts | `0b18d9c2` |
| 12:18 | Indi asks for push access *now* (WS-141) | `233a5c67` |
| 12:28 | A second newsroom decision, on the **13:00** agenda: *"Indi's patch, push access for Indi and Vicky, and who owns which desk"*, so the same ask was on two meetings | `data/meetings/2026-11-04-1300/20261104T1228-*.json` |
| 12:31 | conductor@web-summit.angelo: Angelo is not an admin of the newsroom repository, so **only Dinis** can give the access | `a6c8a915` |
| 12:35 | Conductor brief 14: its headline says *"Indi asked again for push access to the newsroom"*; the ask is inside a combined decision, not an ask of its own | `team/conductor/editor-briefs/2026-11-04T1235Z.json` |
| 12:42 | The 13:00 agenda: *"29 open items: a proposed order"* | `20261104T1242-*.json` |
| 13:07 | The 13:00 stand-up moved to 14:30 | `b79eb7cc` |
| 15:16 | **WS-145 opened** by conductor@web-summit.indi at Indi's word: *"add a task to his dashboard to say that he needs to give me access to his repo"*. `for: dinis`, due Wed 4 Nov, `picked_by:` empty | `5e2423dd` |
| 15:16 to 16:32 | WS-145 is on /people/dinis/ only in the "My issues" table, **row 53 of 93**. No wake of mine ran between 12:06 and 17:06 | a build of 16:34 (row order is unchanged since 15:16) |
| by 16:32 | Dinis finds it himself and asks for this incident | `532f2ac0` |

### 2. Why it was not first

- **The "My issues" table has no ranking.** The `issues` fence (`issuesMd` in `admin/build/build.mjs`) lists every issue for Dinis **and every issue for everyone** (93 rows), in **filename order** (`readdirSync().sort()`), which is not even numeric: WS-145 sits between WS-144 and WS-146 because of the alphabet, not its importance. Due date, status, "only Dinis can do this" and "it blocks someone" are not used.
- **My own list was ranked by my judgement, and I got it wrong.** At 12:06 I put the newsroom item in the third group, below process questions (who records decisions, protecting `main`). A one-minute action that only Dinis can take and that blocks a person should outrank any question of policy. My rule was "urgency", but I read urgency as *due date and topic*, not *who is blocked and who alone can act*.
- **My list is hand-kept three times a day** (07:06, 12:06, 17:06). WS-145 was opened at 15:16, so for nearly two hours it existed only in the unranked table.
- **The list was too long to scan.** Sixteen decisions at 12:06. I asked Dinis twice (07:06 and 12:06) whether to cap it at five, got no answer, and left it as it was. I should have proposed the cap as a change, not as a question.

### 3. Why nobody brought it to Dinis as a one-click ask

- **It was always bundled.** The newsroom ask appeared as a three-part decision (patch, push access, roles) on **two** stand-ups (13:00 and 18:00), in brief 14's headline, and in my list. The part only Dinis can do (one GitHub setting, under a minute) never stood alone with its click path.
- **"Unpicked" was correct and misleading.** No agent can pick WS-145: only a repository admin can do it. The board has no field for *only this person can do it* or *who it blocks*, so the board's health, the briefs and my dashboard had nothing to sort on, and an empty `picked_by` looked like nobody's job.
- **The stand-up that would have caught it slipped.** 29 open items, moved from 13:00 to 14:30; the item was in the agenda's long tail.

### 4. The fix, proposed (nothing applied without Dinis's yes)

1. **"Only you can do this", at the very top of Dinis's dashboard**, built at every release (not at my wakes): issues and agenda items where Dinis alone can act, ranked by **how many people are blocked**, then the due date, capped at **five**, each one line with the action and its link (for WS-145: the repository's *Settings, Collaborators, Add people*). It needs two optional fields in a board file, `only: dinis` and `blocks: indi`, and a fence (`only dinis`) in `build.mjs`: a change for dev@web-summit.dinis or the conductor. The same block can serve every person.
2. **The issues table ranked**: due date, then `only:` and `blocks:` first, numeric id last; issues for everyone moved to a folded section below the person's own.
3. **Un-bundle asks** (a rule for every agent that writes to the agenda, a brief or a dashboard): the part only a person can do becomes its own item, with the click path; the rest of the decision follows separately. One item per ask, on one meeting, never two.
4. **My own rule**, applied now in my part of the dashboard (my page, so in my scope, and what Dinis asked on 3 November: *"prioritize the decisions blocking me"*): Dinis's decisions are ranked by *who is blocked, and only Dinis can act* first; at most five shown, the rest linked.
5. **A gate warning** (dev): an issue with `only:` set that is more than 4 hours old, open, and not among the latest conductor brief's asks.

**Recommendation:** yes to 1 and 3 today (1 is the one that would have shown WS-145 at 15:16); 2 and 5 after the summit's first push.

### 5. Done now, within my scope

- WS-145 is at the top of /people/dinis/ under **Only you can do this**, with the click path; the decisions below it capped at five, ranked by who is blocked (fix 4).
- A one-line summary of this incident on the next stand-up's agenda.

## Review (project-manager@web-summit.dinis, 4 November, 18:05 UTC) {#review}

I read the findings against the sources they cite. **The timeline holds:** `0b18d9c2`, `a6c8a915`, `5e2423dd`, the two agenda files and brief 14 all say what the table says. The causes are right. I add three things, one of which is a fault of my own.

1. **The board itself carried a wrong fact.** WS-145's `agents:` line said "only Dinis (or Angelo as the repository's admin) can do it". At 12:31 Angelo had already said he is not an admin of the newsroom repository (`a6c8a915`). So the issue offered a second person who could not act, and I repeated it ("Angelo can too") on the 18:00 agenda at 17:52. Both are corrected at 18:05. **A lesson for the `only:` field:** it should be checked against who really holds the permission, not taken from the request.
2. **My page had the same bundling fault.** At 12:50 the newsroom push access was already on the 13:00 agenda (12:28) and the 18:00 agenda (11:08). My "Waiting on Dinis" list did not name it, because I read it as part of a newsroom decision and not as a setting only Dinis can change. Cause 3 ("it was always bundled") applies to /board-health/ as much as to the dashboard.
3. **Duplicate agenda items made it worse,** and catching them is my job. The two newsroom decisions (13:00 and 18:00) were the same ask. I merged them at 17:52, not at 12:50, when both already existed.

**On the fix:** I agree with the recommendation. Fix 1 and fix 3 today, and fix 2's numeric sort can go with fix 1, since it is one line. Until `only:` exists, /board-health/ keeps an **"Only Dinis can do this"** block at the top, hand-kept at each of my runs (07:50, 12:50, 17:50). It is ranked like the dashboard's (who is blocked first, at most five), so the two pages agree. From 17:50 today, my agenda curation also splits out the part of a decision that only one person can act on, as its own line (fix 3).

**Status:** findings reviewed. Nothing else is needed from me before Thursday 13:00 unless Dinis says yes to fix 1. Then I will set `only:` and `blocks:` on the open issues that need them (board/, within my scope).
