// The live graph as an app: its one download page and install guide, people/angelo/app/desktop/index.html (backlog 00a,
// spec: people/angelo/proposals/live-map/spec-live-app.md). Placed by people/angelo/pages.mjs. Kept by dev.app@PrompTugal.angelo.
//
// The page is also the iPad's and iPhone's Home Screen entry: its head carries the web app manifest and Apple's tags, and
// opened from the Home Screen (standalone) it goes straight to the live graph's display mode, the same page and display
// mode as the browser pop-out, so the app and the pop-out stay in step (Angelo's decision 2, 8 November).
// Installers are never committed, and are served from this site only (the kit's "Our own website first", 9f3f449): the
// site's deploy puts the newest build in people/angelo/app/desktop/dl/ with dl/builds.json beside it (the draft
// drafts/deploy-pages-step.md, for conductor@web-summit.dinis). The page reads dl/builds.json in the browser and shows a link
// per installer; with no build there (no file, or no installer in it) it says "Not built yet".
//   dl/builds.json: { "built": "<ISO time>", "commit": "<sha>", "files": [{ "os": "Mac" | "Windows", "file": "<name>", "bytes": <n> }] }

const LIVE = '../index.html#live', DISPLAY = '../index.html?display=1#live'
const SRC = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/app/desktop'
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function pages() {
    const title = 'Team and the machine on your desktop: the hexagon app'
    const description = "Install the live graph of Angelo's team and agents as a small hexagon on your desktop (Windows, Mac), as a Home Screen app on an iPad or iPhone, or use it in the browser with nothing to install."
    const none = 'The installers come from a build on GitHub\'s Windows and macOS machines, proposed to the site\'s conductor, and are served from this site; the links appear here once the first one has run. Until then, use the Home Screen app or the browser, below, or build it yourself from '
    const dl = `<div id="hx-dl" aria-live="polite"><p><b>Not built yet.</b> ${none}<a href="${SRC}">the source</a> (its README says how).</p></div>
<script>(function () {
  var box = document.getElementById('hx-dl'); if (!box || !window.fetch) return
  fetch('dl/builds.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null }).then(function (b) {
    var files = b && Array.isArray(b.files) ? b.files.filter(function (f) { return f && /^(Mac|Windows)$/.test(f.os) && /^[A-Za-z0-9_.-]+$/.test(f.file || '') }) : []
    if (!files.length) return
    var when = b.built ? new Date(b.built) : null, day = when && !isNaN(when) ? when.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''
    var ul = document.createElement('ul'); ul.className = 'hx-dl'
    files.forEach(function (f) {
      var li = document.createElement('li'), a = document.createElement('a')
      a.setAttribute('href', 'dl/' + encodeURIComponent(f.file)); a.setAttribute('download', ''); a.textContent = f.os + ': ' + f.file
      li.appendChild(a); if (f.bytes) li.appendChild(document.createTextNode(' (' + Math.round(f.bytes / 1048576) + ' MB)')); ul.appendChild(li)
    })
    var note = document.createElement('p'); note.className = 'note'
    note.textContent = 'Built ' + day + (b.commit ? ' from ' + String(b.commit).slice(0, 8) : '') + ', served from this site.'
    box.replaceChildren(ul, note)
  }).catch(function () { })
})()</script>`
    const dlMd = `**Not built yet** in this copy of the page: the installers come from a build on GitHub's Windows and macOS machines, proposed to the site's conductor, and are served from this site. The page itself (index.html) shows a link per installer once the first build has run. Until then, use the Home Screen app or the browser, below, or build it yourself from [the source](${SRC}) (its README says how).`
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
<p>The live graph of Angelo's team and agents (<a href="${LIVE}">Team and the machine</a>), on its own: a small hexagon that sits on your desktop or fills an iPad, always moving with the record. Pick the way that suits your device. All three show the same page, so they always look the same.</p>
<h2 id="desktop">1. Windows or Mac: the hexagon app</h2>
${dl}
<p><b>The first time you open it</b> your computer warns you, because the app is not signed yet (a signing certificate costs money; that is Angelo's call). It is safe to go on:</p>
<ul class="hx-steps">
<li><b>Mac:</b> in Applications, right-click (or Control-click) <i>Team and the machine</i>, choose <b>Open</b>, then <b>Open</b> again. On macOS 15 or later, if there is no Open button: System Settings, Privacy &amp; Security, scroll down, <b>Open Anyway</b>.</li>
<li><b>Windows:</b> when "Windows protected your PC" appears, click <b>More info</b>, then <b>Run anyway</b>. It installs for you only; no administrator needed.</li>
</ul>
<p><b>Using it:</b> drag inside the hexagon to move it. At its top, beside the logos, <b>⚙</b> opens the controls and <b>✕</b> closes the app. The controls: View (people ring, agents ring, work; 2D or 3D, the 3D turning by itself), Size (S, M, L), Window (always on top, on at first; Calm, on at first: fewer frames, so the fan stays quiet; turn it off for smoother movement), open in browser, reload, close. Right-click gives the same choices as a menu. Clicks outside the hexagon go to the window underneath. It remembers its size and place.</p>
<h2 id="ipad">2. iPad or iPhone: the Home Screen app</h2>
<ol class="hx-steps">
<li>Open this page in <b>Safari</b>.</li>
<li>Tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>, then <b>Add</b>.</li>
<li>Open <b>Live graph</b> from your Home Screen: it opens full screen, straight into the live graph.</li>
</ol>
<p>Apple lets no app float over other apps, so on an iPad the floating window is Safari's pop-out instead (way 3).</p>
<p>An iPad at the stand, showing the graph all day? <a href="ipad.html">Set up an iPad for the stand</a>.</p>
<h2 id="browser">3. Nothing to install: the browser</h2>
<ul class="hx-steps">
<li><a href="${LIVE}">Open the live graph</a> and press <b>⧉ Pop out</b> for a floating window over your other windows (Chrome or Edge on a computer; Safari on a Mac or an iPad).</li>
<li>Or <a href="${DISPLAY}">Display mode</a>: the graph alone, full screen, for a screen left on all day.</li>
</ul>
<h2 id="what">What it holds</h2>
<p>Nothing of yours. The app is a window around the public live page: names, lines and times from the public record, never a message's text, a secret or a location. It has no key and no account, and keeps only its window's size and place. Its source is in this site's repository: <a href="${SRC}">people/angelo/app/desktop</a>.</p>
<p class="note">Built by dev.app@PrompTugal.angelo for Angelo's team (backlog 00a). Something not working? Tell Angelo, or his agents in a commit.</p>`
    const md = `The live graph of Angelo's team and agents ([Team and the machine](${LIVE})), on its own: a small hexagon that sits on your desktop or fills an iPad. Pick the way that suits your device; all three show the same page.

## 1. Windows or Mac: the hexagon app

${dlMd}

The first time you open it your computer warns you, because the app is not signed yet. It is safe to go on:

- **Mac:** in Applications, right-click (or Control-click) *Team and the machine*, choose **Open**, then **Open** again. On macOS 15 or later, if there is no Open button: System Settings, Privacy & Security, **Open Anyway**.
- **Windows:** when "Windows protected your PC" appears, click **More info**, then **Run anyway**. It installs for you only.

Using it: drag inside the hexagon to move it; at its top, ⚙ opens the controls and ✕ closes the app; the controls: View (people ring, agents ring, work; 2D or 3D), Size (S, M, L), Window (always on top and Calm, both on at first; Calm keeps the fan quiet), open in browser, reload, close; right-click gives the same choices as a menu; clicks outside the hexagon go to the window underneath; it remembers its size and place.

## 2. iPad or iPhone: the Home Screen app

1. Open this page in Safari.
2. Tap Share, then Add to Home Screen, then Add.
3. Open Live graph from your Home Screen: it opens full screen, straight into the live graph.

## 3. Nothing to install: the browser

- [Open the live graph](${LIVE}) and press ⧉ Pop out (Chrome or Edge on a computer; Safari on a Mac or an iPad).
- Or [Display mode](${DISPLAY}), for a screen left on all day.

## What it holds

Nothing of yours: a window around the public live page (names, lines and times from the public record). No key, no account; it keeps only its window's size and place. Source: [people/angelo/app/desktop](${SRC}).
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
<p class="note">Kept by dev.app@PrompTugal.angelo (backlog 0m). Checked in a browser at iPad sizes with touch; not yet on a real iPad. The <a href="index.html">app page</a> has the desktop app and the pop-out.</p>`
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
