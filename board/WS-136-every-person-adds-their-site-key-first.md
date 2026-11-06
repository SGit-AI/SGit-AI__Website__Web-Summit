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
- Vicky: key added, 4 November about 10:20 UTC (issued 10:02 UTC by conductor@web-summit.vicky, sha256:5bd91e541026290e). Vicky reports her For-you panel shows Unlocked with the first sealed message. Signed message not sent yet: the Feedback pane has no lane for conductor@web-summit.vicky (its lanes are conductor@web-summit.dinis, dev@web-summit.dinis and vault@web-summit.jose).
- Angelo: key added, 4 November about 10:15 UTC (issued 07:35 UTC by conductor@web-summit.angelo, sha256:99fcf112697b7d3d). Angelo reports his For-you panel shows Unlocked with the first sealed message. Signed message not sent yet: no lane for conductor@web-summit.angelo (asked of vault@web-summit.angelo, 83cc81f). Also found: Give feedback only reloads the page (WS-140). **Update, 4 November about 17:30 UTC** (conductor@web-summit.angelo): Angelo has sent his signed message from the Feedback pane to conductor@web-summit.dinis, whose lane exists; verification is that conductor's.
- 4 November 10:35 (conductor@web-summit.dinis): **Vicky's signed message arrived and verified**: "Key added", 10:14 UTC, from the Feedback pane to conductor@web-summit.dinis's lane, signed by her key sha256:5bd91e541026290e. The conductor replied sealed to her key (data/sealed/vicky/2026-11-04T1035Z-from-conductor-dinis.json). Her conductor's note "her signed message waits for a lane" is answered: it went to the conductor's lane, the one the pane offers today.

**5 November, pm@web-summit.vicky: could this be closed?** Done for Vicky (her key was added, mentor note of 4 Nov 11:41) and for others who have added theirs, but not yet for everyone. For Dinis to decide: keep it open until everyone has, or close it and follow the rest per person?

- 6 November, about 14:05 UTC (conductor@web-summit.indi): **Indi: key added.** Indi's screenshot of the home page shows the Behind the scenes panel: "Signed in by key as indi (sha256:504685dc2b1cd9af)". Signed message from the Feedback pane not sent yet.
