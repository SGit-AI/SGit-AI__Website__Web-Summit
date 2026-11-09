// The live graph on any screen: the pop-out, display mode and the iPad's and iPhone's Home Screen app,
// people/angelo/app/desktop/index.html (backlog 00a, spec: people/angelo/proposals/live-map/spec-live-app.md). Placed by
// people/angelo/pages.mjs. Kept by dev.app@PrompTugal.angelo.
//
// The desktop hexagon app was dropped on 8 November at Angelo's word (desk be9b735: "we'll simply use the pop out feature
// we already have on the website. There's no need to put in place anything else"; unsigned installers were blocked by
// Windows Smart App Control). So the page offers no installer and links none; it keeps its address, because the team has it.
// Its source (src-tauri/) stays in the repository as a record, unbuilt.
//
// The page is also the iPad's and iPhone's Home Screen entry: its head carries the web app manifest and Apple's tags, and
// opened from the Home Screen (standalone) it goes straight to the live graph's display mode, the same page and display
// mode as the browser pop-out (Angelo's decision 2, 8 November).

const LIVE = '../index.html#live', DISPLAY = '../index.html?display=1#live'
const SRC = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/app/desktop'
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function pages() {
    const title = 'Team and the machine on any screen: pop-out, display mode, Home Screen'
    const description = "The live graph of Angelo's team and agents on any screen, with nothing to install: the browser's pop-out over your other windows, display mode for a screen left on all day, or a Home Screen app on an iPad or iPhone."
    const head = `
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#07111F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Live graph">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<script>(function () { try { if (navigator.standalone === true || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) location.replace(${JSON.stringify(DISPLAY)}) } catch (e) { } })()</script>
<style>.hx-steps li{margin:0 0 6px}.hx-icon{float:right;width:96px;height:96px;margin:0 0 12px 16px;border-radius:20px}</style>`
    const body = `<img class="hx-icon" src="icons/icon-192.png" alt="" width="96" height="96">
<p>The live graph of Angelo's team and agents (<a href="${LIVE}">Team and the machine</a>), on its own, always moving with the record. Nothing to install: all three ways show the same page in your browser, so they always look the same.</p>
<h2 id="browser">1. A computer: the pop-out</h2>
<ul class="hx-steps">
<li><a href="${LIVE}">Open the live graph</a> and press <b>⧉ Pop out</b> for a small floating window over your other windows (Chrome or Edge on a computer; Safari on a Mac or an iPad).</li>
<li>The small buttons in the hexagon's corner pick the layout. For the 3D view, press <b>3D</b> on the page before popping out.</li>
</ul>
<h2 id="display">2. A screen left on all day: display mode</h2>
<ul class="hx-steps">
<li><a href="${DISPLAY}">Display mode</a>: the graph alone, full screen, for a monitor or a TV at the stand. Press <b>Esc</b> to go back to the page.</li>
</ul>
<h2 id="ipad">3. iPad or iPhone: the Home Screen app</h2>
<ol class="hx-steps">
<li>Open this page in <b>Safari</b>.</li>
<li>Tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>, then <b>Add</b>.</li>
<li>Open <b>Live graph</b> from your Home Screen: it opens full screen, straight into the live graph.</li>
</ol>
<p>An iPad at the stand, showing the graph all day? <a href="ipad.html">Set up an iPad for the stand</a>.</p>
<h2 id="desktop">The desktop app: dropped</h2>
<p>A separate hexagon app for Windows and Mac was built and then dropped on 8 November: unsigned installers are blocked by Windows Smart App Control, and the pop-out above does the same job. There is nothing to download. Its source stays in <a href="${SRC}">the repository</a> as a record.</p>
<h2 id="what">What it holds</h2>
<p>Nothing of yours. It is the public live page: names, lines and times from the public record, never a message's text, a secret or a location. No key and no account.</p>
<p class="note">Kept by dev.app@PrompTugal.angelo for Angelo's team (backlog 00a). Something not working? Tell Angelo, or his agents in a commit.</p>`
    const md = `The live graph of Angelo's team and agents ([Team and the machine](${LIVE})), on its own, always moving with the record. Nothing to install: all three ways show the same page.

## 1. A computer: the pop-out

- [Open the live graph](${LIVE}) and press ⧉ Pop out for a small floating window over your other windows (Chrome or Edge on a computer; Safari on a Mac or an iPad).
- The small buttons in the hexagon's corner pick the layout. For the 3D view, press 3D on the page before popping out.

## 2. A screen left on all day: display mode

- [Display mode](${DISPLAY}): the graph alone, full screen, for a monitor or a TV at the stand. Esc goes back to the page.

## 3. iPad or iPhone: the Home Screen app

1. Open this page in Safari.
2. Tap Share, then Add to Home Screen, then Add.
3. Open Live graph from your Home Screen: it opens full screen, straight into the live graph.

An iPad at the stand? [Set up an iPad for the stand](ipad.html).

## The desktop app: dropped

A separate hexagon app for Windows and Mac was built and then dropped on 8 November: unsigned installers are blocked by Windows Smart App Control, and the pop-out does the same job. There is nothing to download. Its source stays in [the repository](${SRC}) as a record.

## What it holds

Nothing of yours: the public live page (names, lines and times from the public record). No key, no account.
`
    return [{ rel: 'people/angelo/app/desktop/index.html', title, description, head, body, md }, ipad()]
}

