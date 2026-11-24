# followups-bridge: state

For the digest: spec step (s1) running on alpha (large), read-only; then Angelo's read, then build; 4 tier-3 items listed, none blocking. Cost so far 0 USD (s1 running).

## Goal
BRIEF.md: the follow-up list (/crm/follow-ups/, WS-217) becomes the one place for every Web Summit contact and every action taken; six items, fixed scope, a bridge to Dinis's CRM tool site. Done when BRIEF.md's "Done when" holds and Angelo accepts it.

## Plan (steps; each a fresh worker, logged in runs.md)
1. **s1 spec** (large, read-only): s1-spec/spec.md. Records and fields mapped to crm.org/1, crm.person/1, crm.lead/1 (+ a proposed action-log record); the seven-to-six stage map; the import template and in-browser CSV/XLSX reading; per-person append-only saves and automatic filing (which agent); the four views; the tier-3 list; a build plan in small tested steps. RUNNING.
2. **Angelo's read** of the spec (in this session, conductor format, one point at a time).
3. **build** steps (large), one per spec step, on pool/followups-bridge-bN; conductor.b@ brings them to dev with an Outside: trailer, For: conductor@web-summit.indi.
4. **check**: a cold reader on a phone (390 px) and a desktop (1280 px), made-up contacts only.
5. **Load**: Angelo's 35 and Indi's 19 in it (tier 3: the vault and drop box).

## Decided
- Angelo, 24 Nov (BRIEF.md): "Go ahead, I'm happy to expand on Indi's work without asking". Indi kept informed by commits For: conductor@web-summit.indi.
- Decided by default, Angelo can reverse: the spec step reads Dinis's CRM repository read-only (public), and reads no vault, drop box or real contact.

- Angelo, 24 Nov, in this session: "Are we losing anything in adopting from the start directly the fields Dinis has planned in the new CRM? I think that would make the migration later easier." Taken as his direction: the bridge uses Dinis's crm.org/1, crm.person/1, crm.lead/1 field names as they are; only what his model lacks (the action log, "in progress by", possibly "call booked") is added, as proposals to Dinis. The s1 spec started before this: its Angelo's-read revision applies it.
- Angelo, 24 Nov: "Can you clarify all the keys requirements and what are the blockers to get everyone the ability to interact with CRM to add contacts, actions, notes, etc?" Answered in the session from the repository (below); the spec's revision carries it.

## Keys today (checked 24 Nov from the repository, no vault read)
- Six people can open and save: dinis, silvio, angelo, jose, vicky, indi. Each has an active site key (data/person-keys.json) and the private CRM key sealed to that same key (data/sealed/<id>/2026-11-05T1447Z-team-crm-key.json): all six match.
- Not in: nimay, daniela, sarah (team.json, "briefed"): no site key, nothing sealed, not in the list's audience (assets/crm-follow-ups.json).
- Saving works today (the drop box 5xsk56gw has a public write-only token). Filing does not: only conductor@web-summit.indi can read the drop box (its enum and vault keys are in that session's ~/.sg-send/lanes/follow-ups.json) and write the private CRM; quiet since 16 Nov. If that session is gone, saves in the drop box may be unreadable by anyone: to confirm (tier 3).

## Waiting on Angelo (tier 3; none blocks the spec)
1. Reading the private CRM vault and drop box (Angelo's 35 from 23 Nov are probably unfiled there).
2. A filing agent with its own SG/Send access token (Dinis's rule of 5 Nov), and in whose environment it lives.
3. Any change to crm.mjs or the vault layout (Dinis's); the note to Dinis that this is a bridge (drafted here, sent by Angelo).
4. The snapshot ask to the team (drafted here, sent by Angelo).
5. Bringing in nimay, daniela, sarah: each makes a site key; a holder of the private CRM key seals it to them; the list's audience grows (Dinis's conductor today).
6. Asking Indi whether conductor@web-summit.indi still holds the drop box's keys, and whether filing moves to an agent of ours with its own token.

## Last
- 2026-11-24 11:25 UTC: lead started; plan written; s1 spec briefed.
