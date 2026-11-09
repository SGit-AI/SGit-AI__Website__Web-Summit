---
title: "Deliveries as a dumbbell: the team at one end, the destinations at the other, the routes between"
by: dashboard@PrompTugal.angelo
written: 2026-11-09
status: approved by Angelo, 9 November about 17:30 UTC, with two changes (below); to build
for: Angelo; desk.conductor@PrompTugal.angelo (who builds what); dev.work@PrompTugal.angelo (the page's work view); dev.app@PrompTugal.angelo (the wallpaper's drawing contract)
issue: WS-203 (the wallpaper), backlog 0c4 (the map's levels)
---
Angelo, 9 November about 17:10 UTC, after the wallpaper's Deliverables level (0.4.0): *"The text labels are awkward and hard to read. We should design a different way to make the deliverables easier to read. Maybe is an entirely new view where people and agents are on one side and then there is a pipeline of deliverables that go from the network to their destinations. Pretty much like a dumbbell, on one end the team and the machine network, on the other end the destinations, in the middle all the routes between the two."*

## Angelo's answers (9 November, about 17:25 to 17:30 UTC)

*"Since this is going to live in devices that are either portrait or landscape, this should be a setting: agents on top or below, right or left. I'm not sure we care for the count, it clutters and it's not that meaningful."* Then: *"The rest is ok."*

- **Orientation is a setting**, on the page and on the wallpaper: the team and the machine **on top, below, on the left or on the right**, the destinations at the other end. Added by me, for him to overrule: a fifth choice, **Automatic** (top on a portrait screen, left on a landscape one), as the default until he picks one.
- **No counts.** The list shows the mark and the full name only; the routes' widths carry how much.
- **Questions 1 to 5 as recommended:** it replaces the rim for Deliverables and Workstreams on the page and the wallpaper; routes by person (tap a person for their agents' routes); widths over the last seven days, icons flying live; the network end a small live graph; dev.work@ builds the page's version, then dashboard@ ports it to the wallpaper with a test holding the two together.

## Why the labels are awkward today

The destinations sit on the hexagon's rim among the agents, so their names have to squeeze into pills beside or inside the rim. On a phone there is no room outside the rim, so every name goes inside, cut short, and moved up or down until it clears the others. That is the cause, and no styling fixes it: the names need a place of their own.

## The view

![Wide](mock-wide.png) ![Phone](mock-phone.png) ![Phone, the team below](mock-phone-below.png)

(The mock-ups, redrawn without counts. The third flips the whole drawing to show "below"; the build moves the network to the other end without mirroring it.)

The mock-ups are drawn from this site's own data (`data.json`'s map, and `deliveries.json`'s last seven days), in the dark theme.

- **One end: the team and the machine.** The network as it is now, in a circle: the people, each with their agents beside them.
- **The other end: the destinations.** A plain list, one row each: a mark or logo and the **full name, level, 16 to 18 px**. No count (Angelo). Busiest first, nearest the team. A destination with nothing this week stays in the list, dimmed, so the list does not jump about.
- **The middle: the routes.** One route from each person to each destination they delivered to this week, in the person's colour, **as wide as how much**. Each new delivery flies along its route as its icon (doc, cog, key, record, envelope, post), as today, and the row lights when it lands.
- **Orientation, a setting:** the team on top, below, left or right (and Automatic). Across, the routes run straight into their rows; down, each person's route comes down its own lane in the gutter and turns into its row, like a metro map.
- **Workstreams the same way.** The ten workstreams become the list ("WS-14 newsroom.web-summit…" in full, the number first), and the routes go to them.
- **What is read:** nothing new. `deliveries.json` and `workstreams.json`, as now; names and times only.

## Questions for Angelo, each with a recommendation

1. **Where it lives.** Recommended: it **replaces the rim** for both levels, Deliverables and Workstreams, on the website's live map (Messages | Workstreams | Deliverables) and on the wallpaper. Messages stays the hexagon as it is.
2. **Routes by person or by agent.** Recommended: **by person** (six colours, at most sixty routes, readable); tap a person to see their agents' own routes.
3. **What the widths count.** Recommended: **the last seven days**, while the icons fly live, a few minutes behind as now. The alternative is the last 24 hours, which is thinner but fresher.
4. **The network end.** Recommended: **a smaller copy of the live graph**, with the messages still flowing inside it, so the view stays alive between deliveries. The alternative is a still circle of people only, which is calmer.
5. **Who builds.** Recommended: **dev.work@** builds the page's version (it owns the work view and `work-draw.js`); then I port it to the wallpaper, as I did the rim, with a test holding the two together. The rim stays until the new view is on dev.

Until the new view is on dev, nothing changes: wallpaper 0.4.0 and the page keep the rim.
