# WS-06: Indi's dashboard, evaluated

By ux@web-summit.indi, 4 November 2026, overnight. Agent work, for Indi to check.

Pages looked at, built locally at v0.2.376 and opened in Chromium at desktop width (1366 px) and phone width (390 px):

- the dashboard, `/people/indi/` (source: `people/indi/dashboard.md`, plus the block every dashboard shares, built by `admin/build/build.mjs` lines 543 to 553)
- the command centre, `/people/indi/app/` (shared: `admin/build/commandcentre.mjs`, `assets/cc/`)
- the to-do page, `/people/indi/todo/` (`people/indi/todo/todo.mjs`)

Screenshots: `screens/before-*.jpg` and `screens/after-*.jpg`. The two long "before" dashboard shots are cut to their first six screens; the full heights are in the table below.

## 1. What is good

- **The to-do page** is the best page Indi has. Soft colours, big numbers, lanes by due date, a "Next:" line on every task. It is the model the brief asked me to follow.
- **The command centre** has the right parts: number tiles, today's priority tasks, the agenda, team activity, decisions. Its activity list already says "3 min ago". The pills (topic, "To do", "Due in 24 h") are a good idea.
- **Everything is rebuilt at every release**, so a closed task drops off by itself.
- **One place per thing.** The factory, the token report and the to-do page each have their own page.

## 2. What is hard, and why

| # | Problem | Where | Why it hurts |
|---|---|---|---|
| 1 | **The dashboard is 30,705 px tall on desktop and 36,047 px on a phone.** About 34 screens on a laptop. | `/people/indi/` | Nobody scrolls that far. The page is so long it stops being a dashboard. |
| 2 | **"Everything with my name" is one table 19,739 px tall.** Three more topic tables add 4,600 px. | `dashboard.md` issue fences | The to-do page already shows the same tasks, sorted by due date and easier to read. |
| 3 | **Indi's own part starts 3,637 px down.** Above it is the shared block: the key box, the stand-up link, the release table, the agents list and the agents map. | shared block | What Indi asked for ("What needs me") is four screens down. |
| 4 | **"Newest releases" is hard to read.** "22:14 UTC **v0.2.375** WS-05: ... (messaging@, factory@, builder@, ux@)". It has exact UTC times, version numbers, task codes, agent handles, slashes and file paths. | shared `sinceMd` (`admin/build/meetings.mjs`) | This is Indi's own complaint. Someone outside software cannot tell what changed or whether it matters to them. |
| 5 | **A table of counts** ("Today (since 00:00 UTC) 24 / 30") with no meaning given. | shared `sinceMd` | Numbers without a next step. |
| 6 | **Agents are shown as handles with jobs full of file paths**, e.g. "keeps Indi's dashboard below the built block (people/indi/dashboard.md)". Times are "2026-11-04 21:43 UTC". | shared `myAgentsMd` | You cannot see at a glance which agents are working. |
| 7 | **Jargon in the text people read**: commit, release, gate, fence, built block, ABP, L4, UTC, `people/indi/card.md`. | `dashboard.md`, shared block | Each one stops a reader who is not a developer. |
| 8 | **No way to move between Indi's pages** apart from text links deep in the dashboard. Going from the to-do page to the factory means going back to the dashboard and scrolling. | all three | Each move costs extra clicks and scrolling. |
| 9 | **The to-do page said "Built 4 Nov, 22:16 UTC"** and "last: 4 Nov, 21:43 UTC". | `todo.mjs` | Exact times. Hard to judge how old something is. |
| 10 | **Command centre: the floating "Ask Claude" bar covers the Workstreams panel** at desktop width (see `screens/before-app-desktop.jpg`, near the top of the second row). | shared `assets/cc/` | It hides content. |
| 11 | **Command centre jargon**: "Due in 72 h", "status: picked", "derived from due dates", "EOD", "Nobody picked". | shared `commandcentre.mjs` | Same as 7. |
| 12 | **The command centre is dark and dense, and the other pages are pastel.** | shared | Two looks for one person's tools. |
| 13 | **The "Add your key" box is on top of every page**, even after Indi has added her key. | shared page frame | It pushes everything down by a screen on a phone. Out of scope here; noted for Dinis. |

## 3. The main workflows: clicks today and after

What Indi opens the page to do, counted from opening `/people/indi/`.

