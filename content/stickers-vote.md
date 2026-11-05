---
title: "Pick the sticker: the team vote"
summary: Twenty-three funny laptop stickers for Web Summit Lisbon in three sets, a ranked top 10 each, team only. The images live in an encrypted vault rendered on this page from its published read key; each ballot is signed by the person's site key, sealed, and written to their own append lane. Closes Thursday 5 November, 18:00 UTC.
path: stickers/vote/index.html
script: stickers-vote
---
**Twenty-three stickers in three sets, your top 10, team only.** Tap the stickers you would put on your own laptop in Lisbon: they go into **My top 10** (on the right, or at the bottom of a phone). Put them in order by dragging the handle or with the arrows, press 👎 on any that are not for you, and **Submit**. The 1st gets 10 points, the 10th gets 1 (Dinis, 5 November: "can you allow 10 votes?"). A ballot sent earlier as a top 6 still counts, by position with the same rule. You can submit again until the vote closes: your newest ballot counts. **The road trip** (1 to 12) is the [funny set](../chatgpt/index.html) from [the creative brief](../creative/index.html), each in four variations: flip them with the dots or arrows, and press ♡ on the one you like best (it goes with your ballot). **Creative takes** (13 to 18) are new views on the originals; 13 is still on its way. **The gap** (19 to 24) is about the RiskMandate gap between what an agent can reach and what it is allowed to do.

```sticker-vote
```

## How it works {#how}

This page and the vault work together. The page holds the vault's **read key**, published on purpose, and uses it twice: to render the vault ([ws-stickers-vote](https://dev.vault.sgraph.ai/), opened in the frame above at full resolution, with a lightbox and the count) and to list the vote lanes, so it can show **who has voted** without opening a single vote.

1. **One lane per team person.** Everyone on the team with a site key ([data/person-keys.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/person-keys.json)) has an append lane on the vault. Its token is sealed to that person's key in [data/stickers-vote.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/stickers-vote.json), so only their browser can open it.
2. **Your ballot is yours.** Your browser opens your token, signs `{type, person, ranking, not_for_me, at}` (your top 10 in order, and the ones not for you) with your site key, seals it to the vault's drain key (sgit's hybrid envelope: AES-256-GCM, the key wrapped with RSA-OAEP-4096) and writes it to your lane. The lane server sees ciphertext only.
3. **Angelo, Jose, Indi or Dinis drain.** They hold the vault key (sealed to them on this site; this page opens it for them, in memory, under "Open the vault (full access)") and press **Drain** inside the vault: each ballot is opened, its signature checked against your published key and checked to have come on your own lane, counted, and kept sealed in the vault.
4. **The leaderboard is shown here and in the vault.** The page reads `results.json` from the vault with the same read key: each sticker's Borda points, how many people put it in their top 10, how many said not for me, and who has voted, never who ranked what.

**What the published read key also allows**, accepted for a short team vote: anyone who reads this page can list the lanes and fetch the sealed votes (unreadable without the drain key), and could mark a waiting ballot as processed before a drain, which would lose it. A forged ballot is rejected, because it needs your signing key. If yours does not show as counted after a drain, submit again.

**No key in this browser?** The vote is for the team only. Add the key your conductor gave you ([how](../../agents/index.html#person-key)), then come back.

Built by conductor@web-summit.dinis on 5 November 2026, at Dinis's word (WS-159). The tool: `admin/tools/stickers_vote.py` (images, lanes, drain).
