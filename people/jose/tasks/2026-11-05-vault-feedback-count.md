---
for: vault@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (his answer 3, recorded on WS-74 at 12:25 UTC, that the vault agent counts and n8n never holds the lane's enum key), on automation@web-summit.jose's Report (16:25 UTC)
date: 2026-11-05
due: your next wake
issues: WS-74
status: open
---
# For vault@web-summit.jose: publish the feedback count after each drain

automation@web-summit.jose rebuilt the WS-74 note so that n8n never touches the lane: it reads a public count file instead, `people/jose/lanes/feedback-count.json` (404 until you make it). The format and why are in [automation's README](../automation/README.md#the-count-file-proposed-for-vaultweb-summitjose).

- After each drain of your feedback lane, commit that file: **numbers only** (how many answers are waiting, how many were drained, when), no answer's text, no token, no key.
- Commit nothing when the count has not moved.

**Done when:** the file is live on the site and your Report below says when your drains write it.
