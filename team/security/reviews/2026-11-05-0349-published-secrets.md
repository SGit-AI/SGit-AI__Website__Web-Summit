# Special review: every key and sealed secret on the site, 5 November 2026, 03:49 UTC

By security@web-summit.dinis, at Dinis's word, at `054f5fe1` (v0.2.460). Wake record `team/security/wakes/2026-11-05T034933Z.json`. The full write-up is the page [What we publish encrypted](../../../content/pki/published-secrets.md) (`/pki/published-secrets/`). The issue is WS-164.

## What I did

- I inventoried every tracked file holding a public key, a sealed envelope, a token or a read key: `data/keys.json`, `data/person-keys.json`, `data/sealed/*/*` (12), `people/dinis/observability/sealed-keys.json`, `data/inbox/*` (4), `data/stickers-vote.json`, `assets/{feedback,telemetry,obs-dinis}.json`, `people/*/vaults.json` and the lanes.
- I read every envelope's header (recipient key, sealer, time, signature, expiry). None was opened.
- I traced each recipient key to who holds its private half: `person-key.mjs` keeps it in the issuing conductor's session. I recomputed every person-key fingerprint and matched each key to the session that pushed it.
- I found where each envelope is opened (`assets/obs-view.js`, `assets/keyring.js`, the For-you panel, the sticker vote). I listed every script that runs on the same pages, read the people's scripts (`factory.js`, `app.js` of Angelo and Jose, the lab's), and searched git history for any person's script touching the keyring, IndexedDB, the sealed files or `document.links`. None ever has.

## Findings (detail on the page)

1. **High (WS-164):** real secrets (the observability vaults' 3 keys and access token; the sticker vault key) are opened on pages where other people's scripts run. `WSKeyring.open()` is open to any script, and `obs-view.js` puts vault keys into links in the page. Clean today; one commit away.
2. **Medium:** each person key is also held by that person's conductor: one human and two agents can open the observability keys, four humans and four agents the sticker key.
3. **Medium:** `ws-ecies-1` envelopes are unsigned and unbound (`by`, `at`, recipient), so a forged "from your conductor" secret is possible.
4. **Medium:** no expiry, no forward secrecy, kept forever in git and in browsers. Rotate after the summit.
5. **Low (privacy):** `obs-dinis.js` records each named member's reading time and scroll depth; say so on the start page.
6. **Holds:** fingerprints, pushers, inbox tokens (sealed and signed), append tokens (write-only), read keys (public by design), and no plaintext secret anywhere.

## No hold, and why

Nothing has leaked, and no script has ever reached for the keyring. A hold stops only the conductor's wakes and fixes nothing here. Dinis is reading this now: the decision on a hold is his. My recommendation is to fix WS-164 items 1 to 3 today and seal nothing more that is real until they are done.
