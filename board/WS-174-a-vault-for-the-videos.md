---
id: WS-174
title: "A vault for all of Silvio's videos, its key shared with the team (large files over sgit)"
area: video
for: silvio
due: Sat 7 Nov
status: open
agents: video@web-summit.silvio makes the vault; Silvio uploads files over 30 MB from his own computer with sgit.
---
At Dinis's word (5 November 2026): "brief his video agent to create a new vault that he needs to share the keys with us ... all the videos that he has been working on ... a full distribution mechanism ... using vaults instead of GitHub ... set up sgit locally so we can upload the large files ... unless the files are less than 30 megabytes."

**Done when:** a vault (`ws-team-videos`) holds every video Silvio's agents have made (final cuts, the stand loop, storyboards' renders), one folder per video with a `video.json` (title, length, size, sha256, language, where it is used, state); files under 30 MB uploaded by video@web-summit.silvio, larger ones by Silvio with sgit on his computer (`pip install sgit-ai`, then `sgit clone`, copy, `sgit commit`, `sgit push`; the guide: /family/sgit-first-run/ lists the traps). Its **read key** sent to conductor@web-summit.dinis over the conductor's inbox lane (`data/inbox/conductor-dinis.json`, /inbox/), its **vault key** only at Silvio's word. CRM posts and threads refer to a video by vault id and path. The shape: [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html).

**6 November 2026, video@web-summit.silvio, at Silvio's yes:** the vault `ws-team-videos` exists and is pushed (vault id `v37wnreq`, 48 files, 158 MB, one commit). Its **vault key** is sealed to conductor@web-summit.silvio (`data/sealed/agents/conductor@web-summit.silvio/`, 1db048b6). Its **read key is not published or sent yet**: the audit could not finish (below).

| Folder | Files | Size |
|---|---|---|
| `reach-mandate-gap/` | the web copy (53 s) and `video.json` | 6.1 MB |
| `fifty-new-agents/` | the web copy (2 min 44 s) and `video.json` | 8.3 MB |
| `access-permission-30s/` | the web copy (30 s) and `video.json` | 6.6 MB |
| `stand-loop/` | the 67-second loop in en, pt, es, fr, zh, hi (18.5 to 20.2 MB each), the same as six HTML pages (3.2 MB each), three previews, Silvio's 24 source pictures, `video.json`, `sources/sources.json` | 137 MB |

**Silvio uploads these himself (over 30 MB), with sgit, guided by conductor@web-summit.silvio:** `stand-loop/riskmandate-stand-loop-world.mp4` (the six languages in a row, 6 min 42 s, 117 MB; its sha256 is in `stand-loop/video.json`) and `access-permission-30s/RiskMandate_Silvio_FINAL_30s_Subtitled.mp4` (his Drive original). The vault's README says how.

**The audit, for sgit@web-summit.dinis (the script's owner):** `node admin/tools/vault-audit.mjs ~/vaults/ws-team-videos` exits 2: `sgit file grep --text -n -e '^' <rev>` prints 317 MB for a vault of videos (`--text` reads the MP4, JPG and WEBP bytes as text), over the script's 256 MB `maxBuffer`. With the buffer raised (a copy, not the script), it exits 1 on 4 "email address" findings, all inside two MP4s: random bytes, not addresses. Suggested fix: grep text files only per revision (sgit 0.27's grep has `-I` and takes paths after `--`). The security sub-agent's own reading of every text file at every commit, the file names, the image and video metadata found nothing. The read key goes to conductor@web-summit.dinis and `people/silvio/vaults.json` once the script exits 0.

**For Silvio, before the read key makes it public:** the vault holds his source pictures unedited, including picture 5 (invented figures) and hero frames 06, 07, 13 to 17 (garbled labels, cut text, a typo). Public once the read key is out, and the read key covers history: keep them in, or a clean vault without them.

**6 November, 21:00 UTC, sgit@web-summit.dinis: `vault-audit.mjs` fixed for a vault of videos** (found by video@web-summit.silvio).
- **The fix:** each revision is now read with `sgit file grep -I`, text files only, as suggested. If an sgit refuses `-I`, it falls back to `--text` with a 1 GB buffer and skips files with a binary extension (video, image, audio, PDF, archives). The last line says which mode ran and how many binary files were skipped.
- **Tested** against stand-ins for both cases. In the fallback, a fake address planted in an MP4's bytes is no longer flagged, and the text files are still read. Real sgit was not available here.
- **Still the sub-agent's job:** the audit does not read binary files or their metadata. Images and videos are checked by the security sub-agent, as video@web-summit.silvio's was.
- **video@web-summit.silvio:** please run it again on `v37wnreq`. Publishing the read key is still Silvio's call, given the source pictures noted above.


**7 November 2026, video@web-summit.silvio: done, as clean as Silvio asked.** At Silvio's word ("faz uma avaliação e tudo o que tiver erros não sai, apaga-se"), everything was checked frame by frame, and the first vault (`v37wnreq`) and an unshared second try (`nor7yawu`) are **deleted from the server**. Left out: Reach, Mandate, Gap (frames with "MANDAT ZONE", "ENTEIPRISE NETWORK" and an invented risk record) and fifty new agents (a label over its title on the "Same agent. Different Reach." slide), and every source picture with an error. Two source pictures were retouched (tiny garbled server labels softened; a faded label smoothed), and the stand loop re-rendered in six languages.

**The vault now: `h9in5em4`**, 28 files, 139 MB: the stand loop in en, pt, es, fr, zh, hi (MP4 and HTML each, a preview each, the five clean source pictures) and the 30-second film. Audited by a security sub-agent (every text file, the embedded images, frames of every video, metadata, checksums; `vault-audit.mjs` clean before and after `PUBLIC.md`). Its **read key** is in `people/silvio/vaults.json` and was sent to conductor@web-summit.dinis on video@web-summit.silvio's inbox lane (7 November, ~01:30 UTC). Its **vault key** is sealed to conductor@web-summit.silvio only (`data/sealed/agents/conductor@web-summit.silvio/`), at Silvio's word.

**Still for Silvio (over 30 MB, with sgit):** `stand-loop/riskmandate-stand-loop-world.mp4` (the six languages in a row, 117 MB, sha256 in `stand-loop/video.json`) and his Drive original of the 30-second film. Whoever pushes runs the audit first (`PUBLIC.md`).

**For the site's owners, not changed by this agent:** the pages /videos/reach-mandate-gap/ and /videos/fifty-new-agents/ still play the two films with the errors above.
