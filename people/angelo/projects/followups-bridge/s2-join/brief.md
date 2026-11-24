---
title: "S2: joining Dinis's CRM tool: how our design completes it, the customisation options and pathways (spec)"
item: followups-bridge-s2
project: followups-bridge
by: followups-bridge.pm@PrompTugal.angelo
written: 2026-11-24
role: spec
size: large
go: "Angelo, 24 Nov ~16:25, in the lead's session: \"Yes please. Then let me know how our design can help complete the CRM work and what are the customization options and pathways we should consider.\""
---
# followups-bridge-s2: joining Dinis's CRM tool

Wake routine: trig_01AVamZUMw45sJAxPkJZnq3k

Your folder is people/angelo/projects/followups-bridge/s2-join/. Branch pool/followups-bridge-s2 (from origin/project/followups-bridge). Write only s2-join/plan.md and s2-join/STATE.md (plus your estimates and ledger lines). **Read-only everywhere else.** You read no vault, no drop box, no real contact; examples use made-up people, labelled.

## Context (read first)
- The project: BRIEF.md (Angelo's six needs, and the "Re-scoped" section at the end) and STATE.md (the two reviews of Dinis's tool, 24 Nov, and the keys today).
- Our design: the s1 spec on the branch pool/followups-bridge-s1, people/angelo/projects/followups-bridge/s1-spec/spec.md (git fetch origin pool/followups-bridge-s1; git show). Reuse it; do not repeat it.
- Dinis's CRM tool (public; material only, change nothing): SovereignWebsite/Site__Tool__CRM, branch dev (CLAUDE.md, README.md, site/), live at https://crm.tool.sovereignweb.site/app/; its source history on AgentiCCells/AgentiCCells__Cell__Email branch work/crm.dev.a (crm/model/crm.mjs, crm/README.md, crm/notes/: plan, log.md, requests.md, workflows-and-virtual-inbox, handover), and PrompTugal/PrompTugal__News__Website board/team/maestros/from-a.md and board/guidance/README.md (how contributions and requests reach Dinis's agents). Clone with git clone --filter=blob:none, or add_repo with access read. You may open the live app in Playwright in its synthetic demo mode only; never open or create a real vault.

## plan.md must answer (one phone screen of summary first, then the detail; every claim with a path, sha or URL)
1. **What his tool has against Angelo's six needs** today (built / partly / absent), checked in its code, not only its notes.
2. **How our design helps complete it:** for each gap (team contacts vault and key holders, "in progress by", notes on actions, XLSX import, source/who met them, append-only log, several people saving, views "mine / due this week / by stage / last touch", security@'s condition 4: lawful basis, removal route, retention, key holders), what s1 already worked out that carries over, mapped to his records and files; what is new work. Keep s1's privacy rules (no email or phone unless the team decides otherwise; note his crm.person/1 requires emails[]).
3. **Customisation options:** what his tool lets a team set without code (per-vault stage lists, e.g. the "Our work" vault; fields; views; brand), what needs a change in his code, and what would need our own copy. For each, does it keep the later sync with his tool easy.
4. **Pathways**, two or three real ones (for example: requests to his CRM agent through its Requests page or his maestros; our own work branch with changes Dinis merges; our own layer or fork using his model). For each: speed, who it depends on, what it needs from Angelo (tier 3, named), risk of drift. Then **the recommendation**, in one line.
5. **Getting the six on, step by step:** Angelo's own login first; the team vault; loading Angelo's 35 and Indi's 19 through the CSV template (kept private, never in a repository); what each person does in about 15 minutes.
6. **Tier 3 for Angelo**, as questions with your recommendation; and **draft one short note from Angelo to Dinis** (for Angelo to send; it says what we offer and asks the two or three things only Dinis decides).

- **Done when:** plan.md answers all six, every path it names exists, the gate prints OK on pool/followups-bridge-s2, STATE.md says "ready for Angelo's read", and you fired the wake routine.
