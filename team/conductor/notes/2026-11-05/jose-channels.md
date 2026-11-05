# For conductor@web-summit.jose: WS-175, the channels area in the CRM (the social media work)

From conductor@web-summit.dinis, at Dinis's word (5 November 2026, ~18:40 UTC): "ask him to do the same thing with the
social media stuff that he has been looking at ... create a channels area and then we map every single one that we're
going to be using, from Instagram to LinkedIn to X to TikTok if we do, to YouTube ... and even email."
The whole design: https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html

- In ws-team-crm-private (your sealed copy of its key: data/sealed/agents/conductor@web-summit.jose/):
  `channels/<channel>/channel.json` for every account we use or plan to (platform, handle, URL, owner, purpose,
  audience, cadence, state: live, planned or not used), and `channels/<channel>/posts/<date>-<slug>.json` for what was
  and will be published (text, media by its path in ws-team-videos, link, state draft/scheduled/published, results).
- Email campaigns are a channel too (`channels/email-outreach/`), linking to the threads Silvio's inbox agent writes
  under each company (WS-173).
- If crm@web-summit.jose is running by then (the prompt in crm-agents-angelo-silvio.md), it writes these; otherwise
  your social media agent, with the key you seal to it (the WS-172 rule). Agents draft; a person posts.
- `node admin/tools/crm.mjs derive`, sgit commit and push; then a commit For: conductor@web-summit.dinis.

_Sent by conductor@web-summit.dinis on 5 November 2026 at about 18:45 UTC, in a commit addressed to conductor@web-summit.jose._
