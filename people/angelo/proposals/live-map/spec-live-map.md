---
title: "The live map: Team and the machine, with Replay inside it, the team's keys, sealed messages and lanes, and a public version"
by: dev@PrompTugal.angelo, with vault@PrompTugal.angelo (data-and-who-may-see-it.md)
written: 2026-11-07
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo
issue: WS-97, WS-181
status: approved by Angelo, 7 November 2026 (c6fc4442: the four decisions below, as decided). dev.map@PrompTugal.angelo builds from it, in the order of "The changes, by owner".
---
## What and why

Angelo, 7 November (c7d26a01 and f391ab59, both pushed from riskmandate-angelo):
- *"I also want to integrate the team and the machine map with the replay page as they serve the same purpose, and explore publishing it as an interactive, up-to-date view on our activity. It should also include external connections and exchange of keys and encrypted messages and append lanes."*
- *"I like that the name stays 'team and the machine' rather than replay. What's important is that the graphical appearance is the same as today in my control center, as it's brilliant and I don't want to lose its look and feel. We should consider making it 3D."*

**Where it stands today** (built 6 and 7 November, at Angelo's word):
- Team and the machine's map plays back on Replay's clock: play, pause, the window, speed, the scrubber and jump to a stand-up.
  - Each message is a dot in its sender's colour.
  - Each line lights while a dot is on its way, then fades.
  - Agents join the map when first used, then grow with their messages and glide into place around their person.
  - It works in all three layouts, with focus, and in full screen.
- Replay's timeline is still a separate view, `#replay`.
- Its tests are in `people/angelo/app/tests/` (`tm`, `tml`, `tmfs`, `tmf`, `tmlife`, `rp`, `arcs`).

**What this spec adds:**
1. Replay's timeline inside Team and the machine.
2. Four new kinds of event on the map: keys, sealed handovers, lanes, and sealed messages.
3. External connections: other teams' agents and PrompTugal.news.
4. A public version.
5. A 3D option.

The look and feel stays exactly as in Angelo's command centre today.

## 1. Replay goes into Team and the machine, not the other way

- **The timeline under the map.** Team and the machine gets Replay's timeline (the Gantt of commits, its filters and its arcs) under the map, on one clock. Play moves both, and scrubbing either moves both.
- **Selecting a commit** on the timeline picks out its agent and its message on the map.
- **One entry in the menu:** "Team and the machine". The old `#replay` addresses keep working: they open Team and the machine with the timeline in view and the same filters.
- **No new controls:** the controls under the map today serve both.
- **On a phone:** the map first, the timeline below it, the rows a person each (as Replay's phone view is).

## 2. What the map draws: four new kinds of event

From the public record only. vault@'s [data-and-who-may-see-it.md](data-and-who-may-see-it.md) is the rule; this table is how it looks.

| Event | From | Drawn as (in the map's own style) |
|---|---|---|
| A key published, replaced or ended | `data/keys.json` and the commits that change it (90 so far) | a small key mark on the agent, as it happens; an ended key greys it |
| Something sealed to someone | `data/sealed/<person>/` and `data/sealed/agents/<agent>/`: `by`, `to`, `at` (21 files) | a gold dot from `by` to `to`, with a lock, labelled "a key handed over" and nothing more specific (decision 1), never the file's name |
| A lane made or handed over | `data/inbox/lane-*.json` (4), `assets/feedback.json` lanes (9) | a thin ring on the agent that can receive sealed messages, from the time it was made |
| A sealed message sent or verified | only where an agent says so in a commit (WS-120's "test sent 17:25:33 UTC", "signature verified") | a dot with a lock, in the sender's colour, linked to the commit |
| Work and requests (today) | commit subjects, `Agent:` and `For:` | as now: dots and fading lines |

These appear in the playback as they happened, and in the still map as counts in each node's tooltip.

## 3. External connections

- **Other people's agents on this site:** already on the map. They are the other people's rings.
- **PrompTugal.news's agents:** already on the map from the snapshot (`people/angelo/app/promptugal.json`, refreshed at each of dev@'s wakes). Two additions:
  - **Their key events**, from the newsroom's `board/keys.json` history: when a newsroom agent's key was published or ended.
  - **Their messages map**, reused rather than collected again: security@PrompTugal.dinis already keeps `board/team/security/comms/comms.json` in the newsroom. It is a public ledger of who messaged, created or scheduled whom, by the minute, never the text. The snapshot reads its `edges` and `rows`, and the map draws them as dots like ours. Its "inbox message (signed)" and "lane append" channels are exactly the sealed messages and lanes of section 2, on the newsroom's side.
- **Other places our agents reach,** for example sgit.ai's vault server or pki.sgit.ai: one node each at the map's edge, only where a commit names the exchange.

**Not reused, and why:**
- **dev.graphs@'s article graphs:** prerendered pictures of what an article names. They show content, not activity.
- **designer@'s image of Angelo's communication graph** (62470d45): a still picture for a card. Our map is the live version; the image can be refreshed from it later.

## 4. A public version

The command centre is Angelo's own view. The public version is the site's existing **The map** page (`/team/map/`, a still picture drawn by the site's shared build: `admin/build/build.mjs`'s orgchart, Dinis's code), upgraded to the same interactive map rather than a new page (Angelo, 6 November: "let's not duplicate views").

**What it shows:** the same map, the same look and the same playback, with vault@'s rules for a public view.

**What must never appear, in either view** (vault@'s list, which the build checks):
1. The content of any message, sealed record or vault file. The map draws edges, never payloads.
2. Any secret: a vault key, a private read key, an append token, a private key.
3. The name or topic of a sealed file, only its kind.
4. A person's whereabouts: those belong to WS-181's private vault, never this map.
5. A vault id or read key that is not already published.
6. Anything from the agents' activity lane (WS-160) beyond what its keeper publishes.

**How it stays up to date:** built at each release from this repository, which happens with every push, so within minutes of any agent's commit. The build reads `data/keys.json`, `data/sealed/`, `data/inbox/`, `assets/feedback.json`, the commits and the newsroom's snapshot. There is no new data store, no secret in the build, and nothing fetched from a vault or from GitHub at view time.

**The metadata, honestly:** times and edges are information. A minute-by-minute map shows when each person's agents work, which hints at sleep, travel and the stand's hours, and who talks to whom. All of it is already public in this repository's git history, so a public map adds convenience, not new facts. vault@ proposed two limits (counting by day; running 24 hours behind). Angelo chose neither (decision 1): the public map is as fresh as the releases. It carries no location event, and shows a key handover only as "a key handed over".

## 5. A 3D option

**What it adds:**
- Room for over a hundred agents without crowding: people on a ring, their agents in a shell around each.
- A slow orbit for the stand's screen (Cinema).
- Time as depth: the playback can draw a message's line rising as it ages.

**What it costs:**
- **Weight.** The libraries are already on the site, same-origin: `assets/cc/brain-libs.js`, 1.6 MB, with 3d-force-graph 1.80.1 and three 0.186.1, bundled for Silvio's Summit brain. No new outside dependency, so nothing from a CDN at all, but 1.6 MB to load. It is loaded only when 3D is switched on.
- **Look and feel.** A force-directed 3D layout would lose the map's geometry, which Angelo wants kept. So the 3D view uses the same positions: x and y from the 2D layout, z for each person's agents (a shell). It is the same map, tilted and turned, not a new one.
- **The phone:** WebGL drains the battery and labels are hard to read. 3D stays off on phones unless chosen, and there it is a still view you turn with a finger, without the orbit.
- **Accessibility:** 2D stays the default and the only view with readable labels and keyboard focus.

**What I recommend:** a "3D" switch beside the layouts, off by default, built last (piece 5 below). The 2D map stays exactly as it is.

## Decisions (taken by Angelo, 7 November, c6fc4442)

1. **The public map is as fresh as the site's releases. "Agreed on both points":**
   - No 24-hour delay, and no counting by day.
   - **No location event on it, ever.**
   - Key handovers are shown only as **"a key handed over"**: who to whom and when. Not even the kind ("a record") appears in the public view.
   - Angelo's command centre is a public page too, so its map follows the same two rules: no location event, and "a key handed over" only.
   - **Also: a daily snapshot** of the map goes into Angelo's PrompTugal.news article ([angelos-communication-graph](https://promptugal.news/articles/angelos-communication-graph.html)). It replaces the article's picture and links to the live map. The image only, through writer@PrompTugal.angelo's article; the text is untouched. Under Angelo's publishing rule, the daily swap on his own article goes straight out.
2. **"Option A, replace everybody's map, they aren't going to lose anything and it's going to be much cooler":** `/team/map/` becomes the live map. Today's still picture stays as its no-script fallback. It lands as one commit For: dev@web-summit.dinis.
3. **Replay leaves the menu** for Team and the machine's timeline, with old links kept.
4. **3D as a switch,** off by default, built last.

## Out of scope

- Any message's content, any secret, any location (the never list).
- Collecting the newsroom's sessions ourselves: security@PrompTugal.dinis's ledger is reused as it is.
- Live updates between releases: releases already follow every push within minutes.

## The changes, by owner

- **dev.map@PrompTugal.angelo**, after approval, in this order, each piece tested and on its own branch for dev@'s review:
  1. The timeline inside Team and the machine, on one clock with the map; `#replay` redirects (section 1).
  2. The four new events from this repository (section 2):
     - `people/angelo/app/data.mjs` gains a `live` section: keys, sealed handovers by kind, lanes and claimed sealed messages, each with a time, from the files and their commits.
     - `replay.js`'s `mountFlow` draws them.
     - The build checks the never list: no file name from `data/sealed/`, no token, no key.
  3. The newsroom's key events and security@'s comms ledger (section 3), read by `people/angelo/tools/promptugal-snapshot.mjs`, which dev@ keeps and dev.map@ may change.
  4. The public `/team/map/` (section 4, decisions 1 and 2), and the daily snapshot:
     - **The snapshot:** once a day, a picture of the map (Playwright, the same build, the light and dark themes as the article needs) replaces the image in Angelo's article on PrompTugal.news. The image only, with a link to `/team/map/`; the text is untouched. It goes through writer@PrompTugal.angelo, the article's signer, as an image change (re-signed by writer@ if the image is part of the signed files).
     - **The site's shared files:** `/team/map/` is built by `admin/build/build.mjs` (its orgchart). The change is to shared code, made under the five steps as one commit For: dev@web-summit.dinis, with today's picture kept as the no-script fallback (decision 2).
     - **team-collaboration@PrompTugal.angelo** keeps `people/angelo/tools/team-map.mjs`, which the map reads: changes there are announced For: it.
  5. The 3D switch (section 5), loading `assets/cc/brain-libs.js` only when switched on.
- **dev@PrompTugal.angelo:** reviews each piece and keeps the tests and the snapshot tool.
- **vault@PrompTugal.angelo:** keeps data-and-who-may-see-it.md, the rule.

## Risks

- **Losing the look.** Every piece must pass today's map tests unchanged (`tm`, `tml`, `tmfs`, `tmf`, `tmlife`) and add its own. Screenshots go into each review.
- **A leak through a name.** A sealed file's name says what it holds, so the build reduces each to its kind, and the gate fails on any `data/sealed/` file name or token in the map's data.
- **Weight on a phone:** the data grows with every event. The map keeps only what the window needs, and 3D loads only when chosen.
- **Several agents in the same files** (dev.map@ and dev@; team-collaboration@ for team-map.mjs; dev@web-summit.dinis for the build): the five steps, small pieces, one branch.
- **The newsroom's ledger changes shape:** the snapshot reads it defensively and says when a field is missing, rather than drawing wrong edges.

## How we will know it works

- Team and the machine has one menu entry, and the map and the timeline move together. Old `#replay` links land in the right place.
- The keys, sealed handovers, lanes and sealed messages appear at the times their commits say. Spot-check three of each against the files, and check that the gate's never-list test passes.
- The newsroom's comms edges are drawn with their counts, which match its `comms.json` totals.
- `/team/map/` shows the live map, as fresh as the last release, with no location event and key handovers only as "a key handed over". Without script, it shows today's picture.
- Angelo's article on PrompTugal.news shows a snapshot of the map from the last day, with its text unchanged.
- 3D, when switched on, shows the same positions turned in space. It is off by default, and the 2D tests are unchanged.
- Every piece is tested at 1280 and 390 px, light and dark, with no errors.
