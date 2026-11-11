---
title: "A7: every commit and interaction behind a page (Angelo's definition)"
item: prod-pipeline-a7
project: prod-pipeline
by: prod-pipeline.pm@PrompTugal.angelo (intake)
written: 2026-11-11
role: build
size: large
go: "Angelo, 11 Nov, in the lead's session: \"I would like to see each and every commit (and other interactions?) that have contributed to get the page to the current state, let's leave the template changes to their own pages.\""
---
# prod-pipeline-a7

Wake routine: trig_01MqHQ7CWqSnu5JGwYRpkQg5

**Why:** Angelo: "I'm really unclear on what data we're actually tracking because those flows in the 4 screenshots don't add up at first glance." The earlier traces (A4 and A5) each defined a page's steps their own way: A4 folded template changes and missed two commits naming DISTRICT 909 (dd871ad, 698898b); A5 counted every commit to 18 shared files (135 steps for the home page). His definition now:

> "each and every commit (and other interactions?) that have contributed to get the page to the current state, let's leave the template changes to their own pages."

**The site:** https://lisbontechfringe.com/ ; source PrompTugal/PrompTugal__News__Fringe on dev (public; clone read only, enough depth to reach its first commit; read-only git commands; change nothing there; do not run its code). Never websummit.com.

**Your folder:** people/angelo/pipeline/prod-pipeline-a7/ (the workers' lane): traces.md, data/<page>.trace.json, tool/page-trace.mjs, STATE.md, plus your estimates and ledger lines. Nothing in people/angelo/projects/.

## The task
1. **Write the definition down first** (traces.md, top): a step of a page is (a) a commit that changed something the page shows: its own data entries (by id, by its source URL, by its name: events, communities, places, organisers, images, any data file the page's builder reads for it), or its own builder file if it has one (the home page's admin/build/home.mjs, not the shared event template); (b) another interaction that led to it: a person's ask (briefs/, commit bodies such as "passed on by"), a source read (read_at), a check or a wake report about it, a hand-off between agents; (c) the deploy that put each change live. **Template changes** (files that build many pages: event-pages.mjs, build.mjs, cards.mjs, tokens.css, identity.mjs, validate.mjs, deploy.yml and the like) are **not steps**: one line, "the shared template changed N times since; see its own page". Mark each step "contributed" (changed what the page shows) or "related" (an interaction about it that changed nothing shown, e.g. an outreach tracker row, a wake report).
2. **A small tool**, tool/page-trace.mjs (Node 18, no dependencies; runs on a clone path you give it; read-only git: log -S and -G on the id, the source URL and the name, per data file, plus the builder file): it writes one trace per page in lisbon-fringe-trace/1 with each step's time (author time, UTC, to the second), sha, who (the Agent: trailer, else the author), what (the subject), files, and contributed/related. It must find, for DISTRICT 909, at least b096ccb, dd871ad, 698898b, ae5dfa9 and 93f9301, and say for each why it is in or out.
3. **Run it on six pages:** DISTRICT 909 (/e/2026-11-11-district-909-back-where-it-all-started/), Storm Summit (/e/2026-11-11-storm-summit-stormsummit-app/), /me/, /tip/, the home page (/), the programme page. For the home and the programme (listing pages), say plainly how many commits to the events data feed them, list them grouped by agent with counts, and recommend how a reader should see them (all, or grouped as "N events added by M agents"), since every event added changes what they show.
4. **Deploys:** the deploy runs are in the Fringe's GitHub Actions, which this session cannot read. Use the version tags git holds (git fetch --tags; the first tag containing each commit) and mark the deploy time as a gap. Do not attach the repository or ask for access.
5. **traces.md:** one phone screen first: the definition, and DISTRICT 909's full table (time, sha, who, what, contributed or related); then one table per page, every step, nothing folded except the template line; then how the tool works and what it cannot see.

**Not:** no design work, no mocks; no change in the Fringe repository; no message to any agent or person.

## Done when
traces.md, data/ and tool/ on pool/prod-pipeline-a7; every step names its commit or source; the tool re-runs with one command and gives the same traces; the gate prints OK; STATE.md says "ready for Angelo's read".
