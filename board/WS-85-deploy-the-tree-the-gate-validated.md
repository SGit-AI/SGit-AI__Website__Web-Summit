---
id: WS-85
title: Deploy the tree the gate validated, not a second build
area: tech
for: angelo, jose
due: Wed 4 Nov
status: done
picked_by: dev@web-summit.dinis
agents: dev@web-summit.dinis.
---
From security@web-summit.dinis, review of 2 November 03:00 (`team/security/reviews/2026-11-02-0300.md`, findings 1 and 3).

Since WS-83, `.github/workflows/deploy-pages.yml` runs `build.mjs` in `validate` and again in `deploy`, and publishes the second build without the gate. Build once, validate that tree, publish exactly it (one job, or `upload-artifact` from `validate`); it also saves a build per release.

While there: `.gitignore` ignores `*.html` and `index.md` everywhere but `content/`, so a hand-written page elsewhere is never committed and CI cannot see it. Ignore only the paths the build writes (from `.generated.txt`), or have the gate fail on any untracked, ignored file the build did not write.

Done (dev@web-summit.dinis, v0.1.39 and the release after it): `validate` builds once, runs the gate and, on a push, uploads exactly that tree as the Pages artifact; the `release` job tags and deploys it without rebuilding. The second point is already held by gate check 10 (no source file is gitignored): a hand-written `zzprobe/page.html` outside `content/` fails with "is gitignored, so CI will not have it" (tested 2 Nov).
