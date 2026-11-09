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

## Fri 6 Nov 2026, 19:10 UTC (prompted: the new session takes over)

- New session of dashboard@web-summit.vicky, at Vicky's word. Read decisions.md (its last commits, 99fc7a3 and 750f326, are from riskmandate-vicky: pushed-by.mjs), prompts/dashboard.md and the hand-over note. No HOLD.md. Newsroom (PrompTugal/PrompTugal__News__Website) and the team site are cloned on dev.
- My key: record sha256:43dc954426dcc0f1, encryption sha256:f8b55e84eb929fca, linked to the operator's key sha256:db7f79fdd87e030a; public half only, as entry dashboard-vicky-2 in data/keys.json (the only keys file the old session used; it replaces dashboard-vicky, already marked superseded). Please update people/vicky/agents.json and schedule.json.
- Scheduled tasks set again, 07:50 UTC (trig_01FSSzDCWMqwD5jwd8xGF6JT) and 17:45 UTC (trig_012yhqHVsUHZ3iBiorQfbYyD), with the prompt from prompts/dashboard.md section 2, firing into this session; first runs 7 Nov. The old tasks were already gone.
- For Vicky (a key question): the prompt's last paragraph checks the old key's file (sha256_28c07de37ed3b94d), which this session does not hold, so every run would report URGENT for nothing. Recommendation: change that file name to sha256_f8b55e84eb929fca in both tasks; until you agree, I leave the prompt word for word and ignore that check.
- state: ok; done: hand-over, new key, two tasks, prompts line; next: 07:50 wake on 7 Nov; ask: change the key file named in the scheduled prompt (above); run: prompted

## Fri 6 Nov 2026, 19:30 UTC (prompted: Vicky's two changes)

- Vicky, in this session's chat: the key file named in the scheduled prompt is now sha256_f8b55e84eb929fca (answers my question of 19:10). Changed in both scheduled tasks (07:50 and 17:45 UTC) and in prompts/dashboard.md, section 2.
- Vicky, in chat: WS-31 is dropped (pm@ is closing it as not needed). Removed its row from "Needs me" (people/vicky/dashboard.md), and added it to the never-show list in both tasks and the prompts file; I do not touch its board status. For: pm@web-summit.vicky, so it knows the dashboard no longer shows it.
- state: ok; done: key file and WS-31 changes in tasks, prompts file and dashboard; next: 07:50 wake on 7 Nov; ask: none; run: prompted

## Fri 6 Nov 2026, 19:50 UTC (prompted: the stories page sources)

- Vicky's word in chat: the stories page showed no sources because the curator's README now writes them as [Publisher, "Title"](url), read D Month YYYY (decisions.md answer 9). people/vicky/pages.mjs `parseSources` reads that format (and still the old `<url>` one); each source is a link with its read date after it, also in the markdown twin.
- Candidates refreshed as an exact copy of desks/curator/README.md (20 stories). Built page: 20 cards, 58 source links, none "No source yet".
- For the curator, if it changes the format again: the pattern is in `parseSources` (people/vicky/pages.mjs).
- state: ok; done: parser fixed, page rebuilt; next: 07:50 wake on 7 Nov; ask: none; run: prompted

## Fri 6 Nov 2026, 20:15 UTC (prompted: collapsible story cards)

- Vicky's word in chat: the stories page was too long. Each story is now a native `<details>`/`<summary>` (no script for it), all collapsed by default: collapsed it shows the number, beat, title and the one-line angle; open it shows the date added, the sources and the Comment button. Change is in people/vicky/pages.mjs only (the Promptugal logo page is untouched).
- state: ok; done: stories page collapsible; next: 07:50 wake on 7 Nov; ask: none; run: prompted
- 20:35: after a phone-width check, the "Show more" / "Show less" label moved under each summary so titles use the full width (people/vicky/pages.mjs).

## Sat 7 Nov 2026, 07:55 UTC (wake)

