---
title: "A LinkedIn reader's question on authority checks: who asked, and what we already have"
summary: For the writer and the desk. The question, what public pages say (and do not say) about who asked, and the existing resources that answer it, each with its link and the date read. No contact detail, nothing private.
---
Written by research@PrompTugal.angelo, 9 November 2026, from backlog 0-URGENT-2 (Angelo, about 00:05 on 9 November). Public sources only; LinkedIn is login-only and was not read.

## The question (as Angelo relayed it)

"Fascinating map, Angelo. When 100+ agents collaborate asynchronously, do you enforce deterministic authority checks at each node, or rely on upstream agent validation?" It was a comment on Angelo's post of the evening of 8 November.

## 1. The person: not identifiable from public pages

- The only handle given is the one in his profile address, `usmananzaar`. I searched the open web for that exact handle and for the likely spellings of the name ("Usman Anzaar", "Usman Anzar") together with AI-agent authorization (2026-11-09). **Nothing public matched**: the results were generic name pages and unrelated people. I did not guess among them.
- So I cannot confirm his name, role, company or what it sells. Writing any of that would be a guess presented as fact, so I leave it out.
- What the question itself shows, and only that: he uses the vocabulary of authorization and access control ("deterministic authority checks", "upstream validation", "each node"). That fits a security or identity engineer, a founder or buyer in agent governance, or a researcher; the text cannot tell which. The topic is an active market in 2026 (public examples of products and papers about authorization layers for AI agents exist), so a vendor angle is possible but unproven.
- **Ask for Angelo (one line):** open his public profile yourself and give the desk the name, role and company as he shows them; I will then check the company's own site and any public talks. Until then, answer the question, not the person.

## 2. Existing resources that answer it

Links checked on 2026-11-09 (all returned 200 unless stated).

**On PrompTugal.news**
- [Angelo's communication graph](https://promptugal.news/articles/angelos-communication-graph.html): the map the reader saw; the article that says "dozens" and is due to say "over a hundred" (backlog 0n).
- [How agents avoid collisions](https://promptugal.news/articles/how-agents-avoid-collisions.html): coordination between agents working at once.
- [The agent setup guide](https://promptugal.news/articles/agent-setup-guide.html): how an agent is set up, with its own key and environment.

**On riskmandate.ai**
- [llms.txt](https://riskmandate.ai/llms.txt): the model. A grant is what a credential permits; a mandate is what the holder is authorised to do; the gap is exposure. RiskMandate is read-only and never in the request path: it defines the mandate and measures the gap, it does not enforce it. That is the honest frame for the answer: enforcement is a separate layer.
- [The Agent Behaviour Policy](https://riskmandate.ai/agent-behaviour-policy.html) and [riskmandate.ai/abp.html](https://riskmandate.ai/abp.html): Reach, Mandate, Gap, Barrier, each barrier labelled as a rule, a review or a technical control.

**On this site and sgit.ai**
- [Agent Behaviour Policies: one for each of our agents](/abp/): 93 policies in RiskMandate's terms, in the explorer phase (observe and recommend; block nothing unless really dangerous, per Dinis, 6 November). This is the evidence for "what is a rule and what is a control".
- [sgit.ai llms.txt](https://sgit.ai/llms.txt): the vault and PKI the keys and signatures rest on.
- In this repository, not published as a page (so no link): the kit's protocol, `people/angelo/kit/README.md` (the tiers, "pushed from Angelo's GitHub account" check, signed messages, one key and environment per agent), and `admin/tools/` and `admin/build/validate.js` (the gate and the lane check).

## 3. What the record supports as an answer (for the writer to check against the sources)

Both, by design. Written down, not tested by me:
- **Checked by code at the node:** who pushed a commit is checked against GitHub's record before an agent acts on it (`people/angelo/tools/pushed-by.mjs`); the lane check (check 21) lists writes outside an agent's area and refuses an undeclared one once enforcement is on; the site's gate refuses a bad build; signed messages name recipient, action and old value and are refused on replay; a secret lives only in its own agent's environment.
- **Only a rule or a review (upstream, human or agent):** tier 3 needs Angelo's own words (a rule an agent follows, not a technical block); workers' branches are reviewed by dev@, dashboard@ or vault@ before reaching `dev`; policy@'s audits; fact-checkers.
- **Say plainly:** the lane check's enforcement is described as "once policy@ turns it on"; I did not check today whether it is on. The ABP pages are explorer-phase: they observe, they do not block. The article must not claim every node is enforced.

## 4. What I could not check

- Who he is (above). LinkedIn itself, his post thread and any comments: login-only, not read.
- Whether the lane check is currently enforcing, and whether every "rule" above has an evidence page; the writer should read check 21 and `/abp/` before writing.
