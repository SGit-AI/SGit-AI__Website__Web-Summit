---
title: Vaults and keys
summary: How the team's private material is kept: six encrypted SGit vaults, the agent keys their vault keys are sealed to, and step 8 of getting connected. Kept by sgit@web-summit.dinis. Nothing secret is on this page or in this repository.
---
What must not be public (booked meetings, contacts, introductions, the week's access keys) lives in encrypted SGit vaults, never in this repository. This page says what exists, how a key reaches an agent, and who is ready. It holds no vault key, no private key and no contact detail. Kept by **sgit@web-summit.dinis**.

## What exists today {#today}

- **The team CRM** (WS-170, 5 November): a new pair, `ws-team-crm-public` (public facts, its read key published) and `ws-team-crm-private` (the team's records, sealed a second time to each record's audience). See [the team CRM](../crm/index.html).
- **Six vaults** on dev.send.sgraph.ai: public and private for the CRM, the messages (Email-FS) and the task board (Issues-FS). Each holds only a README ([REALITY.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/REALITY.md)).
- **Their vault keys** are sealed to the DC Vault Registry key (`sha256:06c6ccddb7476629`, on [the keys page](../keys/index.html#vault-registry)), handed over by Dinis as a QR code on 28 October. Only the agent holding that key can open them.
- **Agent keys** are on [the keys page](../keys/index.html): one entry per agent, the public half only, each pushed by the session that made it (the start page, [step 6](../start/index.html#steps)).
- **The first private vault (WS-23):** the meetings vault, made by vault@web-summit.vicky from [the template](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/sgit/vault-templates/private) on 3 November. It is empty until Vicky and Nimay add the booked meetings on 4 November. Its key is sealed only to pm@web-summit.vicky, and to Nimay's agent once it has a key. Contacts and introductions (WS-24) get a vault of their own.
- **The first public vaults:** Angelo's and Vicky's, listed [below](#published).
- **Not yet:** one of the six team vault keys sealed to a team member's agent (the tool is ready; the vault registry key's holder runs it), and encrypted material on the site (WS-38).

## How a vault key reaches an agent {#sealing}

**The push is the authorisation** ([the article](https://newsroom.sgit.ai/articles/the-push-is-the-authorisation.html), CLAUDE.md "Identity and names"). A key is trusted because it was pushed to this repository's keys page, which only an account with push access can do. It is not trusted because of the pki.sgit.ai register, and no registration there is needed.

1. The agent makes its own key in its session (`node pki-agent.mjs keygen --session`) and commits only the public half to `data/keys.json`. The private half never leaves the session.
2. The holder of a vault key seals it to that key, read from what was pushed:
   `node admin/tools/seal.mjs --to <key id> --from-vault <vault dir> --expires 2 --qr sealed.png`.
   The tool takes the bundle from `origin/dev:data/keys.json`, names the commit that pushed it, checks that the live site serves the same key (`/keys/sha256-<fp>.json`), and seals with pki-agent.mjs's own code (refusing any copy whose sha256 is not the pinned one).
   **Who pushed it (WS-106):** every commit here is authored as "Claude", so git cannot say whose account pushed a key. The tool asks GitHub (the repository's activity API names the account behind each push) and seals only if that account is one the roster (`data/team.json`) lists for the person in the key's label, or if the sealer passes `--fingerprint <fp>` that the person read to them out of band (or showed as a QR code). It never prints the fingerprint in a refusal, so the out-of-band check cannot be copied from its own output. The vault key goes from `sgit vault show-key` into memory and is never printed. `--check <key id>` shows what the repository says about a key and seals nothing.
3. The sealed link or QR code reaches the agent out of band (Dinis, or a person carrying the QR code). The agent opens it with `node pki-agent.mjs open <link or qr.png> --save <dir>` and keeps the vault key outside this repository's clone: in the vault's own `.sg_vault/local/` (the vault lives in `~/vaults/<name>`), or under `~/.sg-send/`. Never anywhere in the clone, not even in an ignored folder: the gate reads every file there and stops the build on a key.
4. The agent clones the vault with `sgit` and reads and writes it there.

Tried end to end on 2 November: a test secret was sealed to `sgit-dinis` from the keys page and opened by that session from the link and from the QR code ([WS-102](../briefs/index.html#issues)). Still open, as in the article: proof that a session holds the private half, which writer may replace which role's key, and retiring an old session's key.

## The private vault: a proposed shape {#private}

For WS-23 (Nimay's booked meetings) and WS-24 (every contact and introduction followed up). Nothing is in a vault yet. The shape is ready as [a template](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/sgit/vault-templates/private): the three folders with a `_template.md` each, the rules in `PRIVATE.md`, and `AUDIT.md` for what leaves the vault.

| Folder | One file per | Fields |
|---|---|---|
| `meetings/` | booked meeting | who, when, where, owner, what we bring, public or not |
| `contacts/` | person or organisation | who, how we know them, owner, next step, by when |
| `introductions/` | introduction made to us | from, to, about, owner, next step |

Each person's agents read and write it once their keys hold its vault key. Only an agreed, public meeting may be copied to this site, and only after the decision in WS-23.

## Who is ready for step 8 {#ready}

Step 8 needs agent keys on the keys page (the [leaderboard](../team/setup/index.html) reads them from there). On 3 November Dinis settled WS-106: the GitHub check is enough for now, and `riskmandate-vicky` and `riskmandate-jose` are Vicky's and Jose's accounts (now on the roster). `riskmandate-agent` is Dinis's own account. `seal.mjs --check` on 3 November:

| Key | Pushed by | Its person's account on the roster? | Can be sealed to |
|---|---|---|---|
| `sgit-dinis`, `conductor-dinis`, `mentor-dinis` | DinisCruz | yes (dinis) | yes |
| `dev-angelo` | riskmandate-angelo | yes (angelo) | yes |
| `sgit-silvio`, `procurement-silvio` | riskmandate-silvio | yes (silvio) | yes |
| `conductor-vicky`, `dashboard-vicky` | riskmandate-vicky | yes (vicky), from this release | yes |
| `conductor-jose` | riskmandate-jose | yes (jose), from this release | yes |

The vault registry key holds the six team vault keys today, so its holder does the sealing. Everyone else: steps 4 to 6 first ([the start page](../start/index.html#steps)).

## Everyone's own vaults {#published}

Everyone now makes their own vaults, with the access token Dinis shared on 3 November, through a **vault agent**: [your vault agent, step by step](../vault-agent/index.html). Almost every vault is public: its read key is listed here, from `people/<id>/vaults.json`, and opens the vault read-only, with no account. The build refuses anything but a `sgit_public_read_` key in those files.

```vaults all
```
