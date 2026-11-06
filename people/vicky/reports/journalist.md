# journalist@web-summit.vicky: reports

Vicky's journalist for the Web Summit 2026 newsroom: turns the curator's story candidates into drafts in desks/journalist-vicky/drafts/ of the newsroom repository, one story at a time when Vicky asks. One short line per piece of work.

## Thu 5 Nov 2026, 19:30 UTC (set-up)

- Session key made and published as journalist-vicky in data/keys.json (signing sha256:9b06aaa9c85941a3, encryption sha256:de450e3ef39373e2); pki-agent.mjs matched the sha256 pinned in admin/tools/seal.mjs.
- Read desks/curator/README.md (5 Nov, 18:30 UTC, S1 to S12) and the 11:45 map. No draft written yet.
- Could not open research vault 41j3e9s9 here: installing the sgit CLI was refused in this session. Until it is allowed, the sources are the curator's copied list, which nobody has checked; every draft will re-read each source at its URL.
- No journalist desk of Indi's in the newsroom's desks/ (only curator and programme); journalist@web-summit.indi writes Indi's reports, not drafts. The curator's maps still say "for the journalist (Indi's side)": asked Vicky to confirm.

## Thu 5 Nov 2026, 20:10 UTC (S9)

- Draft S9, "Brazil's startup mission comes to Web Summit Lisbon": desks/journalist-vicky/drafts/S9-brazil-startup-mission.md in the newsroom repository (site v0.1.22), status draft, for the fact-checker and newsroom@web-summit.dinis.
- Sources, all read 5 Nov: ApexBrasil's mission rules (PDF, click.apexbrasil.com.br), Agência Sebrae de Notícias (30 Sep), Executive Digest with Lusa (4 Nov), Web Summit's venue essentials (the dates).
- Not confirmed: the delegation's size (ApexBrasil about 200 on 4 Nov, Sebrae about 300 expected on 30 Sep, national selection 100); the 324 m² pavilion and the 700 million dollars, only from ApexBrasil through Lusa (ApexBrasil's site asked for a login); the mission's start (9 or 8 Nov).
- Left out at Vicky's word: Paraíba's 30 startups. paraiba.pb.gov.br reset the connection, then showed an image check; fapesq.rpp.br was unavailable.

## Thu 5 Nov 2026, 21:00 UTC (S1; new beat)

- New beat at Vicky's word: the summit journalist (Web Summit itself, practical guides, its numbers and reports, delegations). Portugal, Europe, AI and robotics, and connections stories are left to their new journalists.
- Draft S1, "Web Summit Lisbon: your first day, from airport to arena": desks/journalist-vicky/drafts/S1-your-first-day.md in the newsroom repository (site v0.1.24), For: newsroom@web-summit.dinis; publishing waits for Dinis.
- Sources, all read 5 Nov: Web Summit's registration, venue, city, app and schedule pages; Metro de Lisboa's pass page; CP's 2026 pass leaflet (PDF, added: it lists the airport sales hours); Executive Digest (4 Nov, Metro) and Executive Digest with Lusa (5 Nov, Carris).
- Not confirmed: where the pass is sold (Metro and CP: airport only; Carris via Lusa: also the Web Summit Welcome Center, place unknown); the shuttle's return times (reported as from 15:52, so left as "afternoon"); Carris's own 2026 page not found. Web Summit's city page is out of date on the pass (1-day, online); the draft follows the operators. Bus line numbers left out (Carris and Web Summit lists differ).

## Thu 5 Nov 2026, 21:45 UTC (S6 and S5)

- Draft S6, "Gender in Tech report: 84% see women in leadership": desks/journalist-vicky/drafts/S6-gender-in-tech-report.md (newsroom v0.1.26), For: newsroom@web-summit.dinis. Source: Web Summit's article of 27 Oct, read 5 Nov. Not confirmed: the survey's size, method and dates (not in the article); the full report is on DocSend behind an email gate, not read; last year's 75% as Web Summit states it.
- Draft S5, "Web Summit 2026 in numbers: 70,000 people, 10,000 startups": desks/journalist-vicky/drafts/S5-web-summit-in-numbers.md (newsroom v0.1.27), For: newsroom@web-summit.dinis. Sources, read 5 Nov: Web Summit's State of the Industry survey (22 Oct), tracks, startup selection, speakers and venue pages; 2025 figures from ApexBrasil's mission rules and Executive Digest with Lusa. Not confirmed: all 2026 figures are Web Summit's own; the 2025 figures were not found on a Web Summit page; the survey's sampling. The EY study left to S13 (Portugal beat) at Vicky's word, to be linked once written.
- Noted for Vicky: journalist-europe, journalist-portugal and journalist-ai write their drafts (S2, S10, S15) in desks/journalist-vicky/drafts/; left untouched.

## Thu 5 Nov 2026, 23:00 UTC (S9 review)

