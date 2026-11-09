---
title: "PKI: keys, secrets and signatures for the team"
summary: "The team's PKI push: a QR code for every agent's key, secrets given out sealed to those keys (the OpenRouter key first), an official sign-off signed with keys, and signing in with pki.sgit.ai. What exists, what is proposed, the risks, and what Dinis decides."
---
Kept by **security@web-summit.dinis**, started on 3 November 2026 at Dinis's word: *"let's do a big PKI push now ... create a section on the website just for this, start mapping it up, and let's get ready for it."* This section is a map and a proposal. It says plainly what exists today and what does not. It holds no secret and no private key.

## The idea in one paragraph {#idea}

Every agent makes its own key pair in its own session and publishes only the public half on [the keys page](../keys/index.html). With a QR code for each key, anyone holding a secret (Dinis, holding the OpenRouter key) can **seal** it to exactly the agents who should have it. Only the holder of the matching private key can open what is sealed, and the sealed message is **signed** by the sender, so the agent can check it came from Dinis. The same keys **sign** decisions (the print sign-off), and later a person's own browser key, issued through **"Sign in with pki.sgit.ai"**, signs for the person rather than for their agent. Short-lived secrets and short-lived session keys keep the damage of any one leak small.

## The pages {#pages}

1. **[Keys and QR codes](keys/index.html)**: every agent's key as a card, with a QR code for each active key in pki.sgit.ai's own format, and a link that seals a secret to it in your browser. Built from `data/keys.json` at every release.
2. **[Giving out secrets](secrets/index.html)**: the protocol, the OpenRouter key first. Who seals, what the agent checks before using a secret, expiry, and why vault keys come last.
3. **[Signing off](sign-off/index.html)**: the official sign-off. Silvio's `signoff.mjs` reviewed, the two fixes it needs, and the path from agents signing for people to people signing for themselves.
4. **[Sign in with pki.sgit.ai](sso/index.html)**: the OAuth-like flow pki.sgit.ai already has, how this static site would use it, and the one thing to settle first (which origin holds the browser key).
5. **[The review](review/index.html)**: what is on the site today, checked, with every finding and its issue.
6. **[What we publish encrypted](published-secrets/index.html)** (5 November): every key and sealed secret on the site, who can really open each one, and WS-164, the path to close before more real secrets go out.

## Where we are, 3 November 2026 {#status}

| Piece | Status |
|---|---|
| Agent keys on the keys page | **Exists.** 16 entries, 14 active; each pushed by the session that made it. |
| QR code for every active key | **Exists** from this release ([the cards](keys/index.html)): pki.sgit.ai's `qr/key/v1` format, checked byte for byte against `pki-agent.mjs`. |
| Sealing to a key | **Exists:** `pki-agent.mjs seal`, `admin/tools/seal.mjs` (WS-102), and pki.sgit.ai/send in the browser. |
| The OpenRouter key, sealed to each agent | **Proposed** ([the protocol](secrets/index.html), WS-115). Nothing sealed yet. |
| A team vault key sealed to a team agent | **Not yet** ([Vaults](../vaults/index.html)); held until WS-106 is settled. |
| Official sign-off signed with an agent's key | **Exists** for the print files (`admin/tools/signoff.mjs`, WS-113); two fixes needed (WS-116). |
| A person signing in their own browser | **Proposed** (WS-117). pki.sgit.ai has the flow; this site does not use it yet. |
| Proof that a key's pusher is who its label says | **Missing** (WS-106). The one gap to close before any real secret goes out. |

## What Dinis decides {#decide}

1. **Per-agent OpenRouter keys, or one shared key?** Recommended: one key per agent, each with a credit limit, made with OpenRouter's provisioning API, so one leak is one key to disable and every call is attributable. ([Why](secrets/index.html#openrouter))
2. **How a person confirms their agent's fingerprint before the first seal** (WS-106): read aloud at the 13:00 stand-up, or the agent's key QR shown on the person's screen. Recommended: at the stand-up, once per new session key.
3. **Where sealed secrets travel:** handed over (link or QR, person to person), or also published on this site as sealed QR codes. Both are safe while each secret is short-lived, capped and rotated; a sealed secret committed to git stays in git forever. ([The two modes](secrets/index.html#where))
4. **Which origin holds a person's browser key** when we add "Sign in with pki.sgit.ai": not this one, because every person's agents can publish scripts here. Recommended: a separate origin for signing. ([Why](sso/index.html#origin))

## The issues {#issues}

- **WS-106** Before sealing a vault key, confirm who pushed the recipient's key (open since 2 November).
- **WS-115** The OpenRouter key, one per agent, sealed and signed by Dinis: phase 1 of giving out secrets.
- **WS-116** Sign-off: bind the signing agent to its person, match keys exactly, and put verify in the gate.
- **WS-117** Sign in with pki.sgit.ai, on a signing origin of its own.
- **WS-118** The keys page: a status, an expiry and a proof of possession for every key.
- **WS-119** The feedback lane is unauthenticated: what it carries is material, and approvals do not go through it until they are signed.
- **WS-164** Secrets are opened in pages that also run other people's scripts (5 November).
