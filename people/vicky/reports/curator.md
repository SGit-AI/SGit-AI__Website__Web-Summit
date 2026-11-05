# curator@web-summit.vicky: reports

Vicky's curator desk for the Web Summit newsroom (brief 4, desk 2). One entry per run that found something; a run with no new research writes nothing.

## Wed 4 Nov 2026, 19:45 UTC (first run)

- Mapped the researcher's 22 captures of 4 November (people/vicky/newsroom/researcher/2026-11-04-1255.json and 2026-11-04-1546.json) into 8 groups; the map is desks/curator/2026-11-04-1945.json in the newsroom repository (site v0.1.3).
- Not mapped: research vault 41j3e9s9, whose read key is not yet listed in people/vicky/vaults.json; per the researcher's report its 21 captures are these same 22, so nothing is lost until it is.
- Seven story candidates for Indi's journalist: the participant's first day, Europe in Pavilion 4, Road 2 Web Summit, Portuguese startups raising, the summit in numbers, the Gender in Tech report, and items for the Portugal banner (desks/curator/2026-11-04-1945.json, story_candidates).
- No noise dropped; three overlaps grouped, not dropped (the two venue captures, the two Road 2 Web Summit sources, HaDEA's stand said twice); ticket prices kept as reference, not a story (same file, duplicates_and_noise).
- Gaps for the researcher: Portugal's stand, a government announcement, this year's Road 2 cohort, whether the funded startups are at the summit, the rest of the programme, other delegations, and the team's companies (same file, gaps_for_the_researcher); the curator's key is on the keys page as curator-vicky (data/keys.json, v0.2.339).

## Wed 4 Nov 2026, 19:45 UTC run (the research vault, first read)

- Read research vault 41j3e9s9 with its read key (people/vicky/vaults.json, v0.2.342): 25 captures, 21 already mapped from the earlier files and 4 new; the map is desks/curator/2026-11-04-1955.json in the newsroom repository (site v0.1.4).
- New story candidates: S8 Técnico brings robots and six spin-offs to Web Summit (vault captures/2026-11-04-tecnico-web-summit-2026.md) and S9 about 200 Brazilian companies in Lisbon (captures/2026-11-04-apexbrasil-delegation.md).
- For the fact-checker: Metro's page mentions a one-day online pass that Executive Digest says does not exist this year, and Web Summit's page lists one too; S1 gives only the 3 and 5 day passes until checked (captures/2026-11-04-metro-web-summit-transport-pass.md and metro-web-summit-service.md).
- Revised: S5 now uses the survey's own wording with both its 55% and 60%, as conductor@web-summit.vicky noted (team site commit 6227e330); S7 can say RTBEAMTECH is at the summit with Técnico (same map, revisions_to_the_first_map).
- Gaps for the researcher: the one-day pass, what Técnico's six spin-offs do, and the first map's open gaps (same map, gaps_for_the_researcher).

## Thu 5 Nov 2026, 07:45 UTC run (2 new captures; the map is not released)

- URGENT: the 07:45 map (desks/curator/2026-11-05-0745.json) is written and committed locally but not pushed: the newsroom's gate now needs every desk to run admin/tools/derive.mjs and commit the derived entities in data/ (newsroom CLAUDE.md, "After a desk's file in desks/ changes"), and the curator writes only desks/curator/; it needs Vicky's or Dinis's word to write those derived files, or someone else to derive after each map.
- Mapped the researcher's 2 captures of 07:30 in vault 41j3e9s9 (commit ebfc284b741d): ULisboa at Web Summit with UniVerse on 10 November (captures/2026-11-05-ulisboa-web-summit-2026.md), and European Tech Champions, Italy and Portugal, 11 November in Beato (captures/2026-11-05-aicep-italy-portugal-tech-champions.md).
- New candidates once released: S10 Lisbon's universities at Web Summit: two stands and a pitch day (with captures/2026-11-04-tecnico-web-summit-2026.md), and S11 Italy and Portugal meet in Beato on how European tech scales.
- For the fact-checker: ULisboa's ranking, Dealroom figures and four unicorns are its own claims and must be attributed (captures/2026-11-05-ulisboa-web-summit-2026.md).
- WS-153 (team site commit f124bd1b) asks Vicky's agents for their vault keys: the curator holds only the research vault's published read key (people/vicky/vaults.json), so it has nothing to send.

## Thu 5 Nov 2026, 11:45 UTC run (1 new capture; the 07:45 map released)

- Resolved, no longer urgent: the 07:45 map is live (desks/curator/2026-11-05-0745.json, newsroom v0.1.15), now that release.sh derives the data itself (newsroom commit 24a9aba); S10 and S11 are in data/stories/.
- Mapped the researcher's 11:30 capture in vault 41j3e9s9 (commit f9d8757b5a26): Web Summit's 2026 speakers page, 800 speakers, a first page led by robotics and AI companies, a robot (Galbot's G1) listed as a speaker (captures/2026-11-05-websummit-speakers.md); the map is desks/curator/2026-11-05-1145.json (newsroom v0.1.16).
- New candidate S12: A robot among 800 speakers: Web Summit 2026 turns to robotics, grouped with Técnico's robots (captures/2026-11-04-tecnico-web-summit-2026.md).
- For the fact-checker: only the lineup's first page was read; the AgiBot A3 robot reported by PanAsiaBiz is not confirmed (same capture).
- Gaps for the researcher: the rest of the lineup, Portuguese and European speakers' companies, and when Galbot's G1 is on stage (desks/curator/2026-11-05-1145.json, gaps_for_the_researcher).

## Thu 5 Nov 2026, 18:30 UTC (sources under every storyline, from the 18:00 stand-up)

- At Vicky's word from the 18:00 stand-up: desks/curator/README.md in the newsroom repository (v0.1.19) now lists, under each of the 11 open storylines, its sources with the URL, the publisher and the date the researcher read it.
- The 33 source lines are copied from the researcher's captures in vault 41j3e9s9 (captures/*.md, fields source, publisher and read_on); the curator did not open or check them (that stays with Indi's fact-checker).
- All are public pages from the captures, which vault@ audited before publishing the read key and which list only public URLs (vault 41j3e9s9, PUBLIC.md audit table); no storyline is without a source today, so none says "no source yet".
- S8 (Técnico) stays merged into S10, and its source is listed there (desks/curator/README.md).
- From now on every curator run keeps the sources under each storyline (the curator's scheduled task, updated 5 Nov 18:35 UTC). The 15:45 run found no new research and wrote nothing (people/vicky/reports/researcher.md has no entry after 11:30).
