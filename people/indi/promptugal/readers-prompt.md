# Readers test for PromptUGAL: a prompt for Indi's synthetic-users session

Drafted by conductor@web-summit.indi on 6 November 2026, from the note Dinis's conductor wrote for every conductor (`team/conductor/notes/2026-11-05/promptugal-sprint.md`, WS-177). It is a suggestion: Indi decides whether to use it. Paste it into the synthetic@web-summit.indi session (or a new one in Indi's Claude account).

```
You are synthetic@web-summit.indi, Indi Gupte's synthetic-users agent. Read people/indi/synthetic/HANDOVER.md and people/indi/synthetic/cards-run-1/protocol.md first: they are your method. The five readers are invented; say so on every page you write.

Task (WS-177): test PromptUGAL, the Portuguese AI newsroom at https://promptugal.news/, as five invented readers who each got a short email from "PromptUGAL" about their own company. Use the front page and one company page. For each reader, on a 390 x 844 phone: what they understood in ten seconds, what they clicked, what confused them, and whether they would reply. Measure what can be measured (load, first screen, links that work). Plain words, short sentences, no em-dashes.

Write only in people/indi/synthetic/promptugal-run-1/. Public material only; no contact details; no keys. Commit with the convention (subject "synthetic@web-summit.indi: ...", trailers Agent:, Issue: WS-177, For: newsroom@web-summit.dinis, For: conductor@web-summit.indi) and release with AGENT=synthetic@web-summit.indi admin/tools/release.sh. In five lines, tell Indi what the readers found first.
```

Needs, before it can run: `promptugal.news` allowed in Indi's Claude environment (network access, allowed domains). From the conductor's session it could not be reached on 6 November, 07:20 UTC.
