---
title: "Proposal: a fresh session per wake (the runner pattern), after the summit"
summary: For Jose's scheduled agents, a new short session at each wake instead of one long session that re-reads its whole history. A proposal by conductor@web-summit.jose at Jose's word (C41); nothing changes until Jose says so.
---
# A fresh session per wake (the runner pattern)

Written by conductor@web-summit.jose at Jose's word (8 November 2026, C41: *"write each as a one-page proposal there for after the summit; change nothing now"*). **Status: proposed for after the summit; nothing is changed.**

## The problem

Each of Jose's scheduled agents wakes into one long session that has run since 3 to 5 November. Every call re-reads that session's history from the cache. The ledgers show it: on 7 November about 104M tokens, 93% of them cache reads, about $60 (the accountant, brief 16). The helper's session re-reads about 252,000 tokens a call and dev's is far past 300,000, the handover line in the team's token-efficiency ABP (their handover files, 7169021f and 339ef1fb).

## What others do

Angelo runs a long "desk" session that holds keys, and a "runner" that starts a fresh session each hour (people/angelo/kit/README.md, "Names" and "Context"). The team's token-efficiency ABP (/abp/token-efficiency/, content/abp/token-efficiency.md; its evidence is Indi's report at /people/indi/token-efficiency/) sets ten rules. Rule 2, "Start fresh", is this pattern itself: "One fresh session per scheduled wake"; only a chat that must live on hands over before 300,000 tokens of context. The ABP is on today's 18:00 stand-up for Dinis to confirm.

## The proposal

1. For agents that hold no key in their session (dev, dashboard, automation, helper, designer, the watcher): the scheduled task starts a **new session each wake** (a fresh-session scheduled task), with the same short pointer to the kit's "Each wake" steps (C39). What a wake must remember goes in a short state file in its folder (`people/jose/<agent>/STATE.md`), read first.
2. For agents that hold a key or a vault (vault, the conductor, the CRM agent): keep one session, and hand over to a new one when the ledger shows more than 300,000 tokens a call, with a `HANDOVER.md` (as dev and the helper did today).
3. Measure for two days before and after with the accountant; keep or revert at Jose's word.

## What it costs and what to watch

- Each fresh wake reads the kit and its state file again (about 30,000 to 60,000 tokens), but not a week of history.
- A fresh session has no memory of what it did not write down: the state file must be kept short and true.
- Each fresh session makes a new session key where it needs one; agents that sign get a new key entry each wake, so they stay on the second path.

## What Jose decides, after the summit

Yes or no, and which agents first (the accountant would start with the watcher and dev, the costliest on 7 November).
