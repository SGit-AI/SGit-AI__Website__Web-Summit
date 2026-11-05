# The video pipeline, as it really is (WS-52, WS-40)

Written by video@web-summit.silvio on 5 November 2026 from the repository alone, at Silvio's word ("write it without me"). **Silvio's own steps (how a video is made, from idea to file) are not yet written down: each is marked _to ask_.** Silvio corrects this page; when a step is confirmed, the mark goes.

Sources, read 5 November 2026: `content/videos.md` (the pipeline table), `data/videos.json` (the Drive files), the three video pages (`content/video-*.md`), `admin/build/build.mjs` (how a page plays a video), board WS-40, WS-52, WS-71, WS-72, and git history of `assets/video/`.

## The videos so far

| Video | Length | Made | On this site since | Master in Drive |
|---|---|---|---|---|
| Reach, Mandate, Gap | 53 s, no narration | November 2026 | 5 Nov (web copy in `assets/video/`) | `2026-11-02_reach-mandate-gap_v1.mp4` |
| RiskMandate Stories: fifty new agents | 2 min 44 s, narrated, captioned | November 2026 | 5 Nov | `2026-11-02_stories-fifty-new-agents_v1.mp4` |
| Your AI has access. Does it have permission? | 30 s, subtitled | 5 Nov 2026 | 5 Nov | not listed in `data/videos.json` yet |

## The pipeline, step by step

| # | Step | What happens today | Who | State |
|---|---|---|---|---|
| 1 | **Idea** | A question a customer asks, as an issue on the board (`content/videos.md#pipeline`). The three videos so far came from Silvio. | anyone | written |
| 2 | **Storyboard** | Scenes, on-screen text and the job of each scene, as a page like [the loop's](https://web-summit.sgit.ai/videos/storyboard-loop/index.html), for the team to comment on (WS-75). | Silvio, Indi (message), Nimay (positioning), video@ drafts | written |
| 3 | **Script and narration** | _to ask:_ who writes the script, how the narration of the story video is made (voice or text-to-speech), how captions are made. | Silvio | _to ask_ |
| 4 | **Pictures and animation** | _to ask:_ the tools or AI services for the robot "Agent", the scenes and the animated diagrams (the Reach dome, the Mandate ring). | Silvio | _to ask_ |
| 5 | **Edit and export** | _to ask:_ the editor, the export settings (resolution, aspect ratio, codec). The names follow `YYYY-MM-DD_<slug>_v<N>.mp4`. | Silvio | _to ask_ |
| 6 | **Master saved** | In Google Drive, the team's private working folder `RiskMandate (agents)/videos` (masters, drafts, storyboards, published). Only the published files are shared, as "anyone with the link" (`data/videos.json`). | Silvio | written |
| 7 | **Review** | The team votes and comments in `people/<id>/feedback/videos.json` (WS-73); anyone else through the encrypted feedback pane on each video's page, opened only by vault@web-summit.jose; the team also comments with timestamps in Drive. Then a fix pass. | everyone | written |
| 8 | **On this site** | A page `content/video-<slug>.md`: a web copy in `assets/video/` played by `!video[caption](file poster)`, Drive's player underneath by `!drive[caption](<file id>)`, four frames, what it shows, the key concepts, the feedback links; a card on [/videos/](https://web-summit.sgit.ai/videos/index.html). Done so far by conductor@web-summit.silvio. | conductor@ or video@ silvio | written |
| 9 | **YouTube, Instagram, LinkedIn** | To **RiskMandate's accounts** (Silvio, 5 Nov). Titles, descriptions and hashtags in English and Portuguese, each linking to the video's page here: [PUBLISH.md](PUBLISH.md). **Silvio uploads and posts; no agent logs in.** Each post's URL then comes back here. | Silvio | drafted (WS-71) |
| 10 | **Learn** | Views, comments and conversations back into the next storyboard. | Vicky, the journalist agent | not started |

## Where the videos live (WS-40)

What exists today, not a decision:

- **The masters:** Google Drive, the private working folder above. Silvio's.
- **The web copies:** committed to this repository in `assets/video/` (6 to 8 MB each) and served by GitHub Pages with the site. Each page plays them directly; no outside player, no tracking.
- **Drive's player:** under each video, for the published file; it works only while the file stays shared as "anyone with the link".
- **YouTube, Instagram, LinkedIn:** not yet (WS-71). Each is uploaded there from the Drive master, by Silvio.

**Open for WS-40** (Angelo, Jose, Silvio): is committing a web copy per video enough until Lisbon? Every new mp4 adds 6 to 8 MB to the repository forever. Once a video is on RiskMandate's YouTube, its page here could also embed it; the build has no `!youtube` line yet, and adding one is a change for the build's owner, not for this agent.

## For the stand (Thursday 12 November)

The loop on the stand's screen plays from a laptop, from the masters, not from the web (the operator's note: keep the originals on a laptop for longer conversations). The plan for the 2-minute loop is WS-72: [LOOP.md](LOOP.md) when it is drafted.

## To ask Silvio

1. Steps 3, 4 and 5: the tools and services, in your own words, a line each.
2. Is the 30-second film's master in the Drive folder, under which name? (`data/videos.json` lists only the first two.)
3. Who puts a new video on this site: conductor@web-summit.silvio (as so far) or video@web-summit.silvio?
