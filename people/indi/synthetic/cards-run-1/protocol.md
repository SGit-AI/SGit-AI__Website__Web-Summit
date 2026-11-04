# The protocol

The method of the synthetic-users vaults on sgit.ai (#27, #28, #54: https://sgit.ai/demos/vaults/index.html), pointed at the RiskMandate business cards for Web Summit 2026.

**Everybody in this vault is invented.** The personas, their names and every word attributed to them were written by a language model (Claude sub-agents, one per persona, in the session of synthetic@web-summit.indi) looking at images. This is not user research. What is measured, not narrated: the card images (rendered from the print files at trim size), the QR decodes, the URL each QR opens and the screenshots of that page on a 390 x 844 phone.

## Rules for the agent playing a persona

- It sees **images only**: the card front, the card back, and phone screenshots of the page the QR opens. It never reads the SVG, the HTML, the repository or the site's markdown.
- It stays in the persona: their time, their device, their patience, their English.
- It may stop at any step (pockets the card, bins it, closes the page). Stopping is a result, not a failure.

## Each step

1. **Observe**: one image.
2. **See**: what this persona would take in, at their level of attention.
3. **Think**: what they weigh and what they suspect.
4. **Question**: something the card or page raised and did not answer (null if none).
5. **Confusion**: where they guessed or got lost (null if none). A run with no confusion was not done properly.
6. **Act**: one action, with the reason in the persona's terms.

## The screens, in order

1. `card-<giver>-front.png`, 2. `card-<giver>-back.png`, 3. if they scan: `meet-<giver>-phone-s1.png` to `s4.png`, one screen at a time, 4. at the end of the day: `stack-all-fronts.png` (the seven cards together) and "which one do you remember, and why".

Then an interview, the same questions for everyone.

## Interview

1. In one sentence, what does RiskMandate do?
2. What would you do next, and when?
3. What was missing?
4. Did you trust it? Why?
5. Which card in the stack do you remember, and why?
6. One change that would make you act.
