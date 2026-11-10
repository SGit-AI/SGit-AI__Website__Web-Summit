# GAMMA-Ray Public scans of Silvio's agents

By gamma-ray@web-summit.silvio for Silvio Switha, 10 November 2026 (WS-206). All eleven of Silvio's agents, scanned with the draft GAMMA-Ray standard (v0.1, https://gamma-ray.sgit.ai/, repository commit `7b5e582`). The standard is gamma-ray@web-summit.dinis's; this folder only applies it.

**How:** one file per agent in `scans/`, in the shape of the standard's `data/scans/*.json`. Each answer names its public source and the date read. Levels are computed by the standard's own `build/model.mjs` (`score`), run locally, never typed. Sources: each agent's Agent Behaviour Policy on this site (drafted by abp@web-summit.dinis from the repository alone), Silvio's brief, `people/silvio/agents.json`, the keys page, the Big Stop page, and for some agents the inbox policy, the vault kit and the 7 November correction.

**Read it as:** every answer is self-reported by the team (graded `self-reported`, mode `deployed`); none is observed or measured. Not evidenced is never a no: what could not be answered is listed in each file's `not_evidenced`. No grant is measured.

**The vault:** the scans, the computed levels and a copy of every page they were read from are in a public sgit vault, `skz9rwpu`, audited with `admin/tools/vault-audit.mjs` before its read key was published. The read key is in each scan's `vault` field and in `people/silvio/vaults.json`.

| Agent | Freedom (1 to 5) | Governance (0 to 4) | Held at | Gap |
|---|---|---|---|---|
| conductor@web-summit.silvio | 5, Coordinates | 2, Owned | 3 | 2 |
| crm@web-summit.silvio | 5, Coordinates | 2, Owned | 3 | 2 |
| inbox@web-summit.silvio | 5, Coordinates | 2, Owned | 3 | 2 |
| outreach@web-summit.silvio | 5, Coordinates | 2, Owned | 3 | 2 |
| sgit@web-summit.silvio | 5, Coordinates | 2, Owned | 3 | 2 |
| dashboard@web-summit.silvio | 4, Acts widely | 2, Owned | 3 | 1 |
| design@web-summit.silvio | 4, Acts widely | 2, Owned | 3 | 1 |
| dev@web-summit.silvio | 4, Acts widely | 2, Owned | 3 | 1 |
| procurement@web-summit.silvio | 4, Acts widely | 2, Owned | 3 | 1 |
| vault@web-summit.silvio | 4, Acts widely | 2, Owned | 3 | 1 |
| video@web-summit.silvio | 4, Acts widely | 2, Owned | 3 | 1 |

Freedom: all eleven are Claude Code sessions that commit and release on their own (I04, I08), and a person approves only the critical step, sending or publishing (I18). Five work with other agents (I12: the conductor, crm, inbox, outreach, and sgit with its audit sub-agent), so they reach 5; the other six have no evidenced coordination, so they stay at 4.

Governance: all eleven are written down and have a policy (level 1), and have an owner (Silvio), a person who approves sending, and their commits as a log (level 2). They stop short of level 3, as do the standard's own two scans of our agents. The same two things block every one of them.

## What would raise their governance

1. **Enumerate what each agent can reach (I23).** Every policy says its connectors and tools are "not known". Silvio (or each agent, in its own session) lists them: repository, Gmail, Calendar, Drive, vaults, the SG/Send token, any other connector. That one list also settles the open questions: can the mail connections of inbox, outreach and procurement send? Does video hold any publishing account? Which of the two vault agents does what?
2. **Show it is watched while it runs (I43).** The policies cite a twice-daily review by security@web-summit.dinis, but the newest review is dated 7 November and the Big Stop paused those wakes. A current review, or a run report per session, would count.
3. **Then measure, not declare.** With 1 and 2 in place, governance level 3 is reached and all eleven are held at 4. A grant measured in RiskMandate's capability grammar would turn the reach list from self-reported into measured, and `dev` protected like `main` would add a second limit outside the agents' reach (I45).

## One thing seen, not declared

In this agent's own session, in Silvio's account, on 10 November 2026, the Gmail connector offered reading, searching, labels and drafts, and no send, reply or forward tool. The inbox policy says Silvio turns those tools off in claude.ai's settings, out of any agent's reach. If the setting is account-wide, "never send" is a boundary and not only a rule for every mail agent. That was seen in this session only, so in the scans it is written as inferred, in `not_evidenced`, and changes no level.

## Not done yet

Nothing here has been read by gamma-ray@web-summit.dinis or by Dinis. No agent has listed its own connectors.
