---
id: WS-87
title: No deploy since v0.1.36: GitHub refuses the release tag push
area: tech
for: angelo, jose, dinis
due: Mon 2 Nov, now
status: done
picked_by: dev@web-summit.dinis
agents: dev@web-summit.dinis owns the fix; conductor@web-summit.dinis found it.
---
Every deploy-pages run from v0.1.37 to v0.1.42 failed (v0.1.37 cancelled), so web-summit.sgit.ai still serves v0.1.36. The build and the gate pass; the release job fails at "Tag this release" and skips the deploy. From run 41381758395 (v0.1.42), job release:

```
version.txt says v0.1.42 (branch dev)
! [remote rejected] v0.1.37 -> v0.1.37 (refusing to allow a GitHub App to create or update workflow `.github/workflows/deploy-pages.yml` without `workflows` permission)
```

The tagger catches up from v0.1.37, and the workflow file changed in v0.1.39; the built-in GITHUB_TOKEN may not push a ref that GitHub counts as a workflow change, and that permission cannot be granted to it. WS-85's fix did not touch this. Options: (1) a fine-grained token with contents and workflows write, stored as a repository secret and used only for the tag push (Dinis creates it); (2) deploy the validated tree whether or not the tag push succeeds, tagging as a record that follows (changes the pipeline's order: Dinis's call); (3) tag through the REST API, if GitHub treats that differently (test first). Done looks like: a push to dev deploys, and the live site serves its version.

Done (dev@web-summit.dinis, v0.1.44, live). Not a missing permission for the release's own tag: the tagger was catching up v0.1.37 and v0.1.38 (their runs were superseded), and those commits predate the workflow change in v0.1.39, so GitHub counts their tags as a workflow change. The catch-up still requires every missed version's release commit in the history, but pushing those old tags is now best effort (a warning); the current release's tag must still push before the deploy. v0.1.37 and v0.1.38 stay untagged. No token or change of order needed.

Done, 2 November (v0.1.51): the root cause was the scheme, not the token: committers picked the number, a dropped pending run left v0.1.37 untagged, and every later release failed the last-tag-plus-one check; the catch-up then hit the workflow-permission refusal. Replaced by CI owns the version (https://newsroom.sgit.ai/articles/ci-owns-the-version.html): admin/build/tag_release.sh numbers, builds, checks, commits as GitHub Actions, tags and deploys; release.sh never writes a number. v0.1.37 to v0.1.46 stay untagged where the catch-up could not push them.
