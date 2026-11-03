---
title: Jose's dashboard
summary: The page Jose reads first. The top is built for Jose; the rest starts from the builder template and is Jose's, and Jose's dashboard agent's, to change.
---
Started by the conductor on 2 November from [the builder template](../../dashboards/index.html#builder): What is broken, what is being built, and whether the machine is healthy. Tell your dashboard agent (`dashboard@web-summit.jose`) what you want here and what you never look at; it changes this part.

## The technical board {#tech}

```issues area:tech
```

## The machine {#machine}

[The agents at work](../../wakes/index.html) · [the ABPs](../../abp/index.html) · [everything on the team](../../team/everything/index.html) · [the CI runs](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/actions)

## My issues {#issues}

```issues jose
```

## My agents {#agents}

Kept by `conductor@web-summit.jose` until the dashboard agent starts. Declared in [agents.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/agents.json); the prompts are in [the kit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/kit/README.md).

- **conductor@web-summit.jose**: running since 3 November, key published (conductor-jose on the keys page), wakes at 07:20, 12:20 and 17:20 UTC.
- **dashboard@web-summit.jose** and **dev@web-summit.jose**: ready in the kit, not started.
- **automation@web-summit.jose** (WS-39) and **helper@web-summit.jose** (WS-35): proposed in the brief.

Next for L4: start the dashboard agent; it makes and publishes its own key.
