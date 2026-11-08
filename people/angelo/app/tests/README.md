# Angelo's command centre: browser tests

By dev@PrompTugal.angelo, 7 November 2026, for dev.map@, dev.venues@ and any agent changing `people/angelo/app/` (spec: `people/angelo/proposals/new-agents/spec-new-agents.md`). Extend these instead of starting over, and never ship a change that fails one.

Run all of them from the repository's root:

```
people/angelo/app/tests/run.sh
```

Or run just some of them, for example `people/angelo/app/tests/run.sh tm tmf tmlife`. The script builds the site, serves the repository on 127.0.0.1:8765 for the run, and runs each test in Chromium at 1280 px and 390 px (Playwright, preinstalled in the cloud sessions). It prints PASS or FAIL per test and saves the screenshots to a temporary folder. Look at the screenshots, not only the verdicts.

| Test | What it checks |
|---|---|
| `kb` | Kanban: filters, grouping, sort, the card sheet, the address keeping its state |
| `own` | "✦ Angelo's own": the menu group, the marks, the one-time note |
| `cb` | Team and the machine: people, levels, agents and keys |
| `tm` | the whole-team map: people, agents, diamonds, links, focus, a bookmarked focus |
| `tml` | the map's three layouts: people ring, agents at the centre, agents and their work |
| `tmfs` | the map's full screen: it fits, covers the page, its link is copied, Esc closes it |
| `tmf` | the map's playback: controls, pulses in the sender's colour, lines building and fading, pause, window, layouts, focus |
| `tmlife` | agents joining the map as they are first used and staying, growing and never shrinking, gliding into place, never a dot without its line, diamonds kept |
| `rp` | the timeline under the map (`#replay` redirects there): filters in the address, a commit's detail; the clip (`#replay?c=1`) stays its own view |
| `tmtl` | one clock: the map's controls move the timeline's playhead, a commit picked on the timeline moves the map; old `#replay` addresses land on the map; Replay is out of the menu |
| `lvrepo` | the live graph draws every repository the agents work in: live.json carries the others' exchanges (names and times only), and one from another repository travels as a bright pulse; light and dark |
| `lvfresh` | the live graph's sessionless agents: every agent declared as a fresh session each run is drawn with the dashed ring, even one not yet on the map; its ring lights for two hours after it sends something |
| `arcs` | the timeline's arcs (For: lines), following the map's clock |
| `sd` | Summit days: today, now and next |
| `wzone` | Where: a zone by default, an exact spot only as a deliberate second step (WS-181, option C) |

**Notes:**
- Some checks depend on the clock. The time windows end now, so the first minute of a 24-hour window may already hold a message. A test that fails only sometimes is probably that kind; fix the test's tolerance, not the page.
- The tests read only this repository's public data, and the Where test uses only the demo's made-up people.
- kb and cb ignore one outside error: a 507 from the site's page-view telemetry lane (`assets/telemetry.json`, vault 1ssnjy23), full since 7 November and reported to its owner. Every other console error still fails them.
