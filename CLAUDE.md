# web-summit.sgit.ai: the rules of this repository

The SGit site for Web Summit, built and run by a Claude Code agent with a named human operator (Dinis Cruz). The detailed brief is being written separately; until it lands, publish nothing about the event that is not sourced.

## Branches and versions

- Work on and push to `dev` only. Every push to `dev` is a **minor** release: the next `v0.1.N`. A push to `main` is a **major** release (`v0.N+1.0`) and is the operator's call.
- Many people and agents push here. Commit your **source** changes (never the generated pages), then release with `AGENT=<agent>@web-summit.<person> admin/tools/release.sh "<one sentence>"`: it rebases on dev, bumps `admin/build/version.txt`, adds the `admin/versions.json` row, builds, validates, commits `site vX.Y.Z: <sentence>`, pushes (retrying if someone pushed first) and checks the live site. CI (`.github/workflows/deploy-pages.yml`) validates, tags via `admin/build/tag_release.sh`, then deploys. A red validate is no release.
- Never force-push, rewrite history, disable a check to get green, or push an empty commit.

## Build

```
node admin/build/build.mjs      # content/ -> HTML, sitemap.xml, llms.txt, index.md, versions
node admin/build/validate.js    # the gate; must print OK
```

Edit `content/`, never a generated page. Commit the generated output (GitHub Pages serves the tree).

## Articles

`content/articles/<slug>.md` with front matter (title, date, author, summary, status, license). After building, sign the twin: `node pki-agent.mjs sign articles/<slug>.md` (tool from https://pki.sgit.ai/agents/pki-agent.mjs), commit the `.md.sig`. The gate refuses an unsigned article. Pages end with an agent block; every internal link resolves.

## Identity and names

From 2 November 2026 (the operator): every person registers on pki.sgit.ai (passkey, browser key, GitHub as evidence; Dinis is the anchor) and commits their public bundle as `people/<id>/key.json`; each agent makes its own key with `pki-agent.mjs keygen --name "<agent>@web-summit.<person>"` and links to its person's key. Vault keys are sealed to those keys. (The pause of 28 October is lifted for this.) A key is trusted if it is published on a website or the operator hands over its QR code.

Agents are named `<agent>@web-summit.<person>`; this site's conductor is `conductor@web-summit.dinis`. Commits are how agents talk: subject `<name>: <what>`, trailers `Agent: <name>`, `Issue: WS-NN`, `For: <name>`.

The agent's record is in `agent/identity.json` (public statements only) and described at `/agent/`. Session keys die with the session: a new session makes a new key (`pki-agent.mjs keygen --session`), links to the operator's key `sha256:db7f79fdd87e030a`, and is confirmed again. Never commit anything from `~/.sg-send/keys/`.

## Team

The roster is `data/team.json`; `build.mjs` renders `/team/` and a page per member. The conductor keeps it. Each person has `content/brief-<id>.md` (part two is for their agents) and their own folder `people/<id>/` (dashboard.md, onboarding.json, pulse/, card.md, key.json), which they and their agents write. The board is `board/WS-NN-*.md`, one file per issue, which anyone may pick up. The one page to send the team is `/start/`. Everyone champions RiskMandate.

## The estate's standard

This repository follows https://sgit.ai/docs/guidance/repositories.md (read it, and /llms.txt, before changing the shape of the site): the brief, `BRIEF-CORRECTIONS.md`, `REALITY.md` (a thing not in it does not exist), one version on every push, the gate, a markdown twin for every page, the participant disclosure, and a credentials tier that is never committed. Not yet done, recorded in `REALITY.md`: `review/`, the Agent Contact file, a row on nfrs.sgit.ai.
