# Jose's command centre: the design

Kept by `designer@web-summit.jose`, Jose Bota's designer. What `dev@web-summit.jose` builds in `people/jose/app/` (the opt-in app the site build already supports, WS-06: `data.mjs`, `app.css`, `app.js`), and the look of Jose's broadcast messages (WS-39).

**Status, 3 November 2026: three directions proposed, waiting for Jose's pick.** Nothing here is to be built until Jose chooses. The spec below is written for the recommended direction (A), so dev can start the moment Jose says yes; it changes if Jose picks B or C or mixes them.

## The three directions

Every preview uses real repository data as it stood on Tue 3 Nov, 01:30 UTC (the board, `people/jose/agents.json`, the git log). Phone width, 390 px.

| | Direction | For | Preview |
|---|---|---|---|
| **A** (recommended) | **Control room.** The team's approved RiskMandate dark look (the tokens Silvio's command centre uses), with Jose's orange as his accent. Next stand-up, then what needs Jose, then the machine, then issues. | A glance before each stand-up: "do I need to act?" | [A-control-room.png](A-control-room.png) |
| **B** | **The flow.** Jose's work as n8n-style nodes and wires on a light dotted canvas: the broadcast pipeline, his agents, setup. The node that waits on Jose is orange. | Jose's week runs on automations. | [B-flow.png](B-flow.png) |
| **C** | **Builder log.** A terminal you read like a changelog: three numbers, checkbox lists, the commit log addressed to Jose, a prompt line to his conductor. | Scanning raw activity, not cards. | [C-builder-log.png](C-builder-log.png) |
| WS-39 | **Broadcast look:** two ways the report reads in a group chat. | The n8n flow's text. | [broadcast-looks.png](broadcast-looks.png) |

**Jose: tell your conductor or me "A", "B", "C" or a mix** ("A, with C's log on the Agents tab"), plus anything you would remove.

## Spec for dev (direction A)

### Tokens

