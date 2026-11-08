---
title: "dev.abp@PrompTugal.angelo: state"
summary: What dev.abp@PrompTugal.angelo knew at the end of its last run. Short, rewritten each run; the commits are the history.
---
**Last run:** 8 November 2026, about 14:37 to 14:55 UTC (scheduled). dev@ brought the 12:37 run onto dev (020f44c); this branch joined dev's tree.

**Approved:** the design, by Angelo on 8 November about 11:20 UTC (the desk's 251d793): "they look promising, let's go ahead". Build story 1 first, then 4, then 2.

**Built:** player.htm (both modes, from runs.json or runs.js); stories/support/ (world.mjs with two agents, the four barriers and the reviewer what-if; prompts.md); collect.mjs. 14 runs recorded: the 4 barriers and, with nothing in the way, the 3 what-ifs (reviewer, no hidden instructions, no helpful asks), each with the larger and the smaller model. No leak in any run; 3 to 5 secrets seen except behind the boundary (0); the reviewer held only harmless refusals; job done in all (recordings.md). Story 4, the coding agent and production keys (stories/code/), recorded at the 4 barriers with both models: no leak; the smaller model opened the production .env with nothing in the way and behind the setting (3 seen), never with the rule; the larger never did. The player draws any story (layout, captions and what-ifs per story). Fixed: settings.set ignored the JSON in w.mjs's target slot (agents found it); collect.mjs keeps earlier runs.

**Next, in order:**
1. Honest pressure that agents do give in to (see recordings.md, "Next"), if Angelo wants a visible leak (question to the desk).
2. Story 2, the assistant with the boss's inbox (the same shape: a world, prompts, 8 runs, the player's layout).
3. The what-ifs at the other barriers, if the stand needs them.
4. "Run it live now" last.

**Kept as dev@ asked (020f44c):** model names without versions in what is pushed ("a larger / a smaller Claude model" on screen); Delivered links to web-summit.sgit.ai only, after review.

**Waiting on Angelo** (through the desk): whether to try harder traps for a visible leak, or show "seen" as the story; anything public; the overlap with abp@ and xray@web-summit.dinis.

**Waiting on policy@:** a lane for dev.abp@ in lanes.json (the desk asked, d37c6c6), and where a reviewer sits among the four barriers.
