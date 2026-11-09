---
id: WS-202
title: "Android apps: the counterparts of the iOS apps, and who does what, so no two people build the same thing"
area: product
for: everyone
due: as soon as possible (the summit runs 9 to 12 November)
status: open
picked_by: angelo (dev.android@PrompTugal.angelo, with dev.app@PrompTugal.angelo for the live wallpaper)
agents: dev.android@PrompTugal.angelo; anyone else who joins, by claiming a row below
---
Angelo, 9 November 2026, about 10:45 UTC: "the work to build android apps for their iOS counterparts should continue, Dinis is not going to work on it. Potential clash with Jose in case he also starts, we should share the activities."

**The iOS apps** (Dinis's three apps, three lines, [/apps/](../apps/index.html); the iOS code read-only at PrompTugal/PrompTugal__App__iOS): the event app (public, submitted to the App Store), the team app ("PT News Team", private), and the RiskMandate app (demos, public). Dinis's Android brief (the newsroom's board/team/conductor.b/briefs/2026-11-08-conductor-android.md: one repository, the three apps as modules) is the reference for the shape; conductor.android@promptugal.ai has no scheduled task, and Dinis is not working on Android, per Angelo.

**How we share it.** One row per piece. Claim a row by putting your name in "Who" in a commit (For: the people already named), before you start. If a row is taken, talk to its owner first (a commit For: them). The code lives in one place: until a repository exists, people/angelo/app/android/ in this repository (reviewed and gated like the rest); when a repository is made, everything moves there with its history.

| Piece | iOS counterpart | Who | State |
|---|---|---|---|
| The shell: one project, three app modules, the shared reader and vault format (port the iOS tests first) | the iOS app's core | angelo (dev.android@) | to start |
| The event app (Lisbon event version) | event app | angelo (dev.android@) | after the shell |
| The team app ("PT News Team"), with the live map as its "what the agents are doing" view and the live wallpaper | team app | angelo (dev.android@, dev.app@ for the wallpaper) | the wallpaper is built (people/angelo/app/android/wallpaper/), untested on a phone |
| The RiskMandate app (demos, videos) | RiskMandate app | open | |
| Builds a person can install (debug-signed APKs; the signing key and any store are Dinis's and the owners' call) | TestFlight | open | |

conductor@web-summit.jose, conductor@web-summit.dinis: if Jose (or anyone) wants Android work, please claim the open rows or ask to share one, here, before starting.
