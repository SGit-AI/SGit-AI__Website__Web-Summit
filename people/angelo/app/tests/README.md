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
| `lvdisp` | the live graph's Full screen button and display mode (`?display=1#live`): the graph alone covering the screen, no controls, still moving when reads fail, read again at once when the network returns, Esc back; at 1920, 1280 and 390 px, light and dark |
| `lvlong` | the four-hour test (spec-realtime.md): display mode at 1920x1080 with a fake feed, four hours on a faked clock in about a minute; the flow never stops, heap and element count within 10% from the first hour to the last, twenty minutes of failed reads leave it moving with the light off, and it recovers within one tick |
| `lvpip` | the live graph's floating window where Document Picture-in-Picture is missing (Safari on a Mac or iPad): the graph drawn into a canvas and played as a video in picture-in-picture (`?pip=video` forces it in Chromium); the picture has the page's colours and moves, the graph stays on the page, closing removes the video; at 1280 and 390 px, light and dark. Safari itself is not tested (no WebKit in the sessions) |
| `lvdata` | the live map's own events (spec-live-map.md section 2), no browser: `data.json`'s `replay.live` holds keys published and ended, "a key handed over" (by, to, when: never the sealed file's name or kind) and lanes, names and times only; and the never list drops a section holding a sealed file's name, a token or a key |
| `lvmap` | the same events drawn while the map plays back: a small gold key on each agent holding a published key (grey once its keys have ended), a thin gold ring once it has a lane, and a gold dot travelling for each "a key handed over", titled with those words only; fewer marks at the window's start than at its end; at 1280 and 390 px, light and dark |
| `lvmsg` | the live map's last event of section 2, "a sealed message sent or verified": only where an agent says so in its own commit's subject; `replay.live.messages` holds the minute, the agent, sent or verified and the short commit, never the text; while the map plays back, a dot with a lock at the sender, in its person's colour, titled with those words and linked to the commit; none at the window's start; at 1280 and 390 px, light and dark |
| `lvtip` | the same events in the still map, "as counts in each node's tooltip": each agent's tooltip ends with keys published and ended, keys handed over (given, received), a lane and sealed messages sent or verified, checked against `replay.live` for every agent on the map; no token or key in any; at 1280 and 390 px, light and dark |
| `arcs` | the timeline's arcs (For: lines), following the map's clock |
| `sd` | Summit days: today, now and next |
| `wzone` | Where: a zone by default, an exact spot only as a deliberate second step (WS-181, option C) |

**Notes:**
- **Deepen a shallow clone first.** The map's playback and the timeline read every commit since 2 November. A cloud session's clone is shallow, so their early hours come out empty and `tmf` fails although the page is right. `run.sh` warns when the clone is shallow; run `git fetch --depth=3000 origin dev` once, then the tests.
- Some checks depend on the clock. The time windows end now, so the first minute of a 24-hour window may already hold a message. A test that fails only sometimes is probably that kind; fix the test's tolerance, not the page.
- The tests read only this repository's public data, and the Where test uses only the demo's made-up people.
- kb and cb ignore one outside error: a 507 from the site's page-view telemetry lane (`assets/telemetry.json`, vault 1ssnjy23), full since 7 November and reported to its owner. Every other console error still fails them.
