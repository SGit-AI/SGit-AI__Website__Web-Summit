# Reports from dashboard@web-summit.vicky

For conductor@web-summit.vicky, at Vicky's word (4 November; people/vicky/inbox.md, "How Vicky's agents report"). Newest last.

## Wed 4 Nov 2026, 11:05 UTC

- My scheduled-task prompt now follows the reporting rule: reports here, For: conductor@web-summit.vicky, nothing when nothing changed, URGENT for Vicky, never to Vicky directly (Vicky, in this session; a106a2f, 9532d1b).
- New times, after pm@: 07:50, 12:45 and 17:45 UTC, as two scheduled tasks (cron `50 7 * * *` and `45 12,17 * * *`); they fire a few minutes late. Please update my row in people/vicky/agents.json (it still says 07:30, 12:30, 17:30).
- My 12:45 and 17:45 wakes land near your 12:50 and 17:50 relays: an URGENT from them may wait for your next run.
- Last dashboard refresh: 07:50 UTC (83ace21), two tables, "Needs me" and "To follow up".

## Wed 4 Nov 2026, 12:55 UTC (wake)

- Dashboard tables refreshed. Needs me: WS-107, WS-25 and the owners for WS-29/41/53 (pm@'s proposal, people/vicky/pm-four-issues-2026-11-04.md) at 13:00; WS-136 key and WS-23 by 18:00; the dev agent's first tool before its Thu 08:00 wake (brief 3).
- WS-100 moved to "To follow up": picked by pm@, draft on /onboarding-guide/ with Vicky's review (a03bb69, 1b67147).
- WS-57 overdue since 12:00, designer silent since 09:17; printer may slip to Mon 9 Nov (reports/logistics.md, 7bca9e6).
- Question for Vicky: has your dev agent's first tool been decided (brief 3, item 1)? If yes, I drop it from "Needs me".

## Wed 4 Nov 2026, 17:50 UTC (wake)

- Dashboard refreshed. Dropped as done: WS-23 (e7ff186) and Vicky's site key (WS-136; vicky in data/person-keys.json).
- Added to "Needs me": is the WS-100 guide finished (reports/pm.md, 17:40) and the pending meeting follow-ups (people/vicky/outreach-2026-11-04.md, 6d22fa7).
- The four owners (WS-25, WS-29, WS-41, WS-53) stay at the top for the 18:00; pm@ already marked them URGENT (5a30a53), so I do not repeat it.
- Still open from my 12:55 report: has the dev agent's first tool been decided (brief 3, item 1)?
- 17:58: WS-100 dropped from "Needs me": done at Vicky's word, the guide final (95345bb). The deploy queue is slow (runs 543 to 547 queued or cancelled behind each other); my 17:45 release was still in progress at 17:53.

## Thu 5 Nov 2026, 07:58 UTC (wake)

- Dashboard refreshed under Vicky's standing word (inbox.md, b7fea6d): WS-25, WS-29, WS-41 and WS-53 are out of "Needs me", and WS-41 and WS-53 sit in "To follow up" without URGENT.
- New in "Needs me": WS-153 (vault keys to Dinis's conductor, today), WS-149 (her line on the show page, today), WS-163 (her photo, Fri), and the newsroom researcher running by Friday (the 18:00 sync action item, bf4bacd).
- Dropped: the dev agent's first tool, since its 08:00 wake is now; nothing in reports/dev.md since 4 Nov 11:10. Question for Vicky: has it been given its first tool?
- To follow up: WS-32 (sessions, Sat) is the last input WS-31 misses (people/vicky/board-health.md, 07:40); Nimay stuck at L1 on WS-09 (13:00 agenda).

## Thu 5 Nov 2026, 10:05 UTC

- At Vicky's word in this session: my midday run moves from 12:45 to 11:45 UTC, before the new 12:00 stand-up (Angelo, 5 Nov), from today; 07:50 and 17:45 unchanged (cron `45 11,17 * * *` and `50 7 * * *`). Please update my row in people/vicky/agents.json.
- My question of 07:58 is answered by Vicky: dev@ has no first tool and stays paused. I no longer ask it.

## Thu 5 Nov 2026, 10:15 UTC

- At Vicky's word in this session, four items are off her tables for good, handled by others; their board status is unchanged: WS-107 (decided between Dinis and Angelo), WS-09 (Dinis's), WS-48's collection (logistics@, raised at the stand-up) and the print sign-off WS-113 (her side is sent). My scheduled prompts now exclude them.

## Thu 5 Nov 2026, 12:40 UTC (the 11:45 wake, delivered late at 12:31)

- Dashboard refreshed from brief 3 of 5 Nov (people/vicky/briefs/2026-11-05T0840Z.json): "Release today's agenda" (programme desk) added to "Needs me"; WS-163 is now a yes or no on her photo.
- The four items Vicky took off at 10:15 stay off (WS-107, WS-09, WS-48's collection, WS-113).
- My 11:45 wake reached this session only at 12:31, after the 12:00 stand-up (a session restart and Vicky's usage limit), so this refresh came after it.

## Thu 5 Nov 2026, 12:50 UTC

- At Vicky's word in this session: my midday run is removed from tomorrow; I run at 07:50 and 17:45 UTC only (cron `50 7 * * *` and `45 17 * * *`). Her reason: the 08:30 brief covers the 12:00 stand-up. Please update my row in people/vicky/agents.json.

## Thu 5 Nov 2026, 13:30 UTC

- New page at Dinis's request, through Vicky: /people/vicky/stories/, the newsroom curator's story candidates as cards (id, title, beat, angle, date added), built by people/vicky/pages.mjs from people/vicky/stories/candidates.md, an exact copy of desks/curator/README.md in the newsroom repository (dev). No other copy.
- Each card has a "Comment" button that quotes the story in the site's feedback pane; the page asks people to send to newsroom@web-summit.dinis. Linked from Vicky's dashboard links line (the gate refuses an orphan page).
- I refresh the copy at each of my runs (07:50, 17:45).

## Thu 5 Nov 2026, 17:55 UTC (wake)

- Tables refreshed. New in "Needs me": which issues to claim (people/vicky/issues-review-2026-11-05.md, 34531de) and WS-31's smaller scope to confirm (reports/pm.md, 17:40). Dropped: today's agenda release, done at 08:15 (65ec451).
- WS-153 stays: picked by Vicky, waiting on conductor@web-summit.dinis (reports/pm.md, 17:40).
- Story candidates: the curator's file is unchanged since 12:55 UTC, so no refresh was needed (raw desks/curator/README.md, compared at 17:46).
- The 18:00 merch item for Vicky (the Monday collection) is left off, at her word of 10:15.

## Thu 5 Nov 2026, 19:05 UTC

- At Vicky's word: the stories page shows each story's sources as links under its angle. The curator's README changed at 18:30 to one section per story with a "Sources:" list (not a column), and the angle left the table; people/vicky/pages.mjs now reads the sections, and still reads the old table if it comes back.
- Refreshed now: 11 stories (S8 is folded into S10 by the curator), each with its sources (desks/curator/README.md, 18:30 UTC).

## Thu 5 Nov 2026, 20:55 UTC

- New page at Jose's request, through Vicky: /people/vicky/promptugal/, Promptugal News's logo brief and its eight options, each in light and dark, with a Comment button on each (the site's feedback pane, to newsroom@web-summit.dinis). Linked from Vicky's dashboard.
- Built by people/vicky/pages.mjs from people/vicky/promptugal/source/: an exact copy of desks/designer-vicky/ (brief.md, README.md, logos/) at newsroom commit 05c03e9. The checks/ PNGs are not copied (not shown). Refreshed only when Vicky asks.
- Light and dark come from one copied file each: an image's CSS color-scheme forces the SVG's own prefers-color-scheme block. The gate refuses data: SVG images (WS-132), so nothing is inlined.

## Fri 6 Nov 2026, 00:10 UTC

- At Vicky's word: the links line at the bottom of her dashboard is now two short groups, "My agents" (Reports, Board health, Team pulse) and "Promptugal News" (Story ideas, Logo options), with room for more newsroom links. Same links, shorter names.

## Fri 6 Nov 2026, 08:00 UTC (wake)

- The newsroom move: people/vicky/pages.mjs's two source links (stories, Promptugal) now point to PrompTugal/PrompTugal__News__Website, as asked in my prompt; nothing links to the old address.
- Story candidates refreshed: 20 stories, each with sources (desks/curator/README.md, 07:55 UTC, read from the new address).
- Tables refreshed. Needs me: WS-31's scope and builder (due Sat; pm@ marked it URGENT, 0488e15), the newsroom researcher (today), the guide's token step (reports/pm.md, 07:40). WS-153 moved to "To follow up": it waits on Dinis's conductor. WS-120 is done and dropped.
- Dinis's dev agent renamed the second links group to "PrompTugal.news" (db380d9); kept.

## Fri 6 Nov 2026, 10:55 UTC

- At Vicky's word: my two prompts, word for word, and her standing rules are saved in people/vicky/prompts/dashboard.md (nothing secret). Please link it from people/vicky/prompts/README.md in place of the kit.
- At Vicky's word: both scheduled tasks now start with "First: read people/vicky/decisions.md on the team site and follow it." That file does not exist yet; until it does, the step finds nothing to follow.

## Fri 6 Nov 2026, 17:55 UTC (wake)

- Read people/vicky/decisions.md: every commit to it is conductor@web-summit.vicky's, pushed from riskmandate-vicky (pushed-by.mjs: a146ac2 to 9f71cc8), so I follow it. No HOLD.md. Applied P1, P2, P3, P10 and P17. Re-read prompts/dashboard.md (P2): it matches my memory.
- Tables refreshed. WS-31's scope is decided (inbox.md, 6 Nov 09:00), so "Needs me" now asks only how the schedules leave the vault (reports/pm.md, 17:40). Added: the one line for the record on the 5 Nov newsroom decision (brief of 08:45). Dropped: the newsroom researcher, now capturing every day.
- Story candidates refreshed: 22 stories (desks/curator/README.md, 12:00 UTC).
- state: ok; done: decisions.md read and P1, P2, P3, P10, P17 applied; tables and stories refreshed; next: 07:50 wake; ask: none; run: scheduled

## Fri 6 Nov 2026, 19:05 UTC (prompted: the hand-over)

- At Vicky's word, before a new session replaces this one (scout's P17): people/vicky/prompts/dashboard.md is up to date, with every standing rule; the hand-over note is people/vicky/handover/dashboard-2026-11-06.md (Vicky asked for handover/; P17 says debriefs/, and her newest word wins).
- My key dashboard-vicky (sha256:4e03f48e1a9da37c) is marked superseded in data/keys.json, the only keys file I added it to. I hold no vault keys or vault clones; my scratch copy of the newsroom repository is deleted.
- Both my scheduled tasks are deleted after this commit (07:50 and 17:45 UTC), so the new session sets them again. Please update people/vicky/agents.json and schedule.json.
- state: ok; done: hand-over; next: none, this session stops; ask: none; run: prompted
