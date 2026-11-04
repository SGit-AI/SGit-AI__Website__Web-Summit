# WS-25, WS-29, WS-41 and WS-53: where each one stands, before the 13:00 stand-up

By pm@web-summit.vicky for Vicky, 4 November 2026, about 10:20 UTC, at Vicky's request (`people/vicky/requests/2026-11-04-pm-four-issues.md`, conductor@web-summit.vicky, `b646e63`). Read on dev at `b646e63`. **Nothing here is picked up or changed:** the owners and dates below are proposals for Vicky to decide at 13:00.

All four are due today (Wed 4 Nov), `status: open`, with an empty `picked_by:`. None of the four issue files has changed since conductor@web-summit.dinis created them on 2 November (`55e63d9`).

| Issue | Done so far | Proposed owner | Proposed date |
|---|---|---|---|
| WS-25 The first five companies | Nothing on the board; a decision on today's 13:00 agenda | **Nimay**, with Silvio | the five decided **today at 13:00**; the full list (why each, first message, page) **Thu 5 Nov, 12:00** |
| WS-29 Hot leads go to Nimay or Dinis | Nothing | **Vicky**, with Nimay; Dinis agrees the rule | rule drafted **Thu 5 Nov**, agreed **Fri 6 Nov** |
| WS-41 The pulse app | A one-page plan, nothing built | **Jose** (dev@web-summit.jose builds), Angelo and Vicky review | the reminder **Thu 5 Nov**; the view **Fri 6 Nov** |
| WS-53 Silvio's workflow, written up | Nothing | **Silvio** (conductor@web-summit.silvio), Vicky reads | **Fri 6 Nov** |

## WS-25: the first five companies (Silvio, Vicky, Nimay)

**The issue:** "Five companies, why each, the first message we try, and the page we send them to. The action plan for the outreach."

**Already done:** nothing on the board. It has been on the stand-up agenda since 2 November ("The first five target companies and the first message", conductor@web-summit.dinis, 2 Nov 11:05 UTC). That item was merged on 3 Nov at 22:35 into today's 13:00 item.

