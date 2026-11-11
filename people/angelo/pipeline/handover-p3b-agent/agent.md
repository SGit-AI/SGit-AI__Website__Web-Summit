---
title: "Pattern 3b: a whole worker on OpenRouter"
by: build@PrompTugal.angelo (charlie.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
for: the lead, then Angelo
status: done, for the lead's read
---
# Pattern 3b: can a whole worker run on OpenRouter?

**Yes, it works.** The Claude Code CLI in this container (2.1.322) runs headless (`claude -p`) with every model call sent to OpenRouter, with its tools (files, shell) working, and nothing billed to this account but the wrapper.

| Run | Model (OpenRouter) | Cost on OpenRouter | Time | Finished | Quality against my check |
|---|---|---|---|---|---|
| sonnet | anthropic/claude-sonnet-5.5 | 0.141 USD | 32 s, 11 turns | yes | 68 paths, 0 wrong existence claims |
| deepseek | deepseek/deepseek-v3.2 | 0.101 USD | 576 s, 23 turns | yes | 100 paths, 6 wrong (said existing skill files were missing) |

**Recommendation.** Use Sonnet 5.5 through OpenRouter for build, check, spec and research workers: it is right, fast, and only about 40% dearer here than the cheap model. Keep cheap models (DeepSeek V3.2) for work a script then checks (digest gathering, counting), never for a step whose output is trusted as it stands. Try Haiku 5.5 (0.10/0.50 USD per million) for the small slots before any non-Anthropic model.

**Platform cost for the wrapper:** one Bash call that starts `claude -p` and waits; the model tokens of the worker itself are all on OpenRouter. For scale, this whole build session (Opus, doing the research too) used 28 calls, 93,284 tokens without cache reads and 3.17 M cache reads (measure.mjs, its ledger line in people/angelo/ledger/); a lead that only starts the worker and commits its files would need a few calls.

**The recipe** a lead would use (tested; the proxy injects the OpenRouter key, so the token is a placeholder):

```
M=anthropic/claude-sonnet-5.5
cd <a scratch clone with no push remote>
env -i PATH="$PATH" HOME=<an empty scratch home> \
  HTTPS_PROXY="$HTTPS_PROXY" NO_PROXY="$NO_PROXY" NODE_EXTRA_CA_CERTS="$NODE_EXTRA_CA_CERTS" NODE_OPTIONS="$NODE_OPTIONS" \
  ANTHROPIC_BASE_URL=https://openrouter.ai/api ANTHROPIC_AUTH_TOKEN=proxy-injected ANTHROPIC_API_KEY= \
  ANTHROPIC_MODEL=$M ANTHROPIC_DEFAULT_SONNET_MODEL=$M ANTHROPIC_DEFAULT_HAIKU_MODEL=$M \
  ANTHROPIC_DEFAULT_OPUS_MODEL=$M CLAUDE_CODE_SUBAGENT_MODEL=$M \
  timeout 900 claude -p "<the library's prompt>" --output-format json --max-turns 40 \
    --permission-mode acceptEdits --allowedTools "Read,Glob,Grep,Write,Edit,Bash(ls:*),Bash(find:*),Bash(node:*)"
```

The full script used, with the exact tool list, is runs/run.sh (`run.sh <label> <model>`; its paths are this session's scratch folder).

## Detail

**Sources.** OpenRouter's Claude Code guide (https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration.md, read 2026-11-11 19:00 UTC): set `ANTHROPIC_BASE_URL=https://openrouter.ai/api`, the key as `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY` explicitly empty, and `ANTHROPIC_DEFAULT_*_MODEL` to pick models. Prices: https://openrouter.ai/api/v1/models, read 19:12 UTC.

**Why `env -i` and an empty HOME.** This container's own session sets `ANTHROPIC_BASE_URL` and a session login; the inner agent must inherit neither, or it would bill this account. With a clean environment and an empty HOME it has no login but the gateway. Evidence that the calls went to OpenRouter: the key's usage rose from 1.9956 to 2.2468 USD across the two runs (0.251 USD, https://openrouter.ai/api/v1/key), matching the two runs' token costs (0.141 + 0.101).

**Costs.** Each run's cost is its token counts (runs/*/result.json, `usage`) at OpenRouter's prices. Sonnet: 30,456 cache writes at 2.50, 204,750 cache reads at 0.10, 4,439 output at 10 (USD per million) = 0.141, the same as Claude Code's own figure. DeepSeek: 45,700 input at 0.26, 649,728 cache reads at 0.13, 12,309 output at 0.38 = 0.101; Claude Code's own figure (0.861) is wrong, because it does not know the model (`unrecognized_model` in runs/deepseek/stderr.txt) and prices it as its default. Read cost from OpenRouter, not from Claude Code, for any non-Anthropic model. The key's usage counter lags by up to a minute, so per-run deltas (runs/*/meta.json) are rough.

**Quality.** My check (runs/check.mjs, 25 lines) finds 106 path-like names, counting bare file names such as STATE.md and patterns such as `{ID}/brief.md`; the task does not say which names count, so the counts differ by design. What can be judged is each existence claim, against the disk (runs/compare.py, output in runs/*/quality.json). Sonnet: 63 of its 68 paths are also in my list, its existence claims agree on all 63, and none is wrong on disk. DeepSeek: 71 in common, 67 agree, and 6 claims are wrong on disk (skills/conductor.md, skills/plain-language.md, skills/token-thrift.md, formats/conductor.md and the skills and formats folders, all of which exist). It also wrote four helper scripts into the clone, and took 18 times as long.

**What this does not show.** One small task per model; no git push (the clone has no remote, by the brief); no long run near a context limit. A worker that must commit and push would also need git credentials in the scratch clone, which is the lead's call (see STATE.md).

**Spend.** 0.251 USD of the 2 USD cap.
