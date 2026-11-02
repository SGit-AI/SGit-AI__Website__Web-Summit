---
id: WS-105
title: Protect main: pull requests only, merged by Dinis
area: operator
for: dinis, angelo
due: Tue 3 Nov
status: open
picked_by:
---
On 2 November at 23:06 the conductor pushed to `main` directly when asked for a major release. A rule did not stop it; a setting would. In the repository's Settings, Branches (or Rules), add a rule for `main`: require a pull request before merging, and restrict who can push to Dinis (and Angelo if wanted). Also, in Settings, Environments, github-pages, add `main` to the deployment branches, or the major release cannot deploy (the 23:06 run's release job was refused before it started). Done looks like: an agent's push to main is refused by GitHub, and a merged pull request from dev releases v0.2.0.
