---
title: "Sign in with pki.sgit.ai: a key in each person's browser"
summary: "pki.sgit.ai already has an OAuth-like flow with no server and no tokens: the person signs a delegation to a key their browser makes. How this static site would use it for signing, and the one decision first: which origin holds the browser key. By security@web-summit.dinis, 3 November 2026."
date: 2026-11-03
---
By security@web-summit.dinis, 3 November 2026, from pki.sgit.ai's own code (`/assets/people/sso.js`, `delegation.js`, `/authorize/`) and its articles. This is what pki.sgit.ai has today; this site does not use it yet.

## How it works {#how}

1. The site loads pki.sgit.ai's module (`sso.js`, a pinned version with its hash) and **pins the root key** it trusts: Dinis's, `sha256:db7f79fdd87e030a`. The root is never read from the register.
2. **The browser makes a key pair for this site** and keeps it. The site asks for capabilities, for example `identity` and `sign:approval`, for a number of days (1 to 365).
3. The person is sent to `pki.sgit.ai/authorize/`, signs in with **their passkey**, reads what this site asks for, and **signs a delegation with their own key**: "this browser key may sign `approval` for web-summit.sgit.ai until <date>".
4. They come back with the signed delegation. The site checks the nonce, that the delegation names this browser's key and this site, the dates, the signature, and that the person's key chains to the pinned root.
5. From then on, the browser signs notes (`pki.sgit.ai/signed/v1`) that **anyone can verify**, offline, with the delegation inside each note.

No server, no tokens, no passwords: a signed statement from the person, and a key that can act under it. The result is *soft* (signed and in date, cannot be withdrawn early) or *strong* (the person's pki.sgit.ai record lists the delegation, so withdrawing it ends it).

## The decision first: which origin holds the key {#origin}

pki.sgit.ai keeps the site's browser key **in that site's localStorage, unencrypted**. Any script that runs on the same origin can read it and sign as the person.

On web-summit.sgit.ai, scripts are written by many hands: the site's own, the feedback pane, the command centres (`assets/cc/`), and **each person's own `people/<id>/app/app.js`, which any of their agents can commit**. Every person's agent could read every other person's signing key. That is too wide for a key that signs approvals.

**Recommended:** the signing page lives on **an origin of its own** (for example `sign.web-summit.sgit.ai`, or a page on pki.sgit.ai made for it), serving one page and pki.sgit.ai's pinned modules, nothing else, with a strict Content-Security-Policy. The main site links to it. The page shows what is being signed (the files and their hashes), the person presses Approve, and the signed note goes back to their agent to commit. A key made **non-extractable** (WebCrypto) would stop it being copied, but not stop a hostile script on the same origin using it, so the separate origin is the real control.

## What it is for, here {#uses}

1. **Sign-offs by the person** (level 2 on [Signing off](../pki/sign-off/index.html#path)): the print set first.
2. **Feedback that is really from the person** (WS-119): today the feedback pane seals what is submitted, but anyone can submit; a signed note says who.
3. **The person's own key for secrets**: a browser key can open a secret sealed to it, so a person can receive the OpenRouter key on their phone and hand it to their agent.

## What it does not solve yet {#gaps}

- **Strong** delegations need the person's record on pki.sgit.ai to list them, and register writes go through a reviewed commit there. Until then, expect *soft*: valid until its end date, with no early withdrawal. Keep `days` short (7).
- A passkey without the PRF extension cannot sign in; signing in from a phone by QR can need the recovery code.
- Fingerprints are 64 bits (16 hex): fine against accidents and casual forgery, not a long-term identity. Compare the full key when it matters (the QR codes carry it).

## The steps (WS-117) {#steps}

1. Dinis: choose the signing origin (above), and that the root to pin is `sha256:db7f79fdd87e030a`.
2. dev: the one signing page, pki.sgit.ai's pinned module vendored with its hash, a strict CSP, the callback.
3. security: review the page and its CSP before the first real signature; a gate check that nothing else is served on that origin.
4. Each person: sign in once (passkey), approve 7 days of `sign:approval`, and sign their print set.
