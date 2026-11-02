# The home page, redesigned (WS-103): the design

By designer@web-summit.dinis, 2 November 2026, on Dinis's go-ahead (23:10 UTC, in this agent's session). **Built** the same night by designer@web-summit.dinis, on Dinis's word to implement it (WS-104): `admin/build/home.mjs`, the `.hm-*` styles in `assets/site.css`, and the placeholders in `content/index.md`. Dinis kept the headline, and the figures as agreed: round for people, square for agents. The mock-up is `assets/design/home-phone.png` and `assets/design/home-desktop.png`, made by `team/designer/mockups/make-home-mock.mjs`, and shown on the design page (https://web-summit.sgit.ai/design/#home).

## The job of the page

For a person on the team, on a phone, in under ten seconds: **what needs me, what is happening now, who is doing it.** Everything else on the home page today (the site cards, how we work, the sources) moves below, or to the pages it already lives on.

## The blocks, top to bottom

Every number and every line is read from data on each build; none is typed. The names in `code` are where the data already is.

| # | Block | What it shows | Where the data is |
|---|---|---|---|
| 1 | **Hero band** | Dark band (the Ultimate Insider's hero: a serif headline on ink). The headline, one line under it (dates and the stand day), then three numbers: days to the summit (the countdown, counted in the browser as `assets/countdown.js` does), **people connected** (L2 and above, of the core seven), **agents running**. | `onboarding.mjs` (computed levels), `inventory()` (agents that have committed; the "9 agents" tile counts the roster's role entries and is wrong) |
| 2 | **Needs you** | Up to four cards, most urgent first. A card is one ask, the people it is for (a band in the first person's merch colour) and the issue or brief it comes from. Three kinds: (a) a setup step several people are stuck at, grouped ("Nimay, Jose, Indi: accept the GitHub invitation", WS-09); (b) the decision items of the next stand-up, by who decides; (c) open board issues due today for the core seven, overdue first. | (a) `OB.leaderboard` next step per person, grouped by step; (b) `data/meetings/<next>/*.json` (`for`, `title`); (c) `board/*.md` (`for`, `due`, `status`) |
| 3 | **Next stand-up** | One bar: the time, the day, how many items, "decisions first". Links to the meeting page. | `data/meetings/schedule.json` and the next meeting's folder |
| 4 | **Happening now** | The journalist's latest three lines, the time and the link to the full report, and the drawings of the agents who did the work (the agents named in those lines, else the agents with commits since the previous report). | The newest `content/reports/*.md` (its "What happened" list), `data/cast.json`, `cast.mjs agentFigure` |
| 5 | **Who is doing it** | The core seven drawn (`humanFigure`, round, in their merch colour), each with a level bar in their colour, `L<n> · <k> agents`, and a link to their page. Mood from their level: happy at L3 and above, worried below, so the stuck read at a glance. 4 across on a phone, 7 on a wide screen. Under it, links to the team map and the setup page. | `data/design.json` (colours), `onboarding.mjs` (level, agents running) |
| 6 | **The numbers** | Four tiles, not eleven: issues open (of the total), stand-up items waiting, design votes in (of 7), and one more that matters this week (as built: decisions waiting on the plan; printers replied has no data file yet). Each tile links to its page. The eleven move to `/everything/`. | `board/`, `data/meetings/`, `people/*/feedback/design.json`, procurement's data |
| 7 | **Then** | "What happened" (the journalist's section, as now), the site cards, how we work, the sources: as they are today. | `content/index.md` |

## Rules

- **Mobile first.** One column under 760 px; the needs and the now side by side above it. Tap targets at least 44 px. The menu collapses to "Menu" on a phone (the top bar's title and menu must not touch).
- **Colours:** the people's merch colours (`data/design.json`) for the people only; the site's accent for everything else. No colour carries meaning alone: every band has a name next to it.
- **Words:** "0 with an owner" and "0 pages" read as failure. A zero becomes its next step ("no owners yet: the first five at the 13:00 stand-up").
- **The markdown twin** (`index.md`) carries the same blocks as lists, so an agent reads what a person sees.
- **Nothing private:** names, levels and steps only, as on /team/setup/ today.

## Proposed build shape (the dev agent decides)

Fences in `content/index.md`, expanded in `expandIssues` like the others, so the page's order stays in markdown and the journalist keeps its section:

```
{{hero}}
```needs
```
```now
```
```people
```
{{numbers}}   (reduced to the four)
```

## Decided by Dinis

- The headline: "Seven of us. Our agents. One RiskMandate."
- Round figures for the people, square (a screen for a head) for the agents, so the two read apart.
