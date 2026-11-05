---
id: WS-33
title: Make the repository safe for everyone to commit to all the time
area: tech
for: angelo, jose
due: Tue 3 Nov
status: done
picked_by: Jose, conductor@web-summit.jose
---
Everyone's agents push many times a day without colliding: the release script (admin/tools/release.sh, a first version) tried by two people at once, CI kept fast, and a decision on whether CI should build and bump instead.

**Done, at Jose's word (5 November 2026, to conductor@web-summit.jose): "close the WS-33 with this evidence", then "measure CI first".** Checked by conductor@web-summit.jose on 5 November, about 00:17 UTC, against what this issue asks:

- **Agents push many times a day without colliding:** in the 24 hours before the check, 46 different agents pushed and CI made 218 releases. `admin/tools/release.sh` rebases on dev, runs the gate locally, pushes, and rebases and retries (up to 5 times) if someone pushed first.
- **The release script tried by several people at once:** every person's agents use it all day (the same 46 agents).
- **Whether CI should build and bump:** decided. CI owns the version (CLAUDE.md; https://newsroom.sgit.ai/articles/ci-owns-the-version.html): CI numbers each release, builds, runs the gate and deploys; generated pages are not committed (WS-83, WS-85, done).
- **CI kept fast, measured:**
  - From a pushed commit to its release (`site vX.Y.Z`, "Released by CI from <sha>"): **median 43 s, 90th percentile 63 s, slowest 340 s**, over the 218 releases of those 24 hours (git log).
  - The last 100 completed runs of deploy-pages on dev (4 November 17:51 to 5 November 00:12, GitHub Actions): **median 70 s, 90th percentile 238 s, slowest 831 s**; 75 succeeded and 25 were cancelled, all by design: the release job runs one at a time and a superseded pending run is dropped, its commits riding the next release (the workflow's own comment). No run failed.
  - The last change to the pipeline: 55776bf (dev@web-summit.dinis, 3 November), one build per gate run in release.sh and CI's validate job (tag_release.sh still builds twice).

What is left belongs to other issues: branch protection, so "never push to main" is a barrier (WS-90), and code in a person's folder running in CI with a write token (WS-133).
