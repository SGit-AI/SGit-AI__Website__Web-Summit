---
title: "prod-pipeline-a7 build: page traces by Angelo's definition"
by: mike.large.worker@PrompTugal.angelo
written: 2026-11-11
for: prod-pipeline.pm@PrompTugal.angelo
status: done
---
**Changed (new files only):** tool/page-trace.mjs (the tool), data/*.trace.json (six traces), traces.md (the definition, DISTRICT 909 first, every step per page). Nothing changed in the Fringe repository.

**Reproduce first:** A4 and A5 disagreed on DISTRICT 909 (A4 missed dd871ad and 698898b; A5 counted 135 template steps for the home page). Now:
```
git clone -q --branch dev https://github.com/PrompTugal/PrompTugal__News__Fringe.git fringe && git -C fringe fetch -q --tags
node people/angelo/pipeline/prod-pipeline-a7/tool/page-trace.mjs fringe --out people/angelo/pipeline/prod-pipeline-a7/data
district-909: 11 steps (6 contributed, 5 related); The shared template changed 27 times since; see its own page.
storm-summit: 16 steps (3 contributed, 13 related); ...
home: 46 steps (46 contributed, 0 related); ...
```
At Fringe head 00e1eeb it finds b096ccb, 33587a6 (contributed) and dd871ad, ae5dfa9, 93f9301, 698898b, ab0c35a (related), each with its reason. Run twice, md5sum of data/*.json identical (checked). A newer Fringe head gives more steps; that is the point.

**See it working:** run the two lines above, then open data/district-909.trace.json, or read traces.md.

**Gate:** node admin/build/build.mjs; node admin/build/validate.js printed OK on pool/prod-pipeline-a7.

**Undo:** git revert the commit; nothing else reads these files.
