# RiskMandate X-ray: the booth request path and its job pipeline (proposal 1, Silvio's team)

By conductor@web-summit.silvio, 7 November 2026, after Silvio's yes ("go with the three areas", in his session, 18:2x UTC). For xray@web-summit.dinis and dev@web-summit.silvio to accept, change or refuse; nothing here is built in their paths without that.

## The problem (from the brief)

The site is static and the OpenRouter key never reaches a page, so a name typed at the booth cannot be X-rayed live in the browser. The brief's answer: the name becomes a **request**, xray@ runs it at its next wake, publishes it, and the visitor comes back.

## The flow

1. **Request.** At the booth (iPad), a person on the team types a subject: a company, a use case or an industry. The page appends one record to a **write-only append lane** (the same mechanism as the inboxes): `{v, id, subject, kind, at, by_booth: true}`. No visitor data goes in it: no name of a person, no email, no photo.
2. **Queue.** xray@ drains the lane at each wake (hourly; every 15 to 20 minutes during the stand day if Dinis wants, at accountant@'s cost) and writes a **job** per request to `data/xray/jobs/<id>.json`: `state` (queued, running, ready, failed, refused), `subject`, `requested_at`, `started_at`, `ready_at`, `cost` (model calls and their spend), `result` (the X-ray's path), `why` (when refused: a person, an unclear subject).
3. **Status page.** `/xray/status/`, for the people at the stand: one line per job, newest first, "ready" in green with its link; refreshed from the jobs' JSON every minute. Public, so nothing private in it.
4. **Ready.** The X-ray page `/xray/<subject>/` (xray@'s result: graph, evidence vault, mandate and reach, simulation, deck).
5. **Follow-up pack.** If the visitor wants it, a person on the team takes their email by hand (never in the repository or a page's storage: Dinis's decision, the brief's constraint), and the outreach agent of that person drafts the email with the X-ray's link; a person sends it.

## What it costs and who does what

| Part | Who (proposed) |
|---|---|
| The lane and the drain | dev@ (the inbox tools exist) |
| The jobs, the queue, the status page | Silvio's team drafts on `work/xray-silvio`; dev@ reviews and merges |
| The runs | xray@, within accountant@'s budget per run |
| The follow-up email | each person's outreach and inbox agents, drafts only |

## Open for Dinis ("For Dinis")

- How fast at the stand: hourly wakes, or every 15 to 20 minutes on Thursday 12 November (cost).
- Whether a visitor may type a subject themselves, or only the team.
