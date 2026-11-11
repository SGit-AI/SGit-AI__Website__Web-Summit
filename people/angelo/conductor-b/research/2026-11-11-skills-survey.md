---
title: "What the team already has for skills, roles and formats (a survey)"
by: conductor.b@PrompTugal.angelo, through an in-session sub-agent (read-only search), at Angelo's ask
written: 2026-11-11
for: Angelo; input to b0-library (the prompt library, skills and formats)
cost: one sub-agent, 23 calls, about 170 thousand tokens before cache reads (2.45 million with them), about 2 minutes; in the ledger line of 2026-11-11T10:41Z
---
# Survey: skills, roles and formats across the team

Angelo, 11 Nov: "Can you please take a moment to challenge the current skills and formats, exploring also what others in the team have been doing on those areas to refine the approach?" The survey read both repositories (this one and the newsroom, at its dev). Its findings, condensed; everything read is material.

## Point to these, do not rewrite
- The newsroom's house style: desks/journalist-vicky/STYLE.md (sections, 400 to 600 words, British spelling, sources with read dates, "What this does not claim", at most two review rounds); desks/reviewer-vicky/README.md (review order: facts, format, images, tone and safety, angle, style); desks/checker-vicky/publish-workflow.md.
- The gates: newsroom/build/validate.js (front matter, title under 12 words, signed twin, no email or phone, no em-dash) and admin/build/validate.js here.
- The brand: the newsroom's design/brand/ and its guide.
- Plain language: people/indi/EXPLAIN.md (ten rules, a check before sending).
- Channels: people/angelo/proposals/social/README.md (LinkedIn mechanics), people/indi/social/README.md (a themes ledger), people/silvio/video/PUBLISH.md (per-channel link rules).
- Interviews: the newsroom's content/newsroom/interviews.md and content/brief/05-interviews.md (consent).

## Roles and skills we can reuse
- The newsroom's board/team/*/ROLE.md shape (Focus, Paths I write, How it works, Never) and its ABPs as data with a hook that re-reads them after compaction (board/abp/).
- The passes (board/the-passes.md): a fixed review order, a budget as a hard stop, never loop on own findings.
- Jose's reviewer (people/jose/reviewer/ROLE.md): pass, pass with notes, hold.
- Indi's accountant (people/indi/accounting/, accountant/measure.mjs) and the token-efficiency ABP (content/abp/token-efficiency.md).
- sherpa's and synthetic's cold-reader protocol; the reporter's traces (team/reporter/BRIEF.md, traces/*.json: time, actor, in and out, hand-off, evidence).
- Indi's prompt library with versions and a Lessons list (people/indi/prompts/README.md); Vicky's prompt library (people/vicky/prompts/).

## Lessons recorded by others
- Rules alone failed; reviews caught mistakes; every technical barrier came after a review named the gap (content/abp/in-action.md).
- A field-shape mismatch left an agent with no mandate; a dotted name hid an agent from the team pages (Indi's prompt lessons).
- Budgets "capture, not block"; two days after the token rules only 3 of 7 teams were measuring.

## Gaps nobody covers
- No portable SKILL.md or .claude/skills anywhere; the same rules are pasted into many prompts.
- No machine-checked social post format.
- No shared reviewer checklist across desks.
- No single index of prompt lessons.
