---
name: conductor
description: How a conductor of Angelo's (conductor.b@, a lead, conductor.fringe@) answers a digest request, gives him updates and takes his decisions, in his session.
---
# Format: a conductor's update to Angelo

**The rules that exist:** the desk's "usual format" (people/angelo/conductor-b/HANDOVER.md: "an overview, then each decision with a recommendation, one at a time"); the kit's protocol (people/angelo/kit/README.md: tiers, "Delivered:" lines, the backlog); plain language (skills/plain-language.md).

**Angelo's words** (11 November): "give me a little snapshot of everything that is in-progress, what decisions are waiting on me, very brief and then walk me through each relevant update and decision, one at a time, giving me the chance to ask for more info, elaborate and decide, and then when we're done we move to the next point."

## 0. A digest request
**What counts as one:** Angelo asks for the state of things in any words ("digest", "updates", "where are we", "give me a snapshot", "get the updates from the team"). His model request (11 November): "give me a little snapshot of everything that is in-progress, what decisions are waiting on me, very brief and then walk me through each relevant update and decision, one at a time".

**Gather first (quietly, in this order, only what changed since the last digest in STATE.md):**
1. Pull dev in every repository the conductor works in.
2. Its own STATE.md (open, waiting on, decided) and the backlog's items for Angelo.
3. Its people: runs.md (who is running, what finished, cost), each lead's STATE.md and ASKS.md on its branch, each item's STATE.md.
4. The team: commits since the last digest that name Angelo or his conductors in For:; Dinis's "New from Dinis" (the newsroom's board/guidance/README.md); the board items For: everyone; the swarm projects he is in (for example the Fringe's team/<id>/status.json).
5. Anything due by a date someone else set (the summit, a demo).
A wide sweep goes to a sub-agent or a worker, logged in a commit like any other run. **The digest worker** (digest.b@, hourly; ROLES.md) does this gathering ahead of time into pool/ops-digest's digest.md: start from it, and add only what came after it.

**Filter:** only what changes what Angelo does (a decision, a direction for his agents, finished work to see, a risk, a cost); the rest as "N other updates, nothing for you". Updates are one line; each decision is a point of its own. Leads keep a "For the digest:" line in their STATE.md.

**Then give it:** the snapshot (section 1), then the points (section 2), most urgent first: new directives from the team, decisions waiting on him, finished work to see, what is running and its cost.

**After it:** write "last digest: <UTC time>" and the open points in STATE.md, in a commit, so the next digest starts from there and a restarted conductor can resume mid-way.

## 1. The snapshot (once, at the start)
- **In progress:** one line each (what, who, where it stands).
- **Waiting on you:** a numbered list, one line each, most urgent first.
- Nothing else. Fits on a phone screen.

## 2. One point at a time
- Header: **Point n of N: <name>**.
- What happened or what is asked, in three to six lines; his and others' words quoted where they matter.
- For a decision: the options (each with what it does well and badly, when there is more than one real option), then **Recommendation:** in one line, then what it needs from him (tier 3 named as such).
- End with one question: "More detail, or shall I go ahead?" (or the decision's own question). Then stop and wait.

## 3. After his answer
- Act on it: route it (a brief, a worker, a lead), never do the work in the conversation.
- Record it the same turn: his words quoted in a commit (STATE.md, and the item's brief or go.md); say in one line what happens next and where.
- Then "Next" or the next point: never two points in one message.

## 4. When he speaks mid-turn
- Answer his message first, in the same reply; then finish the work in flight.
- A new direction becomes a point of its own, not a footnote.

## Checks (by hand)
- [ ] A digest gathered the five sources before speaking, and STATE.md records its time.
- [ ] Snapshot fits a phone screen; points are numbered n of N.
- [ ] One decision per message, a recommendation on every decision.
- [ ] Every decision he gave is in a commit with his words, before the next point.
- [ ] No em-dash; no worker names where a role says it better; no tokens of jargon without a gloss.
