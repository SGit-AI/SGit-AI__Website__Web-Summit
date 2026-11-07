---
title: "WS-125: the agent setup guide, checked for accuracy and the interactive page tested"
summary: dev@PrompTugal.angelo's review for desk.conductor@PrompTugal.angelo (c5e05274): the published article's technical claims and sources, the interactive page in both themes and at phone width; two page bugs fixed; seven corrections drafted for the newsroom.
---
By dev@PrompTugal.angelo, 7 November 2026, at the conductor's ask (c5e05274, Angelo's words: "we should have the multi user ABP guide checked by the policy and dev agents"). policy@PrompTugal.angelo checks the ABP model and the protocol; this is the accuracy and the page.

**What was checked:**
- **The published article:** PrompTugal.news `content/articles/agent-setup-guide.md`, writer@PrompTugal.angelo's 222e196e, signed.
  - Every setup step, the product table and every technical claim.
  - Every source link, fetched today.
  - Every claim about our own team, against this repository.
- **The interactive page:** `agent-setup-guide.fragment` beside this file. It is not yet published ("to follow").
  - Tested in Chromium at 1280 px and 390 px, in light and dark.
  - The audience bar, the dial over the five deployments, both questionnaires, contrast, and sideways scroll.

**In short:** the guide is accurate on the sources and the products. Four statements about our own team say more than is true. One link is broken. The interactive page had two bugs, fixed here; it must be re-synced with the published text before it goes out.

## 1. The published article: corrections (a draft for the newsroom)

The newsroom has the article, so these are a draft For: conductor@PrompTugal.dinis and writer@PrompTugal.angelo (who published it). Nothing is changed in the newsroom's repository. Each item gives the text now, the proposed text, and why.

1. **A broken link (Where this comes from).**
   - Now: `https://web-summit.sgit.ai/people/angelo/kit/index.md#protocol` returns 404.
   - Proposed: `https://web-summit.sgit.ai/people/angelo/kit/README.md#protocol`, which returns 200.
2. **Microsoft's name (the product table).**
   - Now: "Copilot agents".
   - Proposed: "agents for Microsoft 365 Copilot".
   - Why: that is the name on the Microsoft Learn page cited; "Copilot agents" does not appear there.
3. **Sessions (developers, "the shape we use").**
   - Now: "A long session for the conversation with the person, and a fresh session for each scheduled run".
   - Proposed: "A long session for the conversation with the person. Scheduled runs either wake that session or, cheaper, start a fresh one each time (our hourly runner does)."
   - Why: most of Angelo's agents are woken into their own long session (people/angelo/agents.json). Only runner.conductor@ starts fresh each run.
4. **Tokens (DevSecOps, and the team row of "Where to start").**
   - Now: "One token per agent; no agent uses its person's token".
   - Why: this is right as advice, but our own agents push to GitHub through their person's account. That is what the conductor's check of who pushed relies on. A reader who sees "the shape we use" a few lines above may take it as our practice.
   - Proposed: keep the advice, and add a line under "What this does not claim": "Our own agents push to GitHub through their person's account; secrets are per agent (one environment each), and one GitHub token per agent is where we are going, not where we are."
5. **Changing others' files (lessons).**
   - Now: "so on 6 November we changed it".
   - Proposed: "so on 6 November Angelo's agents changed it".
   - Why: the rule is in Angelo's protocol (ce069603) and was offered to the team as a direction, not adopted by everyone.
6. **Visitors' notes (lessons).**
   - Now: "Visitors' notes are not read by any agent at all."
   - Proposed: "Today, visitors' notes are not read by any agent at all."
   - Why: true now, but an agent drain is planned after security's review (WS-119).
7. **Dinis's authorisation (Who made this).**
   - The only record is Angelo quoting him (ecd8dc39: "Dinis authorized its publication on Promptugal News for everybody").
   - Proposed: Dinis confirms it in a commit of his own, or his conductor's. That also settles the newsroom check's flag c6.

## 2. The newsroom's seven flagged claims, settled from the records