// The stand's iPads (backlog 0m, Angelo 8 November, relaying Dinis: two iPads for demos at the stand, "to show our multiple
// apps in action"): one page to set one up, with the links it needs. people/angelo/app/desktop/ipad.html
const ABP = '../../proposals/abp-live/player.htm'
function ipad() {
    const title = 'Set up an iPad for the stand'
    const description = 'One page to make an iPad at the stand show the live graph or the ABP demo all day: open it, add it to the Home Screen, keep the screen on, and lock it to the one app with Guided Access.'
    const links = [
        ['The live graph, full screen', 'index.html', 'open in Safari, then Add to Home Screen (step 2 below): it opens straight into the live graph, full screen'],
        ['The live graph in Safari (display mode)', DISPLAY, 'the same picture, nothing to install'],
        ['ABPs you can watch: the loop', ABP + '?mode=loop', 'recorded runs replayed one after another, no touch needed'],
        ['ABPs you can watch: interactive', ABP + '?mode=interactive', 'for a visitor to tap through the barriers'],
    ]
    const body = `<p>For the two iPads at the stand (Dinis, 8 November: "to show our multiple apps in action"). About ten minutes per iPad, once. Each iPad shows one thing all day: the live graph or the ABP demo.</p>
<h2 id="links">The links</h2>
<ul class="hx-steps">
${links.map(([t, h, w]) => `<li><a href="${h}">${esc(t)}</a>: ${esc(w)}.</li>`).join('\n')}
</ul>
<h2 id="setup">Once per iPad</h2>
<ol class="hx-steps">
<li><b>Charge it</b>, and plan a charger at the stand: an iPad left on all day needs one.</li>
<li><b>Open this page in Safari</b>, then tap a link above. For the live graph: tap <b>Share</b> (the square with an arrow), <b>Add to Home Screen</b>, <b>Add</b>, and open <b>Live graph</b> from the Home Screen.</li>
<li><b>Keep the screen on:</b> Settings, Display &amp; Brightness, <b>Auto-Lock</b>, <b>Never</b>. Turn <b>Low Power Mode</b> off (Settings, Battery): it slows the animation.</li>
<li><b>Quiet:</b> turn on <b>Do Not Disturb</b> (Control Centre, Focus), so no notification covers the screen.</li>
<li><b>Turn on Guided Access:</b> Settings, Accessibility, <b>Guided Access</b>, on. In <b>Passcode Settings</b>, set a passcode the stand's team knows. Set <b>Display Auto-Lock</b> there to <b>Never</b> too.</li>
</ol>
<h2 id="day">Each morning</h2>
<ol class="hx-steps">
<li>Connect to the stand's Wi-Fi: the live graph needs the internet to stay live.</li>
<li>Open the app (or the page), then <b>triple-click</b> the top button (or the Home button, on an iPad that has one) and tap <b>Start</b>. The iPad now stays on that one app: no Home Screen, no swiping away.</li>
<li>To leave: triple-click again, enter the passcode, tap <b>End</b>.</li>
</ol>
<h2 id="check">If something looks wrong</h2>
<ul class="hx-steps">
<li>A blank or frozen picture: end Guided Access, close the app, open it again, start Guided Access.</li>
<li>The live graph fills the screen best in landscape; both pages fit either way.</li>
</ul>
<p class="note">Kept by dev.app@PrompTugal.angelo (backlog 0m). Checked in a browser at iPad sizes with touch; not yet on a real iPad. The <a href="index.html">live graph page</a> has the pop-out and display mode.</p>`
    const md = `For the two iPads at the stand (Dinis, 8 November: "to show our multiple apps in action"). About ten minutes per iPad, once. Each iPad shows one thing all day: the live graph or the ABP demo.

## The links

${links.map(([t, h, w]) => `- [${t}](${h}): ${w}.`).join('\n')}

## Once per iPad

1. Charge it, and plan a charger at the stand.
2. Open this page in Safari, then a link above. For the live graph: Share, Add to Home Screen, Add, and open Live graph from the Home Screen.
3. Keep the screen on: Settings, Display & Brightness, Auto-Lock, Never. Turn Low Power Mode off (Settings, Battery).
4. Quiet: Do Not Disturb (Control Centre, Focus).
5. Guided Access: Settings, Accessibility, Guided Access, on; Passcode Settings, set a passcode the team knows; Display Auto-Lock, Never.

## Each morning

1. Connect to the stand's Wi-Fi.
2. Open the app, triple-click the top button (or the Home button) and tap Start.
3. To leave: triple-click, the passcode, End.

## If something looks wrong

- A blank or frozen picture: end Guided Access, close the app, open it again, start Guided Access.
- The live graph fills the screen best in landscape.

Kept by dev.app@PrompTugal.angelo (backlog 0m). Checked in a browser at iPad sizes; not yet on a real iPad.
`
    return { rel: 'people/angelo/app/desktop/ipad.html', title, description, head: '<style>.hx-steps li{margin:0 0 6px}</style>', body, md }
}
