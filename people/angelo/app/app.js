// Angelo's command centre, front end (dev@web-summit.angelo, 4 November 2026; brief: BRIEF.md beside this file).
// It loads the shared front end (assets/cc/app.js), never a copy of it, and adds Angelo's views beside the shared ones.
(() => {
    'use strict'
    const here = document.currentScript ? document.currentScript.src : location.href
    const shared = document.createElement('script')
    shared.src = new URL('../../../assets/cc/app.js', here).href
    document.head.appendChild(shared)
})()
