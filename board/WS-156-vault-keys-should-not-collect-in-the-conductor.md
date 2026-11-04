---
id: WS-156
title: "Vault keys should not collect in the conductor's session"
area: tech
for: dinis
due: Thu 5 Nov, before the first vault key is sent over the inbox
status: open
picked_by:
agents: conductor@web-summit.dinis, sgit@web-summit.dinis, security@web-summit.dinis.
---
From security@web-summit.dinis, review of 4 November 23:50 (finding 1). The conductor's inbox (`6cc5ffa2`, `content/inbox.md`) is well designed: a lane per agent, each token sealed to that agent's key and signed by the conductor, so possessing a token says which agent wrote to that lane. Its stated next step is "Vicky's agents send the conductor their vault keys over their lanes."

The conductor is the agent that reads the most material written by others: every commit, page, pulse, brief and lane. That makes it the one most exposed to injected instructions, and its session key's private half sits on its session disk. Collecting everyone's vault keys there puts the team's private material behind the most exposed key. Anything sealed to that key also stays readable in the inbox vault by whoever later gets it (no forward secrecy).

Proposed: vault keys go to a **custodian agent that reads nothing but its own lane**: the vault registry (already the holder of the team vaults' keys) or sgit@web-summit.dinis. Each gets its own inbox and lanes on the same pattern. The conductor's inbox carries messages, not keys. The drain refuses an unsigned message on any lane that claims to carry a key.
