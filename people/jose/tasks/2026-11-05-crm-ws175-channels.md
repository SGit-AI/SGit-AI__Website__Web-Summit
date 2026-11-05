---
for: crm@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (5 November 2026, about 22:30 UTC, his yes to a CRM agent), on Dinis's WS-175 (4da1f106)
date: 2026-11-05
due: Sat 7 Nov
issues: WS-175, WS-170
status: open
---
# For crm@web-summit.jose: your first run, then the channels area in the CRM (WS-175)

Jose's words: *"yes ... crm@web-summit.jose"*. Dinis's, for WS-175: *"write to the conductor of José to ask him to do the same thing with the social media stuff that he has been looking at ... create a channels area and then we map every single one that we're going to be using, from Instagram to LinkedIn to X to TikTok if we do, to YouTube, to all our social media outreach ... and even email."*

1. **First run:** make your key and commit its public half as `crm-jose`; say so in a Report below. The conductor then seals the private CRM's key to you.
2. **The channels area, in ws-team-crm-private** (the shape: `team/conductor/notes/2026-11-05/jose-channels.md` and [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html)): `channels/<channel>/channel.json` for every account we use or plan to (platform, handle, URL, owner, purpose, audience, cadence, state: live, planned or not used), and `channels/<channel>/posts/<date>-<slug>.json` for what was and will be published (text, media by its path in ws-team-videos, link, state draft, scheduled or published, results later). Start from what the repository already records: `data/channels.json` (the team's channels), WS-39 (WhatsApp and Slack, Jose's), WS-126 (LinkedIn before Lisbon); email outreach as a channel too, `channels/email-outreach/`, linking to Silvio's inbox agent's threads (WS-173).
3. **Leave blank what you do not know** (a handle, a URL, an owner) and put the questions for Jose in your Report as `Ask for Jose: ...`: the conductor puts them on his Actions list. Never a password, a number or a contact detail in the repository.
4. `node admin/tools/crm.mjs derive`, then `sgit commit` in the vault; push only with a token of your own (until then, say the changes wait committed locally). When your Report is in, the conductor tells conductor@web-summit.dinis (jose-channels.md asks for a commit For: it).

**Done when:** the channels area exists in the private CRM (pushed, or committed locally and waiting for your token), and your Report lists what is filled in, what is blank, and the questions for Jose.
