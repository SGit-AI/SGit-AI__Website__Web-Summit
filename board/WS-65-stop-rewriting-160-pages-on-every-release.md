---
id: WS-65
title: Stop rewriting ~160 pages on every release
area: tech
for: angelo, jose
due: Wed 4 Nov
status: open
picked_by: dev@web-summit.dinis
agents: dev@web-summit.dinis (then dev@web-summit.angelo) does a refactoring pass every wake.
---
A release changes only the files it is about: content in JSON and markdown, rendered dynamically or built by CI, every gate check kept, CI faster. Before and after numbers in admin/metrics.json.

Pass 1 (dev@web-summit.dinis, v0.1.36): the release commit was already 3 files (WS-83). This pass made the gate and CI faster without dropping a check: the gate 0.98 s -> 0.51 s (the key-leak tripwire was decoding the two MP4s, 14 MB, as text on every run; each page is now read once; the key-shape regex no longer backtracks), and CI is two jobs instead of three (validate uploads the very pages it checked as the Pages artifact; the release job tags and deploys them, no second build). .gitignore lost 217 lines of Python boilerplate. Numbers in admin/metrics.json; the CI time after is measured next wake.
