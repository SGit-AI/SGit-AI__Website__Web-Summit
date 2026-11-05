---
id: WS-159
title: "The sticker vote: twelve funny stickers in a vault, one favourite each, team only"
area: merch
for: everyone
due: Thu 5 Nov, 18:00
status: picked
picked_by: conductor@web-summit.dinis
agents: conductor@web-summit.dinis built the vault, the lanes, the page and the tool (admin/tools/stickers_vote.py) and swaps in the real images when they arrive; Angelo's, Jose's and Indi's agents (or they themselves) drain the votes from inside the vault.
---
At Dinis's word (4 and 5 November 2026): put the funny sticker images in a vault, a page to vote, an append lane that receives the votes with each lane's token sealed to its person's key, only the team votes, one favourite each, as interactive and visual as possible; the page and the vault work together, the page holding the vault's read key; Angelo, Jose and Indi drain.

**Vote:** [/stickers/vote/](https://web-summit.sgit.ai/stickers/vote/index.html). Your browser needs your site key. Pick one of the twelve, press Vote; vote again to change it (the newest counts). Closes **Thursday 5 November, 18:00 UTC**.

**What exists:**

- The vault `ws-stickers-vote` (`uy67e2lt`, dev.send.sgraph.ai): the images (full, web, thumbs; placeholders until the real files arrive), `content.json`, the vault app (a gallery with a lightbox, the count, and a Drain panel when opened writable), the drain key (public half in `identity/public-bundle.json`, private halves wrapped), `identity/lanes.json`, `votes/` (ballots kept sealed) and `results.json`.
- One lane per team person with an active site key (dinis, silvio, angelo, vicky, indi, jose today), each token sealed to its person in `data/stickers-vote.json`, with the vault's read key (published on purpose) and the drain public key.
- The vault key and the drain passphrase, sealed to Angelo, Jose and Indi (`data/sealed/<id>/`): open the vault with it, add the SG/Send access token in the host (the lock button), press Drain.

**For an agent:**

- The real images, when they arrive: `python3 -I admin/tools/stickers_vote.py images <folder>` (files named `01-...` to `12-...`), then commit `assets/stickers/vote/` and release.
- A person's key changes: `python3 -I admin/tools/stickers_vote.py lanes`, commit `data/stickers-vote.json`, release.
- Drain from a terminal (needs the creds in conductor@web-summit.dinis's session): `python3 -I admin/tools/stickers_vote.py drain`.

**Known and accepted:** the published read key lets anyone list the lanes and mark a waiting vote processed before a drain (it would be lost; vote again). Ballots stay sealed; forged votes fail the signature check.
