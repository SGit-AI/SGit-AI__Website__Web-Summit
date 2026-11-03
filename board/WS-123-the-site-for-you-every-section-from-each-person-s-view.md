---
id: WS-123
title: The site for you: every section from each person's point of view, with pictures of what is going on
area: tech
for: dinis, everyone
due: Fri 6 Nov
status: picked
picked_by: conductor@web-summit.dinis (the foundation); dashboard@web-summit.dinis (the panels); designer@web-summit.dinis (the look)
agents: conductor@web-summit.dinis, dashboard@web-summit.dinis, designer@web-summit.dinis, dev@web-summit.dinis, journalist@web-summit.dinis, security@web-summit.dinis, every person's dashboard agent.
---
Dinis, 3 November: "allow the visitor to choose who they are (local storage for now, the vault later), and the whole website shows the information for them: what changed, the latest from their point of view, what they and their agents are working on. The dashboard agent manages these parts, and each major section has this structure." And: graphs and visual representations of what is going on (the schedule and the agents map are the model).

**Done (the foundation, conductor):** a "Who are you?" picker in the top bar of every page (localStorage `ws.me`); `/me.json` built at every release (per person: level, next step, urgent issues, decisions waiting, agents, messages, a 10-day activity series, since-you-looked); `assets/me.js` renders a **For you** panel at the top of every page, different per section (home, start, team, work, summit); anything marked `data-for="<ids>"` is highlighted for the chosen person (the home page's Needs you cards).

**Next, by owner:**
1. **dashboard@web-summit.dinis** owns the panels' content from now: what each section shows first for a person (`assets/me.js`, the `blocks` per section, and the fields in `me.json` in admin/build/build.mjs). Add `data-for` to the lists on each section (the board, the stand-ups, the map, the reports) so the chosen person's items light up, and an "only mine" switch.
2. **designer@web-summit.dinis** owns the look: one visual language for the For-you panel and the site's charts (the schedule, the agents map, activity, the onboarding rings), on a phone first; a spec in team/designer/for-you/ before the build.
3. **dev@web-summit.dinis**: the charts as small build-time SVG helpers anyone can call (a timeline of each day's runs from the agents' schedules, the agents map per person, a burn-down of the board), and the gate checks on me.json (no contact detail, the shape).
4. **journalist@web-summit.dinis**: a "for you" line per person in each report, from me.json.
5. **security@web-summit.dinis**: review that choosing a person is described as a view, never a sign-in, and that me.json holds only what the pages already show.
6. **Every person's dashboard agent**: say what your person wants first in their panel (a commit `For: dashboard@web-summit.dinis`).

Not in scope until the vault: anything private. The vault version (WS-102) will put a person's private view behind their key.

Progress on 3 (dev@web-summit.dinis, 3 November, 03:40 wake): the gate checks on me.json are in. Check 19: the version, one entry per person on the roster, each field's type, issue ids, the activity series' length, and every link and briefing resolving to a page. Check 15 (comms_check) now also scans the generated public JSON the pages read (me.json and each command centre's data.json) for emails, phone numbers and key shapes. Each was shown to fire on planted bad data. Next: the chart helpers, in the look the designer sets under 2.
