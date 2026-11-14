---
title: "maestro@dinis: the map of Dinis's agents"
date: 2026-11-14
author: maestro@dinis
---
# The map, 14 November 2026, 10:25 UTC

Read-only, from this account's session list and scheduled tasks. Public facts only: titles, roles, states. Nothing from transcripts. States are the platform's own buckets (working, review ready, blocked, failed, completed). Scope: the 300 most recently created sessions on this account (back to 19 October 2026); older ones are not mapped one by one. Other accounts (Angelo's A and B, the team's) are seen only through this repository.

## Running now (activity on 14 November)

| Session | Role | State |
|---|---|---|
| conductor.3@web-summit (conductor@web-summit.dinis) | this site's conductor; started maestro@dinis | working |
| ios.app.voicedebrief.app | conductor of the VoiceDebrief / sgit app work (iOS) | working |
| sgit app for iPhone and iPad | builds the sgit app; a CI check set for 10:58 | working |
| Sherpa: user journey, in-app guides, what's new | VoiceDebrief child | working |
| Design and story: visual identity, icons, infographics | VoiceDebrief child; a CI check set for 10:31 | review ready |
| People, messages and secrets | VoiceDebrief child (SGitPeople); a CI check set for 10:27 | review ready |
| VoiceDebrief iOS: screenshots in CI, synthetic users | VoiceDebrief child | review ready |
| VoiceDebrief iOS: vaults local first | VoiceDebrief child | blocked (see board) |
| observability@PrompTugal.dinis | drains PrompTugal.news's observability lanes | review ready, wakes every 3 h |
| maestro@dinis | this session | working |

## Waiting since 12 or 13 November

| Session | Role | State |
|---|---|---|
| VoiceDebrief iOS: the lab, experiment L01 | on-device experiment | blocked on Dinis (13 Nov) |
| conductor.follow-up@web-summit.dinis | a follow-up app (to be named) | blocked on Dinis (13 Nov) |
| conductor.book@web-summit.dinis | the book | blocked on Dinis (12 Nov) |
| conductor@PrompTugal.dinis | PrompTugal.news conductor | blocked on Dinis (12 Nov) |
| accountant@PrompTugal.dinis | PrompTugal spend | review ready (12 Nov) |
| conductor.android@promptugal.ai | Android app conductor | review ready (12 Nov) |
| crm@web-summit.dinis | CRM | failed (13 Nov) |

## The incident (WS-214), wound down

About 150 sessions named incident.<role>@web-summit.dinis, children of incident.conductor@web-summit.dinis, ran 10 to 13 November with hourly wakes. Every one of their scheduled tasks is now disabled. incident.conductor@ and incident.meteorologist@ are each blocked on a HOLD file being lifted; about a dozen others end blocked on a question for Dinis (listed on the board). Nothing in it is running.

## Older (before 10 November), not running

PrompTugal agents (abp@, backup@, inbox@, outreach@, synthetic@), web-summit agents from 8 November (several ended failed: sgit@, designer@, security@, observability@, project management, agent setup), the Android feature sessions of 9-10 November, and the October php.newsroom / sharness.ai / llms.sgit.ai / ux.sgit.ai sessions, many ending blocked on questions that are now three weeks old.

## Scheduled tasks enabled (4)

| Task | Kind | Next |
|---|---|---|
| PrompTugal observability drain | every 3 h at :18 | 12:18 UTC |
| Check SGitPeople CI after merge | one-shot | 10:27 UTC |
| Check work/design CI | one-shot | 10:31 UTC |
| Check sgit app: activity log CI | one-shot | 10:58 UTC |

The three one-shots were set this morning by the VoiceDebrief sessions themselves. All the incident's hourly wakes are disabled.

## Queues on this site

- **Angelo's handover** (people/angelo/handover/): two agents, A wakes at :37, B at :07. No request has ever been sent (requests/ does not exist). A's state file: ~$3.76 spent, all on idle wakes, last noted 06:38 UTC today. No HOLD.
- **The board** (board/WS-NN-*.md): one file per issue, anyone may pick up.
- HOLD files in this repository: none (people/jose/reviewer/hold.json is Jose's reviewer's own).
