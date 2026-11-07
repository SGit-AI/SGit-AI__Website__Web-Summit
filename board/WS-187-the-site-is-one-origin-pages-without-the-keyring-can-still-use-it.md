---
id: WS-187
title: "The site is one origin: a page without the keyring can still use it"
area: tech
for: dinis
due: Sat 7 Nov, before anything else is sealed to a person key
status: open
picked_by:
agents: dev@web-summit.dinis (the gate), conductor@web-summit.dinis (keyring, CRM), sgit@web-summit.dinis, security@web-summit.dinis (review).
---
From security@web-summit.dinis, review of 6 November 23:50 (`team/security/reviews/2026-11-06-2350.md`, finding 1). **Proven locally with a throwaway key; no real key or secret used.** WS-164 item 1 keeps `keyring.js` off pages that run a person's script. That is not a boundary, because the browser treats the whole site as one origin. On `/people/indi/factory/`, which loads no keyring, a script:

1. opened the site's IndexedDB (`ws-keyring`), took the stored keys and **signed** with them (non-extractable keys are usable, just not copyable), and
2. framed the home page (`/`, same origin) and used **its** `WSKeyring` to sign.

The only remaining guard is gate check 22's word search over people's `.js` files. It misses the iframe route outright (a probe passes the gate) and any spelling that splits the words (`'ws-' + 'keyring'`). Today all 20 of people's browser scripts are clean (checked). At stake: the observability vaults' keys and access token (4 people) and the private CRM's key (6 people), each opened by a person's key on this origin.

**Interim, small (dev):** people's browser scripts are served only if their sha256 is on a list the gate holds, and only security adds a hash after reading the file. Any change to a person's `.js` then fails the gate until reviewed. This turns "any agent commit" into "a reviewed commit".

**Real fix (WS-117):** the keyring, and every page that opens a sealed secret (the For-you panel's unlocked items, `/crm/`, `/observability/`, the sticker vault), on an origin of their own (for example `keys.web-summit.sgit.ai`, a second Pages repository), with no person's script and a strict CSP.

**Until one of the two is in place:** seal nothing more to a person key. Rotate nothing yet: no sign that any key was used.

**7 November 11:50** (security@web-summit.dinis): still open; no person's script reaches for the keyring today. New on the same theme: `assets/cc/brain-libs.js` (`14f3f051`, dashboard@web-summit.silvio) is a **1.6 MB custom minified bundle** (3d-force-graph 1.80.1 and three 0.186.1, by its commit) in the *shared* `assets/cc/`, loaded on Silvio's command centre, which has the keyring. I scanned it: no storage, keyring, cookie, beacon, socket, postMessage or frame access; its `fetch` calls are three.js loaders, its `new Function` is ngraph's layout code generator, and its long strings are colour tables. It looks like what it says. But a custom bundle cannot be checked against an upstream hash, and nobody can read 1.6 MB of minified code. The interim rule (hash-pinned, security-reviewed scripts) should cover `assets/` bundles as well. Prefer the libraries' own published builds, vendored unmodified with their sha256s, as `assets/vendor/sg-vault/` does.
