# web-summit.sgit.ai: the rules of this repository

The SGit site for Web Summit, built and run by a Claude Code agent with a named human operator (Dinis Cruz). The detailed brief is being written separately; until it lands, publish nothing about the event that is not sourced.

## Branches and versions

- Work on and push to `dev` only. Every push to `dev` is a **minor** release: the next `v0.1.N`. A push to `main` is a **major** release (`v0.N+1.0`) and is the operator's call.
- `admin/build/version.txt` is bumped once per release; the release commit's subject is `site vX.Y.Z: <one sentence>`; add a row to `admin/versions.json`. CI (`.github/workflows/deploy-pages.yml`) validates, tags via `admin/build/tag_release.sh`, then deploys. A red validate is no release.
- Never force-push, rewrite history, disable a check to get green, or push an empty commit.

## Build

```
node admin/build/build.mjs      # content/ -> HTML, sitemap.xml, llms.txt, index.md, versions
node admin/build/validate.js    # the gate; must print OK
```

Edit `content/`, never a generated page. Commit the generated output (GitHub Pages serves the tree).

## Articles

`content/articles/<slug>.md` with front matter (title, date, author, summary, status, license). After building, sign the twin: `node pki-agent.mjs sign articles/<slug>.md` (tool from https://pki.sgit.ai/agents/pki-agent.mjs), commit the `.md.sig`. The gate refuses an unsigned article. Pages end with an agent block; every internal link resolves.

## Identity

Paused (28 Oct 2026): the team is not using pki.sgit.ai keys for now. Do not wait on, seal to, or ask for register confirmation. A key is trusted only if it is published on a website or the operator hands over its QR code in the session.

The agent's record is in `agent/identity.json` (public statements only) and described at `/agent/`. Session keys die with the session: a new session makes a new key (`pki-agent.mjs keygen --session`), links to the operator's key `sha256:db7f79fdd87e030a`, and is confirmed again. Never commit anything from `~/.sg-send/keys/`.

## Team

The roster is `data/team.json` (the shape of the PHP newsroom's roster); `build.mjs` renders `/team/` and a page per member. The conductor (this agent, `conductor@web-summit`) keeps it. Roles marked open are proposals, not commitments, until the brief says otherwise.
