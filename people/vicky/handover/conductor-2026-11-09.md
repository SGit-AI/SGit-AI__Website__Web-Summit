# Hand-over: conductor@web-summit.vicky, 9 November 2026

Written by the outgoing conductor session at Vicky's word (9 Nov, about 11:00 UTC: "We are switching you to a new session now because your context is at 76%"), under scout's P17 and standing answer 11. Public material only (P27): no prompt text, keys, contact details, interview names or email content. What is private went to Vicky in chat.

## First, in the new session (in this order)

1. Read `CLAUDE.md`, then `people/vicky/decisions.md`, then `people/vicky/prompts/conductor.md` (your startup prompt, your three scheduled prompts word for word, the steps for the brief, the 17:30 check and the relay, and every standing rule from Vicky by date). Where they and this note disagree, decisions.md and conductor.md win.
2. Make your own session key: `node pki-agent.mjs keygen --session` (tool from https://pki.sgit.ai/agents/pki-agent.mjs; in this container Node needs `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`). Add only its public half to `data/keys.json` as `conductor-vicky-2` in your own commit, and mark `conductor-vicky` retired with the time.
3. Create your three scheduled tasks, each firing into your own session, with the prompts in `people/vicky/prompts/conductor.md` word for word (section "Scheduled task: ..."): the morning brief `30 8 * * *`, the 17:30 newsroom check `30 17 * * *`, the evening relay `45 20 * * *` (UTC). Then **disable** (do not delete) the three old tasks, which fire into the old session: `trig_013xdhaBHbA52GD47m1JaKDL` (brief), `trig_01NYwcWXpPmsPK9MLgtq5NAt` (17:30 check), `trig_016MC7wrcBLcFqSgfthMqAnZ` (relay). Do this before 17:30 UTC on 9 Nov so no run is lost or doubled. Update `people/vicky/schedule.json` (new ids, "checked") and the conductor row of `people/vicky/agents.json`.
4. Commit with the subject prefix `conductor@web-summit.vicky:` and the trailer `Agent: conductor@web-summit.vicky` (plus `Issue:` and `For:` lines as usual), and the attribution lines the session gives you. Release with `AGENT=conductor@web-summit.vicky SKIP_LIVE=1 admin/tools/release.sh "<sentence>"`. Work only on `dev`; never `main`, never force.
5. Ask vault@web-summit.vicky (in the next brief, "For vault@: reseal ...") only for what you need: see "Keys" below.

## What the outgoing session did with its keys (P17)

- **Deleted from the session on 9 Nov, 11:00 UTC, and checked gone:** the team CRM vault key and its clone (vault `5n0aocvz`, `~/.sg-send/crm/`, `~/vaults/ws-team-crm-private`); the inbox-lane credentials (`~/.sg-send/lanes/conductor.json`, WS-114); the private half of Vicky's person key (`~/.sg-send/issued/vicky.json`).
- **Vicky's person key stays active** (`data/person-keys.json`, `sha256:5bd91e541026290e`): it is in all her browsers (WS-166, done 8 Nov). Do **not** issue her a new one or mark it replaced; her browsers still open what is sealed to her. The conductor simply no longer holds a copy.
- **Sealed by this session:** the team CRM key to inbox-vicky (`data/sealed/agents/inbox@web-summit.vicky/2026-11-07T1117Z-team-crm-key-inbox-vicky.json`, WS-172); a test item to Vicky (`data/sealed/vicky/2026-11-04T1002Z-hello.json`).
- **Sealed to this session's key** (now useless): the team CRM key (`data/sealed/agents/conductor@web-summit.vicky/2026-11-05T1447Z-team-crm-key-conductor-vicky.json`).
- **Reissue to the new key only if needed:** the CRM key (used only when Vicky asks; vault@ reseals it to `conductor-vicky-2`); an inbox lane for feedback (WS-114: make your own lane, or ask vault@; until then the brief says "inbox lane: none"). Nothing else depends on the conductor's key.

## Session set-up

- Model: Opus (claude-opus-5-5), medium effort. Environment: the main cloud environment (`env_01Ar2m893eDv1RnjHnqRYDe5`), sources SGit-AI/SGit-AI__Website__Web-Summit (push, dev) and PrompTugal/PrompTugal__News__Website (read; push only at Vicky's word, never routinely).
- Network used: github.com and raw.githubusercontent.com, web-summit.sgit.ai, promptugal.news, pki.sgit.ai (Node through the proxy as above), the sgit vault service (pip `sgit-ai`). Chromium and Playwright are installed for page checks.
- Connectors present: Gmail, Google Calendar, Google Drive, Notion, GitHub. **Never use Gmail** (P22; only inbox@ does). Do not create or edit Notion pages unless Vicky asks.
- Tools: the scheduling tools (list, get, create, update triggers; send_later) and `get_session` for usage numbers only. Never `list_events`, `get_event` or `send_message` into another session (P6). A task's prompt can be changed only from the session it fires into: route prompt changes to agents through decisions.md.

## The brief, the check, the relay

- **Brief (08:30 UTC):** the steps are "The daily brief" in `people/vicky/prompts/conductor.md`. Reading of reports and usage goes to ONE Sonnet sub-agent (P16). Write `people/vicky/briefs/<YYYY-MM-DDTHHMMZ>.json` and render it with `python3 -I people/vicky/tools/vicky_brief.py people/vicky/briefs/<stamp>.json` (the team's editor_brief look; commit the JSON and PDF, not the HTML; send the PDF to Vicky in the session). Sections: 1 Urgent / Risks (`urgent`), 2 Actions & Replies by window (`actions`: what, why, a copy-paste reply), 3 Agent runs (the run grid, then one table, problems first), 4 Usage & Checks. Latest: brief 8, `people/vicky/briefs/2026-11-09T0845Z.json`. No em-dashes anywhere (the renderer refuses them).
- **17:30 check:** silent unless something is actionable. **20:45 relay:** after the evening re-check; one short message.

## In progress and waiting (9 Nov, 11:00 UTC)

| What | Waiting on | Where the answer arrives |
|---|---|---|
| Publish S31; publish corrections to S24, S25, S27 (brief 8, actions 1 and 2) | Vicky, in the reviewer's window | reviewer's report (`people/vicky/reports/reviewer.md`), newsroom commits |
| WS-168 `/lead-to-article/`: Vicky's review passed to Indi (six steps fine, title kept, interviews on the spot; f692a1ea) | Indi and conductor@web-summit.indi | `board/WS-168-*.md`, commits For: conductor@web-summit.vicky |
| SA26: Persona back to fix; list other Wikipedia-only Abouts | reviewer, 11:15 run | reviewer's report; `people/vicky/company-pages/backlog.md` |
| SA25: 9 of the 12 handed-over checker findings still to reconcile | reviewer, normal runs | `desks/reviewer-vicky/reviews/checker-findings-sa25.md` (newsroom) |
| Company pages: RWS in fix (its site sends no content to a plain read); Rapidoc skipped; 14 blocked for evidence, 4 held (ontologist) | Vicky, if she starts another batch | `people/vicky/company-pages/backlog.md` |
| journalist-europe asks to rename its task ("three-times-daily run" to "scheduled run"); recommended yes, unanswered since 7 Nov | Vicky | journalist-europe's report |
| Updates still to confirm (listed at the end of decisions.md's "Updates for agents") | the agents named | their reports |
| Scout: no topics left; open proposals P12 to P15 and P20 (`people/vicky/learning/README.md`) | Vicky, if she wants them | scout's report |
| Dinis's synthetic agent: the Replit test request was withdrawn (8 Nov); nothing pending | none | none |

Nothing agreed with Vicky is missing from decisions.md, the prompts files or schedule.json; T1's count request is closed (recorded in conductor.md).

## Numbering

- Next standing answer: **27**. Updates for agents take a short code (as SA26, HANDOFF-FIX).
- Next brief: **9**. Next scout proposal: **P31**. The curator's storylines continue from S32.

## Read first, in order

1. `CLAUDE.md`
2. `people/vicky/decisions.md`
3. `people/vicky/prompts/conductor.md`
4. this note
5. `people/vicky/schedule.json`, `people/vicky/agents.json`
6. `people/vicky/inbox.md`, `people/vicky/newsroom/README.md`, `people/vicky/prompts/README.md`
7. `people/vicky/company-pages/backlog.md`
8. the latest brief JSON and `people/vicky/reports/*.md` since it

## Checklist for Vicky

- [ ] The new session made `conductor-vicky-2` in `data/keys.json` (its own commit) and marked `conductor-vicky` retired.
- [ ] Three new scheduled tasks fire into the new session at 08:30, 17:30 and 20:45 UTC; the three old ones are disabled; schedule.json shows the new ids.
- [ ] The new session's first commit uses `conductor@web-summit.vicky:` and `Agent: conductor@web-summit.vicky`, on dev, and the gate printed OK.
- [ ] It has read decisions.md and conductor.md and says standing answer 27 is next.
- [ ] Its 17:30 check today runs from the new session (or stays silent with nothing actionable).
- [ ] The CRM key and an inbox lane are resealed to the new key only if you want the conductor to have them.
- [ ] The old session commits nothing more under this name.
