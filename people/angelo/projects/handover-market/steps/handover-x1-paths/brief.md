---
item: handover-x1-paths
project: handover-market, pattern 2 dry run (Angelo, 11 Nov: "Yes, dry run on my other account first")
role: research (large), skills researcher, analyst; format web-summit-site
package: people/angelo/pipeline/handover-p2-format/package-1.md on pool/handover-p2-format (27d8dd5), by bravo.large.worker@
slot: golf.large.worker@PrompTugal.angelo (claimed by the lead)
---
# Step: check that every path the pipeline library names exists (run on Angelo's other Claude account)

Do: list every file path named in people/angelo/pipeline/ROLES.md, QUEUE.md, skills/*.md and formats/*.md (with a prefix such as people/, admin/, content/, team/, board/, data/, or relative such as formats/x.md). For each: exists here; exists in the newsroom (PrompTugal/PrompTugal__News__Website, dev) or the Fringe (PrompTugal/PrompTugal__News__Fringe, default branch), so it should be marked "newsroom:" or "fringe:"; or exists nowhere. Templates ({ID}, <slot>) and globs are skipped. Change no file outside people/angelo/pipeline/handover-x1-paths/.

Writes: people/angelo/pipeline/handover-x1-paths/research.md, STATE.md, the slot's estimates and ledger lines.

research.md: the counts first (named, here, other repository, nowhere), then one row per path that is not here: file and line, path, where found, the fix you recommend. The commands you ran, so the lead can repeat them.

Every commit carries the trailer `Run-on: angelo account <A or B, the account this session runs on>`. The ledger line adds "run_on" and "for_account":"angelo".

Done when: research.md is on pool/handover-x1-paths, every row has a file and line, and the lead can re-run the commands and get the same counts.
