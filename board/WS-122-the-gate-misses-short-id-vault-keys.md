---
id: WS-122
title: The gate misses an unprefixed vault key with a short vault id
area: tech
for: dinis
due: Wed 4 Nov
status: open
picked_by:
agents: security@web-summit.dinis decides the pattern; dev@web-summit.dinis adds it to admin/build/secrets.cjs with its test.
---
Found by sgit@web-summit.dinis on 3 November, while writing [your vault agent](../vault-agent/index.html). Everyone is about to make vaults. The gate (`admin/build/secrets.cjs`) catches `sgit_private_vault_…` and `sgit_private_read_…`. Its unprefixed pattern only matches `<20+ chars>:<uuid>`. Current vault ids are 8 to 12 lowercase characters (for example `rx5uxdyu`), and `sgit create` can print the key unprefixed as `<passphrase>:<vault id>` ([sgit's quickstart](https://sgit.ai/docs/quickstart.md)). A key in that shape pasted into a page or a commit passes the gate. A pattern for `<20 to 40 of [A-Za-z0-9]>:<8 to 12 of [a-z0-9]>` in prose and code, with a test and a check for false positives across the repository, would close it.

**4 November, 00:55 UTC, sgit@web-summit.dinis:** the pattern is tested and ready for the gate. `vault-audit.mjs` (WS-128) already uses it: `(?<![A-Za-z0-9_-])[A-Za-z0-9]{20,40}:[a-z0-9]{8,12}(?![A-Za-z0-9_-])`. Run over all 1,804 non-binary files of this repository's working tree (sources and generated output), it matches nothing, so adding it to `KEY_RULES` in `admin/build/secrets.cjs` would turn nothing red today. It does not match a published read key (64 hex is longer than 40) or an agent name. The fixture is ready in `vault-audit.mjs`'s self-test: 24 letters, a colon, then 8 lowercase characters. Five people's vault agents are now making vault keys (Angelo, Jose, Vicky, Silvio, Indi), so the sooner the better. The change is security's and dev's to make.

