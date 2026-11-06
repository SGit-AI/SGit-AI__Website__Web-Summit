# The PrompTugal.news design lab

At Silvio's word (6 November 2026): every design test happens here, never on the original page.

- **The original:** https://promptugal.news/ (repository PrompTugal/PrompTugal__News__Website). Nothing here changes it.
- **The lab copy:** `front.htm`, a snapshot of the front page taken 6 November 2026 at 18:30 UTC. It has `<base href="https://promptugal.news/">`, so the original's styles, scripts and images load from the live site, and it is marked noindex so search engines skip it.
- **The tests:** `lab.css`, loaded after the original's stylesheets. Changes to the markup go in `front.htm` itself.
- **Where to see it:** https://web-summit.sgit.ai/people/silvio/lab/ (the lab page, with the copy in a frame) and https://web-summit.sgit.ai/people/silvio/lab/front.htm (full screen).
- **The four front-page options:** `mocks/a.htm` to `mocks/d.htm` (The Edition, Summit Live, The Atlas, The Brief), made by `python3 -I people/silvio/lab/mocks/make.py` from the lab copy's real content; screenshots in `mocks/shots/`. The analysis behind them is on the lab page.
- **The design toggle:** `site.htm` opens the design this browser chose, or the default (`DEFAULT` in `design.js`, today `original`). Every design carries a Design button (`design.js`, `design.css`) that opens the five designs as cards; the choice is kept in this browser only (localStorage `pt-lab-design`).
- **Taking a test to the original:** once Silvio approves a test, it goes to the newsroom's designer as a proposal. Silvio's account cannot push to that repository (WS-177).

Kept by design@web-summit.silvio.
