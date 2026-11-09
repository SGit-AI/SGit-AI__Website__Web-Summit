# Large files into the videos vault (WS-174)

**Nothing left for Silvio:** every file in the vault is now under 30 MB; the six-languages-in-a-row video was removed on 8 November at Silvio's word (the languages stay separate, with a stand page to choose), and the 30-second film's original is the same size as the copy already in the vault. The steps below stay for the next large file.

The vault `ws-team-videos` (vault id h9in5em4) holds every checked video. Two files are over 30 MB, so they go in from your computer, with sgit. No key is written here: the vault key is with conductor@web-summit.silvio, sealed to it; it gives it to you the safe way (a sealed link or QR, never in a chat), and you keep it in your password manager.

**The two files (both in now)**

| File | Where it goes in the vault | Size | Where you have it |
|---|---|---|---|
| `riskmandate-stand-loop-world.mp4` (the six languages in a row, 6 min 42 s) | `stand-loop-what-is-riskmandate/` | 114 MB | the file video@web-summit.silvio sent you in the chat on 7 November; its sha256 starts `2f3eaa8edd5b4f09` (all of it is in `stand-loop/video.json`) |
| `RiskMandate_Silvio_FINAL_30s_Subtitled.mp4` (your original of the 30-second film) | `your-ai-has-access-does-it-have-permission/` | yours | your Google Drive |

**Once, before:** Python 3.11 or newer, `pip install sgit-ai`, and the SG/Send access token from Dinis set in your terminal as `SG_SEND_ACCESS_TOKEN`. On a Mac read https://web-summit.sgit.ai/family/sgit-first-run/ first (Python version, the token, certificates). Put the vault key in your terminal as `SG_VAULT_KEY_VIDEOS`, from your password manager, so it is never typed into a command you might paste somewhere.

**The four commands** (in a folder of your own, never inside a copy of the website's repository):

```
sgit clone "$SG_VAULT_KEY_VIDEOS" ws-team-videos
cp ~/Downloads/riskmandate-stand-loop-world.mp4 ws-team-videos/stand-loop/ && cp ~/Downloads/RiskMandate_Silvio_FINAL_30s_Subtitled.mp4 ws-team-videos/access-permission-30s/
cd ws-team-videos && sgit commit -m "Silvio: the six-language loop and the 30-second original"
sgit push
```

Change `~/Downloads/` to wherever the files are. Before `sgit push`: check the first file is the right one (`shasum -a 256 (removed: the six-in-a-row video)` starts `2f3eaa8edd5b4f09`), and ask conductor@web-summit.silvio to run the vault's audit (`node admin/tools/vault-audit.mjs`, the rule in the vault's PUBLIC.md): your files are videos, so it is quick. Then tell video@web-summit.silvio, which updates the two `video.json` files (in the vault, "in_vault": true).
