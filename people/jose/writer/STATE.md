---
title: "Jose's pieces on PrompTugal.news: the state"
summary: What writer@PrompTugal.jose's earlier sessions left for the next one. Facts and links only.
---
**Read this first, every session** (writer@PrompTugal.jose, [its prompt](../prompts/writer.md)). Each session updates it before it ends; Jose's conductor may add to it.

## Jose's pieces

| Piece | Stage | Waits on | Link |
|---|---|---|---|
| JW1, one door: how Jose stopped being the middleman between a dozen agents (C19) | **Published** on 16 November 2026, 19:43 UTC, reviewed and signed by journalist@PrompTugal.dinis (newsroom 15c69845) | nothing | [the article](https://promptugal.news/articles/one-door.html), [draft](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/writer-jose/drafts/jw1-one-door.md), [check](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/writer-jose/checks/jw1.md) |
| Counting the tokens (the ledgers, the accountant, the Sonnet trial) | Proposed, not picked | Jose's pick | [accountant](../accountant/ROLE.md), [ledgers](../accountant/ledger/), [schedules](../schedules.md) |
| The watcher and the reviewer (what they caught) | Proposed, not picked | Jose's pick | [watcher](../watcher/ROLE.md), [latest run](../watcher/latest.md), [reviewer](../reviewer/ROLE.md), [reviews](../reviewer/reviews/) |

Picked by Jose at 20:02 UTC on 7 November 2026 (session 2): piece one, one door. Story id JW1; the files are `desks/writer-jose/ideas/jw1.md`, `drafts/jw1-one-door.md`, `checks/jw1.md`.

## The desk and the key

- Desk `desks/writer-jose/` in the newsroom: set up on 7 November 2026 (newsroom commit e538944, in v0.1.622, the release numbered after the curator's push): README only, with `ideas/`, `drafts/` and `checks/` to follow when a piece is picked.
- Key `writer-jose-promptugal` in the newsroom's `board/keys.json`: published 7 November 2026 (newsroom commit 7608012). A session key: it ends with the session that made it (sessions 1 and 2 were the same session), so the next new session makes its own and marks this one `superseded`, with the time. Not linked to an operator key and not submitted to pki.sgit.ai.
- Dinis's yes, as editor-in-chief, for this desk, its sessions and the two team-site files: asked on 7 November 2026 in the README's commit message (For: conductor@PrompTugal.dinis and security@PrompTugal.dinis). No answer yet. Angelo's writer asked the same question (its ask of 7 November in `desks/writer-angelo/asks/`); the newsroom's security and ABP agents put it to Dinis on 7 November. If the answer is no or wait: stop writing in the newsroom and tell Jose.
- Jose's GitHub account in the PrompTugal editors team: yes. Session 1 pushed to the newsroom's `dev` with push access (attach and push were not refused).

## How session 1 ran (for the next one)

- The session opened with the newsroom repository attached and the team site not attached (the prompt assumes the reverse); `add_repo` with push access attached the team site without refusal.
- The newsroom's `release.sh` ran the gate and pushed; CI numbered the release in about a minute. The live site lagged behind (Pages queues deploys): expected, not a failure.
- The reviewer ran as a sub-agent on each diff before `release.sh`, in both repositories; its records are in `../reviewer/reviews/` (2026-11-07-1946-writer.md for the newsroom diff).
- The ABP hooks in the newsroom log this session as an agent of another operator, in observe mode; its grant file `board/abp/writer.md` does not exist there, so what it may do is what Jose's prompt says.

## How session 2 ran (for the next one)

- The author line must start with the agent (`writer@PrompTugal.jose, for Jose Bota ...`): the derivation takes the part before the first comma as the agent, and the story schema rejects anything else.
- The gate is red until the derived card exists; `release.sh` runs `derive.mjs` and commits it itself, after the review, so that commit has no `Reviewed-by` trailer. To show the reviewer the card, derive locally, run the gate, then `git checkout -- data; git clean -fd data` before `release.sh`.
- Jose's reviewer re-opened every fact itself and found nine wrong or dated: commit times differ from release times (author date against committer date and the CI release), and `schedules.md` was corrected after its first figures. Read the latest version of a source and its history, not the commit that first said it.
- Pin team-site links to a commit; folder links need `/tree/`, not `/blob/`.
- No pronouns for Jose or Dinis: neither has stated them. Quotations from the team site use "his"; paraphrase them.
- The session's proxy cannot reach promptugal.news; `release.sh` cannot confirm the live page. CI's release tag is the evidence.

## Open

- Social posts (WS-208, Jose's word of 10 November): a batch when Jose asks, from the newly published GAMMA-Ray cards and interviews (the company named for tagging, the published link, only public facts, no contact details), into `people/jose/writer/posts/<date>.md`; Jose sends them.
- GAMMA-Ray posts (WS-208, Prompt W4, 11 November 01:08 UTC): `posts/2026-11-11.md`, section "GAMMA-Ray (W4)": a LinkedIn share post, 12 card comments and a 13-post X thread, drafts only until Dinis's launch article is out; held: Codacy and Automaise (Control not yet evidenced); waiting: the launch article (none in the newsroom).
- Storm batch (WS-208, Prompt W3): `posts/2026-11-11.md`, retried on 11 November once Jose allowed `websummit.com`, `ttsl.pt` and `promptugal.news`: five posts drafted (Web Summit's statement, the Algés ferry, S41, S45, and /storm/charles/, live since about 00:42 UTC), each for LinkedIn and X, for Jose to re-check and send; nothing waiting.
- The meteologix ask (during Prompt W3): `desks/writer-jose/asks/2026-11-10-meteologix-on-the-storm-page.md` in the newsroom (45b71029); waits on Jose's word on which weather page (/storm/charles/ or the team site's /incidents/the-storm/), then on Vicky's weather desk.
- Dinis's yes for the writer desk (newsroom, open): the yes of 16 November 2026, as the newsroom's board/guidance/2026-11-16-restart-here-go.md records it (point 4), names Jose's conductor and local@, not the writer; conductor@PrompTugal.jose and conductor.b@PrompTugal.dinis carry the question. Until it is recorded, no new piece in the newsroom (Jose, 17 November 2026). The key `writer-jose-promptugal` is this session's.
- Where the writer reports (Jose, 17 November 2026): `desks/writer-jose/status.json` in the newsroom (state, done, next, asks), which conductor@PrompTugal.jose gathers (J10); this file stays the writer's memory between sessions. Jose's standing rules: `desks/conductor-jose/standing-rules.md` (J10 and J11 apply to the writer; J1 to J5 do not). In the newsroom, the J11 self-check replaces the reviewer sub-agent; on this site the reviewer still runs.
- Pieces two and three wait for Jose's pick.
