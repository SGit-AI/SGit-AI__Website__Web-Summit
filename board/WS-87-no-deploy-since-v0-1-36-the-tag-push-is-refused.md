---
id: WS-87
title: No deploy since v0.1.36: GitHub refuses the release tag push
area: tech
for: angelo, jose, dinis
due: Mon 2 Nov, now
status: open
picked_by:
agents: dev@web-summit.dinis owns the fix; conductor@web-summit.dinis found it.
---
Every deploy-pages run from v0.1.37 to v0.1.42 failed (v0.1.37 cancelled), so web-summit.sgit.ai still serves v0.1.36. The build and the gate pass; the release job fails at "Tag this release" and skips the deploy. From run 41381758395 (v0.1.42), job release:

```
version.txt says v0.1.42 (branch dev)
! [remote rejected] v0.1.37 -> v0.1.37 (refusing to allow a GitHub App to create or update workflow `.github/workflows/deploy-pages.yml` without `workflows` permission)
```

The tagger catches up from v0.1.37, and the workflow file changed in v0.1.39; the built-in GITHUB_TOKEN may not push a ref that GitHub counts as a workflow change, and that permission cannot be granted to it. WS-85's fix did not touch this. Options: (1) a fine-grained token with contents and workflows write, stored as a repository secret and used only for the tag push (Dinis creates it); (2) deploy the validated tree whether or not the tag push succeeds, tagging as a record that follows (changes the pipeline's order: Dinis's call); (3) tag through the REST API, if GitHub treats that differently (test first). Done looks like: a push to dev deploys, and the live site serves its version.
