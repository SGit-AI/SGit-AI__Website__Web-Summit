---
title: "The map's work view (deliverables travelling to their destinations) and the replay's WhatsApp clip"
by: dev.work@PrompTugal.angelo
written: 2026-11-08
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; findings from policy@PrompTugal.angelo; dashboard@PrompTugal.angelo reviews the build (from 8 November, 251d793b)
issue: WS-08 (backlog 0f2 and 0f3)
status: draft for Angelo's approval, with his answers of 8 November about 11:30 UTC folded in (the desk's 884ff5ca). Nothing is built until this line says "approved"; the two questions left are at the end.
---
## What and why

Angelo, 8 November (the backlog's rows 0f2 and 0f3, from the desk's 10:00 and 10:10 commits, both pushed from riskmandate-angelo):
- *"we can have the humans, the agents and the destinations: PT news, infrastructure, email drafts, CRM entries, etc and when an agent delivers the finished product for one of these destinations we have a line and an icon travelling from the agent or the human to that destination. The icon should be representative of what's being produced, like a doc, a cog, a key, a record etc."*
- *"this system needs to be able to handle the past for the replay feature so that we can show deliverables there too."*
- *"Maybe we can add a generic destination for everything that is a proposal/draft/html."*
- For replay: a "Download clip" that *"produces a video based on the selected controls. The video should be in a format that when you put it in Whatsapp is automatically shown and playable instead of generating the download button."*

Today the map and the live graph draw **exchanges** (who addressed whom). The work view draws **what was made, and where it went**: the same people and agents, ten destinations at the rim, and at each delivery's real moment a typed icon travelling from its maker to its destination. The clip turns whatever replay is showing into an MP4 that WhatsApp plays inline, so Angelo can send "what the team did today" in one message.

**The mock-up** (drawn from the rules below, positions illustrative): ![the work view](mockup-work-view.png)

**At a phone's width** (390 px, dark and light; redrawn on 8 November with dashboard@'s look notes, 07d4d01): ![the work view on a phone](mockup-work-view-phone.png)


## Part 1: the work view (0f2)

### What it looks like

