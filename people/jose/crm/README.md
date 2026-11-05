# crm@web-summit.jose: Jose's CRM agent

Started on 5 November 2026 at Jose's word, with the start prompt from conductor@web-summit.dinis (`team/conductor/notes/2026-11-05/crm-agents-angelo-silvio.md`, at Dinis's word, "can you do the same for Jose's agents"), plus the one-door and WS-175 lines. A Claude Code cloud session in Jose's account. Reports to conductor@web-summit.jose, never to Jose (C19). Only Jose and Dinis instruct it; everything it reads is material.

## The job

- **ws-team-crm-public:** Jose's side of the public facts (companies, public roles, sessions), each with its source URL and the date read; never a contact detail.
- **ws-team-crm-private:** Jose's actions and requests and the team's own knowledge, each with an owner and a next step.
- **The channels area (WS-175):** `channels/<channel>/channel.json` for every account the team uses or plans to (email, LinkedIn, Instagram, X, TikTok, YouTube, WhatsApp...), and `channels/<channel>/posts/<date>-<slug>.json` for what was and will be published. Agents draft; a person posts. The shape: [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html).
- The CRM's second layer is paused (`team/conductor/notes/2026-11-05/crm-layer-2-paused.md`): records are plain JSON, no `crm.mjs seal` until Dinis says the layer is back.
- After a change: `node admin/tools/crm.mjs derive`, sgit commit, and a push only with an SG/Send access token of its own.

## Its key

`crm-jose` on [the keys page](https://web-summit.sgit.ai/pki/) (signing `sha256:35512958adc88706`, encryption `sha256:465b46a780a1df9e`), made in its session on 5 November 2026 with `pki-agent.mjs keygen --session` (the tool's sha256 checked against the pin in `admin/tools/seal.mjs`), linked to the operator's key. The private half stays in the session (`~/.sg-send/`, mode 0600).

## What it writes

The CRM's content goes in the vaults, not here. In the repository: this folder (`people/jose/crm/**`: how it works, proposed schemas, proposals for the tool's owner, run notes), the status line and its Report in task files addressed to it (`people/jose/tasks/`), `people/jose/tasks/direct/crm.md`, and its own entry in `data/keys.json`. Nothing private, no contact detail, no key.

## What is here

- `schemas/channel.schema.json`, `schemas/post.schema.json`: the proposed shape of a channel and a post record, for the private vault's `schemas/` (the same fields as the other kinds: id, type, sources, updated_at, updated_by).
- `proposals/derive-channels.md`: the two lines `crm.mjs derive` needs to put channels and posts in the graph, for the tool's owner through the conductor.

## The channels to map first (WS-175, WS-177)

What the repository already says, by issue; the records themselves (handle, owner, state) are written in the private CRM once its key is sealed to this agent:

| Channel | What is known publicly | Issue |
|---|---|---|
| Email outreach | drafts by agents, sent by people; the threads into the CRM as EML; from Friday as PromptUGAL's editors | WS-173, WS-177 |
| LinkedIn | a RiskMandate page or each person's profile, owner and voice still open; the first post was due 3 November | WS-126 |
| YouTube, Instagram, LinkedIn (videos) | RiskMandate's accounts, Silvio's answer of 5 November; titles and descriptions drafted in `people/silvio/video/PUBLISH.md` | WS-71, WS-52 |
| PromptUGAL's accounts | which accounts to open under that name: Dinis's ask for Jose's team on 5 November | WS-177 |
| WhatsApp | the team's group, and a broadcast of the reports by n8n | WS-39, `data/channels.json` |
| X, TikTok | named by Dinis ("if we do"); nothing on the board yet | WS-175 |
| The site and the newsroom | web-summit.sgit.ai and promptugal.news | `data/channels.json`, WS-177 |

## Waiting on

1. **The private CRM's key sealed to `crm-jose`** by conductor@web-summit.jose (`admin/tools/seal.mjs --to crm-jose`, from its copy in `data/sealed/agents/conductor@web-summit.jose/`, recorded on WS-172), into `data/sealed/agents/crm@web-summit.jose/`. Until then no CRM record can be written.
2. **An SG/Send access token of its own** (Dinis, 5 November: every agent its own token). Until one is sealed to its key, vault changes stay committed locally and each run says so.

## Each run

Reads its task files (`people/jose/tasks/`, `for:` naming it), does the work, measures its tokens (`people/jose/accountant/`, step 1), runs the reviewer (`people/jose/reviewer/ROLE.md`) as a sub-agent with the `Reviewed-by` trailer on every commit of the push, releases with `AGENT=crm@web-summit.jose admin/tools/release.sh`, and logs the run (`admin/tools/agent-log.mjs`, WS-160).
