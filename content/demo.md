---
title: "The demo screen"
summary: "One screen for our demos at the stand and on the iPads: a bar of buttons, and the demo loads in the middle. Hide the bar for the full screen. The links are one small file anyone on the team can change during the day."
---
**[Open the demo screen](../assets/demo/screen.htm)**, the address to put on the screens and the iPads: https://web-summit.sgit.ai/assets/demo/screen.htm

At Dinis's word (11 November 2026, about 18:40 UTC): "a simple page that has a header at the top with a bunch of buttons and links, or maybe on the side, maybe configurable, and then in the middle we just load up specific views ... something that we put up on the screens ... and show on our iPads ... a way to hide that to give us a bit more bandwidth ... the same unified view that anybody that wants to present can access."

## How to use it {#use}

- **Pick a demo:** click its button, or press its number (1 to 9). It loads in the middle. The screen remembers the last one, and the address ends in `#<number>`, so you can bookmark a demo.
- **More room:** press **H** or click **Hide** to hide the bar. A faint "☰ Demos" button in the corner, or **H** or **Esc**, brings it back. Press **F** for full screen.
- **Top or side:** **L** or the **Side/Top** button moves the bar. On the side, each button shows a one-line description, which helps when presenting.
- **On an iPad:** open the address in Safari, then Share and Add to Home Screen. It opens full screen like an app. Every button is big enough to tap.
- **If a demo will not load inside:** "Open in a new tab ↗" in the corner opens it on its own.

## Today's demos {#demos}

| Key | Demo | What it shows |
|---|---|---|
| 1 | [GAMMA-Ray](https://gamma-ray.sgit.ai/spectrum/) | how much an AI agent does on its own, and how well it is governed |
| 2 | [Gravity: the Universe](https://web-summit.sgit.ai/people/silvio/app/#brain) | Silvio's live map of the summit and our agents |
| 3 | [The team, live](https://web-summit.sgit.ai/people/angelo/app/#live) | Angelo's animation: every dot an agent, every line a message |
| 4 | [The X-ray](https://web-summit.sgit.ai/xray/) | type a company and watch the agents X-ray it |
| 5 | [RiskMandate film](https://riskmandate.ai/) | reach, mandate, gap in 53 seconds |
| 6 | [ABPs you can watch](https://web-summit.sgit.ai/people/angelo/proposals/abp-live/player.htm) | Agent Behaviour Policies in action |
| 7 | [Storm Charles](https://storm-charles.promptugal.news/) | the incident site our agents built in a day |
| 8 | [Lisbon Tech Fringe](https://lisbontechfringe.com/) | everything happening around the summit |
| 9 | [PrompTugal.news](https://promptugal.news/) | the newsroom about agents |

## Changing the links {#change}

The buttons come from one file, `assets/demo/demos.json`. Each demo has:
- `key`: its shortcut;
- `title`: the button;
- `sub`: the description shown on the side;
- `url`;
- `type`: `page`, `video`, or `new-tab` for a site that refuses to be framed.

Edit it, then commit and release as usual. Every screen picks up the change on its next reload. Anyone on the team, or their agent, may change it.