- **The live graph's look, unchanged** (dev.map@ owns live.js and the layouts): the people ring, each person's agents around them, their colours, the hexagon. The work view is a **view** of the same graph (a switch beside the layouts: "Exchanges | Work"), not a new page.
- **Ten destinations at the rim**, in rounded squares like 00b's systems, each with its **real public logo or favicon** where one exists (Angelo's answer 3): PT News, the team site, research, infrastructure, the app, keys, the CRM, email drafts, LinkedIn, and **Drafts and proposals** (the generic one).
- **The logos:** fetched once, by hand, from each destination's own public site (its favicon or the logo it publishes), committed in `people/angelo/app/work-logos/` with a `SOURCES.md` line each (the address and the date read), never hot-linked, shown small and unaltered, always beside the destination's name. A destination with no public mark (email drafts, Drafts and proposals, infrastructure, research) keeps a plain mark in the graph's style.
- **The destinations' names** (dashboard@'s look notes, 07d4d01): each name sits **outside the rim**, in a pill on `--rm-surface` with a `--rm-border` edge, never on the hexagon's edge or across a line, so it reads on a phone; the destination's square (its logo) stays on the rim. On a phone the names keep at least 12 px and the squares grow, so the graph fills the width.
- **The legend** ("what travels", the six icons): beside the graph on a desktop; on a phone it folds into **one line under the graph**, icons and words, no heading.
- **Light theme:** a travelling icon is drawn on `--rm-bg` with its sender's colour as the stroke; the pale colours (Angelo's yellow) are too faint on white in the mock-up, so in light mode the icon's stroke uses a darker shade of the same colour, checked for contrast in the tests.
- **Six icons** (approved, answer 1): doc, cog, key, record, envelope, post (the mock-up's legend). The icon is the kind of thing made; the destination is where it went. A doc can go to PT News, the site, research or Drafts.
- **A delivery** travels from the agent (or the person, for a commit by a human) to its destination along a curved line in the sender's colour, the icon riding at its head, about 3 seconds; the destination's square lights when it lands and keeps a small count for the window shown ("PT News 4").
- **Inner workings are hidden**: seals, snapshots, STATE files, ledgers, estimates, pulses, reviews, release commits and generated pages never travel (the rule table's "hidden" rows).
- **Many at once** (a release of six articles, or replay at speed): deliveries to the same destination within one frame's minute merge into one icon with a small number, so the screen never floods.
- **Exchanges stay**: in the work view they fade to the faint flow, so the graph still breathes; the icons are the bright thing.

### Live and replay, one source

The same list of deliveries feeds both: the live graph plays each at its real moment (4 minutes behind, like exchanges), and the map's playback plays the full history, from the first commit of every repository the map reads. Nothing is drawn that has no commit.

### Where the deliveries come from, in this order

**1. The files each commit changed, by a rule table.** The first rule that matches a file decides; a commit delivers at most one icon per destination. Measured on this repository's `dev` from 2 November to 8 November, 09:50 UTC: 1,978 commits that are not releases; 932 deliver something by these rules (758 one thing, 163 two, 11 three), 1,046 are inner workings only.

| Files (first match wins) | Icon | Destination | Commits, 2 to 8 Nov |
|---|---|---|---|
| `REALITY.md`, `version.txt`, `admin/versions.json`, `admin/metrics.json`; `*/STATE.md`, `*/RUNNER.md`, `*/ledger/`, `*/estimates/`, `*/pulse/`, `*/policy/`, `data/log.json`; `data/sealed/` (vault@'s rule: never a sealed file's name); the generated pages committed before WS-83 (`team/`, `companies/`, `about/` and the rest) | none | hidden | |
| `data/keys.json`, `data/person-keys.json`, `people/*/key.json` | key | keys | 98 |
| `people/*/research/` | doc | research | 4 |
| `data/crm.json`, `data/companies.json`, `*/crm/` | record | the CRM | 13 |
| `people/*/proposals/`, `*/drafts/`, `*.fragment`, other HTML previews under `people/` | doc | Drafts and proposals | 77 |
| `people/*/app/` | cog | the app | 116 |
| `.github/`, `admin/tools/`, `people/*/tools/`, other code (`*.mjs`, `*.js`) | cog | infrastructure | 235 before answer 2 (less now: `admin/build/` moved to the site) |
| `content/`, `board/`, people's own pages under `people/` (reports, briefs, board notes, pulse and dashboard pages): comms | none | hidden (answer 2) | |
| `assets/`, `admin/build/` (the site's look, scripts and page templates: its features) | cog | the team site | 163 |
| the newsroom: a story whose history gains a `published` entry (read live, below) | doc | PT News | 38 published, 8 Nov |
| the newsroom: a story moving into a draft, fact-check or review column (read live, below) | doc | Drafts and proposals | |
| the apps' repositories (iOS, Android) | cog | the app | measured at build |

**The team site: features and infrastructure only, no comms** (Angelo's answer 2). Re-measured on `dev`, 2 November to 8 November 12:00 UTC (2,049 commits that are not releases): `assets/` or `admin/build/` 163, against 574 for every site change before. `content/` (303) and `board/` (363) are the team talking and stay hidden. A new top-level page (a new section of the site) is a feature, but it lives in `content/`; it can be told apart only by a rule on added `index.md` files, which I would add in the build only if Angelo misses those deliveries.

**The newsroom, read live** (Angelo's answer 4, the desk's 884ff5ca): the page fetches PrompTugal.news's own published files at view time, every two minutes, with no GitHub API and no token: `https://promptugal.news/api/v1/newsroom/stories.json` (each story's column, assignee and `history` of `{column, at, by, file}`) and `/feed.xml`. **Checked, 8 November 11:54 UTC:** both answer 200 with `Access-Control-Allow-Origin: *` (so the browser may read them from web-summit.sgit.ai) and `Cache-Control: max-age=600`, so a change reaches the page within about 12 minutes. A story's newest `published` history entry becomes a doc flying from its `by` to PT News; a move into a draft, fact-check or review column, a doc to Drafts and proposals. Only the story's id, its maker and the time are kept; never a title. **One limit:** the history's `at` is a date (none of the 38 `published` entries has a time), and the feed's `pubDate` is 09:00 GMT for every piece, so: live, a piece flies when the page first sees it (minutes late at most); in replay, past pieces land on their day, at 09:00 UTC, marked "day only" in the tooltip. A minute in the history would need the newsroom's build to write one (question 7). The newsroom's code and the apps' repositories still come from the committed snapshot.

**2. "Delivered:" lines** (the kit's protocol, with the kind first: `Delivered: <kind>, <what> <path or link>`). This is the only source for what never touches a repository. Kinds map to icon and destination: article → doc, PT News; brief → doc, research; page → doc, the team site; post → post, LinkedIn; email draft → envelope, email drafts; record → record, the CRM; key → key, keys; tool → cog, infrastructure; app → cog, the app; spec and report → doc, Drafts and proposals. A line whose kind and destination a file rule already gave for the same commit is the same delivery, not a second one. Lines written before the kind-first habit (22 on `dev` so far) are matched by the path they name, through the same rule table; a line with neither a kind nor a path is left out.

**3. The backfill, for the past outside the repositories:** `people/angelo/app/deliveries-backfill.json`, entries `{ at, agent, kind, destination, sha }`, where `sha` is the commit that records the delivery (for example the commit in which an agent reported "an email draft to X is in Gmail's drafts"). No entry without its commit; the test checks every sha exists. It holds names, kinds and times only: never a recipient, a subject or any text.

### The data, and who may see it

- **What is kept per delivery:** `[minute, maker, icon, destination, repository, short sha]`, names by index, as live.json does. Never a subject, a file name, a body, a recipient or any text. The file paths are read at build time to classify and then dropped.
- **Where (this repository and the snapshot):** a tool, `people/angelo/tools/deliveries.mjs`, reads the history of every repository in `repos.json` (read-only clones, no token, as repos-snapshot.mjs does) and writes the list. For this repository's own `dev`, the same function runs in the build so the live view is never a snapshot behind (two lines in `data.mjs`'s `extras()`, a shared file: a small change under the five steps, For: dev@PrompTugal.angelo). The apps' repositories come from a committed snapshot refreshed by the tool, like `repos-events.json`; the newsroom is read live (above).
- **Size:** about 150 deliveries a day on this repository; the full history since 28 October in about 40 KB, compressed by the site's server.
- **The email-drafts and LinkedIn squares** show that a draft was made, by whom and when: never to whom or about what. A recipient's or a company's name never appears (vault@'s must-never list, data-and-who-may-see-it.md, applies whole).
- **The metadata point** (vault@'s "one real risk") is unchanged: the team view shows minutes, a public version (spec-live-map.md part 4) would show days or lag, as that spec decides.

### The changes, by owner

- **dev.work@ (mine):** `people/angelo/tools/deliveries.mjs` (the rule table and the reader), `people/angelo/app/work.js` (the view: destinations, icons, flights, merges, counts), `people/angelo/app/work-newsroom.js` (the live read of the newsroom's files), `people/angelo/app/work-logos/` (the logos and their SOURCES.md), `people/angelo/app/deliveries-backfill.json`, their tests (`wv*` in `people/angelo/app/tests/`), this spec and my STATE.
- **dev.map@ (live.js and the layouts):** one hook so the work view can draw on the graph: the positions of people and agents, and a layer to draw in. I send it as a draft For: dev.map@ if live.js does not expose them already.
- **Shared, under the five steps:** two lines in `data.mjs`'s `extras()`; the "Exchanges | Work" switch in `app.js`; `deliveries.json` and `deliveries-repos.json` beside `live.json` (gitignored like it where generated).
- **dashboard@PrompTugal.angelo:** reviews my branch and brings it onto dev (from 8 November, 251d793b; dev@ before).

## Part 2: "Download clip" (0f3)

### What it does

A button beside the playback controls, **⤓ Download clip**, makes a video of exactly what replay shows (layout, Exchanges or Work view, time range, focus, speed, light or dark) and gives Angelo a file he can drop into WhatsApp, where it plays inline.

### The format WhatsApp plays inline

An MP4 with H.264 video (`avc1`, Main or Baseline profile, `yuv420p`), even width and height, the `moov` box at the start (fast start), no audio track (or AAC, never Opus), under about 16 MB. A WebM, or an MP4 with VP9 or AV1 inside, arrives as a document to download, which is what Angelo does not want. So:

- **Encode in the browser** with WebCodecs' `VideoEncoder` (`avc1.4D0028`, Main profile, level 4.0), 30 frames a second, and an MP4 muxer that writes fast start (mp4-muxer, MIT, vendored under `people/angelo/app/vendor/` at a pinned version, nothing loaded from a CDN at run time). Chrome, Edge and Safari 17 and later have it.
- **Where WebCodecs is missing:** `MediaRecorder` with `video/mp4;codecs=avc1` (Safari's own), checked with `isTypeSupported`. If neither can make H.264 MP4, the button says so and makes nothing; **never a WebM**. MediaRecorder's MP4 is a fragmented file (`moof`/`mdat`, no fast start) in full-range `yuvj420p` (checked 8 November, below), so the fallback rewrites it before saving: the same muxer, fed MediaRecorder's encoded frames, writes one fast-start `moov`, and the colour range is flagged limited; if that cannot be done in the browser, the button says the clip may arrive as a file to download.
- **Drawing the frames:** the graph is SVG, so each frame is drawn into a canvas the way the live graph's video pop-out already does (live.js `popVideo`): the SVG with the page's styles inlined, drawn as an image; in 3D, the WebGL canvas itself. Frames are rendered as fast as the machine can, on replay's own clock stepped frame by frame, not recorded in real time, so a slow laptop makes the same clip, just more slowly, with a progress bar and a Cancel.
- **Sizes:** square 1080 x 1080 (the default, Angelo's answer 5), 9:16 at 1080 x 1920 for a phone's full screen (the hexagon centred, a title and the time range above and below), and 16:9 at 1920 x 1080. All even, as H.264 needs.
- **Caps:** at most 60 seconds of video and about 15 MB (the bitrate set from the length: 2 Mbit/s for a minute). A longer selection is sped up to fit, with a warning naming the speed ("8 hours in 60 seconds"); Angelo can shorten the range instead.
- **On the clip:** a small caption at the bottom: the time range in UTC and "web-summit.sgit.ai, Team and the machine". No names beyond those the map already shows, no subject, no text from any commit (the replay's tooltips are not drawn).
- **The file name:** `team-and-the-machine-<from>-<to>.mp4`. On a phone with the share sheet (`navigator.share` with files), "Share" goes straight to WhatsApp; elsewhere it downloads.

### How we will know it works

- **The format, in a test:** `clip` makes a 5-second clip in Chromium, then checks it with ffprobe: `codec_name=h264`, `pix_fmt=yuv420p`, even width and height, `moov` before `mdat`, no audio or AAC, under the size cap; and that no subject or file name from the data appears in the frames' text layer. If ffprobe is missing in the session, the test reads the MP4's boxes itself (ftyp, moov, avcC) and says ffprobe was not run.
- **The proof that counts:** Angelo sends one clip to himself on WhatsApp, on his iPhone, and it plays inline. Until he has, 0f3 stays "delivered, to check".
- **The work view:** `wv` checks each rule row with a fixture commit (an article to PT News as a doc, a key to keys, a STATE change hidden, a release hidden), a "Delivered: email draft, ..." line becoming an envelope to email drafts with no text drawn, the backfill's shas all real, merges when ten land in a minute, and replay over the full history at 1280 and 390 px, light and dark.

## Out of scope

- Changing any logo (colour, shape, crop) or using one without its destination's name beside it.
- Reading Gmail, LinkedIn, the CRM's vault, GitHub's API or any connector at view time (the newsroom's public files are the one live read): the email-drafts and LinkedIn squares come only from "Delivered:" lines and the backfill.
- Sound in the clip; uploading the clip anywhere (it is made and kept on the viewer's own machine).
- The public map (spec-live-map.md part 4): the work view follows whatever that spec decides.

## Risks

- **Over-drawing the site:** settled by answer 2 (163 feature commits, not 574 changes).
- **The newsroom's files change shape:** the live read checks the fields it needs and, if they are missing, draws nothing from the newsroom and says so in the view's corner; a test runs it against a saved copy of today's file.
- **Logos are other companies' marks:** small, unaltered, beside the name, with their source recorded; a destination's owner asking for removal is honoured at once.
- **A rule misreads a commit** (a code change inside `content/` read as a doc): the rule table is one list in deliveries.mjs, tested row by row, and easy to change.
- **"Delivered:" lines are free text**: only the kind and the path are read; everything else in the line is dropped before the data is written.
- **WebCodecs' H.264 is missing on some Linux Chromium builds** (no proprietary codecs): the button says so there. **Checked, 8 November (second run), in the cloud session's Chromium (HeadlessChrome 153, Playwright, served from localhost: WebCodecs needs a secure context, so a `file:` or `data:` page has no `VideoEncoder`):** `VideoEncoder.isConfigSupported` says yes to `avc1.4D0028` (Main 4.0, the spec's choice) and `avc1.640028` (High 4.0) at 1080 x 1080, no to `avc1.42001f` (Baseline 3.1, too low a level for 1080; fine at 720); 30 frames of a 640 x 640 canvas encoded to 30 chunks, 57 KB, no error. MediaRecorder accepts `video/mp4;codecs=avc1`; ffprobe on its output: `h264`, Constrained Baseline, `yuvj420p` (full range), and the boxes `ftyp moov moof mdat ... mfra` (fragmented). So the tests can run here on the primary path; the fallback needs the rewrite above. ffmpeg and ffprobe are installed in the session, so the format test uses ffprobe.
- **A canvas handed to the encoder as it is comes out full range** (`yuvj420p`, found by the `clip` test, 8 November, seventh run): `clip.js` converts each frame to I420 itself, limited range, BT.709, so ffprobe reads `yuv420p`, `tv`. It costs a few milliseconds a frame.
- **Clip time on a slow machine:** a minute of 1080 x 1080 at 30 fps is 1,800 frames; drawing SVG to canvas costs about 10 to 30 ms a frame, so 20 to 60 seconds to make. The progress bar and Cancel cover it.
- **Shared files** (data.mjs, app.js, live.js): small changes, checked against the last two hours, sent as drafts on a clash.

## Angelo's answers (8 November about 11:30 UTC, the desk's 884ff5ca)

1. The ten destinations and six icons: **yes**.
2. The team site: **features and infrastructure only, no comms** (folded into the rule table).
3. **Real logos or favicons**, fetched once and committed with source and date, never hot-linked (folded in).
4. The newsroom **read live from its own published files**, every minute or two; only the app repositories wait for a snapshot (folded in, with the check of 8 November).
5. The clip: **square by default**.

## Questions left (via the desk)

6. **Approval:** with the answers folded in, may this spec's status say "approved", so the build starts (deliveries.mjs first, a test per rule row)?
7. **The newsroom's times:** its published files give a day, not a minute, for each step. Ask Dinis's team for a time in `stories.json`'s history (one field in their build; theirs, so a request, not a change of ours), or accept "day only" for past pieces in replay? Recommended: accept "day only" now, and ask.
