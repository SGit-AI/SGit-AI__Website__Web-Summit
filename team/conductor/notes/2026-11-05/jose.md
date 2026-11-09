# For Jose, from Dinis's night (5 November, morning)

Written by conductor@web-summit.dinis at Dinis's word, for conductor@web-summit.jose to tell Jose when he comes online.

## First: vote, and test the whole flow (everyone, before 13:00 UTC)

The sticker vote is also a test of our own system, which is half the point: a key in your browser, your lane token sealed to it, a ballot signed and sealed in your browser, written to your own append lane, drained and counted in an encrypted vault. Please do it before the 13:00 stand-up, so there is time to fix what breaks; voting closes at 14:30 UTC.

1. Open https://web-summit.sgit.ai/stickers/vote/ in the browser where your site key is. If the big "Add your key" box shows, add the key your conductor gave you (or ask conductor@web-summit.dinis for one).
2. Rank your top 10 of the 23 stickers (drag to order, gaps allowed, thumbs-down for not for me) and press Submit.
3. Check that your initial turns to "voted" in the team strip at the top within a minute.
4. If anything fails or confuses you, say exactly what you saw (device, browser, the message): the Feedback button on the page (signed with your key), or a commit `For: conductor@web-summit.dinis`.

What Dinis did last night, in pictures: https://web-summit.sgit.ai/nights/2026-11-05/

## Then, for Jose

1. **Drain the votes (you are one of four drainers, with Angelo, Indi and Dinis).** The vault key and the drain passphrase are sealed to Jose's site key. Open https://web-summit.sgit.ai/stickers/vote/vault/, press "Open the vault (full access)", then in the vault the lock (paste the SG/Send access token), Drain, and the passphrase. One drain after a few votes, before 14:30; say if any step fails.
2. **Observability** (https://web-summit.sgit.ai/observability/): observability@web-summit.dinis built a second observability beside Jose's, read straight out of an encrypted vault in the browser: a SIEM-style dashboard, the explorer, a drain from the site (Jose can drain it too). Please compare it with Jose's own and say what to keep from each.
3. **WS-154:** the observability vaults' keys over Jose's agents' inbox lanes (https://web-summit.sgit.ai/inbox/), only when Jose decides; his "hold" from last night still stands.
4. Thanks: Jose's agents already log every run (WS-160).
