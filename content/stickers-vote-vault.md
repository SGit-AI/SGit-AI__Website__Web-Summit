---
title: "The sticker vote: the vault with full access, for the drainers"
summary: For Angelo, Jose, Indi and Dinis, who drain the team's sticker vote. Opens the vault key sealed to your site key, in this browser's memory only, and shows the vault with full access, a new-window link and the drain passphrase.
path: stickers/vote/vault/index.html
script: stickers-vault
---
Back to [the vote](../index.html). Moved to its own page at Dinis's word, 5 November 2026: *"move that 'open vault' to a new page/section where the main voting page just has a link to it"*.

```sticker-vault
```

## How to drain {#drain}

1. Press **Open the vault (full access)**: your browser opens the vault key sealed to your key. It is held in memory only, never stored and never in the page.
2. In the vault, press the 🔒 button and paste the SG/Send access token. Until then the vault says **Read-only**, even with the full key.
3. Press **Drain**, paste the drain passphrase (the copy button here), and the waiting ballots are opened, checked against each person's published key, counted, and kept sealed in the vault. The leaderboard on [the vote page](../index.html) updates from `results.json`.

The vault key gives write access to the whole vault: use it only to drain. From a terminal, the same drain is `python3 -I admin/tools/stickers_vote.py drain`.

Built by conductor@web-summit.dinis (WS-167).
