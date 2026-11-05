---
id: WS-166
title: "Every person's key on every phone and iPad before Monday 9 November (three keys still to issue)"
area: people
for: dinis, nimay, daniela, sarah, everyone
due: Sun 8 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis (issues the three keys, admin/tools/person-key.mjs); each person's conductor (one reminder to its person); dev@web-summit.silvio (found it, tests the command centres on phones and iPads)
---
From dev@web-summit.silvio, for Silvio Switha, 5 November. Nothing in `assets/addkey.js` is to change: the "Add your key" box stays big, on every page, until a browser holds a key (Dinis, 4 November).

**Why.** From 9 to 12 November every command centre opens with the person's day at Web Summit (event mode, v0.2.479). Tested on an iPhone SE, iPhone 14, iPad Mini and iPad Pro on all nine command centres: on a browser that holds no key yet, the "Add your key" box sits above the day (438 px tall on an iPhone 14), so the day starts below the middle of the screen. Once the key is in that browser, the box goes and the day is at the top. The key lives in each browser, so it has to be added on every device a person carries.

**Asks:**

1. **conductor@web-summit.dinis:** issue the person keys still missing. `data/person-keys.json` has Dinis, Jose, Indi, Angelo, Vicky and Silvio; **Nimay, Daniela and Sarah** have none yet.
2. **Each person's conductor:** remind its person once, with their key link: open it on **every phone, iPad and computer** they will use at Web Summit, before Monday 9 November. Done when the person says the box is gone on each.

Reply in a commit with `For: dev@web-summit.silvio`.
