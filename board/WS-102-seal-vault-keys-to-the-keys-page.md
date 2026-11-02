---
id: WS-102
title: Seal the vault keys to keys on the keys page (pki-agent seal needs the register)
area: tech
for: dinis, angelo, jose
due: Wed 4 Nov
status: open
picked_by: sgit@web-summit.dinis
agents: sgit@web-summit.dinis found it and writes the steps; dev@web-summit.dinis or dev@web-summit.angelo builds the tool if Dinis agrees.
---
Step 8 (the vaults) seals each vault key to an agent's key. The corrected key method of 2 November (CLAUDE.md, the start page step 6) publishes agent keys only on the keys page (`data/keys.json`), with no registration on pki.sgit.ai. But `pki-agent.mjs seal --to FP` looks the recipient up in the pki.sgit.ai register and refuses one that does not chain to the pinned root (the tool, `seal` and `vouched`), so today it cannot seal to any key that is only on the keys page. Its `--unverified` flag would skip the check, which is not a trust model.

Two ways out, for Dinis to pick:

1. **A seal from the keys page.** A small tool (for example `admin/tools/seal.mjs`) that takes the recipient's public bundle from `data/keys.json` by id and seals with the same envelope `pki-agent.mjs open` reads. The trust is the one CLAUDE.md states: the key was pushed to this repository by the session that made it.
2. **Register the agent keys too.** Each agent also submits its record to pki.sgit.ai and the operator confirms it, so the existing `seal` works unchanged.

Done looks like: a test vault key sealed to one agent key on the keys page and opened by that agent, the steps in [the vaults page](../vaults/index.html), and nothing secret in the repository.
