---
title: "ABP creation: an agent that writes the rules with you"
summary: How to get an Agent Behaviour Policy for one of your agents without writing it yourself. The ABP maker asks you up to ten questions, then drafts the policy for Dinis's ABP author to review.
---
How to get an Agent Behaviour Policy for one of your agents without writing it yourself. The ABP maker asks you a few questions, then drafts the policy for Dinis's ABP author to review.

At the RiskMandate stand, the same ten questions make a draft in about two minutes, suggested from a company's X-ray: [Make your ABP](../abp-make/index.html).

## What an ABP is {#what}

An Agent Behaviour Policy (ABP) says what one agent can do, what it was asked to do, and what stops it doing the rest. Every agent on the team has one: see [the ABPs](../abp/index.html).

## What the maker does {#maker}

abp-maker@web-summit.indi is a prompt you paste into a new session. It:

- reads two or three of the team's real ABPs, so the draft looks like ours;
- asks you up to ten questions, one at a time, each with a safe default you can accept by saying "default";
- writes the ABP: Reach, Mandate, Gap, Barriers, Licence to Operate, Provenance;
- checks it: every rule can be tested, the gap is named, at least one barrier is more than a rule, nothing contradicts;
- hands it to abp@web-summit.dinis as a draft. It is never in force until they say so.

## The questions it asks {#questions}

1. Which agent is it, and whose?
2. What is it for, in one sentence?
3. What can it reach today: tools, repositories, vaults, connectors, keys, money, people it can message?
4. What must it never do?
5. What needs a person's yes?
6. Who may tell it what to do?
7. What may it read but never act on?
8. What does it do when it is unsure?
9. How often does it run, and how many tokens may it use each time?
10. What shows it behaved?

It skips anything you already told it. "Not sure" is a fine answer: the draft records it as an open question instead of guessing.

## A short example {#example}

Marta (a made-up person) has a LinkedIn agent that she says will "post stuff about our launch". The maker asks for the specific thing and learns it drafts three posts a week for the company page. When asked what it can reach, Marta says it is logged in to the company's LinkedIn page and can post directly, and it can change a shared folder of launch photos.

The draft names the gap: the agent can post publicly on its own, but Marta wants a person's yes for anything public. Today only a rule stands in the way. So the draft proposes a stronger barrier: remove its direct posting, and have it leave drafts for Marta to post. Its open questions: who the marketing lead is, and when the licence ends.

## What it hands over, and to whom {#handover}

- One file, `content/abp/<agent>.md`, committed to `dev` and marked "draft for review".
- A five-line summary for you: the gap, the strongest barrier, the weakest point, the open questions, where the file is.
- The review goes to abp@web-summit.dinis, who keeps [the ABPs](../abp/index.html) and decides when it joins the list.

## How to start one {#start}

1. Open a new Claude Code session on the Web-Summit repository, branch `dev`.
2. Copy the prompt from [abp-maker.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/prompts/abp-maker.md) and paste it as your first message.
3. Answer its questions. It takes about ten minutes.

Made by conductor-abpmaker@web-summit.indi for Indi, at Dinis's request, on 11 November 2026 (WS-34). Tested once with a made-up person; the test is in `people/indi/helpers/abpmaker/DONE.md`.
