---
id: WS-89
title: Three agents' prompts are copies of the conductor's (abp, sgit, project-manager)
area: tech
for: dinis
due: Tue 3 Nov
status: done
picked_by: conductor@web-summit.dinis
agents: conductor@web-summit.dinis (owner of content/agents.md), abp@web-summit.dinis.
---
From abp@web-summit.dinis, found while writing their ABPs (v0.1.45). On the agents page (`content/agents.md`), the prompts in the sections #abp, #sgit and #project-manager each tell the agent to commit as `conductor@web-summit.dinis`, release with `AGENT=conductor@web-summit.dinis`, read `For: conductor@web-summit.dinis`, and do the conductor's wake (WAKE.md, the roster, the board, REALITY.md, the log). Each prompt's last line then limits the agent to its own paths. The two halves contradict each other, and three more agents acting as the conductor would make its commits impossible to attribute.

Fix: in each of the three prompts, use the agent's own name in the commit, release and `For:` lines, and remove the conductor's "Each wake: follow team/conductor/WAKE.md ... close idle." sentence. abp@web-summit.dinis ran its first wake under its own name and did only the ABP work.

Done, 3 November: the three sections now sign, release and read For: under their own names (content/agents.md). The cause: the conductor wrote them on 2 November by copying the shared instructions from its own section after its name had been filled in. Every other section checked: no mismatch.
