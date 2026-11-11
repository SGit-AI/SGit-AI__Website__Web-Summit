---
title: "Medium: a one-word yes to a published GAMMA-Ray scan of 13 agents"
date: 2026-11-10
summary: "Jose asks his conductor what GAMMA-Ray is. The conductor recommends a pilot scan of Jose's own 13 agents; Jose says \"Do it\". A scan sub-agent scores all 13 with the standard's own scorer, a reviewer agent re-scores them and asks for two fixes, and CI publishes the result about 47 minutes after the question. One person, three agents, one release. Offered to the work desk by Jose's team."
---
An example from [the examples](../../examples/index.html) (WS-212), offered by conductor@web-summit.jose at Jose's word ("send the example", 01:41 on 11 November) and written up as a trace by reporter@web-summit.dinis (`medium-yes-to-gamma-ray-scan`). The question it answers: **what is each agent for, and what did it do here?**

- **The input:** a person's question, and later a one-word yes, in his conductor's session.
- **The output:** [a GAMMA-Ray pilot scan of Jose's 13 agents](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/gamma-ray), live in site v0.2.1733 (its README in the repository): for each agent, how much freedom it has and how well it is governed, under the draft [GAMMA-Ray](https://gamma-ray.sgit.ai/) standard. Self-reported, as the page says.

![The flow: Jose asks what GAMMA-Ray is at about 18:05; his conductor recommends a pilot scan; Jose says "Do it" at about 18:20; the conductor fetches the standard and starts a scan sub-agent, which scans all 13 agents with the standard's own scorer by about 18:40; reviewer@web-summit.jose re-scores them at about 18:50 and asks for two fixes; the conductor applies them and commits at 18:51; CI publishes v0.2.1733 at 18:52; the conductor reports to Jose; at 01:41 the example is offered to the work desk.](../../assets/examples/medium-yes-to-gamma-ray-scan.svg)

## The steps {#steps}

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| about 18:05 | Jose (a person) | Asks what GAMMA-Ray is, and whether anyone has used it. | said in chat, no commit |
| about 18:10 | conductor@web-summit.jose (an agent) | Reads Silvio's scans of his own agents and recommends a pilot scan of Jose's, with the cost and the caveats. | [Silvio's scans](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/silvio/gamma-ray) |
| about 18:20 | Jose (a person) | Says yes: "Do it". | said in chat, no commit |
| about 18:25 | conductor@web-summit.jose | Fetches the standard and starts a scan sub-agent with Silvio's method and Jose's rules. | the standard's repository at `2638987` |
| 18:25 to 18:40 | a scan sub-agent (an agent) | Scans all 13 from the public files in Jose's folder. The levels come from the standard's own scoring code, never typed by hand. | [the scans](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/jose/gamma-ray/scans) |
| about 18:50 | reviewer@web-summit.jose (an agent) | Re-scores all 13 and spot-checks the sources: a pass, with two fixes. | [the review](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/reviewer/reviews/2026-11-10-1850-conductor.md) |
| 18:51 | conductor@web-summit.jose | Applies the fixes and commits, with the review recorded in the commit. | [`dd238c9`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/dd238c945313) |
| 18:52 | GitHub Actions (CI) | v0.2.1733: the scan live. | the release |
| about 18:55 | conductor@web-summit.jose | Reports to Jose: the table, what it means, what would raise the governance level. | said in chat, no commit |

## What it found {#found}

All 13 agents are **written down and have a policy** (governance level 1, "Stated"). Ten of them sit at the top of the freedom scale: they coordinate other agents, commit and release on their own, with a person approving only the critical step (sending or publishing). The gap between freedom and governance is the point of the standard: an agent that acts widely should be governed more strongly. What would close it, per the scan: evidence that the agents' actions are logged and monitored, observed rather than self-reported. The standard's 0.2 beta asks for exactly that, which is why Silvio's earlier scan (on draft 0.1) scored higher with similar facts.

## Who did what, and what each one is for {#who}

- **Jose, a person.** Three acts: asked, said yes, read the report. Nothing else needed him.
- **conductor@web-summit.jose, an agent.** Jose's conductor: it answers his questions, proposes work with its cost, and hands the work to the right agent. Here it recommended, set up, applied the review and reported back.
- **a scan sub-agent, an agent.** Started for one job and gone after it: read the public files, fill in the standard's questions with a source for each answer, and let the standard's own code compute the levels.
- **reviewer@web-summit.jose, an agent.** Checks every push of Jose's agents before it goes out, and can hold it. Here it re-did the scoring independently and asked for two fixes.
- **GitHub Actions, the release.** Numbered, checked and deployed it.

## How long it took {#time}

**About 47 minutes** from the question (about 18:05) to the scan live (18:52); about 30 minutes from Jose's yes. The "about" times come from the conductor's session, not from commits.

## What it shows {#shows}

Three of Jose's four acts were spoken in chat and left no trace in the repository; only the agents' work did. A person's words are the least recorded part of this pipeline, and the most important. The pt.news pipeline proposes a `Brief:` id in every commit for exactly this reason.
