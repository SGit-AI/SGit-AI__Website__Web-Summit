# Silvio's companies, staged for the public CRM (WS-170, WS-172)

Kept by crm@web-summit.silvio, from 5 November 2026. The public CRM (`ws-team-crm-public`, read key in `data/crm.json`) was read on 5 November 2026 at 17:19 UTC (graph derived at that time) and compared with Silvio's three lists:

| List | Companies | In the public CRM | Missing, staged here |
|---|---|---|---|
| The 50 targets (`people/indi/overnight/2026-11-04/ws-26-outreach-targets/targets.json`) | 50 | 50 | 0 |
| The 50 buyers (`people/silvio/outreach/buyers.json`) | 50 | 9 | 41 |
| The 38 not at Web Summit (`people/silvio/outreach/online.json`) | 38 | 0 | 38 |

`public/companies/<slug>/company.json` and `notes.md` are the 79 missing records, in the public CRM's layout and schema, ready to copy into the vault. This agent cannot push them itself yet: writing the public CRM needs its vault key, which is sealed in the private CRM (`keys/public-crm.sealed.json`).

**What they hold:** public facts only, each with its source URL and the date read: the name, whether the company is listed at Web Summit Lisbon 2026 (the lis26 partner, appearance or speaker page), and, for the ones not at Web Summit, the AI facts read on the company's own site (with its sector, country and website). Not here, on purpose: why we want them, priorities, owners, channels (those are the team's own notes, for the private CRM), and never a contact detail. Where no public page was read for what a company is (25 of the 38, marked "sector fit" in `online.json`), `category`, `country` and `website` are left empty with a `to_source` note. 'Novo' is listed by Web Summit under that name only; which company it is has not been verified, so it has no website or country.

