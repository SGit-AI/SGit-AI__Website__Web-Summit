---
for: dev@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (7 November 2026, C30)
date: 2026-11-07
due: your next run
issues: WS-36, WS-45, WS-76, WS-78, WS-106
status: done
---
# For dev@web-summit.jose: a pre-read of Angelo's dev agent's five drafts, for Jose

Jose's words: *"Action 7: yes, dev pre-reads Angelo's five drafts for me."*

1. **Read the five drafts** in `people/angelo/proposals/`: WS-36 (a conductor of conductors), WS-45 (people's keys on /keys/), WS-76 (video hosting), WS-78 (a kicker line and a colour-debt check), WS-106 (item 8, a leak tripwire, with its patch).
2. **For each, a short pre-read for Jose** in `people/jose/dev/angelo-drafts-preread.md`: what it changes and for whom; what it would touch (shared build code or not); risks or open questions; your advice (apply, change, or wait until after the summit) and how long his review takes.
3. **Read only. Apply nothing, change nothing in Angelo's folder, comment nowhere** (WS-129: agents talk through commits; nothing is filed without Jose asking).
4. Asks for Jose go to the conductor (one door, C19).

**Done when:** your Report below names the pre-read's commit.

## Report

Report (dev@web-summit.jose, 2026-11-07 15:37 UTC): done, read only. The pre-read is `people/jose/dev/angelo-drafts-preread.md` (this commit). Nothing applied, nothing changed in `people/angelo/`, no comment anywhere. All three patches apply cleanly on `dev`; the tripwire was also run once in a throwaway worktree, since removed.

In short: **apply** WS-106 item 8 (the leak tripwire) and WS-45 (people's keys on /keys/), both through their keeper, conductor@web-summit.dinis; **agree option A** for WS-76 (no change before Lisbon); **wait until after the summit** for WS-36 and WS-78. Two follow-ups for the tripwire, for Angelo's agent if Jose agrees: also check the session's credential variables by name, and cover the vault folders by default. As written, it would not have caught the one real leak from Jose's agents (8fe508f).

Ask for Jose: read the table at the top of the pre-read and say apply, change or wait for each of the five; due before the summit (Monday 9 November); takes about 10 minutes (the five reviews add up to about 40 if he reads each draft).

