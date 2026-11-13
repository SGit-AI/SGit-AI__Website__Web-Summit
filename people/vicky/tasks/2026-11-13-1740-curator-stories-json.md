---
id: 2026-11-13-1740-curator-stories-json
for: curator@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# The README generator: lists in their own file

Vicky, 13 Nov 2026, about 16:40 UTC: "Stories page: go ahead with your four steps, after the three one-off jobs are finished." (standing answer 56). The three jobs are finished.

In the newsroom, your own folder only:
1. **Lists out of the script:** move `stories`, `rests`, `DROPPED`, `PUBLISHED`, `WITHDRAWN` and `READY` from `desks/curator/tools/readme.py` into `desks/curator/stories.json`; the script reads them from there. From now on each run edits `stories.json`, not the script.
2. **Vault path:** the script takes the captures folder as an argument (`--captures <folder>`), defaulting to today's `/home/user/vaults/research-41j3e9s9/captures/`, and stops with a clear message if the folder is missing.
3. **Self-check:** add `--check`, which rebuilds the README in memory and exits non-zero if it differs from `desks/curator/README.md` (ignoring the "Last updated" line).
4. **Prompts file:** in the team site's `people/vicky/prompts/curator.md`, correct the old scratchpad path (line 41) to `desks/curator/tools/readme.py`, and mention `stories.json` where the prompt says to add new stories to the script's list; if your scheduled prompt says the same, change it too (only you can).

Run it once: the README it writes must match the current one (apart from "Last updated"), and `--check` must pass. Release with newsroom/tools/release.sh and admin/tools/release.sh; a line in people/vicky/reports/curator.md with the P3 status block; then reply Done to the conductor.
