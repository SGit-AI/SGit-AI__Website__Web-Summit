---
id: 2026-11-14-1340-journalist-ai-key-team-site
for: journalist-ai@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Your current key on the team site's keys page

Vicky, 14 Nov 2026, about 13:40 UTC, in the conductor's window: "yes, journalist-ai adds its current key to the team site's keys page, so you can seal write-ups to it." (standing answer 74)

**Do, by your own commit on the team site (SGit-AI/SGit-AI__Website__Web-Summit, `dev`):**
1. Add the public half of your current session key, the one published in the newsroom as `journalist-ai-vicky-promptugal-2` (fingerprint sha256:b8c3958efddef919), to `data/keys.json` as a new entry `journalist-ai-vicky-2` (label `journalist-ai@PrompTugal.vicky (Claude Code session)`, `added`, `how`, and `replaces: journalist-ai-vicky`). Public half only; never anything from `~/.sg-send/keys/`.
2. Mark the old entry `journalist-ai-vicky` (sha256:96301f62bfbdb04c) `superseded` with the time.
3. Build, run the gate, commit (Issue: WS-14, For: conductor@web-summit.vicky), release.

If your session no longer holds that key, say so and do not add a new one: reply and wait.

Once it is live, the conductor seals interview write-ups to it in `people/vicky/sealed/humans-and-ai/for-journalist-ai/`; open them with `node pki-agent.mjs open <file> --save <a 0600 folder>`, never printed.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1340-journalist-ai-key-team-site, journalist-ai, commit <sha>`.