**To move them in** (whoever holds the public CRM's vault key):

    cp -r people/silvio/crm/public/companies/* <ws-team-crm-public>/companies/
    node admin/tools/crm.mjs derive public    # then commit and push the vault

The graph is derived in the vault from the records, so it is not kept here.

## 6 November, morning run

crm@web-summit.dinis has the 50 buyers, fuller than these (what each does, AI flows, people and sessions as websummit.com lists them), committed in its local clone of the public CRM and not pushed yet (its commit 1781ccd, waiting for its own token); it also verified that "Novo" is Novo Nordisk. So when that push lands, its 41 buyer records win and the 41 staged here are dropped. The 38 companies not at Web Summit (`online.json`) are still only here. The private CRM's key is not sealed to crm-silvio yet, so no actions yet; no outreach or inbox commit has reported a sent email, a reply or a meeting since 5 November 17:30 UTC.

## 7 November, 02:40 UTC: the private CRM's key arrived

conductor@web-summit.silvio sealed the private CRM's key to crm-silvio at Silvio's word (d38c3ea); it opened in this session, signed by conductor-silvio's key, and is kept out of the repository. I read the private CRM with it (read-only): no outreach action for Silvio's companies is there yet. Writing to either CRM still needs two things this session lacks: sgit (`pip install sgit-ai`, not yet allowed here) and an SG/Send access token of my own (one per agent, issued by Dinis and sealed to crm-silvio).

## 7 November: world 1 (hospitality, tourism and the Algarve)

At Silvio's pick, relayed by conductor@web-summit.silvio. Of the world's companies (`people/silvio/outreach/worlds.md`), Algarve Evolution, DIG-IN, sheerME, Altegio and Just Travel are already in the public CRM (read 7 November, graph of 6 November 15:55 UTC). Booking.com, Amex GBT and Turismo de Portugal were staged here on 5 November; they are now enriched from outreach's research (`people/silvio/outreach/world1/`): what they do in their own words, their sessions at the summit, their AI facts, each with its source. Not taken: outreach's [analysis] lines and the article ideas (the team's own), and people's names (a contact record is only for what the summit lists).

**A correction for outreach@web-summit.silvio:** Turismo de Portugal *is* listed for Web Summit 2026: its lis26 appearance page (`websummit.com/appearances/lis26/91e2a435-.../tourism-of-portugal/`) shows "Tourism of Portugal" as an event partner (fetched 7 November 2026, HTTP 200). `world1/turismo-de-portugal.md` says no lis26 page was found.

One action per company (7, plus one for the 15 more candidates) is sealed to silvio and dinis (ws-crm-env-1), state `new` (nothing drafted yet), next step from outreach's table, no due date until Silvio sets one. They wait in this agent's session, outside the repository, until it can write the private CRM. Algarve Evolution already has its actions there (6 November), so none was added.

## 8 November, morning run

sgit installed at Silvio's word (7 November). In this session's clone of the private CRM, committed and **not pushed** (no SG/Send token of my own yet): one action per company, sealed to silvio and dinis: the 50 targets (state `drafted`; 28 are Gmail drafts, the rest text only), the 47 buyers not in world 1 (`new`), the 38 online (`drafted`, text only), world 1 (the 7 of 7 November, the five Silvio added, the 10 candidates left, and the introduction request to Algarve Evolution, `drafted` in Gmail on 7 November). 150 actions; graph derived. States come only from outreach's and inbox's commits. The five added to world 1 (Lena Concierge, Cadae AI, 241.travel, easyInfluencer.travel, WeRoad) are staged here for the public CRM too (84 records now).

## 8 November: a correction, and the public CRM committed

The public CRM's write key is a plain record in the private CRM (`keys/public-crm.json`, layer 1 only), so anyone holding the private CRM's key holds it too, crm-silvio and conductor-silvio included; earlier notes here said otherwise. The 84 staged companies are now committed in this session's clone of ws-team-crm-public (graph 878 nodes, 1041 edges), not pushed. Checked first: none of the 84 was in the public CRM (graph of 7 November 10:28 UTC). The only thing missing for both pushes is an SG/Send access token for crm-silvio.

## 8 November, ~16:40 UTC: pushed

At Silvio's word ("sim o token", relayed by conductor@web-summit.silvio), pushed with the shared SG/Send token from the session's environment, never printed or stored (the clones' token files deleted after each push), until a token of crm-silvio's own arrives. Both vaults were pulled first (no newer changes). **ws-team-crm-public:** the 84 staged companies are live (407 companies, graph 878 nodes, read back from the server with the published read key). **ws-team-crm-private:** 149 actions for Silvio's lists, sealed to silvio and dinis (162 actions in the vault in all; the earlier "150" counted the world-1 candidates action twice). The staged copies in `public/` stay as the source of these records.

## 8 November: the week's priority, approved by Silvio

Proposed by this agent, approved by Silvio ("aprovo"). In the private CRM the 97 actions due this week are resealed with a wave and a due date (pushed, in sync):

| Wave | What | Companies | Due |
|---|---|---|---|
| A | priority-1 "meet" targets with a Gmail draft; batch 1 Feedzai, KPMG, Startup Portugal; then Primitive and the rest, in batches of 3 to 5 | 18 | 10 Nov |
| B | priority-2 "meet" targets with a Gmail draft; AICEP and ChatPlace first | 9 | 10 Nov |
| C | Portuguese priority-1 buyers: emails in Portuguese written on 9 Nov, sent 10 to 11 Nov | 16 | 11 Nov |
| D | CrowdStrike and the 10 non-Portuguese priority-1 buyers, if time allows | 11 | 11 Nov |
| hold | Hexamind, until its attendance is confirmed | 1 | none |
| postponed | 21 priority-2 interview/article targets (for the newsroom) and 21 priority-2 buyers (an online meeting, like `online.json`) | 42 | 20 Nov |

Everything still waits on Dinis's yes to the PromptUGAL-first shape and the PromptUGAL address in Silvio's Gmail. This agent sends nothing.

## 8 November, 19:00 UTC: wave C written

From outreach's 4acb1035: the 16 wave-C buyer actions are now `drafted` (text in Portuguese in `people/silvio/outreach/wave-c-emails.md`, not yet Gmail drafts). 5 of them have a PromptUGAL page (Galp, Government of Portugal, Banco Português de Fomento, IAPMEI, Universidade de Lisboa); 11 need one from newsroom@web-summit.dinis first. Turismo de Portugal's world-1 action is `drafted` too (outreach lifted its hold and wrote it with wave C); it is not in the approved waves, so it has no due date until Silvio decides. Pushed.
