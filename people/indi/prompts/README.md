# Indi's prompts

Kept by prompter@web-summit.indi (see people/indi/kit/README.md). Every prompt here works on Sonnet 5.5, Opus 5.5 and Fable 5.1, and names the model it is meant for.

| Prompt | For | Version | Model | Date |
|---|---|---|---|---|
| [stand-demo](stand-demo.md) | demo@web-summit.indi at the stand: a visitor's company as a safe simulation, run side by side with and without an ABP (WS-137) | 4.1 | Fable 5.1 or Opus 5.5 | 2026-11-09 |
| [team-messaging-ios](team-messaging-ios.md) | The iOS team app's conductor: team messaging v1 (chat and email, sealed end to end, over the vaults), built to the tested formats | 1 | Opus 5.5 lead, Sonnet 5.5 screens | 2026-11-09 |
| [team-app-redesign](team-app-redesign.md) | Dinis's iOS lead session: rebuild the Team app as five tabs (Now, Where, Plan, Tasks, More), in seven checked stages | 7 | Opus 5.5 lead, Sonnet 5.5 workers | 2026-11-09 |
| [mobile-release-line](mobile-release-line.md) | An Android release agent: one release line for iPhone and Android, copying the iPhone line's design, in nine steps | 1 | Opus 5.5, then Sonnet 5.5 | 2026-11-09 |
| [helper-session](helper-session.md) | A one-off helper that takes one task off Indi's conductor, so two tasks run at once without clashing | 1 | Sonnet 5.5 (Opus 5.5 for writing or code) | 2026-11-09 |
| [infographic-agent](infographic-agent.md) | infographic@web-summit.indi: pastel, plain-word infographic pages on the team site, each tested on a stranger before Indi sees it | 1 | Opus 5.5 first run, then Sonnet 5.5 | 2026-11-09 |
| [video-editor](video-editor.md) | video-editor@web-summit.indi: edits PrompTugal.news interviews from iPhone and Sony A7 III footage; colour correction (too orange, HDR, S-Log), sound, the hook, YouTube and Shorts exports; never publishes | 2 | Opus 5.5 for the edit, Sonnet 5.5 for exports | 2026-11-10 |

## Lessons

One line each, when a prompt did not work first time and why.

- 2026-11-09: name helper agents with a hyphen, not a dot (conductor-faq@web-summit.indi): the team site only recognises agent names of letters, numbers and hyphens, so a dotted name hides the agent from its pages.
- 2026-11-09: a redesign brief must say what to keep of the current look. The first Team app prototype brought a new palette and font, and Indi found it a shock to the eye; version 3 keeps today's look.
- 2026-11-09: write commands out in full, never as a link: the stand-demo agents had no web and skipped the measure step. And give every "if research fails" path, because at a stand it will.
- 2026-11-10: match the output shape to the code that reads it, field by field: the demo runner read abp.mandate, the prompt wrote abp as text, and the agent ran with no mandate. Check the reader before naming a field.
- 2026-11-10: test every command a prompt gives before shipping it: in ffmpeg, colortemperature makes a picture cooler with a higher number, so the obvious '4200K to fix orange' made it worse (video-editor, dev@web-summit.indi).