| Flag | Claim | Finding |
|---|---|---|
| c1 | Vendor names checked on their help pages | **Supported**, re-checked today: Claude Projects, scheduled tasks (on the projects page), connectors (Gmail, Google Calendar, Microsoft 365), Claude Code; Power Automate scheduled flows; the GitHub Copilot coding agent. **Except** "Copilot agents" (item 2 above). |
| c2 | Nine people and dozens of agents | **Supported**: data/team.json has 9 people; the team map has 98 agents |
| c3 | 70 active agent keys on 6 November | **Supported**: data/keys.json at the end of 6 November has 77 entries, 70 not ended, retired, superseded or replaced |
| c4 | The rule change on 6 November | **Supported for Angelo's agents** (ce069603), not the whole team (item 5) |
| c5 | Published on 6 November by writer@PrompTugal.angelo, signed | **Supported**: 222e196e, 23:40 UTC, with articles/agent-setup-guide.md.sig |
| c6 | Dinis authorised publication | **Secondhand only** (item 7) |
| c8 | Adapted from riskmandate.ai and sharness.ai under CC BY 4.0 | **Supported**: both pages state CC BY 4.0 for their content |

**The other sources:**
- **RiskMandate:** "grant, mandate, delta, barrier; it describes and does not judge, so it carries no score". Pages are CC BY 4.0 and code Apache-2.0.
- **SHarness:**
  - The kernel enforces the policy (Landlock, a network namespace, rlimits, cgroups).
  - The person supplies the hash.
  - The launcher caveat is stated.
  - Content is CC BY 4.0, and no code licence is stated on the home page.
- **sgit:** sgit-ai 0.27.0 on PyPI is Apache-2.0.
- **The protected main branch:** `main` of this repository is protected on GitHub, so that "enforced" example is true.
- **Gemini CLI:** github.com refuses this environment's requests, so I could not re-check it from here.

## 3. The interactive page

**Fixed here, in the fragment (Angelo's folder):**
- **The two questionnaires never hid.** `form.quiz{display:grid}` overrode the `hidden` attribute that the tabs set, so both always showed, one under the other, whatever tab was chosen. Fixed with `form.quiz[hidden]{display:none}`.
- **Light-theme contrast.**
  - The text affected: green and gold text on its soft tint (the tags, the selected pills, "Level 2 · Reviewed" and "Level 3 · Enforced", the "✓ tested" cells). It was at 4.1:1, under 4.5:1.
  - Two light-only ink colours were added: `--green-ink:#156E4E` (5.1:1) and `--gold-ink:#9A4508` (5.4:1).
  - The dark theme is unchanged; it already passed.
- **Now:** no text below 4.5:1 in either theme, no sideways scroll at 390 px, and no script errors. The dial marks the right starting level for all five deployments.

**Open, for whoever publishes it (the writer's "interactive version to follow"):**
1. **Re-sync it with the published text.** The page is the earlier draft, and still holds:
   - ChatGPT and Gemini columns ("Projects, GPTs", "Gems", "Scheduled actions", "Codex", "Jules"). The article left these out because they could not be confirmed.
   - "Copilot agents".
   - "One token per agent, sealed to its key".
   - "Start at level 3" where the article says "enforced".
   - The developer and DevSecOps answers from before items 3 and 4.
   
   Take the article's text, not the fragment's.
2. **Questionnaire A ignores two reaches.**
   - "Posting in public" adds to the gap score, but changes neither the deployment nor the level. An agent that posts in public is told "Start at level 2 · Reviewed", with the mail assistant's barriers.
   - "Company documents" alone also lands on the mail assistant.
   - Proposed: posting in public counts as irreversible (level 3, the "money or production" barriers or a new row); documents alone keep level 2, with the wording "an assistant on your documents".
   - This is a judgement for Angelo or policy@, so it is not applied here.
3. **The progress bar starts at 57%** before anything is answered (the three default answers and a constant step count as done). Count only what the reader chose.

Checked by dev@PrompTugal.angelo. The browser test is reproducible: Playwright at 1280 and 390 px, light and dark, contrast measured against each element's own background.
