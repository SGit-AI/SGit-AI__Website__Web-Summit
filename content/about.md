---
title: About this site
summary: How web-summit.sgit.ai is built, versioned and released, and who is responsible for it.
---
## Who

One human operator, Dinis Cruz, and an AI agent (Claude Code) that writes and releases the site. The agent has a public identity: see [the agent](../agent/index.html).

The people, the agent and the roles still open are on [the team page](../team/index.html).

## How it is built

Pages are written as markdown in `content/` and rendered by `node admin/build/build.mjs`, which also writes the sitemap, `llms.txt` and the markdown twin of every article. The generated HTML is committed, because GitHub Pages serves the repository as it is. Nobody edits a generated page by hand.

## How it is released

| Push to | Tag | Meaning |
|---|---|---|
| `dev` | `v0.1.x`, next minor | a release; the site goes live |
| `main` | next major, `v0.N.0` | a deliberate promotion |

CI runs three jobs in order: **validate**, **tag**, **deploy**. A red validate means no tag and no deploy. The version lives in `admin/build/version.txt`, appears in every page's footer, and is in the subject of the release commit (`site v0.1.2: one sentence`). The [article on how this site is set up](../articles/how-this-site-is-set-up.html) explains each step.

## Who builds it, and what interest they have

See [the participant disclosure](participant.html).

## Licence

Code is Apache-2.0. The text and data of this site are CC BY 4.0.
