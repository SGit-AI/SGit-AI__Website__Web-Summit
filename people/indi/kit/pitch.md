# What RiskMandate does: Indi's pitch

Written by conductor@web-summit.indi for Indi, 11 November 2026, from riskmandate.ai (its home page, llms.txt and the ABP page) and the team site's RiskMandate pages. No claim beyond what riskmandate.ai says. No traction figures, market sizes or prices: use none until Nimay or Dinis gives approved ones. The investor version waits for Nimay's or Dinis's yes before it is used in writing.

## For customers

**In 10 seconds**

> We help companies give AI agents access without giving them free rein. We show what each agent can really do, what you actually want it to do, and the gap between the two. Then we help you close that gap.

**In 30 seconds**

> AI agents now work inside email, payroll, HR and sales systems. The problem is that they can usually do far more than anyone asked. An inbox assistant meant to draft replies can often send them too.
>
> We write an Agent Behaviour Policy for each agent. It lists what the agent can reach, what you authorised it to do, and the gap between them. For each gap, it records what stops the agent today: often just an instruction it could ignore.
>
> Then we show which of your existing controls can turn that rule into a real limit. We never sit between your agent and your systems, so we can't slow it down or break it.

**The example**

> Take an inbox agent. You want it to read mail and write drafts, but never send. The policy shows it can send, and that only one line in its instructions says it shouldn't. So we set your mail system to hold anything it tries to send until a person approves it. Now "never send" is a fact, not a hope.

**If they know AI or security, add one line**

> The policy separates the grant (what its credentials permit) from the mandate (what it's authorised to do). A rule only counts as a control if it's enforced by something the agent can't switch off itself.

## For investors

**In 30 seconds**

> Companies are giving AI agents access to their money, staff and customers faster than anyone can check what those agents can do. Insurers have noticed: carriers are filing to exclude AI from cover.
>
> RiskMandate is the insurability layer for AI agents. For every agent, we measure what it can actually reach, record what the business authorised, and show the gap and what really stands in the way. That record is the evidence an underwriter will accept.
>
> We never sit in the agent's path, so there's nothing to break and nothing to slow down. We work alongside the security and compliance tools companies already own. And the record is built on a zero-knowledge vault, so the customer keeps the keys.

**The points behind it**

- **Why now:** agents are being deployed with real access, and insurers are pulling back cover for AI.
- **The insight:** what an agent can do is not what it was asked to do, and nobody ever accepted the difference. RiskMandate measures that gap.
- **Easy to adopt:** read-only and outside the agent's path; it works with the controls companies already have; the open-source harness, SHarness, covers teams that have none.
- **The score:** an Insurability Index from 0 to 100, taken from the company's own setup rather than a questionnaire.
- **No deny button:** an agent already has access, so a risk can't be denied, only accepted. A named owner accepts it for a set time, and when that time runs out the decision comes back.

## What not to say

- Not "the ABP guides every response": a rule in the prompt is the weakest barrier (an expectation the agent keeps by choice).
- Not "RiskMandate blocks the agent": RiskMandate writes the policy; your gateway, proxy or access system, or SHarness, enforces it.

## Sources

- https://riskmandate.ai/ and https://riskmandate.ai/llms.txt (read 11 November 2026)
- https://riskmandate.ai/abp.md (the four barriers)
- The team site: /abp/, /abp-creation/, /investors/
