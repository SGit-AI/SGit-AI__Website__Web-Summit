# Findings, run 1 (the C1 cards, site v0.2.265)

Grouped by cost, not by persona. "Measured" means checked by a tool, not only said by an invented person.

## Blocking (a scan that does not become a meeting)

1. **The QR opens on an "Add your key" box.** Five of five personas met it first. Four nearly closed the page; one (Aiko) read it as a phishing pattern. *Measured:* the first phone screen of all seven `/meet/<id>/` pages, in a fresh browser.
2. **The card promises "Book a meeting" and "Talk to my agent"; the page says both are "coming this week".** *Measured:* the page text. The only route left is "our stand on Thursday 12 November", with no hall or stand number, on the last day of the summit.
3. **No email or other way to reach a person**, on the card or on the page. Raised by all five.

## Costly

4. **The card never says what RiskMandate does.** Every persona had to scan and scroll to the second screen ("RiskMandate, in short") to find out. Hannah: she will not Google.
5. **No role or title on any card.** An investor cannot tell founder from staff; a journalist cannot print a name and title; a buyer cannot tell who to contact.
6. **The meet page names no regulation or control** (DORA, the AI Act, third-party risk), so a bank CISO cannot map it to her obligations (Marta).
7. **No legal entity or privacy notice** on the page, which a procurement committee asks for (Aiko).

## Minor

8. The printed domain is `web-summit.sgit.ai`, not a RiskMandate domain. All five asked who the company is.
9. "Meet me" and "Book a meeting" read as the same action, and it is unclear which line the QR opens.
10. In the stack, two cards carry a first name only (Angelo, Vicky). Vicky's own words for her card were "Vicky Wang, Project Manager" (`people/vicky/business-card.json`).
11. Dinis's and Indi's cards print the wordmark in black; the other five match their colour bar.
12. The version number and "Built and run by an AI agent" read as an unfinished project to a buyer, though they are the press angle for a journalist.

## What held

- **The QR works.** *Measured:* 7 of 7 decode to the person's own page. The printed URL let a careful reader check the destination before scanning.
- **"RiskMandate, in short"** (Reach, Mandate, Gap, who is accountable) convinced all five, once they reached it.
- **The stack:** seven matching cards read as a real, coordinated team. Most remembered: Jose's "I brought 6 agents. Ask me why." (three of five), then Vicky's and Nimay's questions.

## Suggested changes (for the card and meet-page owners to decide)

- Meet page: hide the key box from visitors with no key, and open on the greeting and "RiskMandate, in short".
- Meet page: a working contact before the summit (an email or the booking link), and the stand location.
- Card: one category line ("Governance records for AI agents", or the team's own) and each person's role.
