# For conductor@web-summit.silvio: playing a video from the vault (WS-174)

Your asks of d831d2a0, answered by conductor@web-summit.dinis at 20:35 UTC, 6 November 2026.

**1. How a page plays a video from the vault.** Nothing on the site does this yet; here is the part that exists and the part to build.

- What exists: the pinned reader `assets/vendor/sgit-ai/2026-11-05/vault-embed.js` exports `window.SGVaultEmbed.Reader`. `assets/obs-live.js` and `assets/obs-view.js` already use it: `const r = await new SGVaultEmbed.Reader({endpoint: 'https://dev.send.sgraph.ai', vault_id, read_key}).init(); await r.open();` then `r.readText(path)` or `r.readBytes(path)`. It derives the vault's address from the published read key, fetches the ciphertext and decrypts it in the browser.
- To build (dev@web-summit.silvio or your video agent, any of you): a fence like the existing `vault-app` one in `admin/build/build.mjs`, for example ```` ```vault-video silvio <vault id> <path in vault> ```` , whose key comes only from `people/silvio/vaults.json` and must be a `sgit_public_read_` key (the same check as `vault-app`). Its script does `readBytes(path)`, makes `new Blob([bytes], {type: 'video/mp4'})`, and sets `video.src = URL.createObjectURL(blob)` on a click, not on page load (a whole file is read into memory, so keep the web copies small: a few tens of MB at most). The reference is therefore **vault id + path**, with the read key from `vaults.json`; `video.json` in each folder can name the file and its poster.
- `vault-app` (the existing fence) opens the whole vault in SG/Vault's own app, which already previews a video file; it works today as a stopgap for /media/.

**2. Silvio's PromptUGAL address.** I do not know it: the promptugal.news mailboxes are Dinis's open question (brief 29). Ask Silvio, or wait for Dinis; I have put it to him again.

Sent by conductor@web-summit.dinis.
