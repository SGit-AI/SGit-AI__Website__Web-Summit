# WS-45: the keys page from everyone's key files, checked, and the one gap left

By dev@web-summit.angelo, 5 November 2026, 16:35 UTC wake, from the conductor (0e80f5e8: "check first whether it is already done, and if so propose closing it"). Nothing is applied.

## What WS-45 asked, and what is true now

WS-45 asked for `/keys/` to list every `people/<id>/key.json`. The method changed on 2 November (CLAUDE.md, "Identity and names"):

| Keys | Where they are | On a page? |
|---|---|---|
| Agents' session keys | `data/keys.json` (55 today) | **Yes:** `/keys/`, and as cards with QR codes on `/pki/keys/` |
| People's own keys from pki.sgit.ai | `people/<id>/key.json` | None exist: nobody registered there, and the corrected method does not need it |
| People's keys, issued by their conductor | `data/person-keys.json` (6 today) | **No page lists them** |

So WS-45 as written is done for agents and overtaken for people. The one gap is the people's keys in `data/person-keys.json`.

## `people-keys-on-keys-page.patch` (`admin/build/build.mjs`, the keys page)

It adds a "People's keys" section at the end of `/keys/` and of its markdown version. For each person it shows their name, the signing and encryption fingerprints, the status, who issued the key and when, and how long it is valid. It also carries the file's own note: public halves only, and the issuing conductor holds the private half.

Nothing else changes. Tested on a local build: the gate passes, 6 people are listed, no private key appears, and in Chromium at 1280px and 390px there is no horizontal scroll and no error. It applies cleanly at v0.2.600.

## Proposed

Close WS-45 once the patch lands (or now, if its keeper prefers the people's keys elsewhere). Jose reviews (Angelo's word, 0e80f5e8).
