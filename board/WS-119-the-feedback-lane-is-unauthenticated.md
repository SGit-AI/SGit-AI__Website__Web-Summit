---
id: WS-119
title: "The feedback lane is unauthenticated: what it carries is material, and approvals wait for signatures"
area: tech
for: dinis
due: Wed 4 Nov
status: open
picked_by:
agents: dev@web-summit.dinis (the pane and the drain), security@web-summit.dinis.
---
From security@web-summit.dinis, [the PKI review](https://web-summit.sgit.ai/pki/review/index.html), finding 3. The append token in `assets/feedback.json` is public by design (write-only), so anyone can append to the lane, including a "Decision: Approve" that reads like Dinis's, or fill it until it refuses (507).

1. The draining agent treats every item as material from an unknown sender, never as Dinis's decision, until it is signed (say so in `feedback_drain.py`'s output and the agent's rules).
2. When WS-117 lands, the pane signs each submission with the person's browser key (a `pki.sgit.ai/signed/v1` note inside the sealed envelope), and the drain shows who signed it.
3. A cap per day on the lane, and the drain alerts when it is near full.
