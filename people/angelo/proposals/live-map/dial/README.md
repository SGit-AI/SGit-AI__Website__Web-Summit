# The live map's time dial that really goes back, and a play button at 6 hours a second

Angelo, 10 November about 00:30 UTC, on the live map with the dumbbell: *"the bar below that should allow to slide through time like in the replay view, doesn't actually seem to do anything. We need that to go back in time properly and also have a simple icon-based play button that goes from the start at 6 hours per second."*

## Why it seems to do nothing (dashboard@'s check, 10 November)

1. **It replays at real speed.** live.js's dial (backlog 0c4 (4)) moves the graph to the chosen moment, then queues every exchange after it "at its real pace from now": one second a second. Dragged back two days, the graph looks the same as live, so nothing seems to happen.
2. **The dumbbell does not follow it.** live.js fires `lv-time` ("for the work view, to follow the dial"), but no file listens: work-live.js and work-bell-draw.js keep showing now (the routes' seven days, the flights).

## What to build (drawing and time only; the data and the engine's rules stay)

- **Drag back = see that moment at once,** as the replay does: the graph, the counts and (on Workstreams and Deliverables) the dumbbell's routes as they were then, its seven days ending at that moment, the date line saying when. While paused, nothing moves except the steady flow.
- **Play buttons** (below: two speeds): an icon (▶ / ❚❚, no text), at the dial's left. Pressed: from **the start of what live.json holds** (2 November), time runs at **6 hours a second**; exchanges and deliveries fly as they happen in that time, the dial's thumb and the date line move with it, the routes' widths follow the week ending at the moment shown. Pressed again: pause where it is. At the end it reaches live and stops. **Live** returns at once.
- **Two speeds, two icons** (Angelo, about 00:40: *"It could actually have a single play for the slow 1h / sec and the FF symbol for the 6h/sec"*): **▶ play at 1 hour a second**, **⏩ fast forward at 6 hours a second**. Pressing either while it runs switches speed; pressing the running one again pauses (its icon shows ❚❚ while it runs).
- **Phones:** the button at least 44 px; the dial usable with a thumb.
- **Tests:** the dial dragged back changes what is drawn (lit lines, the date line, the dumbbell's routes); play advances the date line about 6 hours a second; Live returns to now.

## Who

- **dev.map@** (live.js, the dial and the engine's time): the play button, the compressed clock (one clock the whole map reads), drag-back at once.
- **dev.work@** (work-live.js, work-bell-draw.js): follow `lv-time` and the compressed clock: the deliveries in the window replayed at the same speed, the routes' week ending at the moment shown.
- **dashboard@:** reviews both; the wallpaper keeps its live view (no dial) for now.
