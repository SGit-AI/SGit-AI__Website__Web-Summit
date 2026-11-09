# dashboard@PrompTugal.angelo: reports

Newest first. One entry per run that found something new; the commit that adds it is addressed to desk.conductor@PrompTugal.angelo. Formerly dashboard@web-summit.angelo.

## 9 November 2026, about 13:00 UTC (Angelo, in this session: the wallpaper APK)

- **Installed:** Angelo installed the live wallpaper on his Android phone (WS-203), after a second send at 12:52 UTC: the first card at 12:43 did not reach him, so the same file was sent again from an excluded folder in the working directory (never committed). APK news.promptugal.wallpaper 0.1.0, SHA-256 adde534f52c569c857251646558aaa5a73f4c9f739bb8aee68d35044d43f141c, built from dev at 8002f2dd.
- **Next:** he asked how to record his screen to share it; I gave him Android's Screen record steps and asked him to note smoothness, warmth and battery after an hour. His video and notes go to dev.app@PrompTugal.angelo, the first report of the wallpaper on a real phone.
- **If a file card fails again:** a GitHub release (public, only at his go) or the file renamed to .zip; he has not needed either.
- **Angelo's ask, about 13:10 UTC:** "Can we enhance the live wallpaper to enable choosing the view as in the website?" Today the wallpaper draws one view: the 3D ball, dark theme, Messages (Graph.java ports live3d.js's ball()). For the desk to brief dev.app@ (WS-203), spec first as the protocol says: a Settings screen opened from Android's wallpaper picker (wallpaper.xml's android:settingsActivity), with the site's choices: layout (People ring, Agents ring, Agents and their work, 3D), level (Messages, Workstreams, Deliverables), theme (dark, light, follow the phone), kept on the phone. Each view ported from the page's own renderer as the ball was, and hxappwall extended to every view. My recommendation: 3D and People ring first, Messages and Workstreams, then the rest.

## 7 November 2026, about 16:00 UTC (Angelo, in this session: "Write your current state and open questions to your report and commit, then I'll compact")

### My state

- **Who I am:** dashboard@PrompTugal.angelo, Angelo's dashboard agent, in a Claude Code cloud session in Angelo's account. My session key is `dashboard-angelo` on the keys page (record `sha256:c525afa927190f36`, encryption `sha256:0a31f8d2ef54b5e4`; `renamed_to` carries my new name). It is linked locally to the operator's key `sha256:db7f79fdd87e030a`.
- **My scheduled task:** "dashboard@PrompTugal.angelo wake", `trig_012S7Zz6chENnViAaSZba2Cq`. It runs every three hours round the clock (cron `30 */3 * * *`) and fires into this session. Its prompt:
  - pull `dev`, re-read the kit's protocol and the names table;
  - act on the conductor's commits addressed to me, after `node people/angelo/tools/pushed-by.mjs <sha>`;
  - release with `AGENT=dashboard@PrompTugal.angelo`;
  - append the token line to my ledger file in `people/angelo/ledger/` (it keeps my old name, so the series stays one);
  - log with `agent-log.mjs`, giving my name in lower case (the tool refuses capitals).
- **What I write:**
  - `people/angelo/dashboard.md`, the classic page: a short text version pointing into the command centre. Its sections are 1. Blocked on you (with "Settled on" lines), 2. My work (links into the app's views), 3. The machine, 4. My agents, and the helper's line on `/help/`, which I keep.
  - `people/angelo/app/config.json`: the command centre's workstreams, agents, decisions and prompts.
  - My ledger line, my WS-160 line, my own entry in `data/keys.json`, and this report.
  - At Angelo's direct word, I have also changed `people/angelo/app/` (app.js, app.css, where.js) and added `people/angelo/app/venue-map.js` with its generator `people/angelo/tools/venue-map.mjs`.
- **The rules I follow** ([the kit's protocol](../kit/README.md#protocol)):
  - the conductor is my hub, with the three tiers;
  - every direct session with Angelo ends in a commit to the conductor;
  - specs before builds, reviewed with Angelo;
  - other people's files may be changed directly, after the five steps;
  - one commit per run, and none when nothing is new;
  - I never read a visitor's note.
- **Today's runs:** 00:30, 03:30, 06:30, 09:30, 12:30 and 15:30 UTC, all scheduled, plus "Wake up" at about 10:20, at Angelo's word.
  - Last release: v0.2.1064 ("Blocked on you" opens with the two specs for his review).
  - Token check (66b37f04): not set.

### What I built at Angelo's direct word (6 to 7 November)

- **The team map:** a key for every symbol, and the rings (scheduled or fresh session) visible again (7024f967).
- **Where:**
  - the place buttons stay put (5d7749ec);
  - the venue map is now a stylised drawing from OpenStreetMap's outlines (2a996384), with names on the map, full screen and "I'm here" by tapping (4a7f759c);
  - dev@ then made the exact spot a deliberate second step (4dead814), after Angelo's "C" (592d1096).
- **The venue map is now dev.venues@'s,** under WS-181's spec. I build no more on it.

### Open questions, each with my recommendation

1. **The exhibitor email's venue map** (Web Summit's, private). Does Angelo have it? If so, it goes in his vault, never the public repository, and I draw our own rough Pavilion 1 from it: ALPHA 1, our stand A1-30 and the entrances, for dev.venues to use. **Recommendation:** yes, because it is the only inside map before the app's on 9 November.
2. **Full screen on a phone held upright** leaves empty space, because the drawing is wider than it is tall. A portrait layout was offered, and Angelo has not answered. **Recommendation:** leave it for the WS-181 spec (dev.venues).
3. **For Angelo's review with the desk, already first on his dashboard:**
   - [the live-map spec](../proposals/live-map/spec-live-map.md) (e330e542);
   - [the venues spec, Part B](../proposals/WS-181/spec-venues.md) (693e3d0c).

   **Recommendation:** review both before Monday, so dev.map and dev.venues can build.
4. **Still on "Blocked on you", no answer yet:**
   - the presence agent;
   - Jose's conductor's proposal on 15 unpicked issues;
   - the two items the conductor holds (WS-35/124 practice, WS-148);
   - the visitors' inbox after security's review.
5. **My keys entry's label** still reads the old name, with `renamed_to` added, as Angelo said: "keep the keys". Nothing to do.
6. **The run log tool's capital letters** (asked of observability@web-summit.dinis on 6 November). I log in lower case until it accepts them.

### To resume after compaction

Pull `dev`. Read the kit's protocol and the names table, this report, and the conductor's commits since this one (`git log <this commit>..HEAD -E --grep "For: dashboard@(PrompTugal|web-summit)\.angelo"`). Then carry on with the scheduled runs as above.
