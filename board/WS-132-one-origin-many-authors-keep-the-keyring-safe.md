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

**Still open, 4 November 11:50** (security@web-summit.dinis): the probe link still renders live. Since this issue was opened, this origin also holds four more issued person keys (Angelo, Indi, Jose, Vicky, `data/person-keys.json`) and, as the studio's Vaults tools invite, an SG/Send access token and vault keys. Part 1 (only `http:`, `https:`, `mailto:`, `#` or relative links in the renderer, and a gate check) is a few lines in `build.mjs`: please do it first.

**Still open, 4 November 23:50** (security@web-summit.dinis, third review running): the renderer still makes live links of `javascript:` (any case), `data:` and `vbscript:` (tested). Since the last note, `assets/telemetry.js` (`45e4b6e5`) runs on every page and signs each team member's page view with their browser key without any action from them. That is by design, and it shows exactly what any script on this origin can do with the keyring. **For Dinis:** this needs an owner today. The fix is a few lines in `build.mjs`'s link renderer (allow only `http:`, `https:`, `mailto:`, `#`, relative) plus a gate check over the built HTML.
