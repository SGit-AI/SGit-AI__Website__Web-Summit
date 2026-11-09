---
title: "The share button: the build, as a patch (not yet run)"
summary: dev.venues@PrompTugal.angelo's first build of the approved share button (backlog 0o), as a patch against the newsroom's dev; written but not run, because the session could not run the newsroom's build or gate.
---
Spec: [spec-share.md](../spec-share.md), approved by Angelo on 9 November about 09:05 UTC ("All as recommended", the desk's 20e9501).

**Status: written, not run.** On the twenty-third run (9 November, about 10:50 UTC) the session's permission check refused to run the newsroom's own build and gate (`node newsroom/build/validate.js`: "code from an external repository"). The newsroom's rules and the spec both require the gate to pass before a push, so nothing was pushed to PrompTugal/PrompTugal__News__Website. The patch waits here until a run may run that gate.

**Against:** PrompTugal/PrompTugal__News__Website `dev` at `1d340a3c` (site v0.1.824).

**What it changes** (one commit, For: dev@PrompTugal.dinis):
- `newsroom/build/features/share.mjs` (new): `decorate` sets `page.share`, the row under the lead, on every public page (not raw pages such as the investors' site, not `noindex` pages, the sign-in, account, profile, offline pages or the 404); on an article a second row at the end ("Share this article"). Links built at build time from the canonical address: LinkedIn, X, WhatsApp, Email, plus Copy link. A gate check: every page in the sitemap has the row; each link goes to one of the three hosts or `mailto:`, carries the canonical address and no `utm_`; no share script from another site; every article has the end row.
- `assets/share/share.js` (new, about 2 KB, no dependency): on a phone, or wherever the browser has the phone's own share sheet, one Share button that opens it (else it opens the list); Copy link with "Link copied" said to screen readers. Without the script the plain links still work.
- `assets/share/share.css` (new): outlined pills like "Save for offline", Share filled; tokens only, so light and dark follow.
- `data/site/site.json`: the words (`share`).
- `newsroom/build/lib/shell.mjs`: one line, `${page.share || ''}`, after the lead in the page head.

**Undo:** delete the two new files and `assets/share/`, the `share` key in `site.json` and the one shell line.

**Apply and test:** `git am 0001-share-row.patch` on the newsroom's dev; `node newsroom/build/validate.js` must print OK; then browser checks at 1280 and 390 px, light and dark (the row is there; Copy link copies; Share calls `navigator.share` with the title and canonical address, stubbed; the list opens where it is missing).

**Not in it:** decision 2B, counting shares by target in the newsroom's observability: a separate change to `assets/obs/obs.js`, For: observability@PrompTugal.dinis, after the button is live.
