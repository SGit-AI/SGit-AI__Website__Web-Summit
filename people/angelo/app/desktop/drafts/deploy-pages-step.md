---
title: "Draft for conductor@web-summit.dinis: the site serves the desktop app's installers"
by: dev.app@PrompTugal.angelo
written: 2026-11-08
for: conductor@web-summit.dinis (owner of .github/workflows/); dashboard@PrompTugal.angelo reviews; desk.conductor@PrompTugal.angelo for Angelo
issue: backlog 00a
---
**Why.** Angelo, 8 November (the kit's "Our own website first", 9f3f449): anything shown or linked for the team is served from web-summit.sgit.ai, never another host. The first draft (`desktop-build.yml`) had the download page link a GitHub release. Now the release is storage only, linked from nowhere, and the site's own deploy copies the installers into `people/angelo/app/desktop/dl/`. Installers are still never committed: they go into the Pages artifact only, like every generated page (WS-83).

**What.** One step in `.github/workflows/deploy-pages.yml`, in the `release` job, just before "Assemble the site artifact". It needs no new permission: the job already has `contents` (reading a release needs only read).

```yaml
      - name: The desktop app's installers, served from the site (people/angelo/app/desktop/dl/, never committed)
        env: { GH_TOKEN: "${{ github.token }}", GH_REPO: "${{ github.repository }}" }
        run: |
          mkdir -p people/angelo/app/desktop/dl
          gh release download desktop-latest --dir people/angelo/app/desktop/dl --pattern 'Team-and-the-machine-*' --pattern builds.json --clobber \
            || echo "no desktop build yet: the page says so"
```

**How it behaves.**
- No release yet (today): the step prints one line and the page says "Not built yet", as now.
- After a build: `dl/` holds `Team-and-the-machine-mac.dmg`, `Team-and-the-machine-windows-setup.exe` and `builds.json` (written by the build itself: its time, its commit, each file's system and size). The page (`page.mjs`) reads `builds.json` in the browser and shows one link per installer, with its size and build time. Every later release of the site carries the same files until the next build replaces them.
- Size: the two installers are about 10 MB each with Tauri, well inside Pages' limits (1 GB a site, 100 MB a file).
- The release's `--clobber` and the step's `--clobber` keep one copy of each, so the artifact does not grow.
- The gate is not involved: the step runs after the build and the gate, and `dl/` holds no page.

**The other half** is in `desktop-build.yml` (same folder): after replacing the release's files it asks for one deploy of `dev` (`gh workflow run deploy-pages.yml --ref dev`, `actions: write`), so a new build reaches the site at once. That dispatch goes through "Build (a manual dispatch, no number)", so it makes no version.

**Not done here.** dev.app@ never edits `.github/` (workflows are shared). If you would rather not hold installers on a release at all, the other way is for the deploy to fetch the build's artifact from the latest successful "desktop app" run (`actions/download-artifact` with `run-id` and `actions: read`); artifacts expire after 90 days, so a quiet month would lose the downloads. I recommend the release as storage.
