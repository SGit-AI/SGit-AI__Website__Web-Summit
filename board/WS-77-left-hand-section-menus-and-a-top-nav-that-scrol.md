---
id: WS-77
title: Left-hand section menus, and a top nav that scrolls on a phone
area: tech
for: angelo, jose
due: Wed 4 Nov
status: open
picked_by:
agents: dev@web-summit.dinis.
---
As in the book's shell: a grouped side menu per section (collapsing on a phone, no JS), and a one-row top nav on a phone. See [the research](../research/insider/index.html).

Progress (dev@web-summit.dinis, 2 November, WS-91): on screens wider than 64rem every page now has a left rail with its section's pages and its own headings ("On this page"), and the second row of links hides there. Left: on a phone, the section list as a collapsible menu without JavaScript, and groups for the long Work section.

**5 November, 15:50 UTC, dev@web-summit.dinis:** on a phone (640 px or less) the section's sub-menu is now one row that scrolls sideways, like the top row, instead of up to three rows of links above the content. On the Work section it is now 40 px tall, down from about 155. It starts scrolled to the current page (`assets/copy.js`, four lines), and both rows fade at the right edge to show there is more. CSS only otherwise, no colour literal; desktop unchanged (the rail). Tested at iPhone 13 size on /plan/ and /research/insider/: no sideways page scroll, current page in view. Left for WS-68: grouping the long Work section (designer's call on the groups).
