# DONE: the newsroom workflow (conductor-newsroom@web-summit.indi)

10 November 2026, for Indi and Dinis, from their voice brief of about 13:00 UTC.

## What I made

| # | What | Where | State |
|---|---|---|---|
| 1 | The unified workflow: 16 steps from meeting a person to the published interview, each with who, in, out, where and what stays private, and what changes for the agents pivot | `people/indi/helpers/newsroom/workflow.md` | written |
| 2 | The infographic: a pastel timeline of 14 steps with a picture per role, hand-overs marked, the privacy lock on each step, and the same journey as a map | `people/indi/helpers/newsroom/page.mjs`, at /people/indi/helpers/newsroom/; linked from /start/ and Indi's schedules page | built, gate OK on my copy |
| 2a | Stranger test: a small sub-agent with no context explained it back correctly. It stumbled on Web Summit, GAMMA-Ray, RiskMandate, which yes is filmed, "automatic checks" and "map". All six were fixed in plain words | the page | done |
| 3 | The newsroom map: a spec in GAMMA-Ray's graph grammar (verbs with inverses, absences as nodes), drawn from commit trailers, run records, the vault README and front matter, with a new `Piece:` trailer. A first sketch is drawn on the infographic page | `people/indi/helpers/newsroom/map-spec.md` | spec; sketch only |
| 4 | The pt.news redesign brief, addressed to conductor@, journalist@, designer@, dev.pages@, dev.graphs@ and correspondent@. Three bands, the map on every piece, recycling round 3 | PrompTugal__News__Website `board/briefs/2026-11-10-pt-news-about-agents-redesign.md` | written, not yet answered |
| 4a | Mock-ups, phone and desktop: the home page and a piece page with its map | PrompTugal__News__Website `design/home-designs/agents/` | made |
| 5 | A note for the app's redesign helper | `people/indi/helpers/newsroom/for-newsapp.md` | written; its session was not reachable |

## What PrompTugal's team agreed

Nothing yet. The brief asks four questions: take it as the redesign pass; where the hand-over from Indi to the journalist lands; may I build the first map on a branch; is a `Piece:` trailer acceptable.

## What is left, and why

- **Nothing is pushed.** Attaching both repositories for pushing was refused in this session. Both sets of changes are committed only on my local copies: the team site on `dev`, PrompTugal's on a branch `work/newsroom.indi`. Someone with push rights, or this session once allowed, runs the release script.
- **No key.** Running the PKI tool (`pki-agent.mjs keygen --session`) was refused here because it is downloaded code, so `data/keys.json` has no entry for me.
- The map from real trailers (step 2 of its build order) waits on PrompTugal's yes.
- I did not use or ask for the Audo key. No interview was touched.

## Measure

Run at the end of this stretch, once the repository is reachable:
`node people/indi/accountant/measure.mjs --agent conductor-newsroom@web-summit.indi --task "WS-211: unified newsroom workflow, infographic, map spec, pt.news brief" --since 2026-11-10T12:40:00Z --quality pass --append`
