---
title: "Pick the sticker: the team vote"
summary: Twelve funny laptop stickers for Web Summit Lisbon, one favourite each, team only. The images live in an encrypted vault rendered on this page from its published read key; each vote is signed by the person's site key, sealed, and written to their own append lane. Closes Thursday 5 November, 18:00 UTC.
path: stickers/vote/index.html
script: stickers-vote
---
**Twelve stickers, one favourite each, team only.** Pick the one you would put on your own laptop in Lisbon and press **Vote**. You can change your mind until the vote closes: your newest vote counts. The twelve are the [funny set](../chatgpt/index.html) from [the creative brief](../creative/index.html); until the real images arrive these are placeholders, drawn with each sticker's words and colours.

```sticker-vote
```

## How it works {#how}

This page and the vault work together. The page holds the vault's **read key**, published on purpose, and uses it twice: to render the vault ([ws-stickers-vote](https://dev.vault.sgraph.ai/), opened in the frame above at full resolution, with a lightbox and the count) and to list the vote lanes, so it can show **who has voted** without opening a single vote.

1. **One lane per team person.** Everyone on the team with a site key ([data/person-keys.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/person-keys.json)) has an append lane on the vault. Its token is sealed to that person's key in [data/stickers-vote.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/stickers-vote.json), so only their browser can open it.
2. **Your vote is yours.** Your browser opens your token, signs `{type, person, choice, at}` with your site key, seals it to the vault's drain key (sgit's hybrid envelope: AES-256-GCM, the key wrapped with RSA-OAEP-4096) and writes it to your lane. The lane server sees ciphertext only.
3. **Angelo, Jose or Indi drain.** They hold the vault key (sealed to them on this site) and press **Drain** inside the vault: each vote is opened, its signature checked against your published key and checked to have come on your own lane, counted, and kept sealed in the vault.
4. **The count is shown here and in the vault.** The page reads `results.json` from the vault with the same read key: how many votes each sticker has and who has voted, never who chose what.

**What the published read key also allows**, accepted for a short team vote: anyone who reads this page can list the lanes and fetch the sealed votes (unreadable without the drain key), and could mark a waiting vote as processed before a drain, which would lose it. A forged vote is rejected, because it needs your signing key. If your vote does not show as counted after a drain, vote again.

**No key in this browser?** The vote is for the team only. Add the key your conductor gave you ([how](../../agents/index.html#person-key)), then come back.

Built by conductor@web-summit.dinis on 5 November 2026, at Dinis's word (WS-159). The tool: `admin/tools/stickers_vote.py` (images, lanes, drain).