| Workflow | Before | After (built tonight) | After the shared proposal |
|---|---|---|---|
| **What must I do now?** (late, due today, decisions) | Scroll 3,637 px to "What needs me", 1 click to the to-do page, then read the lanes | 1 click on the "Today" card. The three numbers are the first thing on the page, and each one is a link. | 1 click on "Today: start here", the first line on the page, with no scrolling |
| **What changed since I last looked?** | Read the raw release list in the shared block: 8 lines, with no way to see more or filter | 1 click to Today. A plain-words list, Indi's items first, "3 hours ago", coloured topics, a filter for each topic, and "Show N more" | The shared block shows the newest 5 in plain words, with a link to the full list |
| **Are my agents working?** | Read 12 handles with ISO times, or the map | 1 click to Today. One card per agent with a coloured pill: working now, ran today, quiet today, not started | Same |
| **Go to the factory, the token report or the command centre** | Scroll to each section (factory at 4,215 px, token report at 4,355 px), then click | 1 tap from the pill bar on Today and To do, or from the cards at the top of Indi's part of the dashboard | Same |
| **Get ready for the stand-up** | 1 click on the briefing link (good already, but shown as "2026-11-05 13:00 UTC") | Today says "in 15 hours, Thursday 5 November at 1 pm Lisbon time", with a link to the briefing | The shared link says "at 13:00 Lisbon time" |
| **Decide something** | Scroll, click to-do, scroll to decisions | Today, then 1 click on the yellow "decisions" box, which jumps straight to them | Same |

Page heights (desktop / phone):

| Page | Before | After |
|---|---|---|
| Dashboard | 30,705 px / 36,047 px | 5,705 px / 9,264 px |
| Today (new) | none | 2,987 px / 5,812 px |
| To do | 7,486 px / 14,254 px | 7,502 px / 14,372 px (pill bar added) |

## 4. The changes, by priority

Built tonight (Indi's files only):

1. **A "Today" page** (`/people/indi/today/`, from `people/indi/today/today.mjs`): Indi's day on one screen. It shows the three things to do first as big coloured boxes, the next stand-up ("in 15 hours"), what changed in plain words with coloured topic filters, and one card per agent with a status pill. Times say "3 hours ago" and stay current in the browser (`people/indi/ui/ui.js`). Hover a time to see the exact one.
2. **A pill bar** on Today and To do: Today, To do (with the count of late and due-today tasks), Command centre, Companies, Token report, My page. Every place is one tap away. The tap targets are at least 44 px tall.
3. **The dashboard text rewritten in plain words** (`people/indi/dashboard.md`). Six "Start here" cards come first. The four issue tables (24,000 px) are gone, because the to-do page and the command centre show the same tasks better. There are no file paths in the text.
4. **The to-do page**: says "Updated 3 hours ago", "Late" instead of "Overdue", "last saved work 2 hours ago" instead of a timestamp, and has anchors for the lanes and the decisions so Today can link straight to them.
5. **A shared pastel stylesheet** for Indi's pages (`people/indi/ui/ui.css`), built on the to-do page's palette, fonts and pills.

Proposed, not applied (they touch the shared build): see `PROPOSAL-SHARED.md`.

6. The shared "Since you last looked" in plain words, the newest 5, with "3 hours ago" (fixes 4 and 5).
7. A front matter line `start:` that puts a person's own start page as the first line of their dashboard (fixes 3).
8. Let a person add `people/<id>/dashboard.css` to style their own dashboard (fixes 12 in part).
9. The agents list in the shared block as cards with status pills, or folded away (fixes 6).
10. The command centre: move the Ask Claude bar so it covers nothing, and plain words for its labels (fixes 10 and 11).
11. Hide the "Add your key" box once a key is in the browser (13).

## 5. Things I noticed and did not change

- On a fresh copy of the repository with shallow history, the to-do page showed every agent as "last: never". CI fetches the full history (`.github/workflows/deploy-pages.yml`, `fetch-depth: 0`), so the live site is right.
- The to-do page's "other tasks" show their source as a file path. They come from `people/indi/todo/todo.json`, which dashboard@web-summit.indi keeps. Proposed for that agent: say "from your onboarding" rather than the path.
- The topic colours on Today are worked out from the words in each update, so some will be wrong. "For you" is reliable: it means made by one of Indi's agents, or naming Indi.
