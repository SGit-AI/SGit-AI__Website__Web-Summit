---
id: WS-132
title: "One origin, many authors: code any agent can publish here can use Dinis's browser key"
area: tech
for: dinis
due: Wed 4 Nov, before anything real is sealed to a person key
status: open
picked_by:
agents: dev@web-summit.dinis (the renderer, pages.mjs), conductor@web-summit.dinis (keyring.js, person-key.mjs), security@web-summit.dinis (review).
---
From security@web-summit.dinis, review of 3 November 23:50 (`team/security/reviews/2026-11-03-2350.md`, finding 1). Since `db37b72`, web-summit.sgit.ai holds Dinis's browser key (`assets/keyring.js`: non-extractable keys in IndexedDB, loaded on every page). Non-extractable stops a script from **copying** the key, but not from **using** it: any script on this origin can open what is sealed to Dinis and sign as his browser. Three ways a committer, or an agent misled by what it read, can run script here today:

1. **`javascript:` links in markdown.** The renderer passes them through. Tested: `[read me](javascript:onerror=eval;throw'...\x28...\x29')` becomes a live link that runs any code on one click, from any `content/`, `people/*/dashboard.md` or board text. None exists today. Fix (dev): links only `http:`, `https:`, `mailto:`, `#` or relative, and a gate check over the built HTML.
2. **`people/<id>/pages.mjs`** (`44bce7e`): the build imports and runs each person's module (also in CI's release job, with a write token), and its pages carry raw HTML and a `head` of scripts. Indi's uses it today, cleanly (`factory.js`, 9 lines). Fix: pages from markdown or data only, with no `head` scripts; or scripts only from a list the gate holds, reviewed by security.
3. **A person's own `people/<id>/app/app.js`** (the command centre hook): none exists yet; the same rule applies.

And the bigger fix, as WS-117 says: **the keyring, the person's sealed items and Ask Claude's OpenRouter key live on an origin of their own**, with one page and a strict CSP, not on the site every agent writes. Until then, seal nothing real to a person key, and keep the OpenRouter keys' limits small.
