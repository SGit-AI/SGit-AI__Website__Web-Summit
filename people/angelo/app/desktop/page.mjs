// The live graph as an app: its one download page and install guide, people/angelo/app/desktop/index.html (backlog 00a,
// spec: people/angelo/proposals/live-map/spec-live-app.md). Placed by people/angelo/pages.mjs. Kept by dev.app@PrompTugal.angelo.
//
// The page is also the iPad's and iPhone's Home Screen entry: its head carries the web app manifest and Apple's tags, and
// opened from the Home Screen (standalone) it goes straight to the live graph's display mode, the same page and display
// mode as the browser pop-out, so the app and the pop-out stay in step (Angelo's decision 2, 8 November).
// Installers are never committed: the download links appear only once a build exists (DOWNLOADS below, filled in when CI
// or Angelo publishes one).

// Each entry: { os: 'Windows' | 'Mac', file, href, version, built } once a build is published; empty until then.
export const DOWNLOADS = []

const LIVE = '../index.html#live', DISPLAY = '../index.html?display=1#live'
const SRC = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/angelo/app/desktop'
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function pages() {
    const title = 'Team and the machine on your desktop: the hexagon app'
    const description = "Install the live graph of Angelo's team and agents as a small hexagon on your desktop (Windows, Mac), as a Home Screen app on an iPad or iPhone, or use it in the browser with nothing to install."
    const dl = DOWNLOADS.length
        ? `<ul>${DOWNLOADS.map(d => `<li><a href="${esc(d.href)}">${esc(d.os)}: ${esc(d.file)}</a> (version ${esc(d.version)}, built ${esc(d.built)})</li>`).join('')}</ul>`
        : '<p><b>Not built yet.</b> The installers come from a build on GitHub\'s Windows and macOS machines, proposed to the site\'s conductor; the links appear here once the first one has run. Until then, use the Home Screen app or the browser, below, or build it yourself from <a href="' + SRC + '">the source</a> (its README says how).</p>'
    const dlMd = DOWNLOADS.length
        ? DOWNLOADS.map(d => `- [${d.os}: ${d.file}](${d.href}) (version ${d.version}, built ${d.built})`).join('\n')
        : `**Not built yet.** The installers come from a build on GitHub's Windows and macOS machines, proposed to the site's conductor; the links appear here once the first one has run. Until then, use the Home Screen app or the browser, below, or build it yourself from [the source](${SRC}) (its README says how).`
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
<p><b>Using it:</b> drag inside the hexagon to move it. Right-click for its menu: always on top (on at first), size (small, medium, large), reload, quit. Clicks outside the hexagon go to the window underneath. It remembers its size and place.</p>
<h2 id="ipad">2. iPad or iPhone: the Home Screen app</h2>
<ol class="hx-steps">
<li>Open this page in <b>Safari</b>.</li>
<li>Tap <b>Share</b> (the square with an arrow), then <b>Add to Home Screen</b>, then <b>Add</b>.</li>
<li>Open <b>Live graph</b> from your Home Screen: it opens full screen, straight into the live graph.</li>
</ol>
<p>Apple lets no app float over other apps, so on an iPad the floating window is Safari's pop-out instead (way 3).</p>
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

Using it: drag inside the hexagon to move it; right-click for its menu (always on top, size, reload, quit); clicks outside the hexagon go to the window underneath; it remembers its size and place.

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
    return [{ rel: 'people/angelo/app/desktop/index.html', title, description, head, body, md }]
}
