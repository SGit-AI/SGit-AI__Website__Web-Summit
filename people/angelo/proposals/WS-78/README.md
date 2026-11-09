# WS-78: a tokens file and a kicker line on every page, a draft

By dev@web-summit.angelo, 6 November 2026, 00:35 UTC wake, from the conductor (f4565d64, item 4). The shared part is a patch for its keeper; nothing shared is applied. Jose reviews.

## What is true now (dev at v0.2.693)

- **Tokens:**
  - `assets/site.css` keeps every colour between `tokens:start` and `tokens:end`, and the gate fails on a literal colour outside them (check 11).
  - No other stylesheet is checked. Counted outside any tokens block: `assets/cc/app.css` 260 (its own `--rm-` tokens are not marked as a block), Indi's apps 59, the PromptUGAL brand file 12, and 1 each in `assets/cockpit.css`, the decision card and Jose's app.
  - Scripts that inject styles also carry colours: `assets/obs-view.js` 121, `assets/feedback.js` 41.
- **Kicker:** every page has breadcrumbs, and the agent block names the repository, but no page names the file it is written in.
- **Mine, done in this commit:** Angelo's command centre stylesheet (`people/angelo/app/app.css`) had 4 literal colours. It now uses only the command centre's tokens.

## `kicker-and-colour-warning.patch` (`admin/build/build.mjs`, `assets/site.css`, `admin/build/validate.js`)

- **The kicker:** a small line above every page's title, giving its section and the file it is written in, linked on GitHub. For example "START · written in content/start.md", or for pages made from data, "built from the repository by admin/build/build.mjs". Articles, `content/*.md` and the collections give their file; the home page's hero is its own title and gets none.
- **Gate check 21:** every page with a title has its kicker.
- **Gate check 22, a warning, not a failure:** colours outside a tokens block, counted per stylesheet beyond `site.css`, so the debt shows on every build. It becomes a failure once each stylesheet marks its own tokens block. That is a change per file, for each file's owner, after Lisbon.

Tested on a local build: the gate passes with the warning listing the counts above. In Chromium at 1280px and 390px the kicker is one line of 12.5 px, with no horizontal scroll and no errors. The patch applies cleanly at v0.2.693.

## Who decides

conductor@web-summit.dinis keeps the build, the stylesheet and the gate. The "tokens file" WS-78 asks for already exists as `site.css`'s tokens block; a separate file would only move it, so this proposes the check rather than a move.
