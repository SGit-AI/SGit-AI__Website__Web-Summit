# WS-76: the videos on proper hosting, measured, and the choice to make

By dev@web-summit.angelo, 5 November 2026, 18:35 UTC wake, from the conductor (f4565d64, item 2). Nothing is applied; no patch is needed (below). Jose reviews.

## What is true today (measured on `dev` at v0.2.632)

- **Three web copies are in the repository,** `assets/video/`, 21 MB in all: 5.8, 6.3 and 7.9 MB. They are served by GitHub Pages with the site and play directly, with no outside player and no tracking.
- **The deploy uploads about 150 MB** (the tree, minus `.git`, `content/` and `admin/build/`). The videos are about 14% of that. The print zips in `team/designer/print/` come to about 18 MB, and `pki/keys/index.html` alone is 4 MB, so moving only the videos would speed deploys a little, not a lot.
- **CI's clone is blobless** (`filter: blob:none`), so old copies of a video are not fetched on each build. The repository still keeps every video ever committed, forever: each new one adds 6 to 8 MB to every full clone.
- **The build needs no change to move them:** `!video[caption](file poster)` already takes a full URL as well as a path. Moving a video means changing one line on its page (`content/video-*.md`, video@web-summit.silvio's).
- **Angelo's command centre keeps the videos offline** (WS-84 step 1) only while they are same-origin. Moved elsewhere, its worker needs one line to allow that host, which is mine to add.

## The choice

| | Where | For | Against | Who decides |
|---|---|---|---|---|
| **A** | Keep the three in the repository; add no more | Works now, offline-friendly, no tracking, nothing to set up before Lisbon | The repository grows with any new video | Nothing to decide |
| **B** | A media repository of our own with GitHub Pages on a subdomain (for example `media.web-summit.sgit.ai`) | Same tools, no tracking, range requests work, the site's deploy loses 21 MB | A new repository and a DNS record: Dinis | Dinis |
| **C** | RiskMandate's YouTube (WS-71), embedded | Reach, captions, the channel grows | An outside player that tracks viewers (the site has none today), no offline, and the stand cannot rely on venue wifi | Silvio and Angelo, and the security agent's rule on outside scripts |
| **D** | A paid video host or object storage | Built for it | Money and a new account | Dinis |

**Recommendation:** A until Lisbon, with one rule: from now on a new video goes to B or C, not the repository. C works alongside A or B for reach (YouTube as well, never instead), and B is for after the summit, if the deploy time matters by then. The stand plays from a laptop with the masters (PIPELINE.md), so none of this touches the stand.

## If B or C is chosen

- **For each video page:** the `!video` line's URL changes on `content/video-*.md` (video@web-summit.silvio's pages). For C, the build would need an embed line, which is a change for its keeper (PIPELINE.md says so too).
- **In Angelo's command centre:** I add the new host to its offline worker (tier 1).
- **The old copies:** they stay in history. Removing them from `assets/video/` only stops them being deployed; rewriting history is never done here.
