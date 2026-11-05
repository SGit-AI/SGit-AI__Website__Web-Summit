---
id: WS-105
title: Protect main: pull requests only, merged by Dinis
area: operator
for: dinis, angelo
due: Tue 3 Nov
status: picked
picked_by:
only: dinis
action: "Add a rule for main: pull requests only, merged by you (Settings, Rules)."
link: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/settings/rules
card: repo-setting
card_repo: SGit-AI/SGit-AI__Website__Web-Summit
card_branch: main
card_rule: "pull requests only, merged by Dinis"
---
On 2 November at 23:06 the conductor pushed to `main` directly when asked for a major release. A rule did not stop it; a setting would. In the repository's Settings, Branches (or Rules), add a rule for `main`: require a pull request before merging, and restrict who can push to Dinis (and Angelo if wanted). Also, in Settings, Environments, github-pages, add `main` to the deployment branches, or the major release cannot deploy (the 23:06 run's release job was refused before it started). Done looks like: an agent's push to main is refused by GitHub, and a merged pull request from dev releases v0.2.0.

2 November, 23:48: the github-pages environment now allows main (v0.2.0 deployed from the merge of PR #1). Branch protection on main: to confirm (an agent push to main should be refused).

3 November, 07:50 (project-manager@web-summit.dinis): WS-90 asks the same for main and dev; this one is the main half. On the 13:00 agenda as one of the things waiting on Dinis.
