# journalist-portugal@web-summit.vicky: reports

Vicky's Portugal journalist for the Web Summit 2026 newsroom (Portuguese startups, funding, universities, government support, the Portuguese ecosystem): turns the curator's story candidates on that beat into drafts in desks/journalist-vicky/drafts/ of the newsroom repository, one story at a time when Vicky asks. One short line per piece of work.

## Thu 5 Nov 2026, 20:40 UTC (set-up and S10)

- Session key made and published as journalist-portugal-vicky in data/keys.json (signing sha256:f3c5113e46068c5c, encryption sha256:397766fec1bee839); pki-agent.mjs matched the sha256 pinned in admin/tools/seal.mjs.
- Draft S10, "Lisbon's universities at Web Summit: two stands and a pitch day": desks/journalist-vicky/drafts/S10-lisbon-universities-at-web-summit.md in the newsroom repository, status draft, for newsroom@web-summit.dinis.
- Sources, all read 5 Nov at their own addresses: ULisboa's announcement (19 Oct), Técnico's announcement (29 Oct, updated 3 Nov), Web Summit's venue essentials (the dates).
- Not confirmed: ULisboa's own rankings and figures (Startup Portugal's 2025 ranking, the Dealroom numbers, the four unicorns), attributed to ULisboa and not checked; which startups pitch at UniVerse; the day and time of Arlindo Oliveira's panel; the quadruped's model ("Unitree G02" per Técnico); "first day of the event" read as 10 November, as ULisboa says.

## Fri 6 Nov 2026, 09:50 UTC (WS-177: S3, S4, S7, S13, S20)

- Newsroom copy now points at PrompTugal/PrompTugal__News__Website; all five drafts pushed to its dev through newsroom/tools/release.sh, For: newsroom@web-summit.dinis, following STYLE.md (435 to 518 words each).
- S3, Road 2 Web Summit: Tek Notícias (14 Aug) and Startup Portugal's programme page, read 6 Nov. The curator's Startup Portugal link (/pt/programs/road-2-web-summit-pt/) was a 404; read at /pt/programs/road-2-web-summit/. Not confirmed: the 2026 class (only "up to 125"); the totals differ (Tek: over 1,200 since 2016; Startup Portugal: over 1,000).
- S4 and S7 overlap on the three rounds (Granter, Intuitivo, Seamoretech). S4 covers them, from Portugal Startup News (3 Nov, 23 Oct, 2 Nov); the companies' figures are their own, via press statements not seen. None is confirmed at Web Summit.
- S7, now the awards and the Algarve: Portugal Startup News (27 Oct, 1 Nov) and Técnico (RTBeamTech on its stand), read 6 Nov. Not confirmed: Algarve Evolution's targets and the Informa D&B study (not read); the report spells the startup both "knok" and "knock".
- S13, the EY figures: Executive Digest with Lusa (5 Nov), read 6 Nov. EY's report itself not read; its method not checked. The press conference's remarks on protests left out as off the story.
- S20, Octo Health: Jornal Económico (4 Nov) and Portugal Startup News (5 Nov), read 6 Nov. Not confirmed: attendance at Web Summit, the round's date, the company's privacy and compliance claims.

## Fri 6 Nov 2026, 10:55 UTC (reviews; new name journalist-portugal@PrompTugal.vicky)

- Renamed journalist-portugal@PrompTugal.vicky; the same key entered in the newsroom's board/keys.json as journalist-portugal-vicky-promptugal (signing sha256:f3c5113e46068c5c).
- S20 fixed after its review (Fix first): "personally identifiable data", the S4 link now to the published from-pitch-to-new-markets.html, "both reports place it before the launch", the published format, organisation page links; plus the one line S21's review suggested (3xP Global's stated focus, from Portugal Startup News on Granter, read 6 Nov). 473 words. S21 (Hold, journalist-connections') left untouched.
- Scheduled task created: daily at 08:00 and 16:00 UTC, Vicky's prompt word for word; prompts file updated.
- The newsroom copy's remote had reverted to the old SGit-AI address after a container restart; the pull at 10:49 went through it (GitHub redirects), nothing was pushed there. Repointed to PrompTugal before any push.
