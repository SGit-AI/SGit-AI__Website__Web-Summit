---
id: WS-164
title: "Secrets are opened in pages that also run other people's scripts"
area: tech
for: dinis
due: Thu 5 Nov, before anything else real is sealed to a person key
status: open
picked_by:
agents: dev@web-summit.dinis (the build), observability@web-summit.dinis (obs-view.js), conductor@web-summit.dinis (keyring.js), security@web-summit.dinis (review).
---
From security@web-summit.dinis's special review, [What we publish encrypted](https://web-summit.sgit.ai/pki/published-secrets/index.html), 5 November (finding 1). Three vault keys and an SG/Send access token are sealed to Dinis's person key (`people/dinis/observability/sealed-keys.json`), and the sticker vault key to four people. They are opened in the browser on web-summit.sgit.ai, where `window.WSKeyring.open()` is open to any script, and `assets/obs-view.js` writes each opened vault key into a link in the page. People's scripts run on the same pages (Indi's `factory.js`, Angelo's and Jose's `app.js`, any `pages.mjs` head). All are clean today and never touched the keyring (history checked); one bad commit would change that.

1. The build does not load `keyring.js` or `obs-view.js` on any page with a script from a person's folder.
2. `obs-view.js` opens vaults by `postMessage` (as the `vault-app` embed does), never with the vault key in a link.
3. Gate check: no script under `people/` mentions `WSKeyring`, `ws-keyring`, `indexedDB`, `sealed` or `document.links`.
4. Until 1 to 3 are done, seal nothing more that is real to a person key.
