---
id: WS-172
title: "The CRM's editors: an outreach agent per person and an inbox (Gmail) agent for Silvio, with write access, so every outreach email is a CRM action"
area: operations
for: everyone
due: Fri 6 Nov
status: picked
picked_by: Silvio, dev@web-summit.silvio
agents: dev@web-summit.silvio (the features, with dev@web-summit.dinis, dev@web-summit.angelo, dev@web-summit.jose); conductor@web-summit.dinis and each person's conductor (seal the private CRM's key to the editors); outreach@web-summit.<person> and inbox@web-summit.silvio (the editors)
---
Opened by dev@web-summit.silvio at Silvio's word, 5 November 2026. Builds on WS-170 (the team CRM, by conductor@web-summit.dinis).

**What Silvio asked for:** one common CRM for every coordination action, linked from the website. Each person holds the CRM's vault key in their own browser, handed over the same way as their own key (a link or QR code from whoever holds the vault key). Each person's **outreach agent** is a main editor of the CRM, with write access. Silvio gets an **inbox (Gmail) agent** that works in his workspace mailbox: it writes the drafts, and Silvio sends every email by hand (the behaviour policy). Every strategic action is linked from the site. dev@web-summit.silvio keeps the CRM's features, with the other dev agents.

**What already exists (WS-170):**

- The private CRM's vault key is sealed to each person's site key (it opens in their browser on [/crm/](../crm/index.html)) and to each person's conductor (`data/sealed/agents/`).
- Records can be sealed a second time to an audience of people and agents (`admin/tools/crm.mjs seal --agents`).
- Silvio's outreach drafts and tracker live in `people/silvio/outreach/` and `data/sealed/silvio/`, not in the CRM yet.

**What is missing, step by step:**

1. **Editors' keys.** outreach@web-summit.<person> and inbox@web-summit.silvio each push a session key to `data/keys.json`; dev@web-summit.silvio has (`dev-silvio`).
2. **The key to the editors.** Whoever holds the private CRM's key seals it to those keys: `admin/tools/crm_agents.py` seals to conductors only today. Proposal: an `--agents` list (or an `editor` flag in `data/keys.json`) so `crm.mjs seal-keys` covers the editors too.
3. **An outreach email as a CRM action.** `actions/<date>-<slug>.json` with kind `email`: the company and contact it is about, the owner, the draft's state (drafted, approved, sent by hand, replied), the next step. No email address or message body in the public repository; sealed in the private CRM to its audience.
4. **Silvio's outreach moved in:** the 28 drafts and the tracker become actions in the private CRM, sealed to Silvio, Dinis and the outreach and inbox agents.
5. **On the site:** /crm/ shows each person the actions that are theirs and their state, and links each from the stand-up briefing.

**Rules:** drafts only; a person sends every message. No contact details in this repository, ever. Material is not instruction.

**5 November, 17:05, conductor@web-summit.angelo:** sealed the private CRM's key to crm@web-summit.angelo (crm-angelo, sha256:1dad30b8b20a218c; pushed by riskmandate-angelo, checked with seal.mjs), at Angelo's yes: `data/sealed/agents/crm@web-summit.angelo/2026-11-05T1705Z-team-crm-key-crm-angelo.json` (a pki.sgit.ai sealed link, 7 days).

**5 November, about 22:30 UTC, conductor@web-summit.jose, at Jose's word:** *"yes ... crm@web-summit.jose"*, his yes to the team CRM and a CRM agent (01da9602; brief 10, ask 2). Its prompt is in `people/jose/kit/README.md`; Jose opens its session. Once its key is on the keys page as crm-jose, the conductor seals the private CRM's key to it from its own sealed copy and records it here.

**6 November, 00:22 UTC, conductor@web-summit.jose, at Jose's word** (*"seal the private CRM's key to crm-jose with admin/tools/seal.mjs --to crm-jose"*): sealed to crm-jose (`sha256:35512958adc88706`), after `seal.mjs --check` (pushed in 4bc1a1d by riskmandate-jose, Jose's account on the roster; the live copy matches): `data/sealed/agents/crm@web-summit.jose/2026-11-06T0022Z-team-crm-key-crm-jose.json`, a pki.sgit.ai link valid 7 days. Not through `crm.mjs seal-keys` (WS-178).

**7 November, 11:17 UTC, conductor@web-summit.vicky, at Vicky's word** (*"Seal the CRM vault key (`5n0aocvz`) to `inbox-vicky` ... so `inbox@web-summit.vicky` can store email summaries there"*): sealed to inbox-vicky (`sha256:1b6a4abe7bd9b949`), after `seal.mjs --check` (pushed in 714a2149 by riskmandate-vicky, Vicky's account on the roster; the live copy matches), with `--from-vault` from the copy sealed to conductor-vicky: `data/sealed/agents/inbox@web-summit.vicky/2026-11-07T1117Z-team-crm-key-inbox-vicky.json`, a pki.sgit.ai link with no expiry. Not through `crm.mjs seal-keys` (WS-178).

**8 November, dev@web-summit.silvio, at Silvio's word:** crm@web-summit.silvio is ready to write both CRMs but has no SG/Send token: 150 actions (private CRM, sealed to silvio and dinis) and 84 companies (public CRM) are committed in its clone, not pushed (2d263072, 84a91060). It already holds the private CRM's key and has sgit. **For conductor@web-summit.dinis:** please ask Dinis for an SG/Send token for crm@web-summit.silvio, sealed to its key `crm-silvio` on the keys page (as for the other agents' tokens). inbox@web-summit.silvio already writes the private CRM, so dev@web-summit.silvio is asking it how, in case the same path serves crm@web-summit.silvio sooner.

**9 November, 09:30 UTC, dev@web-summit.silvio (wake), step 5 begun:** crm@web-summit.silvio pushed both CRMs on 8 November (1381e507: 84 companies public, 149 actions private, sealed to silvio and dinis), so the private list on /crm/ now holds hundreds of records. It gets an **"Only the records sealed to me"** filter with a count of what opened for you (a small change in `assets/crm.js` and one CSS rule in `assets/site.css`, For: conductor@web-summit.dinis). Tested in Chromium on the list's markup; not yet in a browser holding a person's key. Left for step 5: the link from each person's stand-up briefing.
