---
id: WS-159
title: "The sticker vote: 23 funny stickers in three sets in a vault, a ranked top 10 each, team only"
area: merch
for: everyone
due: Thu 5 Nov, 18:00
status: picked
picked_by: conductor@web-summit.dinis
agents: conductor@web-summit.dinis built the vault, the lanes, the page and the tool (admin/tools/stickers_vote.py) and swaps in the real images when they arrive; Angelo, Jose, Indi and Dinis (or their agents) drain the votes from inside the vault.
---
At Dinis's word (4 and 5 November 2026): put the funny sticker images in a vault, a page to vote, an append lane that receives the votes with each lane's token sealed to its person's key, only the team votes, one favourite each, as interactive and visual as possible; the page and the vault work together, the page holding the vault's read key; Angelo, Jose and Indi drain.

**Vote:** [/stickers/vote/](https://web-summit.sgit.ai/stickers/vote/index.html). Your browser needs your site key. Round 2 (Dinis, 5 November: "pick the top 6 ... I can reorder them ... on the right hand side, you show me the top 6, and that's what I click submit"): tap stickers into **My top 6**, reorder them (drag, or the arrows), press 👎 on any that are not for you, Submit. Borda points: 1st = 6, 6th = 1. Submit again to change it (the newest ballot counts). A v1 ballot (one pick, from round 1) counts as a top 6 of one. Closes **Thursday 5 November, 18:00 UTC**.

Round 3 (5 November, Dinis uploaded the art into the vault's `images/uploads/`): the road trip (1 to 12) with four variations each (flip them; a ♡ on your favourite goes with the ballot as `variant_pick`, and the leaderboard shows the favourite), creative takes (14 to 18; 13 is still on its way) and the gap (19 to 24). No placeholders left.

Round 4 (Dinis, 5 November: "can you allow 10 votes?"): a ranked **top 10**, 1st = 10 points ... 10th = 1. Ballots sent earlier (a top 6, or one pick) stay valid and are scored by position with the same rule. `max_ranking` in the vault's content.json is the one number.

**What exists:**

- The vault `ws-stickers-vote` (`uy67e2lt`, dev.send.sgraph.ai): the images (full, web, thumbs; placeholders until the real files arrive), `content.json`, the vault app (a gallery with a lightbox, the count, and a Drain panel when opened writable), the drain key (public half in `identity/public-bundle.json`, private halves wrapped), `identity/lanes.json`, `votes/` (ballots kept sealed) and `results.json`.
- One lane per team person with an active site key (dinis, silvio, angelo, vicky, indi, jose today), each token sealed to its person in `data/stickers-vote.json`, with the vault's read key (published on purpose) and the drain public key.
- The vault key and the drain passphrase, sealed to Angelo, Jose, Indi and Dinis (`data/sealed/<id>/`). On the vote page their browser opens it in memory under **Open the vault (full access)**: the vault in a frame there, or in a new window. Add the SG/Send access token in the host (the lock button), then Drain the votes with the passphrase.

**For an agent:**

- New images: Dinis uploads to the vault's `images/uploads/` (PNG, JPEG or a zip); `python3 -I admin/tools/stickers_vote.py images` processes them and empties the folder. Earlier note on the images (Dinis's Google Drive folder "RiskMandate (agents) / videos / 00 upload here (from your phone)"): download them into a folder and run `python3 -I admin/tools/stickers_vote.py images <folder>`. Any file names: a word of the sticker's name (keys, sardine, surf ...) or a single number 1 to 12 places a file, the rest go by order; it prints the mapping, so check it. Then commit `assets/stickers/vote/` and release.
- A person's key changes: `python3 -I admin/tools/stickers_vote.py lanes`, commit `data/stickers-vote.json`, release.
- Drain from a terminal (needs the creds in conductor@web-summit.dinis's session): `python3 -I admin/tools/stickers_vote.py drain`.

**Known and accepted:** the published read key lets anyone list the lanes and mark a waiting vote processed before a drain (it would be lost; vote again). Ballots stay sealed; forged votes fail the signature check.
