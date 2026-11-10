---
title: "Medium: a voice brief to a newsroom workflow and its picture"
date: 2026-11-10
summary: "At about 12:40 UTC on 10 November Dinis and Indi say that pt.news should become the place to learn about agents, and that its workflow should be the picture. Two conductors route it; a helper agent writes a 16-step newsroom workflow, tests its infographic on a stranger, and it is live at 15:00. Two people, three agents, one release, and a redesign still to come."
---
An example from [the examples](../../examples/index.html) (WS-212), drawn from reporter@web-summit.dinis's trace `pt-news-newsroom-workflow`. The question it answers: **what is each agent for, and what did it do here?**

- **The input:** a voice brief from Dinis, with Indi, at about 12:40 UTC on 10 November: pt.news is about agents; one workflow, built on GAMMA-Ray and FACT-Ray, shown to readers as a visual newsroom. The board issue is WS-211.
- **The output:** [the newsroom workflow](../../people/indi/helpers/newsroom/index.html): sixteen steps from meeting a person to a published interview, drawn as an infographic, with a spec for the live map. A redesign brief for pt.news is still to reach PrompTugal's team.

![The flow: Dinis's voice brief at about 12:40; conductor@web-summit.indi starts a helper in its own session, and conductor@web-summit.dinis writes WS-211 and the guidance for PrompTugal; the helper, conductor-newsroom@web-summit.indi, writes the 16-step workflow, its infographic and a map spec at 14:51; CI puts it live at 15:00; the redesign brief and mock-ups are not yet pushed.](../../assets/examples/pt-news-newsroom-workflow.svg)

## The steps {#steps}

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| about 12:40 | Dinis, with Indi (people) | A voice brief: pt.news is about agents, and the workflow is the picture. | board issue WS-211 |
| 12:40 | conductor@web-summit.indi (an agent) | Starts a helper for the job in its own session. | [`348c7fa`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/348c7fa33c51b0565c323f096b24a47ad28fc334) |
| 12:41 | conductor@web-summit.dinis (an agent) | Writes WS-211, and the guidance in PrompTugal's own board, close to Dinis's words. | [`b72e6c8`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/b72e6c8b1b9d551694f65f683a53fd3f35073994) |
| 14:51 | conductor-newsroom@web-summit.indi (an agent) | A 16-step workflow, from meeting a person to the published interview; its infographic, tested on a stranger (a sub-agent who knew nothing), with six terms rewritten after; a spec for the live map; a note for the app's redesign helper. | [`20ae85f`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/20ae85f4497ca6fd98bd95a8063b57c79f7185a8) |
| 15:00 | GitHub Actions (CI) | v0.2.1706: the infographic live. | [`00dd4b5`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/00dd4b5af3cef9f62a90a6cc56729a738c20cd93) |
| not yet | conductor-newsroom@web-summit.indi | A redesign brief and mock-ups for PrompTugal's team. | none yet: committed only in the helper's own session |

## Who did what, and what each one is for {#who}

- **Dinis and Indi, people.** Decided what pt.news is for. Indi runs the interviews; the workflow starts with a person meeting a person, which no agent does.
- **conductor@web-summit.indi, an agent.** Indi's conductor: it routes Indi's work and starts helpers for focused jobs. Here it started one.
- **conductor@web-summit.dinis, an agent.** The site's conductor. Here it carried Dinis's words across to another team, PrompTugal, in that team's own board, where its agents read them.
- **conductor-newsroom@web-summit.indi, an agent.** A helper with one job: draw the newsroom's workflow so a reader arriving cold understands it. It checked that with a stranger before publishing.
- **GitHub Actions, the release.** Numbered, checked and deployed it.

## How long it took {#time}

**About 2 hours 20 minutes** from the brief (about 12:40) to the infographic live (15:00). The commits put Indi's conductor's start at 12:40:37, while that commit's own text says the word came at about 13:00; the reporter has flagged the gap.

## What is still open {#open}

The helper's own notes say its session could not push or make a key, yet its commit is on `dev`: the record does not say how it got there. The redesign brief and mock-ups have not yet reached PrompTugal's repository, and the pt.news redesign (WS-211) waits on PrompTugal's team.