Scope everything to the app page (`html.cc-on`, as Silvio's app does), so the rest of the site is untouched. Dark is the default; a light set comes after the pick.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#07111F` | page |
| `--surface` | `#0E2035` | cards, agent tiles |
| `--surface-nav` | `#061425` | bottom tab bar |
| `--line` | `#294A64` | borders, row dividers |
| `--text` | `#F7FAFC` | primary text |
| `--text-2` | `#BCCCDC` | body copy in cards |
| `--text-3` | `#9EB2C7` | labels, times |
| `--jose` | `#F07A2E` | Jose's accent: primary button, issue ids, active tab. From his colour `#e86a1c` in `data/design.json`, lifted for contrast on navy. Ink on it: `#1A0D04`. |
| `--gold` | `#F5B942` | "waits on you" only: the needs-you edge, the count, the level badge |
| `--ok` | `#3DD68C` | an agent that ran on time |
| `--warn` | `--gold` | an agent late by more than one slot |
| `--bad` | `#FF6B6B` | an agent that missed two slots, CI red |
| hero | `linear-gradient(120deg, #0A1830, #1B1240)` | the stand-up card only |

Colour carries state, never decoration: gold means Jose, green means fine, red means broken.

### Type

Inter, bundled like Silvio's (`fonts/`, SIL OFL 1.1; copy `people/silvio/app/fonts/`); IBM Plex Mono or the system mono for issue ids. Tabular figures for every time.

| Role | Size / weight | Notes |
|---|---|---|
| Stand-up time | 28 / 700, tracking -0.02em | one per screen |
| Name | 15 / 700 | |
| Card title | 14 / 700 | |
| Body in cards | 12.5 / 400, line-height 1.45 | |
| Section label | 11 / 600, uppercase, tracking 0.1em, `--text-3` | count on the right |
| Meta (times, pills) | 11 / 500 | |
| Issue id | 12 mono, `--jose` | |

### Spacing and shape

4 px base. Page gutter 16 px; between sections 16 px label-top; between cards 8 px; card padding 11 by 12 px; the agent tiles' grid gap 6 px. Radius: hero 16, cards and tiles 12, buttons 8, pills 999. No shadows: borders separate. Tap targets 40 px tall at least (the buttons in the preview are visual size; pad their hit area).

### Layout, top to bottom (Today tab)

1. **Header:** avatar (orange circle, initial), name, role; on the right the level badge (`L5 of 6`, from `onboarding.json` and the leaderboard rule).
2. **Next stand-up card:** label, time in UTC, "in 11 h 30 min" (live), and the summit countdown under it (opening night Mon 9 Nov, 18:00 UTC, from `data/events.json`).
3. **Needs you (count):** one card per open ask, oldest first. Gold left edge 3 px. Title, one-line why, up to three buttons. Sources: Jose's open asks in his conductor's latest brief (`people/jose/briefs/*.json`), issues with `for: jose` that ask a decision, and the dashboard agent's open question.
4. **The machine:** one tile per running agent in `agents.json`, three across (wrap to two at under 340 px): status dot, name without `@web-summit.jose`, "ran HH:MM · next HH:MM". Last run from the git log (`Agent:` trailer); next from the cron. Header says "all running" in green, or "N late" in gold.
5. **My issues:** picked first, then by due date; three rows on Today and the rest under Issues. Row: mono id, title (one line, ellipsis), pill (status · due). Header: "1 picked · 27 more in the pool" (the pool is the issues whose `for:` names jose and that are not done).
6. **Bottom tabs:** Today, Issues, Agents, Broadcast. Fixed, with the safe-area inset under it.

### States

| Thing | States |
|---|---|
| Needs-you card | open (gold edge) · answered (collapses to one grey line, "answered 13:04", for the rest of the day) · none (one line: "Nothing waits on you. Next stand-up 13:00.") |
| Agent tile | ok (green, slow pulse; no pulse with reduced motion) · late (gold) · missed (red) · not started (outline only, from `agents.json` entries with no commits) |
| Issue pill | picked (orange tint) · open (grey) · due today (gold text) · late (red text) · done (hidden on Today) |
| Data | loading: the no-JavaScript fallback (`summaryMd`) shows first, so there is no spinner · stale: if `data.json` is more than 3 hours old, a gold line under the header, "Built 04:10, 3 h ago" |
| Buttons | default · pressed (darken 8%) · focus: 2 px `#FFD166` outline, 2 px offset |

The buttons send nothing (the team's rule: agents draft, people send). A decision button copies a one-line reply for Jose's conductor ("WS-39: forward route") and says "Copied: paste it to your conductor".

## The broadcast look (WS-39)

Today `report-draft.mjs` lists all seven points. In a group chat, people read three. Proposed text (look 1, recommended), WhatsApp formatting only, about 300 characters:

```
*RiskMandate team · 00:57 report*
Tue 3 Nov · stand-ups 13:00 and 18:00

▸ *Print files ready* for sign-off
▸ *A printer can make Friday*, if confirmed today
▸ *First major release*, v0.2.0

+4 more: https://web-summit.sgit.ai/reports/2026-11-03-0057/
```

Rules for dev: a fixed title line (`*RiskMandate team · HH:MM report*`); the day and stand-up times; the first three points, bold lead plus at most six words; `+N more:` and the link last, so the preview card shows. Slack takes the same text (its bold is also `*`). Look 2, one line and the link, is the fallback if the group finds a message every two hours too much.

## Tried and learned

- **3 November, first run.** Tried: three directions over the same real data, as a live HTML preview and as phone-width PNGs. Learned: `*.html` is gitignored in this repository (generated output, WS-83), so a hand-made preview page cannot be committed; the PNGs here are the record, and the live, tappable preview goes to Jose as a private link in his Claude session. The team already has an approved dark look (Silvio's command centre); starting A from it keeps Jose's page in the family and gives dev tested tokens.
