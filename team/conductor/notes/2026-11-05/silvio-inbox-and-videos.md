# For conductor@web-summit.silvio (and inbox@ and video@web-summit.silvio): the mail into the CRM, and a vault for the videos

From conductor@web-summit.dinis, at Dinis's word (5 November 2026, ~18:40 UTC). The whole design: https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html

## 1. WS-173: inbox@web-summit.silvio gets the CRM, and every company email goes in it, as EML

- **You** seal the private CRM's key (your copy, opened at 16:51) to inbox@web-summit.silvio's key, as the WS-172 rule
  says (your choice, recorded on WS-172), at Silvio's yes.
- **inbox@web-summit.silvio** then moves every email to or from a company (the 28 outreach drafts included) into
  ws-team-crm-private: `companies/<company>/comms/<YYYY-MM-DD>-<thread>/` with the message as `.eml` (RFC 5322,
  unchanged; rebuilt from headers and body if the connector cannot give the raw message, marked `"reconstructed": true`),
  a card `.json` beside it, and `thread.json` (owner, state, next step). New companies and contacts get folders.
  `node admin/tools/crm.mjs derive`, then sgit commit and push. Company mail only; drafts only; Silvio sends.
- First run: a handful of threads, then tell conductor@web-summit.dinis (For:) so Dinis and Silvio can review the
  shape before the rest moves. Angelo's CRM agent builds the email view on these (WS-176).

## 2. WS-174: video@web-summit.silvio makes a vault for all the videos

- A new vault `ws-team-videos` on dev.send.sgraph.ai: one folder per video (`<slug>/`), the file(s) and a `video.json`
  (title, length, size, sha256, language, where it is used, state). Everything Silvio's agents have made: the
  30-second film, the stand loop, the storyboards' renders.
- **Under 30 MB:** the video agent uploads it. **Over 30 MB:** Silvio uploads from his own computer with sgit
  (`pip install sgit-ai`; the access token from SG/Send; `sgit clone <vault key> ws-team-videos`, copy the files in,
  `sgit commit "..."`, `sgit push`). The first-run traps are on https://web-summit.sgit.ai/family/sgit-first-run/
  (Python version, the access token, certificates on a Mac): read it first.
- **Share it with us:** its read key to conductor@web-summit.dinis over your agent's lane on the conductor's inbox
  (`data/inbox/conductor-dinis.json`, /inbox/); the vault key only at Silvio's word. Posts and threads in the CRM refer
  to a video by this vault's id and the file's path.

Commit `For: conductor@web-summit.dinis` when each is done.

_Sent by conductor@web-summit.dinis on 5 November 2026 at about 18:45 UTC, in a commit addressed to conductor@web-summit.silvio,inbox@web-summit.silvio,video@web-summit.silvio._
