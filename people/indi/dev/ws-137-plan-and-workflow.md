# WS-137: the plan, and the customer workflow, in plain words

Written by dev@web-summit.indi on 8 November 2026 for Indi, who asked for it explained to someone with no knowledge of computing or RiskMandate. A proposal: nothing here is built until Indi says go. The issue: [WS-137, Dinis's lab](../../../board/WS-137-dinis-s-lab-from-a-conversation-to-an-agent-policy.md).

## RiskMandate in one paragraph

AI agents are computer programs that do tasks for a company on their own: answer emails, move money, change files. To work, they are given access to systems, like a new employee given a master key, and the key usually opens far more doors than the job needs. RiskMandate writes one page per agent that says:

- **Reach:** every door the key opens.
- **Mandate:** the rooms the agent is actually meant to be in.
- **Gap:** the difference between the two. This is where the risk is.
- **Barriers:** what actually stops the agent going where it shouldn't, with proof.
- **Provenance:** who owns the agent, who checked it, and which version is running.

That page is an **Agent Behaviour Policy**. It ends in a **Licence to Operate**: what the agent may do, and on what conditions. Bosses, security teams and insurers all read the same page.

## The plan: five steps (version 2, 8 November, after the synthetic review; Indi said yes to all five changes)

Built in this order, so the most useful part for Thursday is ready first.

1. **The demo pack, as a vault per company.** A vault is a private online folder; a read key is the password that lets one company open theirs and nothing else. Each of the three companies gets one vault holding its policy, infographic and animation. **Test data only** until the security agent approves real keys (WS-132, WS-117). A copy that works without internet is a stand backup only, **if Dinis allows it**.
2. **Testing, early.** Every piece is tried with wifi switched off and in a headless browser (a browser run by a program, no screen) against a pretend model, before it goes near a customer.
3. **A "Make the infographic" button in the policy studio.** It turns the studio's conversation into the three pictures (what the company does, its risks from agents, how RiskMandate helps), expert and everyday words side by side. It runs **only in the browser**: nothing new runs while the website is rebuilt, until Dinis decides WS-133.
4. **The animation, built on the studio's own.** The studio already animates a scenario (since 4 November). This makes it RiskMandate's picture, in the same words as Silvio's video: Reach, Mandate, and the gap between them.
5. **Hand over.** Put it live, and tell Dinis, the designer agent and the security agent, with what is done and what is not.

**Also for Thursday, not code:** one page of likely objections and a price answer, agreed with Dinis (no one improvises on price or terms); and a short note taken after every stand conversation.

## The customer workflow: what a team member shows and says, in order (version 2)

1. **Before the meeting, know them.** Read the company's factory page: what they do, the likely risks from their agents, the suggested opening line. *Exists today (28 pages).*
2. **Open with one question** they can't easily answer: "Do you know what your agents are doing?" or "Your AI has access. Does it have permission?" *Exists today (shirt and card lines).*
3. **Check they are the right person (new).** "Do you run AI agents today, or plan to? Who in your company owns the risk if one goes wrong?" If they run none and plan none, thank them, give a card, and move on. *Script only.*
4. **Explain the problem in everyday words:** "An AI agent is like a new employee with a master key. Most companies don't know which doors the key opens." Show the "RiskMandate in one picture" panel. *Exists today.*
5. **Say who we are and who vouches for us (new).** Who is behind RiskMandate, what a Licence to Operate is, and who reads it (their security team, board, insurer). Only what is public and true. *Wording to agree with Dinis.*
6. **Work through an example, not their secrets (changed).** Use a made-up example from their industry in the policy studio, so they share nothing confidential. Ask about their real agents only if they offer. *The studio exists today; test keys only for now.*
7. **Show the gap:** the animation and the risks picture. "This is what the agent can do. This is what it was asked to do. The red part is the risk nobody has written down." *Planned (plan steps 3 and 4).*
8. **Show what RiskMandate gives them:** one page per agent, Reach to Licence to Operate. "Your security team, your board and your insurer all read the same record." *Exists today (the studio writes it).*
9. **Handle the questions** with the agreed answer sheet, including price: "Pricing comes from Dinis; here is how a first policy starts." *Planned (to agree with Dinis).*
10. **Leave something behind:** their vault link and read key, passed on by a person, and your card with its QR code. *Planned (plan step 1); today, the factory page link.*
11. **Take a note within minutes (new):** name, role, company, their agents, the next step. *Planned: a simple note form.*
12. **Follow up:** an agent drafts it; **a person reads it and sends it**. Thanks, the vault link, and one next step: writing the policy for one of their real agents together. *Exists today (the follow-up loop).*
