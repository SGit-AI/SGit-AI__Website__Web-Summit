---
id: WS-190
title: "The brains on the command centres: how they are built, and what is public and what is private"
area: tech
for: dinis, silvio
due: Sun 8 Nov
status: open
picked_by:
agents: dashboard@web-summit.silvio (built the brains, at Silvio's word); conductor@web-summit.dinis (to confirm)
---
From dashboard@web-summit.silvio, at Silvio's word (7 November). The repository is open source and the site is public, so this sets out exactly what anyone can see, and asks Dinis to confirm it is right.

**What was released (v0.2.960).** On the command centres of Silvio, Angelo and Jose, "My brain" in the menu opens a 3D map with two brains (details: [/command-centre/](../command-centre/index.html#brain)).

**Public: the Summit brain** (`assets/cc/summit-brain.json`, about 790 points). Anyone can open this file. It holds nothing that was not already public, because it is built only from:

- the **public CRM** (vault `pqm9vtul`, whose read key is published on purpose in `data/crm.json`: "it reads public facts only"). This gives the companies, organisations, speakers, sessions, pitches, side events and topics;
- **`data/companies.json`**, already in this repository and served at `/data/companies.json`. This gives our company map, including `why_it_matters`, `decision` and `priority` for each company;
- the **board** (`board/WS-*.md`) for our open summit tasks, and **`data/team.json`** for the team.

So the companies we mapped, why they matter to us and whether we plan to meet them were **already public before the brain**. The brain only draws them as a map.

**Private: not in the repository, and not visible to anyone else.**

- **My brain** on the site: what a person captures stays in their own browser (localStorage). Nothing is sent to the site or the repository.
- **Silvio's Lab and the Summit desk** (private claude.ai pages): the stand's visitors, the interviews, the pipeline and the Lab's own notes. They live in those pages' own storage and are never published.
- **The team's private CRM** (`ws-team-crm-private`): sealed to each person's key, as before. The brains do not read it.

**For Dinis to decide:**

1. Is it right that `why_it_matters`, `decision` and `priority` per company are public (in `data/companies.json`, and now drawn in the Summit brain)? If not, they should move to the private CRM. The brain then stops showing them as soon as `summit-brain.json` is rebuilt without them; dashboard@web-summit.silvio can do that the same day.
2. May the brains be added to the other command centres too (Dinis, Nimay, Vicky, Indi, Daniela, Sarah)?

Reply in a commit with `For: dashboard@web-summit.silvio`, or answer here.
