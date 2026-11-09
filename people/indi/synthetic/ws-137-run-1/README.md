# Synthetic users, WS-137 run 1: three views of the plan and the customer workflow

Asked for by Indi on 8 November 2026; run by dev@web-summit.indi. Written to [the plain-words standard](../../EXPLAIN.md).

## What this is

**Synthetic users** are invented people: a computer model plays a character and reacts to something, so we can spot problems before real people do. **This is not research with real people.** Every word below was written by a model playing a part.

What they reviewed: [the WS-137 plan and the customer workflow](../../dev/ws-137-plan-and-workflow.md) (the five steps to build, and the nine things a team member shows and says to win a customer).

How: three separate model sessions, one per character, each reading only the document (the Dinis view also read the files that record his rules and requests). None saw the others' answers or wrote anything except its own report. Their full answers are in [runs/](runs/).

## The three characters

1. **Helena, a prospective customer** (invented): chief operating officer of a 900-person insurance broker in Europe, not technical, piloting AI agents in claims and customer email, wary of vendors, answers to a board and a regulator.
2. **Tomás, a business strategy and sales coach** (invented): 15 years coaching small software companies to sell to large ones.
3. **A Dinis view** (synthetic): not Dinis, and no invented quotes. It judges the plan only against what the repository records Dinis asking for and deciding (WS-137, the rules in CLAUDE.md, the token mandate, his verdict on Silvio's video, WS-133). Where the record is silent, it says so.

## What all three agree on

- **The master key picture works.** Helena would repeat it to her board; Tomás calls it clear and different from generic "AI safety" talk.
- **The best moment is seeing their own gap** (workflow step 5, the red area). But it is **not built yet**, and the stand day is Thursday.
- **Asking a stranger to describe their real agents is where trust breaks** (workflow step 4). Helena stops there; the Dinis view says real company details must wait, because only test keys are allowed until the security work is done (WS-132, WS-117).

## What each one adds

**Helena (the customer)**
- She still doesn't know **what RiskMandate is**: software, a service, or a certificate, and **who stands behind** a Licence to Operate.
- She needs **proof**: a reference from a regulated firm, and whether a regulator or insurer has ever accepted such a page.
- "No promises on price" loses her at the end. She needs at least **how pricing works**, or a rough time and cost range for one first policy, to take to her board.
- She would rather start from **a made-up example in her sector** than describe her real systems on the spot.

**Tomás (the coach)**
- It is **a demo script, not a sales process.** Missing: who the visitor is and whether they run agents (qualification), who the buyer is (security, risk, compliance, the head of AI), why now, objections, a 3-minute and a 15-minute version, a note of every conversation, and who on the team does what.
- **Priorities for Monday:** the offline demo pack and testing matter most (no hotspots, and a broken demo costs more than a missing one); the infographic button next; the animation can wait, since a static picture and a good story do the same job on day one.
- **Five objections to prepare**, with answers that promise nothing on price ("we already have security tools", "we don't use agents yet", "too early for us", "is this real or just a picture", "who are you").
- **Stand tips:** practise the 3-minute version aloud twice; test the pack with wifi off; carry a printed one-page policy; note each conversation within minutes.

**The Dinis view**
- The plan **only partly matches** WS-137's definition of done: *"after a meeting, in minutes, a company gets a link to its policy, its animation and its infographic, in a vault they hold a read key to."* The plan's pack is a link and an offline copy, **with no vault and no read key**.
- **WS-133 comes first**: step 1 adds code, and Dinis has not yet chosen how person-folder code may run when the website is rebuilt. Build the live drawings as code that runs only in the browser.
- The studio **already animates the scenario** (built 4 November), so step 3 should build on it, using the same words as Silvio's video (Reach, Mandate, the gap between them).
- **Decisions only Dinis can make:** where the key vault lives (WS-117), which WS-133 option, whether an offline copy outside a vault is allowed, and anything on price or terms.

## What I would change (dev@web-summit.indi), for Indi to decide

1. **Make the deliverable a vault per company** (policy, infographic, animation, with a read key a person passes on), with test data only until security clears real keys; the offline copy becomes a stand backup, if Dinis allows it.
2. **Add two workflow steps**: a short qualification after the opener (do you run agents, who owns the risk), and "who we are and who vouches for it" before asking about their agents; offer a made-up example from their sector instead of their real systems.
3. **Write one page of objections and a price answer** ("pricing comes from Dinis; here is how a first policy starts"), agreed with Dinis, so nobody improvises.
4. **Reorder the build** for Thursday: the demo pack and testing first, the infographic button second, the animation built on the studio's own last; nothing that runs during the website rebuild until WS-133 is decided.
5. **Add a capture note** for every stand conversation, so the follow-up has something to work from.
