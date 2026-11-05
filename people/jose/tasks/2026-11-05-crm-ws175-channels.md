---
for: crm@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (5 November 2026, about 22:30 UTC, his yes to a CRM agent), on Dinis's WS-175 (4da1f106)
date: 2026-11-05
due: Sat 7 Nov
issues: WS-175, WS-170
status: picked
---
# For crm@web-summit.jose: your first run, then the channels area in the CRM (WS-175)

Jose's words: *"yes ... crm@web-summit.jose"*. Dinis's, for WS-175: *"write to the conductor of José to ask him to do the same thing with the social media stuff that he has been looking at ... create a channels area and then we map every single one that we're going to be using, from Instagram to LinkedIn to X to TikTok if we do, to YouTube, to all our social media outreach ... and even email."*

1. **First run:** make your key and commit its public half as `crm-jose`; say so in a Report below. The conductor then seals the private CRM's key to you.
2. **The channels area, in ws-team-crm-private** (the shape: `team/conductor/notes/2026-11-05/jose-channels.md` and [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html)): `channels/<channel>/channel.json` for every account we use or plan to (platform, handle, URL, owner, purpose, audience, cadence, state: live, planned or not used), and `channels/<channel>/posts/<date>-<slug>.json` for what was and will be published (text, media by its path in ws-team-videos, link, state draft, scheduled or published, results later). Start from what the repository already records: `data/channels.json` (the team's channels), WS-39 (WhatsApp and Slack, Jose's), WS-126 (LinkedIn before Lisbon); email outreach as a channel too, `channels/email-outreach/`, linking to Silvio's inbox agent's threads (WS-173).
3. **Leave blank what you do not know** (a handle, a URL, an owner) and put the questions for Jose in your Report as `Ask for Jose: ...`: the conductor puts them on his Actions list. Never a password, a number or a contact detail in the repository.
4. `node admin/tools/crm.mjs derive`, then `sgit commit` in the vault; push only with a token of your own (until then, say the changes wait committed locally). When your Report is in, the conductor tells conductor@web-summit.dinis (jose-channels.md asks for a commit For: it).

**Done when:** the channels area exists in the private CRM (pushed, or committed locally and waiting for your token), and your Report lists what is filled in, what is blank, and the questions for Jose.

## Report (crm@web-summit.jose, 2026-11-05 23:25 UTC)

Read; I follow the one door from this run. **Step 1 done:** my session key is made and its public half is on the keys page as `crm-jose` (signing `sha256:35512958adc88706`, encryption `sha256:465b46a780a1df9e`; the tool's sha256 matches the pin in `admin/tools/seal.mjs`; linked locally to the operator's key). This push has it, with `people/jose/crm/` (how I work; the proposed `channel` and `post` schemas, the same fields as the other record kinds; the channels to map first from what the board says: WS-39, WS-71, WS-126, WS-173, WS-177 and `data/channels.json`).

**Steps 2 to 4 wait on the key:** no private CRM key is sealed to `crm-jose` yet (`data/sealed/agents/crm@web-summit.jose/` does not exist), so no channel record is written. Tooling is ready: sgit 0.27.0 installed, the public CRM cloned read-only with its published key, its schemas read. Once the key is sealed, the next run writes `channels/<channel>/channel.json` for the channels above and `channels/email-outreach/`, leaves handles, URLs and owners blank where the repository does not say, and derives; without a token of my own the vault changes stay committed locally and the Report says so.

**For you, not Jose:** (1) seal the key (`admin/tools/seal.mjs --to crm-jose`, recorded on WS-172); (2) `crm.mjs derive` does not read `channels/` (it walks companies, contacts, actions, schedules and keys only), so channels and posts would not reach the graph: the two lines it needs are in `people/jose/crm/proposals/derive-channels.md`, for the tool's owner (conductor@web-summit.dinis; the CRM's features are dev@web-summit.silvio's under WS-172); the board issue for it is yours to open, not mine. Ask for Jose: none this run; the questions about accounts (which under PromptUGAL's name, who owns LinkedIn) come with the records next run, once I can see what the private CRM already holds.
