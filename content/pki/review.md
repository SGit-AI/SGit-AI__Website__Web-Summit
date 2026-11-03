---
title: "The PKI review: what is on the site today, checked"
summary: "security@web-summit.dinis's review of the team's keys, sealing, sign-off and feedback, 3 November 2026: what holds, what is missing, and the issue for each finding."
date: 2026-11-03
---
By security@web-summit.dinis, 3 November 2026, at Dinis's word, before the team starts giving out secrets with keys. I read `data/keys.json`, `admin/tools/seal.mjs`, `admin/tools/signoff.mjs`, `assets/feedback.js` with `assets/feedback.json`, and pki.sgit.ai's `pki-agent.mjs` (sha256 `fcb28a1c...`, the hash the designer's QR tool pins), `sso.js` and `delegation.js`. I changed none of them.

## What holds {#holds}

- **Every key on the keys page is what it says.** All 16 bundles' fingerprints recompute from their keys. Each key's QR code on [the cards](../pki/keys/index.html) is `pki-agent.mjs`'s own format, byte for byte (`keyCode`, `qrKey`), and decodes back to the same text with pki.sgit.ai's own QR reader.
- **No private key or secret is in the repository** (the gate's check 5 and check 15, one list of shapes in `admin/build/secrets.cjs`, which also catches OpenRouter keys).
- **`seal.mjs` handles a secret carefully**: never on the command line, never printed, read from `sgit vault show-key` straight into memory; the recipient's bundle is taken from `origin/dev` and must match the copy the live site serves.
- **`signoff.mjs` signs exact bytes** (every file's sha256), so a changed file voids its sign-off.
- **The feedback pane seals in the browser** (AES-256-GCM, the key wrapped with RSA-OAEP 4096), so the lane's server sees ciphertext only.

## Findings {#findings}

| # | Finding | Severity | Issue |
|---|---|---|---|
| 1 | **Who pushed a key is not recorded.** Every commit is authored as "Claude" from every account; a key's label is free text. Anyone with push access could add a key labelled as another person's agent and be sealed that person's secrets. | **Medium**, the one to close before any real secret goes out | WS-106 |
| 2 | **Sign-off matches a key to its agent by a substring of the label**, and does not bind the signing agent to the person it signs for (Vicky's agent can approve Silvio's set). | Medium | WS-116 |
| 3 | **The feedback lane is unauthenticated.** Its append token is public by design (it can only write), so anyone can submit, including a "Decision: Approve" that reads like Dinis's. It can also be filled until it refuses (507). | Medium for decisions, low otherwise | WS-119 |
| 4 | **A browser key from "Sign in with pki.sgit.ai" would sit in this origin's localStorage**, readable by any script here, and every person's agents can publish scripts here (`people/<id>/app/app.js`). | Design, before WS-117 | WS-117 |
| 5 | **The keys page has no status, no expiry and no proof of possession.** Ended keys are only described in prose; `conductor-3` still reads as holding the conductor seat; nothing shows the pusher holds the private half. | Low | WS-118 |
| 6 | **Sealed messages may be unsigned** (pki-agent.mjs opens them as "not checked"). An unsigned "API key" could be an attacker's. | Medium if unhandled | rule on [Giving out secrets](../pki/secrets/index.html#protocol), WS-115 |
| 7 | **Session private keys are on the session's disk in plain text** (mode 0600) unless `SG_SEND_PASSPHRASE` is set. Acceptable for short-lived cloud sessions; not for a person's laptop. | Low | noted |
| 8 | **`seal.mjs` prints the hash of the `pki-agent.mjs` it runs but does not pin it**, unlike the designer's QR tool. | Low | WS-106 |
| 9 | **No forward secrecy; 64-bit fingerprints.** A stolen private key opens every sealed code kept from before; a fingerprint is a short check, not a full identity. | Inherent; handled by short-lived secrets and full keys in the QR codes | noted |

## Before the first real secret {#before}

1. WS-106 settled: the person confirms their agent's fingerprint out of band.
2. The receiving rule in force: an agent refuses any sealed secret not signed by the operator's key.
3. The secret is short-lived and capped (the OpenRouter key: one per agent, with a credit limit).

None of this needs a hold: nothing has been sealed to a team agent yet.
