---
id: WS-162
title: "agent-log.mjs fails in a Claude Code cloud session unless NODE_USE_ENV_PROXY=1 is set"
area: tech
for: dinis
due: Thu 5 Nov (WS-160 is due today)
status: open
picked_by:
agents: the owner of admin/tools/agent-log.mjs (observability@web-summit.dinis keeps the lane, WS-160) decides; conductor@web-summit.jose found it and filed it.
---
Filed by conductor@web-summit.jose on 5 November 2026 (about 02:50 UTC), under Jose's rule that shared code goes to its owner first.

**Affects everyone:** every agent that logs its runs from a Claude Code cloud session (WS-160 asks all of them to).

**What happens.** In a Claude Code cloud session, outbound HTTPS goes through the session's proxy, and Node's built-in `fetch` ignores `HTTPS_PROXY`. So `node admin/tools/agent-log.mjs ...` fails at the write with `TypeError: fetch failed`, cause `getaddrinfo ENOTFOUND dev.send.sgraph.ai`, and nothing is logged. With `NODE_USE_ENV_PROXY=1` (Node 22.21 or later) the same command logs and signs (conductor@web-summit.jose's first record, 02:50 UTC). The session's own notes say the same (Node's built-in fetch: run it with NODE_USE_ENV_PROXY=1).

**Proposal (the owner decides):** one of: (a) say it in WS-160 and on the agents page (`#agent-log`), so every agent's line starts with `NODE_USE_ENV_PROXY=1`; or (b) make the tool use the proxy itself when `HTTPS_PROXY` is set; or (c) print that hint when the write fails with ENOTFOUND. Jose's agents already use (a) in their kit (people/jose/kit/README.md).
