---
title: "One real step on OpenRouter: path marks in the pipeline library"
by: build@PrompTugal.angelo (alpha.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
status: done, for the lead's read
---
# Result: done

| | |
|---|---|
| Done | **Yes**: the real step ran end to end on OpenRouter and ended in a commit |
| OpenRouter cost | **0.446 USD** of the 1 USD cap (run 2, kept: 0.251; run 1, thrown away: 0.195) |
| This session's own cost | 13 calls, 58,238 tokens without cache reads, 1.26 M cache reads (measure.mjs, Sonnet 5.5) |
| Inner agent (kept run) | anthropic/claude-sonnet-5.5, 77 s, 29 turns |
| Changes | it made 11 path marks; I kept 10 (one undone, see below) |

**Why two runs.** My first scratch clone was stale (an older commit without QUEUE.md, skills/, formats/); the agent said so and changed only ROLES.md. I discarded that run and cloned my branch's HEAD for the second.

**What I checked.** Each mark against the named repository's dev (public raw files, HTTP 200): newsroom board/keys.json, board/guidance/README.md, board/the-story-pipeline.md, newsroom/build/build.mjs, newsroom/tools/release.sh; Fringe work/09-design.md, team/angelo/status.json. Undone: the `newsroom:` mark on `articles/<slug>.md.sig` (no such path found in the newsroom; it is a signer argument). Left to the lead: `newsroom/build/...` is the newsroom's own folder name, so a reader may take "newsroom:" plus "newsroom/" as doubled; the marks follow the step's rule as written. Only four files changed; no line reworded.

## The recipe as used (unchanged except where marked)

```
M=anthropic/claude-sonnet-5.5
git clone --no-hardlinks -b <branch> <repo> <scratch>/clone; git remote remove origin   # clone the HEAD you mean, then check ls
env -i PATH="$PATH" HOME=<empty scratch home> HTTPS_PROXY NO_PROXY NODE_EXTRA_CA_CERTS NODE_OPTIONS \
  NODE_USE_ENV_PROXY=1 ANTHROPIC_BASE_URL=https://openrouter.ai/api ANTHROPIC_AUTH_TOKEN=proxy-injected ANTHROPIC_API_KEY= \
  ANTHROPIC_MODEL=$M ANTHROPIC_DEFAULT_{SONNET,HAIKU,OPUS}_MODEL=$M CLAUDE_CODE_SUBAGENT_MODEL=$M \
  timeout 900 claude -p "<short prompt>" --output-format json --max-turns 40 --permission-mode acceptEdits \
  --allowedTools "Read,Glob,Grep,Write,Edit,Bash(ls:*),Bash(find:*),Bash(node:*)"
```

Improvements: (1) clone the exact branch HEAD, not "origin/dev" of a local clone (that was the stale-clone mistake); (2) tell the agent the repositories it may not read from the disk (it cannot know the newsroom's real paths): give it the facts, or let the wrapper confirm them with public raw URLs as above; (3) the agent's reported cost (`total_cost_usd`) matched OpenRouter's key counter only roughly (the counter lagged), so record the agent's figure for Anthropic models.
