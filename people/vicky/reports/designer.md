# designer@web-summit.vicky: reports

Vicky's designer for Promptugal News, the Web Summit newsroom's new name (WS-14): the publication's design brief and its logo options, in desks/designer-vicky/ of the newsroom repository. One entry per piece of work.

## Thu 5 Nov 2026, 19:40 UTC (first session: key and brief)

- Session key made (pki-agent.mjs keygen --session, the pinned copy) and its public half published as `designer-vicky` in data/keys.json (record sha256:228de9dce8c49784, encryption sha256:ed165814e5e50a13), linked locally to the operator's key sha256:db7f79fdd87e030a; the private half stays in the session.
- The design brief is live: desks/designer-vicky/brief.md in the newsroom repository (newsroom v0.1.20): what Promptugal News is, who it is for, the tone, and seven things the logo has to do. No logo drawn yet: waiting for Vicky's word on the brief and its three open questions (the capitals, "News" in the logo or under it, keep the azulejo tile).

## Thu 5 Nov 2026, 20:00 UTC (the logo options)

- At Vicky's word (brief approved; capitals open, PromptUGAL one option; News both in the logo and underneath; the azulejo tile stays the default, plus new marks to compare): eight logo options and two new marks are live in desks/designer-vicky/ of the newsroom repository (newsroom v0.1.21), shown in one gallery in desks/designer-vicky/README.md with a line on each idea.
- The options: Promptugal, PrompTugal News, PROMPTugal, PromptUGAL News, PromptUgal, >promptugal (with a new cursor mark), an editor's correction of Portugal to Promptugal (with a new caret mark), promptugal.news. Every letter is a path cut from the site's own Newsreader and IBM Plex Mono (SIL OFL); the SVGs follow light and dark mode themselves.
- Checked in Chromium in light and dark, at full size and in a 390px phone header (desks/designer-vicky/checks/): every one-line form fits; the options with News underneath have a one-line header form. Waiting for Vicky and Dinis to choose; the site is unchanged.

## Fri 6 Nov 2026, now designer@PrompTugal.vicky (the move and the new name)

- At Vicky's word: the newsroom copy now points at PrompTugal/PrompTugal__News__Website (dev pulled); nothing pushed to the old SGit-AI address.
- Renamed designer@PrompTugal.vicky. The same session key, entered as designer-vicky-promptugal in the newsroom's board/keys.json (record sha256:228de9dce8c49784; newsroom v0.1.208, commit 2a9dd384; the Pages deploy was still late when the release script stopped waiting).
- The startup prompt, word for word, and Vicky's decisions and standing rules from chat are saved in people/vicky/prompts/designer.md.
- For Vicky: the newsroom's CLAUDE.md now says the brand identity v2.0 (design/brand/Promptugal-Brand-Guide.pdf) settles the logo and the spelling PrompTugal.news, so the eight options in desks/designer-vicky/ may be superseded. No logo work done today.

## Fri 6 Nov 2026 (paused)

- At Vicky's word: the logo work stops (Dinis's designer owns the brand), with no comparison against the brand guide v2.0. designer@PrompTugal.vicky is paused until Vicky asks.

## Wed 11 Nov 2026, 19:40 UTC (RULES-11NOV confirmation wake)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: nothing (my desk desks/designer-vicky/, my logo generator in this session's scratch area and my key files hold no reads of those sites: the generator reads only the site's own fonts; I have no scheduled task of my own, only this one-off wake); key: kept designer-vicky-promptugal (record sha256:228de9dce8c49784, still in this session, no "-b" entry). No HOLD.md. Read standing answers 31 to 33 and the RULES-11NOV section of my prompts file; it updates my memory (paused since 6 Nov) with the new remit: cover graphics on request only. My newsroom clone now points at PrompTugal/PrompTugal__News__Website again (the container had reset it to the old SGit-AI address; nothing was pushed there). No design work in this wake.
- state: ok; done: RULES-11NOV confirmed, key kept; next: wait until the reviewer, a journalist, the conductor or Vicky asks for a graphic; ask: none; run: scheduled

## Sat 14 Nov 2026, 10:35 UTC (the new role and the short prompts file)

- designer: cover graphics; applied CLEANUP-14NOV and PROMPTS-SHORT. No HOLD file (team site). Read standing answers 16, 54, 63 and 64. `people/vicky/prompts/designer.md` rewritten for the role (cover graphics on request only; drawn strictly from an article's sourced numbers; readable at 390 px, text at least 12 px; asked for in a commit For: designer@PrompTugal.vicky by the reviewer or a journalist; no brand changes, no publishing): the one-line pointer to decisions.md, then only the role, my paths and the rules Vicky gave in my own window. Size 8,561 bytes before, 4,096 after. The old startup prompt (the logo job) is no longer copied there; it stays in the file's history (commit a0c23734). No scheduled task of my own, so none changed. Ledger: two lines in `people/vicky/ledger/designer.jsonl` (the run, and my session's total so far). No design work.
- state: ok; done: prompts file rewritten for the new role, ledger lines added; next: wait for a request For: designer@PrompTugal.vicky; ask: none; run: prompted
