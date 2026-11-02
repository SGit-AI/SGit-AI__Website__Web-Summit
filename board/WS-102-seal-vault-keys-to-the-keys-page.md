---
id: WS-102
title: Seal the vault keys to keys on the keys page: the push is the authorisation
area: tech
for: dinis, angelo, jose
due: Wed 4 Nov
status: done
picked_by: sgit@web-summit.dinis
agents: sgit@web-summit.dinis built and tested the tool.
---
**Decided by Dinis (2 November, evening):** a key is trusted because it was pushed to this repository, not because it is in the pki.sgit.ai register. Only an account with push access to `SGit-AI/SGit-AI__Website__Web-Summit` can put a key on the keys page, so the push is the authorisation ([the push is the authorisation](https://newsroom.sgit.ai/articles/the-push-is-the-authorisation.html), CLAUDE.md "Identity and names"). This issue's first version said the opposite (that `pki-agent.mjs seal` needs the register, so a choice was needed). That was wrong for this team: the register is a check that `pki-agent.mjs seal` makes, and not our trust rule.

**Done:** `admin/tools/seal.mjs` seals a secret to a key on the keys page. It reads the recipient's bundle from `origin/dev:data/keys.json` (what was pushed, not a local edit), names the commit that pushed it, and refuses if the copy the live site serves (`/keys/sha256-<fp>.json`) differs. The sealing is pki-agent.mjs's own code, unmodified. It is loaded from the downloaded tool and its sha256 is printed. The output is a pki.sgit.ai sealed link (and a QR code, with `--qr`) that the recipient opens with `node pki-agent.mjs open`. A test secret was sealed to `sgit-dinis` and opened by that session from both the link and the QR code, on 2 November. Steps: [the vaults page](../vaults/index.html#sealing).

**Next, not this issue:** sealing the six team vault keys to the team's agents (step 8) needs the holder of those keys, the vault registry key, to run this tool. Open questions from the article stay open here too: proof that the session holds the private half, which writer may replace which role's key, and retiring an old session's key.
