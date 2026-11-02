---
title: Vaults and keys
summary: How the team's private material is kept: six encrypted SGit vaults, the agent keys their vault keys are sealed to, and step 8 of getting connected. Kept by sgit@web-summit.dinis. Nothing secret is on this page or in this repository.
---
What must not be public (booked meetings, contacts, introductions, the week's access keys) lives in encrypted SGit vaults, never in this repository. This page says what exists, how a key reaches an agent, and who is ready. It holds no vault key, no private key and no contact detail. Kept by **sgit@web-summit.dinis**.

## What exists today {#today}

- **Six vaults** on dev.send.sgraph.ai: public and private for the CRM, the messages (Email-FS) and the task board (Issues-FS). Each holds only a README ([REALITY.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/REALITY.md)).
- **Their vault keys** are sealed to the DC Vault Registry key (`sha256:06c6ccddb7476629`, on [the keys page](../keys/index.html#vault-registry)), handed over by Dinis as a QR code on 28 October. Only the agent holding that key can open them.
- **Agent keys** are on [the keys page](../keys/index.html): one entry per agent, the public half only, each pushed by the session that made it (the start page, [step 6](../start/index.html#steps)).
- **Not yet:** a vault key sealed to any team member's agent, the private vault's folders for meetings and contacts, and encrypted material on the site (WS-38).

## How a vault key reaches an agent {#sealing}

1. The agent makes its own key in its session (`node pki-agent.mjs keygen --session`) and commits only the public half to `data/keys.json`. The push is its authorisation. The private half never leaves the session.
2. The holder of a vault key seals it to that public key. The output is a link or a QR code that only the recipient's private key opens.
3. The sealed link reaches the agent out of band (Dinis, or a person carrying the QR code). The agent opens it with `node pki-agent.mjs open <link>` and keeps the vault key in its session's key store, or in the gitignored `.credentials/` tier.
4. The agent clones the vault with `sgit` and reads and writes it there.

**Open gap ([WS-102](../briefs/index.html#issues)):** `pki-agent.mjs seal` looks the recipient up in the pki.sgit.ai register and refuses a key that is not there. Under the corrected method, agent keys are only on the keys page, so step 2 needs either a seal that takes the bundle from `data/keys.json`, or the agent keys registered as well. That is Dinis's call.

## The private vault: a proposed shape {#private}

For WS-23 (Nimay's booked meetings) and WS-24 (every contact and introduction followed up). This is a proposal. Nothing is in the vault yet.

| Folder | One file per | Fields |
|---|---|---|
| `meetings/` | booked meeting | who, when, where, owner, what we bring, public or not |
| `contacts/` | person or organisation | who, how we know them, owner, next step, by when |
| `introductions/` | introduction made to us | from, to, about, owner, next step |

Each person's agents read and write it once their keys hold its vault key. Only an agreed, public meeting may be copied to this site, and only after the decision in WS-23.

## Who is ready for step 8 {#ready}

Step 8 needs agent keys on the keys page (the [leaderboard](../team/setup/index.html) reads them from there):

- **Dinis:** the vault registry key holds the vault keys today; sgit@web-summit.dinis has its own key (`sgit-dinis`).
- **Vicky:** conductor@web-summit.vicky (`conductor-vicky`) and dashboard@web-summit.vicky (`dashboard-vicky`). Ready to be sealed to once WS-102 is settled.
- **Angelo:** dev@web-summit.angelo (`dev-angelo`). Ready to be sealed to once WS-102 is settled.
- **Everyone else:** steps 4 to 6 first ([the start page](../start/index.html#steps)).
