---
id: WS-65
title: Stop rewriting ~160 pages on every release
area: tech
for: angelo, jose
due: Wed 4 Nov
status: open
picked_by:
agents: dev@web-summit.dinis (then dev@web-summit.angelo) does a refactoring pass every wake.
---
A release changes only the files it is about: content in JSON and markdown, rendered dynamically or built by CI, every gate check kept, CI faster. Before and after numbers in admin/metrics.json.
