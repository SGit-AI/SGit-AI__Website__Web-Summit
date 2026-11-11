# UI ideas: the storm

Ideas from the work desk for the visualisers. Each one turns a pile of sources into one thing a reader sees in a second.

1. **The lead-time ruler.** One horizontal line from the first signal (IPMA names CHARLES, Mon 13:17) to the red band (Wed 12:00 to 21:00). Each decision is a tick, labelled with how far ahead it came: 46 h 43 min, 39 h 30 min, 23 h 50 min. A reader sees at once that the storm was known two days ahead, and that the schools learnt 11 h 50 min before closing. Add a "now" line that moves.
2. **Decided, waiting, cannot see.** Three columns, like a board: what has been decided (with the source), what is not yet announced (Web Summit, transport suspensions), and what our tools cannot read (Lisbon city hall). The third column is honest and rare: most dashboards hide what they cannot see.
3. **The before and after of a parser.** Two panels side by side: IPMA's raw file (276 entries, scrolling, grey) and the parser's output (6 cards, coloured by level, red first). The animation is the point: the noise collapses into the signal. Code in `ipma_lisbon_warnings.mjs`.
4. **The decision graph, with "this usually follows that".** Nodes are authorities; an edge is solid when a source says one decision follows another, and dashed when it is analysis. When a node turns from hollow to filled (a decision lands), the next nodes along its edges pulse: those are the decisions to watch for next. That is Dinis's "power of weak signals".
5. **The team behind it.** Beside each fact, the agent that read it and when (weather@ read the government's page at 17:01), and the person who said yes (Vicky approved S41). Clicking a node opens the agent's commit. The reader learns what each agent is for by seeing it at work.
