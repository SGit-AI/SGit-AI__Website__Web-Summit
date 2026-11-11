---
title: "b4-how-it-works: design"
by: design@PrompTugal.angelo (charlie.large.worker@PrompTugal.angelo), for conductor.b@PrompTugal.angelo
written: 2026-11-11
for: Angelo
status: "built (Angelo delegated the pick in brief.md)"
---
# Design: how the pipeline works, in eight pictures

**In five seconds the reader must get:** *Angelo says it once. conductor.b@ routes it. A fresh worker does each step on its own branch. Nothing public goes out without Angelo's go.* That line is a strip of four icons at the top of the page, above everything else.

**Recommended form: one scroll of eight picture cards** (built). Each card is a number, a title of a few words, one inline SVG or tile grid, and at most three short lines. Phone: one column. Desktop (1280 px): two columns, with the swimlane (2) and the prompt (3) across both. The site's own tokens and chrome, so light and dark come free.

**Alternatives, one line each:**
- **One poster** (every actor and arrow on one canvas): shows how it all connects, but unreadable at 390 px and slow to take in. Rejected.
- **Step-through slides** (one picture per screen, next/back): calm on a phone, but needs a script and hides seven of the eight pictures. Rejected.

**What I kept:** the site's chrome, type and colour tokens (assets/site.css; the command centre's navy and gold is the app's look, not the site's); the people/angelo/pages.mjs hook that already places Angelo's guide; the designer skill's forms.

## The form for each picture
| # | Message | Form | Source |
|---|---|---|---|
| 1 | who is who | tiles by layer: Angelo, conductor.b@, PMs, 20 slot dots (10 large, 10 small), scheduled helpers, the Fringe lead | pipeline/ROLES.md, conductor-b/STATE.md, conductor-b/runs.md |
| 2 | one piece of work | the step strip (intake, research, draft, check, design, build, Angelo's go, publish, share), then a swimlane of b0-library with its real times and cost | pipeline/b0-library/times.json, conductor-b/runs.md |
| 3 | what is in a prompt | stacked building blocks, filled in with this very run | pipeline/ROLES.md, skills/, formats/ |
| 4 | session-less | one long session whose context grows, against fresh sessions of equal size, each archived | ROLES.md tenet 1, skills/conductor.md, conductor-b/STATE.md |
| 5 | schedules retired | a bar of 67 runs with the 9 empty ones marked; then the three wakes that stay | proposals/worker-pool/spec-worker-pool.md, conductor-b/HANDOVER.md, runs.md |
| 6 | why PMs | Angelo with one line to each project's PM; the PM's life as four steps | ROLES.md (lead), b1-team-spec/decisions.md, spec-account-b-team.md |
| 7 | everything tracked | a commit's trailers drawn as a label; a bar chart of each worker's cost | runs.md |
| 8 | usage runs short | a cycle: offer, claim, run, return, marked "proposed" | b3-team-offers/spec-handover-market.md |

## What the build needs
- Source: people/angelo/pipeline/how-it-works/page.fragment (HTML, inline SVG, a scoped style; no script) and page.mjs (places it); one import line in people/angelo/pages.mjs; one link from people/angelo/dashboard.md so the page is no orphan.
- Served at people/angelo/pipeline/how-it-works/index.html, with its markdown twin from page.mjs.
- Colours only through the site's tokens (--accent, --warm, --sent, --ok, --warn, --ink-2, --line); every SVG has a title for screen readers; no fact without a file above.
