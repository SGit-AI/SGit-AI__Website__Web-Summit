---
id: WS-200
title: "PrompTugal.news: a light and dark switch at the top of every page and every front-page design"
area: content
for: dinis, silvio
due: Tue 10 Nov
status: open
picked_by:
agents: newsroom@web-summit.dinis (owns PrompTugal.news: builds it); dashboard@web-summit.silvio (proposed it, with a tested prototype)
---
From dashboard@web-summit.silvio, at Silvio's word (9 November): *"diz ao agente do Dinis para fazer"*. PrompTugal.news is the newsroom's site, so this asks its owner to build it; nothing was changed on it.

**What Silvio wants.** A one-tap switch between light and dark at the **top** of PrompTugal.news, on **every page** and in **every front-page design** (`?design=today`, `a`, `b`, `c`, `d`, `e`). His example: [`?design=e`](https://promptugal.news/?design=e) ("The Front Page") opens dark on his computer and he wants to turn it light there, and the same everywhere else.

**What exists today** (read on 9 November, site v0.1.764):

- The theme engine is already there: `assets/themes.js` sets `data-theme` before the first paint, remembers the reader's choice and exposes `window.__ptTheme` (`get`, `set`, `themes`). Paper is light and Ink is dark, and there are three more: Broadsheet, Archive and Azulejo.
- The only control is the "Paper ▾" menu in the **footer**, at the bottom of a long page (around 8,400 px down on a computer and 11,000 px on an iPhone). Readers do not find it.

**Where the switch would go.** Each front-page design has its own masthead, so the switch needs a place in each:

| Page | Masthead at the top | Where the switch fits |
|---|---|---|
| `/` (design Today) and the inner pages (articles, companies, about) | `header.ctop` with Ask and You | beside Ask, before You |
| `?design=a` The Edition | `header.fa-plate` | in the masthead |
| `?design=b` Summit Live | none at the top | top right of the page, or beside the Design pill |
| `?design=c` The Atlas | `header.fc-hd` | in the header |
| `?design=d` The Brief | `header.fd-hd` | beside "Get the daily" |
| `?design=e` The Front Page | `header.fe-mast` | in the dateline row ("Lisbon · Independent") |

**The behaviour proposed:**

- A round icon button: a moon in a light theme (go dark) and a sun in a dark theme (go light). It has an `aria-label` ("Switch to dark mode" or "Switch to light mode"), is at least 44 px on touch screens, and uses the page's own text colour, so it suits all five themes.
- A tap calls `__ptTheme.set('ink')` from a light theme and `__ptTheme.set('paper')` from a dark one. The choice is remembered, as with the footer menu, and the artwork that swaps by tone (wordmark, infographics) follows.
- The footer's five-theme menu stays as it is, for the other three themes.

**A prototype, tested.** dashboard@web-summit.silvio injected this into the live front page in a test browser only, with no change to the site. In design Today, on a computer and on an iPhone, it appears beside Ask, switches Paper to Ink and back, remembers the choice, causes no sideways scroll and raises no JS errors. It finds its place by the You button, so it covers design Today and the inner pages only; designs a to e need the places in the table.

```js
(function () {
  'use strict';
  var T = window.__ptTheme; if (!T) return;
  var SUN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  var tone = function () { var t = T.themes[T.get()]; return t ? t.tone : 'light'; };
  function paint(b) { var dark = tone() === 'dark'; b.innerHTML = dark ? SUN : MOON; b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode'); b.title = dark ? 'Light mode' : 'Dark mode'; b.setAttribute('aria-pressed', String(dark)); }
  function mount() {
    var you = [].slice.call(document.querySelectorAll('header a, header button')).filter(function (e) { return /^\s*You\s*$/.test(e.textContent); })[0];
    if (!you || document.querySelector('.pt-mode')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-mode';
    b.addEventListener('click', function () { T.set(tone() === 'dark' ? 'paper' : 'ink'); paint(b); });
    window.addEventListener('promptugal:theme-changed', function () { paint(b); });
    you.parentNode.insertBefore(b, you); paint(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
```

```css
.pt-mode{display:inline-grid;place-items:center;width:40px;height:40px;margin-right:6px;border-radius:999px;border:1px solid color-mix(in srgb,currentColor 35%,transparent);background:transparent;color:inherit;cursor:pointer}
.pt-mode:hover{background:color-mix(in srgb,currentColor 8%,transparent)}
.pt-mode:focus-visible{outline:2px solid currentColor;outline-offset:2px}
@media (pointer:coarse){.pt-mode{width:44px;height:44px}}
```

In the site itself it would rather be rendered by the build into each masthead (or by `themes.js`, which already plans a picker in the nav's tools, `#nr-tools`) than found by the You button.

**Done when:** on every page and on `?design=today`, `a`, `b`, `c`, `d` and `e`, the switch is in the first screen on a phone and a computer, turns light to dark and back in one tap, and the choice holds from page to page.

Reply in a commit with `For: dashboard@web-summit.silvio`, or answer here.
