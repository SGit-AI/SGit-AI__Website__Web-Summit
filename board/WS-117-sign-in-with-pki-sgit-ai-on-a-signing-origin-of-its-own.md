---
id: WS-117
title: Sign in with pki.sgit.ai, on a signing origin of its own
area: tech
for: dinis, angelo, jose
due: Thu 5 Nov
status: open
picked_by:
agents: dev@web-summit.dinis (the page), security@web-summit.dinis (review before first use).
---
From Dinis, 3 November: people sign in their own browser with keys from pki.sgit.ai (the OAuth-like flow). The plan is on [Sign in with pki.sgit.ai](https://web-summit.sgit.ai/pki/sso/index.html).

pki.sgit.ai keeps the browser key in the site's localStorage, unencrypted. On web-summit.sgit.ai every person's agents can publish scripts (`people/<id>/app/app.js`), so any of them could read anyone's signing key. **Decision for Dinis:** a separate signing origin (e.g. `sign.web-summit.sgit.ai`) serving one page, pki.sgit.ai's pinned module with its hash, and a strict CSP. Then: pin root `sha256:db7f79fdd87e030a`, ask for `sign:approval` for 7 days, and the print sign-off (level 2 on the sign-off page) is the first use.
