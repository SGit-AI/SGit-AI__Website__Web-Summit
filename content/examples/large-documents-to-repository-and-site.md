---
title: "Large: two documents and a spoken brief to a new repository, a site and the first signed card, in a night"
date: 2026-11-10
summary: "At about 23:20 UTC on 9 November Dinis hands over two documents and a spoken brief. The site's conductor starts one agent, gamma-ray@, which reads the documents against their sources, builds a standard, a site and its gate, then starts its own team of agents. They draft, review twice, send back and sign off the first public card by 08:44, and FACT-Ray is live at 10:20. One person, six agents, a new repository."
---
An example from [the examples](../../examples/index.html) (WS-212), drawn from reporter@web-summit.dinis's trace `large-documents-to-repository-and-site`. The question it answers: **what is each agent for, and what did it do here?**

- **The input:** two documents Dinis made with a research assistant (a selection of five standards, and a concept note), and his spoken brief at about 23:20 UTC on 9 November: map agents against existing standards, in a way that can be measured, through RiskMandate's lens. The brief is kept in the new repository's [BRIEF.md](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/blob/dev/BRIEF.md).
- **The output:** a new repository, [SGit-AI__Website__Gamma-Ray](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray), its site [gamma-ray.sgit.ai](https://gamma-ray.sgit.ai/), the first signed public card (Replit Agent) and [FACT-Ray](https://gamma-ray.sgit.ai/fact-ray/).

![The flow: Dinis's documents and brief at about 23:20; conductor@web-summit.dinis writes WS-206 and starts gamma-ray@; Dinis makes an empty repository at 00:20; gamma-ray@ builds draft 0.1, the lens, standard 0.2 beta, the public card format, and starts a team; gamma.studio@ drafts Replit Agent's card at 04:24, gamma.review@ reviews it twice, gamma.approve@ sends it back then signs it off at 08:08; it is live at 08:44; FACT-Ray at 10:20.](../../assets/examples/large-documents-to-repository-and-site.svg)

## The steps {#steps}

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| about 23:20 (9 Nov) | Dinis (a person) | Two documents and a spoken brief. | [BRIEF.md](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/blob/dev/BRIEF.md) |
| 23:24 | conductor@web-summit.dinis (an agent) | Writes it down as board issue WS-206: GAMMA-Ray, beside the RiskMandate X-ray. | [`37ad1b1`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/37ad1b1a0ff7f9ea47bfceea488aee2d78852718) |
| 23:25 | conductor@web-summit.dinis (an agent) | Starts a new agent for the job, gamma-ray@web-summit.dinis. | [`9e6756a`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/9e6756aef3ca6a78a8b0cd9a16606d2ccc132a90) |
| 00:20 | Dinis (a person) | Makes a new, empty repository on GitHub. Agents here cannot create repositories; a person does. | [`816bab1`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/816bab1f32e1bff474fa8e6df1399bd63b17b101) |
| 00:39 | gamma-ray@web-summit.dinis (an agent) | Reads the documents against their sources. Draft 0.1: nine instruments cut into 286 provisions and 69 indicators, the site, its gate and CI. First version live. | [`842d904`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/842d904b3c442ee356076c8dd7b95b3465526f33) |
| 01:11 | gamma-ray@ | At Dinis's word, RiskMandate becomes the lens (mandate, grant, delta). | [`f04b4fa`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/f04b4fa8a4a986d6b73825a16b006eb7b48c9d0e) |
| 02:46 | gamma-ray@ | After an outside review and a launch brief: standard 0.2 beta. The errors found in the original documents are recorded, not hidden. | [`86dc604`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/86dc6047ea3d5b1c6b0578c21198ec52ce2181ba) |
| 03:36 | gamma-ray@ | The public card: four measures (Autonomy, Reach, Control, Openness), sixteen rules as data, a scorer, five cards. | [`be9faab`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/be9faaba56290125f7c80f5f293dd7a56dc285dc) |
| 04:05 | gamma-ray@ | Starts its own team: studio, review, approve, editor, design and graphs. | [`e7aa10e`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/e7aa10e86a1be82a8f27f9d39e75ee1cd4a2d330) |
| 04:24 | gamma.studio@web-summit.dinis (an agent) | A draft card for Replit Agent, from public sources only. | [`6575a23`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/6575a234786a070a59a9d052cc4ef5ef124f126e) |
| 05:08 | gamma.review@web-summit.dinis (an agent) | Review, round one. | [`82bf912`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/82bf912aa459faf60f11bbdc4f1e232c98dc7742) |
| 05:44 | gamma.studio@ | Answers: a source swapped, an indicator re-sourced. | [`e2cf406`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/e2cf406a637bc5f0e8e30fe4e1a3fe5370f6e276) |
| 06:11 | gamma.review@ | Review, round two. | [`52c138c`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/52c138c73532169e47495ab10279d6bc2325c35e) |
| 07:09 | gamma.approve@web-summit.dinis (an agent) | Sends the card back, with reasons. gamma-ray@ tightens the rule: the last review round must pass. | [`2701d8f`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/2701d8f724f84d88b229e96eb49562f63bc3769b), [`9fd015d`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/9fd015da44f157e32b21315fa3c1d4eb65be035f) |
| 08:08 | gamma.approve@ | Signs it off under the corrected rule: the first GAMMA-Ray card. | [`ade3c6e`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/ade3c6ea6b8b761a2565d08208d46ebd5b9435b8) |
| 08:44 | gamma.studio@ | Replit Agent's card live, the first public card. It reached the 09:00 deck's "Overnight" slide ([the medium example](../../examples/medium-voice-brief-to-deck/index.html)). | [`d4b05f6`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/d4b05f60712c9854a3c350838667e8afa9638c6d) |
| 10:20 | gamma-ray@ | After Dinis's second brief: FACT-Ray inside the site, trust shown on every card, a page per provision. | [`64c846a`](https://github.com/SGit-AI/SGit-AI__Website__Gamma-Ray/commit/64c846ae68e210198f7d8d4e085369d255ba4f28) |

GitHub Actions versioned every push of the new repository: v0.0.1 to v0.0.44 in about ten hours.

## Who did what, and what each one is for {#who}

- **Dinis, a person.** Brought the documents and the idea, made the repository, and gave two more briefs as it took shape (the lens, the launch, FACT-Ray).
- **conductor@web-summit.dinis, an agent.** The site's conductor: turns Dinis's word into plans and board issues, and starts the agent a job needs. Here it did one thing well: gave the job to a new agent of its own, with its own repository.
- **gamma-ray@web-summit.dinis, an agent.** The owner of GAMMA-Ray: it keeps the standard, the site and the gate. It checked the input before building on it, corrected it in the open, and when the work grew, started a team and wrote the rules the team works by.
- **gamma.studio@web-summit.dinis, an agent.** Drafts a card for a product's agent from public sources only, and answers the reviewers.
- **gamma.review@web-summit.dinis, an agent.** Reviews each draft in rounds and asks for changes. It does not sign.
- **gamma.approve@web-summit.dinis, an agent.** Sends a card back or signs it off; the gate checks that the rules were followed, so a card without a passing last round cannot go live.

## How long it took {#time}

- **About 1 hour 20 minutes** from the brief to the first site (about 23:20 to v0.0.1 at 00:39).
- **About 9 hours 25 minutes** to the first signed card live (08:44), through two review rounds and one sent-back card.
- **About 11 hours** to FACT-Ray (10:20). Through the night, and across a three-hour pause the team called THE BIG STOP (23:36 to 02:40); gamma-ray@ kept working in its own repository.

## What is still open {#open}

The site goes on: about 250 commits by 16:20 on 10 November. Cards for the companies pt.news interviews come next (WS-211).
