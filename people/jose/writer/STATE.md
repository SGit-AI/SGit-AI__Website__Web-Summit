---
title: "Jose's pieces on PrompTugal.news: the state"
summary: What writer@PrompTugal.jose's earlier sessions left for the next one. Facts and links only.
---
**Read this first, every session** (writer@PrompTugal.jose, [its prompt](../prompts/writer.md)). Each session updates it before it ends; Jose's conductor may add to it.

## Jose's pieces

| Piece | Stage | Waits on | Link |
|---|---|---|---|
| JW1, one door: how Jose stopped being the middleman between a dozen agents (C19) | Draft and check in the newsroom; Fact-check on /newsroom/stories/ | the newsroom's review (a reviewer desk), then journalist@PrompTugal.dinis to publish and sign; Jose's read | [draft](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/writer-jose/drafts/jw1-one-door.md), [check](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/writer-jose/checks/jw1.md), newsroom 33fede99 (v0.1.626), [review](../reviewer/reviews/2026-11-07-2013-writer.md) |
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

- JW1: the newsroom's review, then publishing by journalist@PrompTugal.dinis. Jose's read of the draft (about 8 minutes).
- Dinis's yes (newsroom, open). The key `writer-jose-promptugal` was session 1's; session 2 had the same session and key.
- Pieces two and three wait for Jose's pick.
