---
title: "The X-ray: what Dinis decides"
summary: The first X-ray experiments of 7 November 2026, side by side, with what each costs and a recommendation, for Dinis to choose between. Four choices: which search agents, how much a run reads, what a visitor sees, and how a name typed at the booth becomes an X-ray.
path: xray/decide/index.html
---
**From xray@web-summit.dinis, 7 November 2026, evening (WS-198).** Dinis asked: *"Do a couple of experiments, so we can then choose."* These are the first ones: five searches (three companies, one use case, one industry) and three X-rays whose sources were read. Answer in your own session; nothing below changes until you do. The [X-ray](../index.html) itself is live with nine prepared subjects (the second six added the same evening).

## 1. Which search agents run {#agents}

The same JSON question went to four agents through OpenRouter, five times (RiskMandate, SGit, Replit, refund agents, insurance claims). Then each agent's claims about the three companies were checked against the sources.

| Agent (model) | Cost per run | Time | URLs given | Claims | Confirmed | Not found |
|---|---|---|---|---|---|---|
| Perplexity (`perplexity/sonar`) | 0.006 USD | 6 to 12 s | 15 to 16 | 50 | 45 (90%) | 4 |
| OpenAI (`openai/gpt-5.4-nano:online`) | 0.012 to 0.035 USD | 8 to 17 s | 5 to 8 | 41 | 35 (85%) | 6 |
| Gemini (`google/gemini-3.1-flash-lite:online`) | 0.0007 to 0.043 USD | 2 to 4 s | 1 to 5 | 23 | 16 (70%) | 7 |
| OpenRouter web search (`anthropic/claude-haiku-5.5`) | 0.024 to 0.038 USD | 15 to 23 s | 3 to 11 | 55 | 49 (89%) | 3 |

What it shows: Perplexity gives the most sources for the least money, every time. The Haiku agent finds the most claims that hold up, but is the slowest and was cut off on the two broad subjects (its budget is now 7000 tokens). Gemini answered three times in about two seconds for under 0.001 USD, which looks like no web search ran; four of the URLs it gave for Replit do not exist. OpenAI twice said RiskMandate "enforces" or "alerts in real time", which riskmandate.ai says it does not.

- **A (recommended).** Keep all four on screen, because the fan-out is the show, and keep Gemini as the fast first answer; but weigh nothing by a model's word: only what the sources say reaches the page (as now).
- **B.** Drop Gemini, add a second Perplexity model (`perplexity/sonar-pro`) for depth. Fewer bad leads; one less colour on the screen.
- **C.** Perplexity alone. About 0.006 USD a run, but the "team of agents" picture is lost.

## 2. How much a run reads {#depth}

The search is the cheap part (about 0.06 to 0.09 USD for four agents). The real work is reading the sources: 22 to 39 pages per company, about six to seven minutes for one reading agent, before a fact reaches the page.

- **A (recommended).** Prepared X-rays read every source (as the three are now); a booth request gets the same, at the next run.
- **B.** A quick X-ray first (the search only, every claim shown as an unconfirmed lead, clearly marked), then the full one an hour later. Faster at the booth, but the page shows models' words before they are checked.

## 3. What a visitor sees first {#show}

The X-ray page plays a replay of the real run (labelled with its date), the graph grows, then the result: the agents, what they reach, the gap, the cost. The subject page adds the simulation: each action placed against the mandate, and the record that results. RiskMandate never stops an action in it: it is read-only by design.

- **A (recommended).** For a company with a public incident, lead with it (Replit's first use case is the July 2025 database deletion, step by step, each step sourced). Otherwise lead with the use case whose gap is widest.
- **B.** Always lead with the graph and let the visitor tap. Prettier on the big screen, less of a story.

## 4. How a name typed at the booth becomes an X-ray {#booth}

The site is static and the OpenRouter key can never be in a page, so a typed name cannot run live. Today the page says honestly that the name is not on the list yet and stores nothing. Silvio's team has proposed the request path (WS-194).

- **A (recommended).** The name goes, sealed, to a write-only lane on a vault (as the feedback pane does today, WS-114); the agent with the key reads the lane at its next wake, runs and reads, and publishes the X-ray. The stand sees "queued, running, ready".
- **B.** The person at the stand types the name into their own Claude session, which runs the X-ray at once. No new parts, but it needs a person each time.

**Not part of these choices: the visitor's email.** How it is kept for the follow-up pack is your call, and nothing on the site stores one.

## What it cost {#cost}

Eleven searches on 7 November: about 0.94 USD in all (the first five 0.38 USD, the second batch of six 0.56 USD). Reading the sources for nine companies: sub-agents of this session, no OpenRouter spend. Credit left on the key before these runs: about 79.9 USD of 100.
