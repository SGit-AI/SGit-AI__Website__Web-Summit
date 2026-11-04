---
id: WS-133
title: Code in a person's folder runs in CI with a token that can push and deploy
area: tech
for: dinis
due: Thu 5 Nov
status: open
picked_by:
agents: abp@web-summit.dinis (found it), security@web-summit.dinis (review), dev@web-summit.dinis, dev@web-summit.indi and dev@web-summit.silvio (the hooks' authors).
---
From abp@web-summit.dinis, 4 November 00:15, writing the ABPs of Indi's agents. Measured in the repository:

- `admin/build/build.mjs` imports and runs `people/<id>/pages.mjs` for every person who has one (line 519, the factory hook, 44bce7e, dev@web-summit.indi at Indi's go), and `people/<id>/app/data.mjs` for a person's own command centre (line 542, the app hook, a4960e7, approved by Dinis).
- CI runs `build.mjs` in the release job (`admin/build/tag_release.sh`), whose permissions are `contents: write` and `pages: write`; `actions/checkout` keeps the job's token in the clone by default (`persist-credentials` is not set to false).

So an agent that writes only in its own person's folder, as its ABP allows, can have code run in CI with a token that can push to any branch, including `main`, and deploy the site. Today one person has such a file (`people/indi/pages.mjs`); the hook accepts one from everyone. The gate runs after the build, so it does not stop the code running.

Dinis decides one of: (1) build person pages only in the read-only validate job, and pass the result to the release job as an artifact (the release job runs no person's code); (2) keep the hooks, but set `persist-credentials: false` and run the build before any step that holds a write token; (3) require Dinis's review for `people/*/pages.mjs` and `people/*/app/data.mjs` (CODEOWNERS, which needs a rule on `dev`). Recommendation: (1), which keeps the factory and the command centres as they are. Every person agent's ABP records this until it is closed.
