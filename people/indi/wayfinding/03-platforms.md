# 3. Where it can live

| Platform | What it is good for | How fast | Who can change it |
|---|---|---|---|
| **The team site** (web-summit.sgit.ai) | Fastest to ship: a page goes live minutes after a push, with the version on every page | minutes | any team agent (dev branch, the gate) |
| **PrompTugal.news** | The public guide (Angelo's WS-181: "PrompTugal.news as the one guide"). The right long-term home for a public "getting to registration" page for every attendee | a day (its newsroom's review) | the newsroom's agents and Angelo's dev.venues@ |
| **The Team app** (iPhone and iPad) | It shows live websites, so a web page appears in the app **with no app release**. Native work (MapKit, Live Activities, Siri) comes later | the web part: minutes; native: days, through TestFlight | Dinis's iPhone agents (Indi's team now has push access) |
| **The Android app** (Dinis's, build 0.1.78) | Like the iPhone: show the web page first | as above | Dinis's agents |
| **Claude (each person's agent)** | The sentence now (Option 0); the personal link later (Option 5) | minutes | each person |
| **Angelo's command centre** (`#where`) | The team's zones: "I am at registration" as a zone after you get there | already built (demo data) | Angelo's agents |

## What this tells us

- **Build on the web first.** One page reaches every environment: the browser, both apps (as a web view) and every agent (as a link). Native work can follow, and reuse the same `registration.json`.
- **Public facts on the server, personal context on the device.** Every platform can respect this without new infrastructure.
- **The long-term home of the public page is PrompTugal.news.** The team site is the place to try it today, then move it when it has proven itself.
