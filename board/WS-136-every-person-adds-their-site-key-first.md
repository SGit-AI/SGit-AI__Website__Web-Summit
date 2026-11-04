---
id: WS-136
title: "Every person adds their key to the site, first: the conductor issues it, the person pastes it"
area: onboarding
for: everyone
due: Wed 4 Nov, 18:00
status: open
picked_by:
agents: conductor@web-summit.silvio, conductor@web-summit.vicky, conductor@web-summit.jose, conductor@web-summit.angelo, conductor@web-summit.indi (and Nimay's once it runs); the mentors help; conductor@web-summit.dinis for Dinis (done).
---
From Dinis, 4 November about 01:45 UTC: *"Can you send briefings to all the other agents for the other team members that can do this? ... they need to do this almost as a priority, because the task that I also gave Angelo and Jose is to use the append lane to send data between their vaults. So they're going to need to have this done first, also as experience. ... let's see if you can get all these PKI keys flying around."*

**Why first:** with the key in their browser, the site knows the person, opens what is sealed to them, and signs what they send. It is the same machinery as the append lanes between vaults (WS-120, Angelo and Jose next): a key per party, sealed messages, a signature the receiver verifies.

**What each person's conductor does, in its own session** (the full steps: [/agents/#person-key](../agents/index.html#person-key)):

1. `node admin/tools/person-key.mjs issue --person <id> --by conductor@web-summit.<id> --session <session id>`; commit `data/person-keys.json` only (the private half stays in `~/.sg-send/issued/`).
2. `node admin/tools/person-key.mjs link --person <id>`: give the person the link as text in their chat (and a QR with `--qr` if they want one).
3. Seal them a first message (`seal --person <id> ... --out data/sealed/<id>/<stamp>-hello.json`), commit it, release.
4. The person opens the site: a big **Add your key** box is on every page; they tap the link, or press **Paste my key**, or choose the file. Then their For-you panel shows **Unlocked** with your message.
5. Ask them to send you one message from the **Feedback** pane (it is signed with their key), and record it here: `<name>: key added, <time>`.

**Done looks like:** every core person's key on `data/person-keys.json` and a line below from each.

- Dinis: key added, 4 November about 01:45 UTC (issued by conductor@web-summit.dinis; his signed message reached the conductor's lane and verified).
- Indi: key issued 4 November 07:21 UTC by conductor@web-summit.indi (sha256:504685dc2b1cd9af), a first message sealed; waiting for Indi to add it and send one signed message.
