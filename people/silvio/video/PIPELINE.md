# The video pipeline, as it really is (WS-52, WS-40)

Written by video@web-summit.silvio on 5 November 2026 from the repository alone, at Silvio's word ("write it without me"). **Silvio's own steps (how a video is made, from idea to file) are not yet written down: each is marked _to ask_.** Silvio corrects this page; when a step is confirmed, the mark goes.

Sources, read 5 November 2026: `content/videos.md` (the pipeline table), `data/videos.json` (the Drive files), the three video pages (`content/video-*.md`), `admin/build/build.mjs` (how a page plays a video), board WS-40, WS-52, WS-71, WS-72, and git history of `assets/video/`.

## The videos so far

| Video | Length | State (7 November 2026) | Where |
|---|---|---|---|
| The stand loop, six languages | 67 s each | checked, final | vault `ws-team-videos` (h9in5em4), `stand-loop/` |
| Your AI has access. Does it have permission? | 30 s, subtitled | checked, final | the vault, `access-permission-30s/`; Silvio's Drive original to upload |
| An X-ray, in 30 seconds (WS-197) | 30 s, silent | checked, final, for Silvio's yes | the vault, `xray-30s/` |
| The demo is us | 47 s, silent | checked, final, for Silvio's yes | the vault, `the-demo-is-us/` |
| The Licence to Operate, in 30 seconds | 30 s, square and 16:9 | checked, final, for Silvio's yes | the vault, `licence-to-operate-30s/` |
| With and without RiskMandate: the agent beyond its mandate, the access that stayed, the supplier with the open door | 19 s each, EN and PT, four frames | made 8 November, sent to Silvio; into the vault at his yes | not yet in the vault |
| Reach, Mandate, Gap | 53 s | **on hold: errors in frames** | not in the vault (PUBLISH.md says which) |
| RiskMandate Stories: fifty new agents | 2 min 44 s | **on hold: a label over its title** | not in the vault |

## The pipeline, step by step

| # | Step | What happens today | Who | State |
|---|---|---|---|---|
| 1 | **Idea** | A question a customer asks, as an issue on the board (`content/videos.md#pipeline`). The three videos so far came from Silvio. | anyone | written |
| 2 | **Storyboard** | Scenes, on-screen text and the job of each scene, as a page like [the loop's](https://web-summit.sgit.ai/videos/storyboard-loop/index.html), for the team to comment on (WS-75). | Silvio, Indi (message), Nimay (positioning), video@ drafts | written |
| 3 | **Script and narration** | _to ask:_ who writes the script, how the narration of the story video is made (voice or text-to-speech), how captions are made. | Silvio | _to ask_ |
| 4 | **Pictures and animation** | _to ask:_ the tools or AI services for the robot "Agent", the scenes and the animated diagrams (the Reach dome, the Mandate ring). | Silvio | _to ask_ |
| 5 | **Edit and export** | _to ask:_ the editor, the export settings (resolution, aspect ratio, codec). The names follow `YYYY-MM-DD_<slug>_v<N>.mp4`. | Silvio | _to ask_ |
| 6 | **Master saved** | In Google Drive, the team's private working folder `RiskMandate (agents)/videos` (masters, drafts, storyboards, published). | Silvio | written |
| 6b | **Checked, then into the vault** | Every frame checked for errors (misspelled or garbled text, invented figures, text over text) at Silvio's rule: what has one stays out. A clean file goes into `ws-team-videos` with its `video.json`: under 30 MB by video@web-summit.silvio, larger by Silvio with sgit ([UPLOAD.md](UPLOAD.md)); the audit before every push. | video@ silvio, Silvio | running since 7 Nov |
| 7 | **Review** | The team votes and comments in `people/<id>/feedback/videos.json` (WS-73); anyone else through the encrypted feedback pane on each video's page, opened only by vault@web-summit.jose; the team also comments with timestamps in Drive. Then a fix pass. | everyone | written |
| 8 | **On this site** | A page `content/video-<slug>.md`: what it shows, the key concepts, the feedback links, a card on [/videos/](https://web-summit.sgit.ai/videos/index.html). Until 6 November the video itself was a web copy committed in `assets/video/`; from now on no video goes into git, so a new page plays the file from the vault by its id and path. The player for that is still to build (conductor@web-summit.dinis's note of 6 November, "the reader that exists, the fence to build"); until it exists, a new page links to the post on YouTube. | conductor@ or video@ silvio; the player: the site's dev | the player to build |
| 9 | **YouTube, Instagram, LinkedIn** | To **RiskMandate's accounts** (Silvio, 5 Nov), from the file in the vault. Titles, descriptions and the checklist per channel: [PUBLISH.md](PUBLISH.md). **Silvio uploads and posts; no agent logs in**; LinkedIn routed to Indi (WS-126). Each post's URL then comes back here. | Silvio (Indi for LinkedIn) | ready, not yet run once (WS-71) |
| 10 | **Learn** | Views, comments and conversations back into the next storyboard. | Vicky, the journalist agent | not started |

## Where the videos live (WS-40, WS-174)

- **The vault `ws-team-videos`** (vault id h9in5em4, read key in `people/silvio/vaults.json`): every checked video, a `video.json` each (title, length, size, sha256, language, where it is used, state). From 6 November no video or image goes into this git repository (Dinis's rule); pages refer to a file by the vault id and its path.
- **Writing to it:** video@web-summit.silvio pushes files under 30 MB; Silvio pushes larger ones with sgit from his computer, guided by conductor@web-summit.silvio, who holds the vault key (sealed to it at Silvio's word). Whoever pushes runs the audit first (the vault's PUBLIC.md).
- **The masters:** Silvio's Google Drive working folder.
- **YouTube, Instagram, LinkedIn:** RiskMandate's accounts; Silvio posts.

## For the stand (Thursday 12 November)

The loop on the stand's screen plays from a laptop, from the masters, not from the web (the operator's note: keep the originals on a laptop for longer conversations). What was made for the stand is in [LOOP.md](LOOP.md).

## The flow in one line

Silvio's file (Drive) → checked frame by frame → the vault `ws-team-videos` with its `video.json` → a page here (the player from the vault still to build) and the posts on RiskMandate's channels (Silvio posts) → each post's URL back into `video.json` and the page.

## Only Silvio can answer

1. Steps 3, 4 and 5: the tools and services you use for the script, the narration, the pictures and animation, and the edit, a line each.
2. The two films on hold (Reach, Mandate, Gap; fifty new agents): fix them at the source, or retire them? And their pages on this site: leave, take down, or replace? (Not this agent's pages.)
3. Which clean video goes up first, on which channel (PUBLISH.md, A or B), and whether RiskMandate's three accounts all exist.
4. Who puts a new video on this site from now on: conductor@web-summit.silvio (as so far) or video@web-summit.silvio?
