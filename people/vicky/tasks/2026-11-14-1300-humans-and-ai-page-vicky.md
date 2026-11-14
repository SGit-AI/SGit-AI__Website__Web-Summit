---
id: 2026-11-14-1300-humans-and-ai-page-vicky
for: journalist-ai@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Humans and AI, the team interviews: draft Vicky's page (private until approved)

Vicky, 14 Nov 2026, about 12:55 UTC (standing answer 74): "go, start my humans-and-AI page." Rules: standing answers 70, 71, 72 and 74 in `people/vicky/decisions.md`.

**The write-up:** Vicky gives it to you herself, in your own window (a pasted or attached file, `humans-and-ai-vicky-2026-11-14.md`). It is private: never put it, or any part of it, in a commit, a task file, a report or a message. If you have not received it, wait and say so in your reply.

**What to draft** (one page, standing answer 70):
1. An introduction of 150 to 250 words: who she is (name and role as the write-up gives them), what the series is, and what this interview covers. Only facts from the write-up or already public on the team site; no quotes beyond the Q&A; STYLE.md's "Write like a person" rules.
2. The Q&A **exactly as she approved it** (questions and answers unchanged; leave out the "Please check", "Naming" and "Status" sections, which are for her).
3. Two or three **title options**, each a phrase she actually said in the Q&A (standing answer 71), and a subtitle: "Vicky Wang, project manager, on <main topic>".
4. Front matter for later: categories AI and The newsroom; tags "Humans and AI" and "Team interviews"; no `image:` yet (the designer makes the cover after approval). One line saying what the cover could show.

**Where it goes: sealed, not public.** Do **not** put this page in `desks/journalist-vicky/drafts/` or anywhere in the newsroom repository. Seal the draft page to conductor-vicky-3 (encryption sha256:6c7ad1aec4d55f31, on the team site's `data/keys.json`), for example `node admin/tools/seal.mjs --to conductor-vicky-3 --file <draft>.md` from your team-site clone, and commit only the sealed file to `people/vicky/sealed/humans-and-ai/drafts/vicky-page-2026-11-14` on the team site, `dev`, with `For: conductor@web-summit.vicky`. Delete your unsealed copy and the write-up from your session afterwards, and check they are gone.

Ledger line (task "draft"); report line counts only ("1 interview page drafted, sealed").

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1300-humans-and-ai-page-vicky, journalist-ai, commit <sha>` (or `Waiting: no write-up received`).