**Who has said what:**
- **Silvio**, 3 November, relayed by procurement@web-summit.silvio (`0fdfc91`, 16:49 UTC): "4 stand-up tomorrow ... 5 Algarve and Portuguese companies". On the agenda that became: "Nimay proposes five, Silvio adds the Algarve and Portuguese ones" (`data/meetings/2026-11-04-1300/20261103T1649-...json`). Silvio owns "Algarve and Portuguese companies, and anyone who asks how we run our agents" (same commit).
- **Silvio's dashboard** (`people/silvio/dashboard.md`, read today): "the 13:00 stand-up: the first five companies with Nimay (WS-25)".
- **Nimay:** nothing in the repository. Nimay has no agent commits yet, and was still at the push step on 3 November (Jose's pulse, `people/jose/pulse/2026-11-03-evening.md`).

**Missing:** the five names, why each one, the first message, and the page we send them to. WS-26 (50 targets for Thursday and Friday's outreach) and WS-31 (the schedules, Saturday) both build on it.

**Proposed:** **Nimay** owns it with **Silvio**, and Vicky supports. The five are decided at **today's 13:00**. The rest (why each one, the first message, the page) is due **Thu 5 Nov at 12:00**, before Thursday's outreach starts. *Risk:* if Nimay can't bring five today, Silvio brings his Algarve and Portuguese companies as a start, and the rest is decided at 18:00.

## WS-29: hot leads go to Nimay or Dinis (Vicky, Nimay)

**The issue:** "A rule and a route: when a lead is hot, Nimay or Dinis meets them (or is part of it), within a day."

**Already done:** nothing.

**Who has said what:**
- **Dinis's brief** (`content/brief-dinis.md`): "With Nimay, Dinis meets the hot leads, or is part of the meeting."
- **Silvio's dashboard** puts it in Lisbon: "Tue 10 to Thu 12 Nov ... Hot leads to Nimay or Dinis (WS-29)".
- **Dinis's dashboard** (`people/dinis/dashboard.md`): meetings and hot leads are "not tracked yet: they belong in the private vault, with a count only on the site".
- **The board-health pages** (project-manager@web-summit.dinis, `097a49a`, 07:52; mine, `207ad76`, 07:41): WS-31 needs it, and nobody is on it.

**Missing:** a definition of "hot", the route (who tells whom, and how, within a day), and where leads are kept. Leads go in the private vault, never in the repository; only the rule is public.

**Proposed:** **Vicky** owns it, with Nimay; pm@web-summit.vicky drafts the rule for her. The draft is due **Thu 5 Nov**, and Nimay and Dinis agree it by **Fri 6 Nov**, so WS-31 has it by Saturday. The draft needs only three things: what counts as hot, who is told and how fast, and where the lead is written down (the private vault).

## WS-41: the pulse app (Angelo, Jose, Vicky)

**The issue:** "Better than files: the agent interview prompt, a reminder at each slot, and a view of the team's pulse over time. (The files version works now.)"

**Already done:** a one-page plan, `people/jose/dev/WS-41-plan.md` (dev@web-summit.jose, `c5376d7`, 4 Nov 01:55 UTC, "a plan only; nothing is built"). Jose's reviewer passed it (`people/jose/reviewer/reviews/2026-11-04-0156-dev.md`).

**Who has said what:**
- **The plan:** "2 check-ins ... out of about 36 slots due since check-ins started on 3 November", so "the first thing to build is the reminder, and the second is a way to answer in under two minutes without opening a session". Its order: (1) each person's conductor asks at its own wake (a prompt line, which needs conductor@web-summit.dinis); (2) a view built from `people/*/pulse/`; (3) an answer page over the person's own lane.
- **Its question for Angelo and Vicky:** "who picks it up, and whether Vicky's pm agent wants the view for WS-46".
- **Jose's brief for today** (`people/jose/briefs/2026-11-04-morning.md`, conductor@web-summit.jose): "decision: in the split (draft: yours, can slip to Thu)". Jose's reviewer refused a draft line that gave WS-41 to "Angelo and Vicky" as unsourced (`people/jose/reviewer/reviews/2026-11-04-0725-conductor.md`).
- **Vicky's pulse**, 3 Nov morning: "too many views of the same thing".

**Missing:** an owner, Jose's go, conductor@web-summit.dinis's yes to the prompt line, and the pulse agent's real schedule (the plan found three different times on `content/agents.md`).

**Proposed:** **Jose** owns it, with dev@web-summit.jose building, as his brief already drafts. Angelo and Vicky review. Step 1 (the reminder) is due **Thu 5 Nov**, the view **Fri 6 Nov**, and the answer page after the summit if no one asks for it sooner. **My answer to the plan's question, for Vicky to confirm or overrule:** yes, the view would help WS-47. Only 2 of 9 people have checked in, and a reminder matters more than a view.

## WS-53: Silvio's agentic project-management workflow, written up (Silvio, Vicky)

**The issue:** "How it works, what we can use here, and one part of it running for the team."

**Already done:** nothing. Silvio's dashboard shows "Agentic PM ... WS-53 (Wed 4 Nov) ... 0 of 1".

**Who has said what:**
- **Silvio's brief** (`content/brief-silvio.md`): "Silvio's project-management workflows are some of the best around: how do we use them here?"
- **His profile** (`people/silvio/profile.json`): "an entrepreneur with advanced agentic project-management workflows"; "learn from his own workflows as much as teach".
- **His dashboard** names the lane: "My project-management workflow written up, one part running for the team | conductor@web-summit.silvio | WS-53 | Vicky".

**Missing:** everything: the write-up, what we can use, and one part running. Silvio's today is full: the print order (WS-48), WS-25, contacts (WS-24) and the videos (WS-40, WS-52, WS-71).

**Proposed:** **Silvio** owns it, with conductor@web-summit.silvio writing it from his words. Vicky reads it, and pm@web-summit.vicky says which part fits the board. Due **Fri 6 Nov**: it doesn't block the outreach or WS-31, so it can move.

## For the 13:00, in one line each

1. **WS-25:** decide the five, with Nimay as owner (Silvio adds his); the full list Thu 5 Nov, 12:00.
2. **WS-29:** Vicky takes it with Nimay; the rule drafted Thu, agreed by Nimay and Dinis Fri.
3. **WS-41:** Jose's, as his brief drafts; the reminder Thu, the view Fri.
4. **WS-53:** Silvio's; Fri 6 Nov.

Each date change needs the owner's or Dinis's word, and the issue files stay as they are until then.
