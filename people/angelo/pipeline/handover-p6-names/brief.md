---
item: handover-p6-names
project: handover-market
role: spec (large); format web-summit-site
Wake routine: trig_01Sp6G7mUcG4f97btiJRmgK4
---
# Step: worker names that say model and environment; external work counted like any other

**Angelo, 11 Nov:** "I think we need to include the environment in the name before the @. Also, let's be explicit about the model name. So alpha.opus-5-5.openrouter.worker? But we also have claude as an environment and chatgpt, etc." Then: "We don't need to distinguish between different claude environment, what matters is the overall environment shape, not individual accounts." Earlier: "we want to be able to track each and every agentic activity though commits".

**The scheme (agreed):** `<slot>.<model>.<environment>.worker@PrompTugal.angelo`. Slot: alpha... (size implied by the slot list, people/angelo/pipeline/QUEUE.md). Model: as asked, dashes (opus-5-5, sonnet-5-5, haiku-5-5, deepseek-v3-2). Environment: claude, openrouter, chatgpt, ollama, aws (the shape, not the account). An inner agent a worker starts on another environment has its own name, e.g. alpha.sonnet-5-5.openrouter.worker@ under alpha.sonnet-5-5.claude.worker@.

**Do.**
1. Draft the changes, as files in your folder, without editing the live files: names.md (the scheme, one screen; the model actually served goes in the ledger, the name says the model asked for); ROLES-diff.md (the exact line changes to people/angelo/pipeline/ROLES.md's preamble and roles, QUEUE.md's slot list, skills/project-manager.md and skills/conductor.md for the new names, and a `Sub-agent:` line form for inner agents on other environments: name, environment, model, tokens, cost).
2. lanes-draft.md: what people/angelo/policy/lanes.json (policy@PrompTugal.angelo's file) would need so each slot entry accepts any model and environment, and whether admin/build/validate.js's lane check (check 21) can match a pattern today; the change for policy@ to make, as a proposal.
3. ledger-proposal.md: how a ledger line in people/angelo/ledger/ records an inner agent on another environment (provider, model asked, model served, tokens, cost, who pays), today written by hand by the worker; what people/indi/accountant/measure.mjs (Indi's tool) and the accountant role in ROLES.md would need to total by environment; a proposal for its owner, not an edit.
4. Fill the table in names.md with today's runs of this project (people/angelo/projects/handover-market/runs.md at your brief's commit): old name, new name, environment, model, cost.

**Never.** Edit ROLES.md, QUEUE.md, skills/, lanes.json, measure.mjs or validate.js themselves; contact anyone.

**Writes.** people/angelo/pipeline/handover-p6-names/ (names.md, ROLES-diff.md, lanes-draft.md, ledger-proposal.md, STATE.md), your estimates and ledger lines.

**Done when.** the four files are on pool/handover-p6-names, every path named exists, the gate prints OK, STATE.md says "ready for the lead's read". Last, fire the wake routine.
