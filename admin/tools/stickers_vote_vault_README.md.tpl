# ws-stickers-vote: the team's sticker vote (WS-159)

Funny laptop stickers for RiskMandate at Web Summit Lisbon, in three sets (the road trip, 1 to 12, four variations
each; creative takes, 13 to 18; the gap, 19 to 24), and a vote: each person on the Web Summit team
ranks a top 10 (Borda: 1st = 10 points, 10th = 1; `max_ranking` in content.json is the one number to change) and may mark any sticker "not for me". Built by conductor@web-summit.dinis on 5 November 2026, at Dinis Cruz's word, as a showcase of
encrypted vaults and append lanes. Voting closes Thursday 5 November 2026, 18:00 UTC.

- **Vote:** https://web-summit.sgit.ai/stickers/vote/ (team only: your browser needs your site key).
- **This vault, rendered:** opening it runs `index.html`, a full-screen gallery with a lightbox and the count.
- **The tool that builds it:** `admin/tools/stickers_vote.py` in SGit-AI/SGit-AI__Website__Web-Summit.

## What is in it

| Path | What |
|---|---|
| `images/uploads/` | **upload new sticker images here** (PNG, JPEG or a zip); the conductor processes them and empties it |
| `images/full/` | the originals, renamed `<nn>-<slug>` (and `-v1` to `-v4` for variations) |
| `images/web/`, `images/thumbs/` | 1600 px and 480 px WebP, for the lightbox and the grid |
| `content.json` | every sticker in the vote: names, jokes, words, group, files, variants; it drives the app and the page |
| `index.html` | the app (everything inline) |
| `app.json`, `.vault/app.json` | the manifest: read everything, write `votes/` and `results.json`, list, read and mark the lanes |
| `identity/public-bundle.json` | the drain key's public half: RSA-4096 (votes are sealed to it), ECDSA P-256 |
| `identity/private/drain-key.sealed.json` | the drain key's private halves, **wrapped** (PBKDF2-SHA256, AES-256-GCM) |
| `identity/lanes.json` | each lane by the SHA-256 of its token, and whose it is |
| `identity/person-keys.json` | a copy of the site's person keys, to verify each vote's signature |
| `votes/<date>.jsonl` | the drained ballots, one line each, **still sealed** |
| `results.json` | the leaderboard: per sticker, Borda points, how many top 10s (`in_top`), firsts, "not for me"; who voted (not what); replaced, late and rejected ballots |

## How a vote travels

1. Each team person with a site key has one lane. Its token is sealed to their key (ws-ecies-1) in the site's
   `data/stickers-vote.json`, so only their browser opens it.
2. On the vote page their browser opens the token, signs `{type: web-summit.sticker-vote/v2, person, ranking, not_for_me, at}`
   (`ranking`: up to 10 sticker ids in order) with their site key, seals
   `{vote, signed, sig, key}` to this vault's drain key (sgit hybrid v2) and writes it to their lane.
3. A drainer opens this vault with the vault key, writable, and presses **Drain**: each ballot is opened, its
   signature checked against `identity/person-keys.json` and checked to have come on the signer's own lane, kept
   sealed in `votes/`, and counted into `results.json`; the vault is pushed, and only then are the lane files marked
   processed. The newest ballot of each person counts; a v1 ballot (one `choice`, from the first version of the page) counts
   as a ranking of one; every ballot is scored by position with the same rule, so an older top 6 scores 10 to 5. `stickers_vote.py drain` does the same from a terminal.

## Who holds what

- **The read key is published** (Dinis's choice), on the vote page and in `data/stickers-vote.json`: it renders this
  vault and lets the page list who has a vote waiting. So **everything in this vault is public**, which is why the
  drain key is wrapped and the ballots stay sealed: who voted is public, what each person chose is counted, never listed.
- **The vault key** (the master key: write access, configure the lanes) and the **drain passphrase** are sealed to
  Angelo, Jose, Indi and Dinis on the site (`data/sealed/<id>/`), and kept in conductor@web-summit.dinis's session.
- **What the published read key also allows**, and was accepted for a short team vote: it derives the lanes' enum
  key, so anyone can list the lanes (and see the raw tokens: the server names each lane by its token), fetch the
  sealed ballots (unreadable without the drain key) and mark them processed before a drain (which would lose them).
  A forged vote is rejected: it needs the person's signing key.

## Changing it

- **Sticker 13** (the first of the creative takes, "<Title>-1.png") has not arrived; upload it to `images/uploads/`,
  run `stickers_vote.py images`, and give it its name and joke in the tool's catalogue.
- **The real images:** `python3 -I admin/tools/stickers_vote.py images <folder>` (any file names: a sticker number or
  slug in the name places a file, the rest go by order; the mapping is printed).
- **A new team key:** `python3 -I admin/tools/stickers_vote.py lanes` (all anchors in one call; configure replaces the list).
