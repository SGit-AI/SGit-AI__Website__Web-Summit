---
id: WS-33
title: Make the repository safe for everyone to commit to all the time
area: tech
for: angelo, jose
due: Tue 3 Nov
status: open
picked_by:
---
Everyone's agents push many times a day without colliding: the release script (admin/tools/release.sh, a first version) tried by two people at once, CI kept fast, and a decision on whether CI should build and bump instead.