- S9 fixed after reviewer@web-summit.vicky's "Fix first" (desks/reviewer-vicky/reviews/S9.md): all five points applied, each checked against ApexBrasil's rules (PDF, read 5 Nov). Dates now 8 to 13 November (9 to 13 for most); beat, license and tags added; "12 state-level missions"; paid flights "if they qualify"; a line on where to find the delegation (Brazil Pavilion, MEO Arena, 10 to 12 Nov, per ApexBrasil). No disagreements. Intuitivo link (curator's S19) not added: it needs its own source.
- Not done: the style cut to 400 to 600 words, which the review leaves for a style pass; Vicky said drafts already done are not rewritten.

## Thu 5 Nov 2026, 23:40 UTC (S1, S5, S6 reviews)

- S1, S5 and S6 fixed after reviewer@web-summit.vicky's "Fix first" (desks/reviewer-vicky/reviews/), every point applied, none disputed; one commit For: newsroom@web-summit.dinis.
- New source for S6: Web Summit's women in tech page (read 5 Nov): "more than 1,000 women" surveyed; programme sold out. Re-read for S1: Web Summit's venue page (asks attendees not to bring bags; South and North bag drops) and Metro's pass page ("1 dia (exclusivo online)" still listed).
- Standing rules taken: beat in every front matter; a person's name, not he or she, unless the source gives the pronoun. S5 and S6 now say "Naithani" and "Quinlan".
- Still long, not cut (drafts already done): S1 about 1,180 words, S5 about 780, S9 about 780 (counted from In short to the sources). S9's review is unchanged since its fixes.

## Fri 6 Nov 2026, 10:30 UTC (WS-177; the move)

- The newsroom copy now points at PrompTugal/PrompTugal__News__Website (dev pulled); STYLE.md read and followed.
- Draft WS-177, "From 400 people to 71,386: Web Summit before 2026": desks/journalist-vicky/drafts/ws177-web-summit-before-2026.md, committed (af6e124), For: newsroom@web-summit.dinis. Sources, read 5 and 6 Nov: Wikipedia's Web Summit article (fixed revision of 4 Nov 2026), AICEP (2025 record), Executive Digest with Lusa (the 2019 to 2028 agreement), Portugal Tech Week's site, Web Summit's schedule.
- Not confirmed: any side event held earlier this week (online lists disagree, none checked at an organiser's page); Wikipedia's figures not checked edition by edition.
- NOT PUSHED: the gate is red on a build bug, not the draft. A draft with a beat and no curator candidate is listed on its topic page with a link to "<draft>.html", which the build never makes (newsroom/build/features/topics.mjs, story candidates list). Needs dev@PrompTugal.dinis; asked Vicky. Also found: the graph schema wants lower-case paths, so the file is named ws177-*.
- Prompts saved in people/vicky/prompts/journalist.md (startup prompt word for word; no scheduled task; twelve standing rules from chat).

## Fri 6 Nov 2026, 11:15 UTC (WS-177 pushed; renamed journalist@PrompTugal.vicky)

- WS-177 pushed without its beat, at Vicky's word (newsroom v0.1.202), For: newsroom@web-summit.dinis and dev@PrompTugal.dinis, with the broken link in newsroom/build/features/topics.mjs described for dev@. The beat goes back once it is fixed.
- A mistake: that push went to the old SGit-AI address. The remote had been reset to it (I think when the session restarted) and I did not check it first. GitHub redirected it, so the commit is on PrompTugal/PrompTugal__News__Website dev, but it broke the rule. The remote is fixed, and I now check it before every push.
- Renamed journalist@PrompTugal.vicky: same session key, entered in the newsroom's board/keys.json as journalist-vicky-promptugal (v0.1.203). The team site's journalist-vicky entry left as it is. Reports stay here, at Vicky's word. Prompts file updated with the new name and three new rules.

## Fri 6 Nov 2026, 11:00 UTC (WS-177 review; scheduled task)

- WS-177 fixed after reviewer@PrompTugal.vicky's "Fix first" (newsroom v0.1.220), For: journalist@PrompTugal.dinis and newsroom@web-summit.dinis. Done: summary names Portugal Tech Week; the first-timers' line replaced by the site's edition pages (Dublin 2010 to Lisbon 2025, all in promptugal.news's sitemap); edition pages linked; "at the Expo '98 site"; no title line, front matter in the published order.
- Not changed, for Vicky to decide: the review (and STYLE.md's new "Match the published format", edited by reviewer@ on 6 Nov) asks for sources as <url>; Vicky asked in chat for [Source name](URL), never <URL>. Kept Vicky's.
- The newsroom remote had been reset to the old SGit-AI address again at session start; caught before any push this time (a fetch only), fixed.
- Scheduled task created: daily 08:00 and 16:00 UTC, into this session; prompt saved word for word in people/vicky/prompts/journalist.md. people/vicky/decisions.md does not exist yet on the team site.
