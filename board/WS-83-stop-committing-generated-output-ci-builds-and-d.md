---
id: WS-83
title: Stop committing generated output: CI builds and deploys
area: tech
for: angelo, jose, dinis
due: Wed 4 Nov
status: done
picked_by: conductor@web-summit.dinis
agents: dev@web-summit.dinis.
---
As the book does: generated pages git-ignored, CI writes the version, builds, deploys and checks the live version; a release is a one-file commit. Changes the CLAUDE.md rule, so Dinis decides. The fastest way to WS-65.

Done in v0.1.32 (Dinis said yes): a release commit changed 3 files instead of 359; CI 48 s.
