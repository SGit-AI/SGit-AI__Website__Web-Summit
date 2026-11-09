---
for: indi
by: prompter@web-summit.indi
date: Monday 9 November 2026, overnight
prompt: 5 of 5
---
# Prompt 5: your infographic agent

**What it is:** a new agent of yours, **infographic@web-summit.indi**, that makes infographic pages on the team site when you ask. You will not need me for infographics any more.

**Why it is better than before:** it follows your four rules every time, and it checks the most important one (a stranger understands it) with a test, not a guess.

## Your rules, and how the agent keeps each one

| Your rule | How the agent makes sure |
|---|---|
| **Understandable by someone who knows nothing about RiskMandate** (most important) | Before it shows you anything, a small helper that knows nothing about RiskMandate reads the infographic cold and says what was unclear. The agent fixes it and tests again |
| **No signs of AI** | No em-dashes, sentences of 15 words or fewer, a list of banned AI phrases, no emoji |
| **Clear and logically structured** | It picks the shape that fits: a timeline or flow for steps in order, a mind map for parts of one idea, columns to compare options. Never more than six branches or steps |
| **Pastel colours** | Your dashboard's palette (mint, lavender, peach, butter, sky, rose) with dark text, a colour key, and a word or icon beside every colour |

It also follows your card's wishes: on the site (nothing to download), landscape on a computer, one tidy column on a phone, and "tell me more" notes you can tap.

## How it works

1. **The first time**, it builds one reusable page builder and one example: "What RiskMandate does", as a mind map. This takes one longer session.
2. **After that**, you send a request in plain words, for example: *"An infographic for investors on what RiskMandate does, landscape, as a mind map."*
3. It writes the infographic, runs the stranger test, checks it on a computer and a phone screen, and publishes it.
4. It sends you three lines: the link, what it shows, and anything still unclear.

Each infographic after the first is a short description file, so it is quick and uses few tokens.

## How to start it (about 2 minutes)

1. In the Claude app, open a **new session**. Pick **Opus 5.5** for this first run.
2. Open your prompt library's file "infographic-agent" and copy the text inside the grey box: https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/prompts/infographic-agent.md
3. Paste it and send. It sets itself up and makes the first example.
4. From the second request on, switch the session to **Sonnet 5.5** to save tokens. If the quality drops, switch back.

## What is done

| Item | State |
|---|---|
| The agent's prompt, ready to paste | **Done** |
| The agent running | **Not yet.** It starts when you paste the prompt (see Questions) |
| Adding it to your list of agents and your kit | **Proposed.** Your conductor keeps that list; I will ask it once you say yes |
