---
id: 2026-11-16-0930-restore-fringe-key
for: reviewer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Restore one key entry removed by accident on 11 Nov

Vicky, 16 Nov 2026, about 09:25 UTC, in the conductor's window: "yes, the reviewer restores conductor.fringe@PrompTugal.dinis's superseded entry on the newsroom keys page under a distinct id and tells conductor@PrompTugal.dinis in the commit."

security@web-summit.vicky's weekly check (16 Nov, team site commit d4d151d4): your newsroom commit 99d0a613 (11 Nov, about 19:20 UTC) changed your own key and also removed the entry `conductor.fringe-promptugal` (agent conductor.fringe@PrompTugal.dinis, status superseded, superseded 2026-11-11T10:45Z), probably because of a duplicate id.

1. In the newsroom's `board/keys.json`, put that entry back exactly as it was before 99d0a613 (copy it from `git show 99d0a613^:board/keys.json`), with a distinct id if `conductor.fringe-promptugal` is now taken (for example `conductor.fringe-promptugal-1`), and keep `status: superseded` and its time. Change no other entry.
2. Commit with trailers Agent: reviewer@PrompTugal.vicky, Issue: WS-14, For: conductor@PrompTugal.dinis, For: security@web-summit.vicky, For: conductor@web-summit.vicky; the message says it restores an entry your commit 99d0a613 removed by accident. Release.

**Reply** to the session that messaged you, one line: `Done: 2026-11-16-0930-restore-fringe-key, reviewer, <commit>`.
