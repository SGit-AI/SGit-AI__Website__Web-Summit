# 2. Six ways to solve it, simplest first

Each option says what the person sees, what it needs, what it costs to build, and what is private.

## Option 0: a sentence (minutes)

**What the person sees:** an answer in chat: *"Today, Monday, Pavilhão de Portugal is open 12:00 to 22:00, and the airport's Terminal 1 until 22:00. Take the metro's red line to Oriente; the pavilion is by the river, a few minutes' walk."*
**Needs:** the facts above. Any agent can say it now.
**Private:** nothing leaves.
**Limits:** no map, no line, no "from where I am". But it is already useful, and it is what the person needs in the first minute.

## Option 1: a static page with "open in Maps" buttons (an hour)

**What the person sees:** one page: two cards, one per registration point. Each card shows its hours, with today's highlighted and "open now" or "closed" from the phone's clock, and a button, "Directions". The button opens Apple Maps, Google Maps or Citymapper with the destination filled in. The maps app uses the phone's own location for the start.
**Needs:** the two places' coordinates (from OpenStreetMap) and the hours. One markdown page, plus a few lines of script for "open now".
**Private:** nothing. The page never asks where you are. The maps app does, on the phone.
**Limits:** the line is drawn by another app. That is fine: it is the best line there is.

## Option 2: Option 1, plus "from where I am" with a straight line (half a day)

**What the person sees:** Option 1, plus a button, "From where I am". The browser asks for the location once. The page picks the nearest point that is open now, and draws a small map: the venue drawing (Angelo's outlines), the two registration points, a dot for "you", and **a straight line** with its distance and compass direction ("2.3 km, east"). It adds one plain line for transport: "metro, red line, to Oriente".
**Needs:** the browser's location (on the phone only), a small map with no tiles (an SVG from OpenStreetMap's outlines, so no third-party map service), and a distance formula.
**Private:** the location never leaves the phone. The page sends nothing.
**Limits:** a straight line, not a route. That is what Dinis asked for: "some kind of line, even if not perfect".

## Option 3: from my hotel (a day)

**What the person sees:** Option 2, plus "From my hotel". The person types or picks the hotel's name once. The phone keeps it in the browser's local storage, never on the server. The page shows the line from the hotel, and the nearest metro station to the hotel.
**Needs:** turning a hotel's name into a place. On the device this means a lookup: either the person drops a pin once, or a small public list of the hotels near the venue, which we can publish because it is public data, not who stays where.
**Private:** who stays where never leaves the phone. That matches Indi's and Angelo's decisions: no hotel addresses in the team's files.
**Team version:** a person may choose to share "my hotel: <name>" with the team, as a zone, under WS-181's rules. The team sees the name, not the address.

## Option 4: in the Team app, natively (days, through Dinis's iPhone agents)

**What the person sees:** a "Registration" card on the Team app's home screen. It shows the open point, a MapKit map with the line, and "Directions". There is a Live Activity on the lock screen while walking, and Siri can answer "where is registration?".
**Needs:** a change in PrompTugal/PrompTugal__App__iOS, built and sent through TestFlight by the release line. It reads the same public JSON as the web page.
**Private:** location on the device, as in Option 2.
**Limits:** an app release, and App Review for external testers. Too slow for the first days, right for the next summit.

## Option 5: an agent that makes your page (a day, then reusable)

**What the person sees:** they tell their agent, in the Claude app, "I'm at <hotel>, where do I register?". The agent replies with Option 0's sentence and a link to their own private page (Option 3, with the hotel already filled in).
**Needs:** a short prompt for every person's agent, the public JSON, and the page from Option 2 or 3, which accepts the starting point in the link's `#` part, so it is never sent to the server.
**Private:** the hotel is in the person's chat and in the link's `#` part, read only by their phone.
**Why it matters:** it is the general workflow. A person's agent joins personal context and public facts into a page made for them. The same shape works for "my next session" or "the stand".

## What every option shares

One public data file, **`registration.json`**: the points, their coordinates, their hours by day, the source URL and the date read. Every option reads it: the sentence, the page, the app and the agent. When Web Summit changes the hours, one file changes.
