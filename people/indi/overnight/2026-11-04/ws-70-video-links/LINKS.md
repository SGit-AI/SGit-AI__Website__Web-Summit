# WS-70: where the two video recordings are

WS-70 asks for the full narration of both videos on their pages (today the captions are read from frames). At Indi's word, this step finds the recordings.

| Video | Length | In the repository (GitHub) | On the site | Google Drive (shared copy) |
|---|---|---|---|---|
| Reach, Mandate, Gap | 53 s, no narration (visual only) | [assets/video/riskmandate-reach-mandate-gap.mp4](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/assets/video/riskmandate-reach-mandate-gap.mp4) | [the page](https://web-summit.sgit.ai/video-reach-mandate-gap/) | [file](https://drive.google.com/file/d/1QWOcRJFlG86MBBlNLghbev5yFx8apHwk/view) |
| RiskMandate Stories: fifty new agents | 2 min 44 s, narrated and captioned | [assets/video/riskmandate-stories-fifty-new-agents.mp4](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/assets/video/riskmandate-stories-fifty-new-agents.mp4) | [the page](https://web-summit.sgit.ai/video-fifty-new-agents/) | [file](https://drive.google.com/file/d/1r4Mf4LZjX5Av5n7yM0WvBO23-duXBgr8/view) |

Sources: `data/videos.json` (the Drive file ids), `content/videos.md` line 17 (the Drive links), `content/video-fifty-new-agents.md` line 8 (the file in the repository). Checked on 4 November 2026, 22:20 UTC: both files are in the repository (6.1 MB and 8.3 MB), each with one video and one audio track, and no subtitle track.

## What a full transcript needs

- **Reach, Mandate, Gap** has no narration: its "transcript" is the words on screen, which its page already lists.
- **Fifty new agents** is narrated. A transcript needs speech-to-text on the audio track. It could not be made in this session: the speech models are downloaded from huggingface.co, which this environment's network does not allow.
- **Two ways to finish it** (Indi or Silvio to choose):
  1. Silvio exports the transcript from the tool he made the video with (the narration script is its source), and an agent puts it on the page.
  2. An agent in an environment that allows huggingface.co runs Whisper on `assets/video/riskmandate-stories-fifty-new-agents.mp4`, then a person checks it against the video.
