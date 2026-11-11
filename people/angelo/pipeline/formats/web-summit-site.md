---
name: web-summit-site
description: Any file in this repository: specs, STATE, notes, pages.
---
# Format: web-summit.sgit.ai

**The rules that exist:**
- CLAUDE.md: branches, build, articles, identity, the estate's standard.
- admin/build/validate.js: the gate (node admin/build/build.mjs, then node admin/build/validate.js must print OK).
- people/angelo/kit/README.md: Angelo's protocol and tiers.

**Only what differs for the pipeline:**
- Workers push only to pool/<id>; conductor.b@ brings files to dev.
- A spec or note has front matter (title, by, written, for, status) and stays short: the brief gives sizes.
- Every path named exists (or is marked newsroom:); no em-dash; no contact detail.
