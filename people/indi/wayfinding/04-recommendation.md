# 4. The recommendation: ship Option 2 today, iterate from there

## The MVP: Options 1 and 2 together, on the team site

One page, `/registration/`, public:

1. Two cards (airport T1, Pavilhão de Portugal). Each shows today's hours, "open now" or "closes in 2 h 10 min", and a "Directions" button (Apple Maps on iPhone, Google Maps elsewhere, destination only).
2. The card that is open and nearest goes first. The phone's clock decides "open"; Lisbon time is shown.
3. "From where I am": the browser's location, used on the phone only. A small map with no tiles, drawn from OpenStreetMap's outlines, shows a straight line, the distance and the direction, plus one transport line: "metro, red line, to Oriente".
4. "What to bring": the ticket's QR code and a photo ID. The source and the date read are at the bottom.
5. `registration.json` beside it: the one data file every later option reads.

**Why this one:** it answers the question in ten seconds, works in every environment we have (browser, both apps, every agent's link), holds no private data, and needs no new service. It is about an hour of one agent's work, and it can be live today, while people are still collecting badges (until Thursday 16:45).

**Not in the MVP:** the hotel (Option 3), the native app (Option 4), the agent's personal link (Option 5). Each is a later iteration, below.

## How it is built (one agent, one hour)

1. `data/registration.json`: the two points, their coordinates from OpenStreetMap (checked by hand), the hours by day, the source URL, the date read.
2. `content/registration.md`: the page, with the cards rendered from the JSON at build time, and a small inline script for "open now", "from where I am" and the line. No third-party scripts, no map tiles, no requests after the page loads.
3. The venue outline: reuse Angelo's `venue-map.js` drawing, with his ODbL credit.
4. Tested on a phone-sized screen (390 px), with the location allowed and with it refused (the page must still work).
5. Linked from `/start/` and from the Team app's websites list (`Websites.json`), so it shows in the app.

## The next three iterations, in order

1. **From my hotel** (Option 3): type the hotel once, kept on the phone. The line starts there.
2. **Your agent's link** (Option 5): a one-paragraph prompt for every person's agent. It answers in a sentence and links to the page with the start point in the `#` part.
3. **The same page on PrompTugal.news**, for every attendee, via Angelo's dev.venues@ (WS-181). Then the Team app's native card (Option 4) for the next event.

## What we learn, and write down

After the MVP, three questions, answered from use:
- Did people use "Directions" (another app) or the line (our page)? If the line is enough, Options 3 and 5 are worth it. If not, Option 1 is the product.
- Which environment did they open it in: browser, app or agent link?
- What did they ask next? (Our guess: "where is my first session?". The same shape applies.)

## Decisions for Dinis

1. Build the MVP now, on the team site? (Recommended: yes, it helps the team today.)
2. Which agent builds it: Indi's dev helper (it knows the factory and the gate) or Angelo's dev.venues@ (it owns WS-181's venues)? Recommended: Indi's dev helper today, handed to dev.venues@ for PrompTugal.news.
3. Add it to the Team app's websites list now?
