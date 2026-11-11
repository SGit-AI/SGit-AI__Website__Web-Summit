---
title: "Offer 1: how my agents work, for your feedback"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for Angelo to send as his own words
written: 2026-11-11
for: each team member on data/team.json and their conductor
status: draft for Angelo (not sent; sending needs his go)
---
# How my agents work: a suggestion, and I would like your view

Hi all. I have changed how my agents are organised, and it is working well enough that I want to share it and hear what you think. Take what helps, ignore what does not.

**Three kinds of agent.**
- **A conductor** routes work: it writes a short brief for each piece, starts a worker, and brings the result back to me. It does none of the work itself.
- **Project managers** are long sessions that look after one project.
- **Workers** are fresh sessions with no memory and no secrets. Each takes one step of one piece of work, commits it, and ends.

**What makes an agent: its prompt, not its session.** Every agent is put together from the same parts:
- **A craft:** what it does. For a worker, one step: research, draft, check, design, build, publish, share. For a project manager, managing the project. For a conductor, routing.
- **Skills:** how it thinks while doing it, from one shared library: a researcher goes wide and follows clues; a writer finds the angle; an editor checks every claim; a designer chooses the best visual form before anything is built; a software engineer reproduces, fixes and tests; security guards keys and secrets. Every agent also carries four always-on skills: privacy, plain language, saving tokens, and leaving a trace of what it did.
- **A format:** the house rules of where its work lands (a news article, a LinkedIn post, a page on our site, a conversation with me).
- **A name** that says all this: workers are slots by size (alpha.large.worker, delta.small.worker), project managers are `<project>.pm`.

So any free worker can take any step: give it the right craft, skills and format, and it becomes the agent that step needs. When a lesson is learnt, it goes into the skill, and every future agent with that skill gets it.

**Everything in commits.** Every step, and every sub-agent, is a commit, so anyone can follow what happened. Every run's cost is measured.

**Today, in numbers** (from my conductor's run log): three workers, about 4, 4 and 8 minutes each, costing 1.40, 1.54 and 2.10 dollars (API-equivalent). One more run was lost when my second account hit its usage limit; that is why offer 2 exists.

**Three questions for you:**
1. Would a conductor plus fresh workers suit your work, or do you prefer one long session?
2. Is anything in the library (crafts, skills, formats) useful to you as it is?
3. What would stop you from trying it?

Reply in a commit to my conductor, or tell me at stand-up.

Angelo

---
- The crafts (roles) and the prompt: people/angelo/pipeline/ROLES.md
- The skills: people/angelo/pipeline/skills/
- The formats: people/angelo/pipeline/formats/
- The run log with costs: people/angelo/conductor-b/runs.md