- Read people/vicky/decisions.md (2d9bc363; its new commits 1b2d15ee and 2d9bc363 were pushed by riskmandate-vicky, pushed-by.mjs). No HOLD.md. Applied P22 (I never use Gmail) and P27 (no prompt text in reports or public files). Re-read prompts/dashboard.md (P2): it matches what I hold.
- Tables rebuilt from board-health.md (07:40), the 12:00 agenda and the board's front matter; WS-31 stays out at your word. New in "To follow up": WS-166 (keys on every device, due Sun 8, no owner); WS-177, WS-163 and WS-153 now marked overdue. Still open for you: the 5 Nov newsroom line (overdue) and the guide's token step (Dinis's 12:00 item on WS-170 asks the same).
- Story candidates refreshed: 20 stories, 58 sources, all shown as links (desks/curator/README.md, 07:46 UTC).
- state: ok; done: tables and stories refreshed, P22 and P27 applied; next: 17:45 wake; ask: none; run: scheduled

## Sat 7 Nov 2026, 17:55 UTC (wake)

- Read people/vicky/decisions.md (47541d70; ten new conductor commits since this morning, all with the Agent: line the reworded guard asks for, pushed by riskmandate-vicky). No HOLD.md; session key present. Re-read prompts/dashboard.md (P2): it matches. **Applied SA16**: P1 to P3 word for word in prompts/dashboard.md and in both of my scheduled tasks' prompts (I changed the tasks too).
- Tables rebuilt (board-health.md 07:40, the 18:00 agenda, the 7 Nov brief, board front matter). New in "Needs me": Dinis's and your yes or no on parking the late unowned issues (18:00 agenda). Brief items 1 and 2 (the guard, the shortlist push) are done, so not shown. "To follow up" is now in due order.
- Story candidates refreshed: 21 stories, 59 sources, all links (desks/curator/README.md, 11:50 UTC).
- state: ok; done: SA16 applied, tables and stories refreshed; next: 07:50 wake on 8 Nov; ask: none; run: scheduled

## Sun 8 Nov 2026, 07:55 UTC (wake)

- Read people/vicky/decisions.md (212e084d; seven new conductor commits since last night, each with the Agent: line, pushed by riskmandate-vicky). No HOLD.md; session key present. Re-read prompts/dashboard.md (P2): it matches. **Applied SA21**: the Live AI Office link is on the "My agents" line (dev put it there) and stays through every rebuild; I touched nothing of dev's office pages.
- Tables rebuilt (board-health.md 07:40, board front matter, the 18:00 agenda; no 12:00 agenda or new brief yet). The parking yes or no (team-collaboration's note 07:42: not taken in 24 hours) stays first in "Needs me", now overdue. WS-32 is now overdue; WS-168 and WS-166 are due today.
- Story candidates refreshed: 23 stories, 61 sources, all links (desks/curator/README.md).
- state: ok; done: SA21 applied, tables and stories refreshed; next: 17:45 wake; ask: none; run: scheduled

## Sun 8 Nov 2026, 12:30 UTC (prompted: a shorter dashboard)

- Vicky's word in chat: make her dashboard a decision page. Folded by default: earlier releases (the latest 3 stay visible), the agent details text, "From your mentor", and "Team follow-ups" (5). The agent network graph, "Needs me" and her own follow-ups (WS-153, WS-163) stay visible. Files: people/vicky/dashboard.md, people/vicky/prompts/dashboard.md (the layout rule), and my two scheduled tasks.
- For dev@web-summit.dinis (owner of admin/build/build.mjs): a small opt-in change there. `render()` knows a block `:::details Title` ... `:::`, and a person's dashboard is folded only if its front matter says `compact: true` (only Vicky's does). Checked old code against new, built back to back: no other page's HTML or markdown changed (only build timestamps in generated JSON).
- state: ok; done: dashboard folded, layout rule saved in prompts and both tasks; next: 17:45 wake; ask: none; run: prompted

## Sun 8 Nov 2026, 12:40 UTC (prompted: vault open, Office link)

- Vicky's word in chat: "My vault" stays open by default with its read-only buttons visible (it is a plain section, never in a fold; the rule is now in prompts/dashboard.md and both tasks). A prominent "Open the Live AI Office →" link now sits under the agent network graph in "My agents", to the existing office/index.html; the Office is not embedded, and the link on the "My agents" links line stays (standing answer 21).
- For dev@web-summit.dinis: one more line in the opt-in change to admin/build/build.mjs: a dashboard's front matter `office_link: <path>` (only when `compact: true`) adds that link by the graph. Only Vicky's dashboard sets it.
- state: ok; done: Office link added, vault confirmed open, rules saved in prompts and both tasks; next: 17:45 wake; ask: none; run: prompted

## Sun 8 Nov 2026, 13:00 UTC (prompted: the vault opens by itself for Vicky)

- Vicky's word in chat (option 1): in "My vault" the read-only vault app now opens by itself, only in a browser where the "Who are you?" pick (localStorage `ws.me`) is vicky, and only when the section scrolls into view (nothing loads at page start; not with Save-Data on). Everyone else keeps click-to-load. On a phone the frame is 60% of the screen high with a tap-to-use layer. Same published read key, same three buttons. Files: people/vicky/dashboard.md, admin/build/build.mjs, prompts/dashboard.md and both tasks.
- For dev@web-summit.dinis (owner of admin/build/build.mjs): the `vault-app` fence takes an optional word `auto` (only Vicky's dashboard uses it). Checked old code with the old page against new code with the new page, built back to back: nothing outside people/vicky changed, Jose's vault frame included.
- state: ok; done: auto-load for Vicky only, rule saved in prompts and both tasks; next: 17:45 wake; ask: none; run: prompted
- 13:20: the tap-to-use hint on the phone is now a small dark pill, so it stays readable over the vault (people/vicky only; admin/build/build.mjs, auto branch).

## Sun 8 Nov 2026, 17:55 UTC (wake)

- Read people/vicky/decisions.md (cd2ecbc0; seven new conductor commits since this afternoon, each with the Agent: line, pushed by riskmandate-vicky). No HOLD.md; session key present. Re-read prompts/dashboard.md (P2): it matches. Nothing new was addressed to the dashboard.
- **URGENT, for Vicky before the 18:00 stand-up:** Indi's conductor published /lead-to-article/ (WS-168) and asks "does this match your proposals?"; it is item "From a conversation with a lead to an article" on the 18:00 agenda (options: adopt as written, adopt with changes, not yet). pm@ reads it as a match (reports/pm.md, 17:40). It is the first row of "Needs me".
- Tables rebuilt (board front matter, the 18:00 agenda, pm's 17:40 check). WS-168 moved to Indi's conductor in "Team follow-ups". Stories refreshed: 24 stories, 62 sources, all links (desks/curator/README.md). Vault, Office link and folds unchanged.
- state: ok; done: tables and stories refreshed, URGENT lead-to-article decision surfaced; next: 07:50 wake on 9 Nov; ask: Vicky's yes, changes or not yet on /lead-to-article/ (I'd say adopt, as pm@ reads it); run: scheduled

## Mon 9 Nov 2026, 07:55 UTC (wake)

- Read people/vicky/decisions.md (4ccd3900; six new conductor commits since last night, each with the Agent: line, pushed by riskmandate-vicky). No HOLD.md; session key present. Re-read prompts/dashboard.md (P2): it matches. Nothing new was addressed to the dashboard.
- Tables rebuilt (board front matter, pm@'s 07:40 note, the 18:00 agenda of 8 Nov; no newer agenda or brief yet). Still open for Vicky, now overdue: her yes, changes or not yet on Indi's /lead-to-article/ (WS-168; no decision recorded at 07:40, reports/pm.md) and the parking yes or no. New in "Team follow-ups": WS-199 (three apps, three lines; due today, no owner); WS-166 and WS-168 now overdue, with the summit tomorrow.
- Story candidates refreshed: 28 stories, 66 sources, all links (desks/curator/README.md). Vault, Office link and folds unchanged.
- state: ok; done: tables and stories refreshed; next: 17:45 wake; ask: Vicky's answer on /lead-to-article/ (I'd say adopt, as pm@ reads it); run: scheduled
