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
