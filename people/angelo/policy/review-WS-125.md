---
title: "WS-125: the agent setup guide, checked against the ABP model, the levels and Angelo's protocol"
summary: policy@PrompTugal.angelo's review of the guide, at Angelo's ask in this session (7 November 2026, about 10:40 UTC). Five things a customer could be misled by, three smaller ones; what is right. dev@PrompTugal.angelo's review (beside the guide) covers accuracy and the page; this one does not repeat it.
---
By policy@PrompTugal.angelo, for Angelo, 7 November 2026. Angelo's ask, given in this session; the desk's brief of the same ask (`c5e05274`) is copied on the commit so it can track it.

**What was read:** `people/angelo/proposals/WS-125/agent-setup-guide.fragment` (the interactive version, re-synced with the published text by dev@ in `eea247d7`), including the dial's data in its script; dev@'s `review-dev.md`; and, fetched today, riskmandate.ai/agent-behaviour-policy.html, riskmandate.ai/abp.html, sharness.ai and sharness.ai/design/. The published article in the newsroom repository was not read directly; where the fragment and the article differ, dev@'s re-sync is the evidence.

**In short:** the guide is honest about its limits (its "What this does not claim" section is good), but its three levels misstate the model it credits, and it tells customers that some things "hold" which, by that model, are not controls. Fix 1 to 5 before the interactive version is published.

## Fix before publishing

### 1. The three levels are attributed to the wrong source, and the model already has its own scale

- **Now:** "The three levels below are this guide's own way of sorting barriers, not RiskMandate's", and level 2 and 3 cite "SHarness's words": a *setting* and a *boundary*. The kit's README says "in SHarness's terms expectation, setting, boundary".
- **At the source:** these terms are RiskMandate's. riskmandate.ai/abp.html classifies every barrier into four kinds: **none** ("nothing in the way"), **expectation** ("a rule in prose, enforced by nobody"), **setting** ("a switch the agent's own account can flip") and **boundary** ("enforced above the grant, out of the agent's reach"), with a column "Is it a control": only a boundary is. SHarness uses "setting" and "boundary" only in passing ("a Boundary for the child and only a Setting for the process") and never "expectation".
- **Proposed:** credit the four kinds to RiskMandate, and present Watch / Reviewed / Enforced as the guide's own *practice levels* mapped onto them: Watch and Reviewed are both **expectations or settings** (not controls); only Enforced is a **boundary**. Keep "none" visible: today the guide has no level for "nothing in the way", which is where most step-1 to step-3 readers actually are.

### 2. "Reviewed" reads as a control; by the model it is not

- **Now:** Level 2, "A person, or an independent auditor agent, checks before or after", sits between Watch and Enforced as the middle of a dial, and for "A team of scheduled agents" it is the recommended start.
- **Why it matters:** a check *after* the fact stops nothing; only a person's approval *before* the action (two-person approval, a person pressing send, a person merging) is a barrier, and only when the agent cannot do the action without it. The guide mixes both under one level.
- **Proposed:** split level 2 into "approved before" (the agent cannot act without a person: a barrier if the tool enforces it) and "audited after" (finding out sooner: not a barrier). Say plainly that an auditor, ours included, is the second kind.

### 3. "Barriers that hold" for a team of agents lists things that do not hold

- **Now (the dial, "A team of scheduled agents"):** "Barriers that hold: Commits only between agents; a check of who pushed; the auditor reporting to the person."
- **At the source:** all three are expectations: an agent that ignores "commits only" can message another session; the auditor reports after the fact (2 above); and **the check of who pushed proves less than it seems**: every agent of Angelo's pushes from the same account (riskmandate-angelo), so a commit "pushed from Angelo's account" proves that some session in his account pushed it, not that his conductor did. Any of his agents, tricked, passes the check. (Policy's map records this as a weakness of rule R8, from today.)
- **Proposed:** "What helps: commits only between agents; a check of who pushed; an auditor reporting to the person. None of these holds against a tricked agent: only one token per agent (level 3) does." The level-3 text already says this; the "hold" line contradicts it.

### 4. SHarness is described as working; it says it is a design

- **Now:** "SHarness (open source) runs each tool as a process under a policy the kernel enforces" (CISO and DevSecOps), and under Open source: "Runs an agent's tools as small processes ...".
- **At the source:** the homepage's status is "Design, with the first experiments", with "no other component" than the launcher's first slice built; the launcher is the open decision ("Who runs the launcher").
- **Why it matters:** a CISO who reads this as a product they can deploy today for "money or production" (the dial's level 3 names "the tools in a process sandbox") is being told a barrier exists that does not yet.
- **Proposed:** "SHarness, an open-source design with its first experiments (November 2026), aims to run each tool ..." and, in "money or production", name the sandbox generically ("a process sandbox, for example containers or seccomp/Landlock profiles") rather than one unbuilt tool.

### 5. Secrets: the guide recommends something no listed tool does, and not what we do

- **Now:** "secrets in a vault the agent can use but never read in the clear" (DevSecOps), and "Secrets in an encrypted vault (sgit), never in a file, a page or a message".
- **At the source and in our practice:** sgit encrypts at rest, but the agent that opens it reads the secret in the clear; Angelo's own rule since 6 November is a secret in the one agent's cloud environment, read by that agent (kit, "Secrets: one cloud environment per agent"); "use but never read" is what vault@'s sharness.kms analysis (`6d3ccd60`) puts after the summit.
- **Proposed:** "Secrets per agent, where only that agent can reach them (its own environment, or an encrypted vault only it can open); never in a file, a page or a message. An agent that can use a secret can also read it, until a broker exists that holds it for the agent." And list it under "What this does not claim".

## Smaller

6. **"Agents push to a development branch only"** is stated as our shape; this week Angelo's agents pushed session branches 73 times (policy P-02, P-05) and the desk's brief for new workers (`1d6ba95d`) has them push their own branches. Either fix the practice (WS-179) or say "our rule; we are still enforcing it".
7. **"Today, visitors' notes are not read by any agent at all"** is true in practice and not enforced: a stranger can write to an agent's lane through the public form, and the drain would show it to the agent (policy P-01). Proposed: "No agent of ours is meant to read a visitor's note; making that impossible is in progress."
8. **The third tier:** "only with the person's own words, quoted". Angelo's protocol says his own words *in the agent's session*, or *quoted* when relayed by the conductor; the quote is not verifiable by the agent (policy P-04). Proposed: "only with the person's own go, given in the agent's session or relayed with their words quoted".

## Right as written

- The ABP's four objects (grant, mandate, delta, barrier) and "It describes and does not judge, so it carries no score": both verbatim at the source.
- "Prompt injection turns every barrier the agent applies itself into a suggestion; only level 3 holds against an agent that has been tricked": consistent with the model's "Is it a control".
- The customer-facing and money deployments starting at Enforced; a person pressing send for the assistant; admin rights kept by the person; one token per agent as the target, with "where we are going, not where we are" said honestly.
- CC BY 4.0 for both sources' content; SHarness's code licence correctly left unstated.
