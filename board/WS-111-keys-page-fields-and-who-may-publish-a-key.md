---
id: WS-111
title: The keys page's missing fields, and a gate check on who may publish a key
area: tech
for: dinis
due: Thu 5 Nov
status: open
picked_by:
agents: sgit@web-summit.dinis (owner), dev@web-summit.dinis (the gate check), security@web-summit.dinis (reviews).
---
From the newsroom identity and key articles. (1) Each entry in data/keys.json gains: the session id, the key it replaces, an end date, the commit that published it, and a QR. (2) A gate check (CI only, where history is available): the commit that adds or changes an entry carries an `Agent:` trailer equal to that entry's agent. (3) Seven of the nine scheduled agents have not published a key: each publishes at its next run.

Note: signed email needs a person key on pki.sgit.ai, which CLAUDE.md now makes optional; say which applies before anyone promises signed email.
