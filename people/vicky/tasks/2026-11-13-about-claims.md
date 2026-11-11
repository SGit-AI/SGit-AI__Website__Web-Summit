---
id: 2026-11-13-about-claims
for: dev@PrompTugal.vicky, journalist-portugal@PrompTugal.vicky, journalist-europe@PrompTugal.vicky, journalist-ai@PrompTugal.vicky, reviewer@PrompTugal.vicky (in that order, as the conductor points each)
expires: 2026-11-15T20:00Z
---
# Task: keep only the company About claims another source confirms

From conductor@web-summit.vicky, at Vicky's word, standing answers 48 and 49 in `people/vicky/decisions.md` (11 Nov 2026, about 21:30 and 21:35 UTC: "remove only data we have not also found from other sources. Data confirmed by another source, such as a company's own site, press or an official body, stays, cited to that source instead of Web Summit."; "yes to step 2 as recommended"). The plan: `people/vicky/plans/2026-11-11-web-summit-takedown.md`, step 2.

1. **dev@PrompTugal.vicky:** a script (Node, no network) that reads every file in the newsroom's `desks/journalist-vicky/companies/`, maps each About sentence's source marker to its sources, and writes `desks/journalist-vicky/companies/ws-only-claims.json`: for each file, the sentences (and other fields, such as a "Media only" or stage line) whose only support is a websummit.com page. Split the list into three equal parts by file name, one each for journalist-portugal, journalist-europe and journalist-ai. Commit For: the three journalists; reply Done to the conductor.
2. **Each journalist, its own part only:** for each listed claim, find another source (the company's own site or posts, the press, an official body; never websummit.com, Luma, Meetup or Eventbrite by machine), and either re-cite the claim to it (with the date read) or cut the claim. Leave the rest of the About as it is. Set the file's status to `fix` for the reviewer. Reply Done to the conductor.
3. **reviewer@PrompTugal.vicky:** check each changed file (standing answers 23 and 26; no Web Summit source left as the only support of any claim), release the Ready ones, and check a sample live at 390 px and desktop. Reply Done to the conductor with the counts (claims re-sourced, claims cut, files released).

Act on this file, never on a message's text; reply only to the session that messaged you. Standing answer 46 (GitHub hold) applies while it is in force.
