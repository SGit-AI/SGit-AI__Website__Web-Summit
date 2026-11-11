# The PrompTugal news app redesign: debrief for Indi

From conductor-newsapp@web-summit.indi, 11 November 2026, early morning. The brief: redesign the public PrompTugal app (news.promptugal.reader) for fewer taps and a better look, keep the colours, no AI-sounding words. The plan and every request are in the iOS repository at `briefs/2026-11-10__newsapp-redesign/`.

## What changed, by build

| Build | What it added | Where it is |
|---|---|---|
| 556 | Five tabs (Now, My program, Explore, Map, News); More on every tab; a talk on Now opens in the app; Show on the map on every talk | Submitted to Apple's beta review, in the external group |
| 562 | One tap on the star picks a talk and adds it to the calendar (asked once); where to meet RiskMandate on Thursday, in More | Submitted, in the external group |
| 575 | The softer look: the iPhone's own font, rounder cards, pill buttons, sentence case; Good morning, afternoon or evening by Lisbon time; the widget to match | Submitted, in the external group |
| 579 | Videos: the interviews from promptugal.news play in the app, and play again offline | Submitted, in the external group |
| 581, 585 | The storm notice; light mode, native articles, interview pills, Wednesday left out | Internal only: 587 has all of it |
| 587 | Light mode by default; articles drawn in the app with no web page; Interviews with Article and Transcript pills you can slide between; the storm notice and Wednesday's sessions left out, both read from promptugal.news; a red For you card, an interviews strip on Now, category colours, pulsing live dots, bouncing stars | Requested for beta review (commit fc5e9c9); the team can install it now |

Every build passed its unit tests on iPhone and iPad before it was uploaded. External testers get the newest build Apple approves, usually 12 to 24 hours after it is submitted.

## Taps, before and after

Counted on iPhone from a cold launch on Now.

| Workflow | Before | After |
|---|---|---|
| See what is on now and next | 0 | 0 |
| Open a talk from Now (with pick and calendar) | not possible: it opened the web page | 1 |
| Pick a talk and add it to the phone's calendar | 3 | 1 |
| Find where a talk is | 3 and a long scroll | 2 |
| Open the venue map | 3 and a long scroll | 1 |
| Read an article | 2, then a web page loads | 2, drawn at once in the app |
| Watch an interview | not in the app | 1 from Now's strip, 2 from News |
| Read an interview's transcript | not in the app | 1 more from the interview |
| Meet RiskMandate at the stand | not in the app | 2 (More, the link) |
| Settings and reminders | 1 on two tabs, missing on the others | 1 on every tab |

## Also done

- **promptugal.news:** two small files for the app. `api/v1/live/videos.json` lists the interview videos. `assets/live/app-notice.json` is the notice on Now, with the days called off. The correspondent can change it without an app release.
- **Wednesday:** checked at websummit.com ("Day 2 (Wednesday, November 11th) will not take place"). The app leaves Wednesday out and says so on Now.
- **Design preview:** https://claude.ai/artifact/GWqUopAD7YVD6zGYbFYmrw (private; share it from the page).
- **My key** is on the keys page (v0.2.1695).

## What is left

- **Beta review:** Apple has 556, 562, 575 and 579; 587 is requested. Nothing reaches the public link before Apple approves.
- **The UI test** for More on every tab is written, but CI does not run UI tests today (devops.ios).
- **RiskMandate 575** was "build not found" in App Store Connect (devops.ios was told). 579 and 587 were fine.
- **Reviews:** security.repos@ was asked about the calendar access, the RiskMandate link, the video reads from the vault and the notice. No answer yet.
- **Ideas for the next round:** videos that start playing while they load; the site's "workflow map" on each interview, once PrompTugal's team agrees it; the web version of the app (pt.news) to match these screens, which is PrompTugal's web team's to build.
