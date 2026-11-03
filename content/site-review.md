---
title: Site review: width, navigation, usability, and the cast
summary: A review of web-summit.sgit.ai on 2 November 2026 at Dinis's request: what was wrong with the width, the navigation and the usability, what dev@web-summit.dinis fixed in the same release, and what is next for the conductor, the designer and the dev agent.
lead: Dinis asked for the page width to be used, navigation people can find their way around, and the agents' characters from the book, with a way to draw the humans. This is what was found, what changed, and what is next.
---

Reviewed by dev@web-summit.dinis on 2 November 2026, at 1440 and 390 pixels wide, from Dinis's brief: "make the width use the page", "improve the navigation and the usability", "actually use the characters", "little icons for every participant", "reuse the book's agent cards", "how do we represent the human?". The work is on the board as WS-91 (the site) and WS-92 (the cast); WS-68, WS-69 and WS-77 are the issues they serve.

## What was wrong {#found}

- **The width was wasted.** Inner pages were a 46rem column in the middle of a 72rem header: at 1440 pixels, about half the screen was empty on both sides, while long tables and prompts were squeezed into the middle.
- **Tables broke words letter by letter.** The page allows any word to break (`overflow-wrap: anywhere`), and table cells inherited it: on every dashboard, "Issue" and "Status" were set one or two letters per line.
- **The agents' prompts were cut off.** Each prompt sat on one line inside a box that scrolled sideways, so a person could read only its first words and had to select by hand to copy it.
- **Markdown ate the asterisks.** In a cron line such as `27 */2 * * *` the stars were read as italics: the agents page showed "27 /2", and paths like `people/*/pulse/` came out as broken markup on the briefs, the ABPs and the board (ten pages).
- **Navigation was one row of links.** Each section's pages were a second row under the top bar, and a long page had no list of its own headings: you scrolled to find anything.
- **The team was text only.** The people and the agents were cards of words; the book's cast of characters was not used anywhere.

## What changed in this release {#changed}

- **The frame uses the page.** Up to 82rem wide, with a **rail on the left** on screens wider than 64rem: the section's pages, then "On this page" (every heading of the page you are on). Tables, prompts, cards and figures take the full width; paragraphs keep a readable 50rem line. On a phone, the rail folds away and the section row stays.
- **Tables** break between words, never inside one; headers and issue ids stay on one line.
- **Prompts wrap**, and every block of code has a **Copy** button.
- **The renderer** sets code apart before it reads emphasis, and follows markdown's rule that a star next to a space is not emphasis. Ten pages now render as written; nothing else changed (checked against the previous build, page by page).
- **The cast is on the site**: [the cast](../cast/index.html), figures on [the team](../team/index.html), on each member's page, and an icon in each person's bar. Drawn from `data/cast.json` by `admin/build/cast.mjs`, ported from the book's `lab/characters/make_cast.py`, inline in the page (no image files to build or commit).

## The cast: agents and people {#cast}

- **Agents are the book's robots.** The same construction as The Ultimate Insider: a screen for a head, one colour, one thing on the head and one in the hand, four moods on the face. Six come from the book's own looks (the conductor, dev, the designer, the researcher, the writer as the storyteller, sgit as ruv-sgit); nine are new in the same style (the journalist's fedora and notepad, pulse's heart and clipboard, security's helmet and shield, the ABP agent in RiskMandate's colour with a signed policy, and others).
- **Every agent wears a lanyard in its person's colour.** `dev@web-summit.dinis` carries Dinis's colour, so whose agent it is reads at a glance: the naming rule, drawn. When Angelo takes the dev agent, its lanyard turns green.
- **People are not robots.** Four ways to draw a human are on [the cast](../cast/index.html#people), all keeping the book's rule (no likeness guessed, no face, hair or skin invented), each in the person's merch colour: **round** (the book's own rule for its one human: a face where agents have a screen), **keyholder** (the round head holding the key every agent's key links to), **ring** (not a person at all: a ring in their colour with their agents' heads around it), and **screen** (one of the team, nobody's agent). The recommendation: round for figures, ring for small icons and the shirt sleeve. **Dinis decides** (WS-92): one word in `data/cast.json`, and every page follows.
- **Moods could come from the record.** The pulse agent's reading of a person's day, a red gate, a hold: the face could carry it, as the book does. A mood is a reading, never a claim.

## What is next {#next}

1. **Dinis:** pick how people are drawn (round, keyholder, ring or screen), or ask for another option (WS-92).
2. **designer@web-summit.dinis**, after the merch: refine the nine new agent looks and the people's style; the infographics of how the team works, using the cast (WS-69). The figures are data: change `data/cast.json`, not a drawing.
3. **conductor@web-summit.dinis:** route WS-91 and WS-92; put the cast on the home page (the seven and their agents, as a picture), and on each person's meet page once the style is chosen; keep each person's agents in `data/cast.json` as they join (their rings fill in).
4. **dev@web-summit.dinis:** the phone menu as a collapsible section list without JavaScript (WS-77); grouped menus for the long Work section; a "who is on stage now" bar from the session log, as the book's cast bar; the agents' moods from the record.

## Charts anyone can use {#charts}

Added on 3 November (WS-123, item 3). A page asks for a chart in its markdown with a fence, and the build draws it as SVG from the repository's own data, no script in the page; the look is the `.ch` block in `assets/site.css`, on the site's tokens, for the designer to set.

- `chart burndown`: the board, burning down to 12 November, from the history of `board/` (when each issue appeared, and when its status became done), with the pace it needs.
- Today's runs, every agent's scheduled slots met, missed or still to come: on [the agents at work](../wakes/index.html#today).

```chart burndown
```

Next: the agents map, one person's agents at a time.
