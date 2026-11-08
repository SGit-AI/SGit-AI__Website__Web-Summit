// /people/silvio/videos/: the team's video library, ready to post (Silvio, 8 November 2026: "a page dedicated to the
// videos where anyone on the team can see them, organised, so whoever works on social media can get the videos to
// upload"). By video@web-summit.silvio. No video or image is in this repository (Dinis's rule): the page reads
// library.json, the posters and the files from the team's videos vault in the browser, with the vault's published
// read key (people/silvio/vaults.json), through the site's pinned reader (assets/vendor/sgit-ai/2026-11-05/vault-embed.js).
import fs from 'node:fs'
import path from 'node:path'
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const VAULT_ID = 'h9in5em4'
const CSS = `<style>
.vl{--bg:#070d1c;--card:#0c1529;--line:#1f2c48;--line2:#2f4366;--ink:#eef1f6;--soft:#b8c2d6;--dim:#8f9bb3;--teal:#5eead4;--gold:#f5d78e;
background:var(--bg);color:var(--ink);border-radius:20px;padding:28px 24px 32px;border:1px solid var(--line);font-size:16px}
.vl a{color:var(--teal)}
.vl .k{margin:0;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--teal)}
.vl h2.t{margin:8px 0 10px;font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.12;color:var(--gold)}
.vl .lead{margin:0;max-width:52rem;color:var(--soft);line-height:1.55}
.vl .steps{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 6px}
.vl .steps span{display:flex;align-items:center;gap:10px;background:#0e1830;border:1px solid #22314f;border-radius:12px;padding:10px 14px;font-size:15px}
.vl .steps b{display:inline-flex;width:26px;height:26px;border-radius:50%;background:var(--teal);color:#062a26;align-items:center;justify-content:center}
.vl .filters{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:18px 0 6px}
.vl .filters .lab{font-size:14px;color:var(--dim);margin-right:4px}
.vl button,.vl .btn{font:inherit;font-size:14px;font-weight:600;min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--line2);background:#0e1830;color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;gap:6px;text-decoration:none}
.vl .filters button{border-radius:999px;padding:0 16px}
.vl .filters button.on{background:var(--gold);color:#1a1406;border-color:var(--gold)}
.vl .count{margin-left:auto;font-size:14px;color:var(--dim)}
.vl .status{margin:16px 0 0;font-size:15px;line-height:1.5;color:#dfe4ee;background:#0e1830;border:1px solid #2f4366;border-left-color:#2f4366;border-radius:12px;padding:12px 14px}
.vl section{margin-top:34px}
.vl section>.h{display:flex;flex-wrap:wrap;align-items:baseline;gap:12px;border-bottom:1px solid #1d2a45;padding-bottom:10px;margin-bottom:16px}
.vl section>.h h3{margin:0;font-size:1.5rem;color:var(--ink)}.vl section>.h p{margin:0;color:var(--dim)}
.vl .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px}
.vl article{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.vl .thumb{position:relative;aspect-ratio:16/9;background:#050913}
.vl .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.vl .len{position:absolute;right:10px;bottom:10px;background:rgba(5,9,19,.86);font-size:13px;font-weight:600;border-radius:6px;padding:3px 8px}
.vl .body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:10px;flex-grow:1}
.vl .aud{margin:0;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal)}
.vl h4{margin:0;font-size:1.15rem;line-height:1.3;color:var(--gold)}
.vl .shows{margin:0;font-size:15px;line-height:1.5;color:var(--soft)}
.vl .shows{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;min-height:6em}
.vl .ctl{margin-top:auto;display:flex;flex-direction:column;gap:10px;padding-top:6px;border-top:1px solid #1d2a45}
.vl .row1{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px}
.vl .pick{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}
.vl .pick select{font:600 15px Inter,system-ui,sans-serif;color:var(--ink);background:#0e1830;border:1px solid var(--line2);border-radius:10px;min-height:44px;padding:0 10px;text-transform:none;letter-spacing:0}
.vl .one{margin:0;font-size:14px;font-weight:600;color:var(--soft)}
.vl .fmt{font-size:13px;font-weight:600;color:var(--dim)}
.vl .acts{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}
.vl .acts>*{justify-content:center}
.vl .play{background:var(--teal);color:#062a26;border-color:var(--teal)}
.vl .post{background:#1d1708;color:var(--gold);border-color:#5c4a1c}
.vl .ghost{background:transparent}
.vl .where{margin:0;font-size:13px;line-height:1.4;color:var(--dim);word-break:break-word}.vl .where:empty{display:none}
.vl .extra{display:flex;flex-wrap:wrap;gap:8px}
.vl .text{display:none;background:#081022;border:1px solid #5c4a1c;border-radius:12px;padding:12px}.vl .text.open{display:block}
.vl .text pre{margin:0;white-space:pre-wrap;font:14px/1.5 Inter,system-ui,sans-serif;color:#dfe4ee}
.vl .how{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;background:#0b1427;border:1px solid var(--line);border-radius:16px;padding:20px;margin-top:34px}
.vl .how h3{grid-column:1/-1;margin:0;font-size:1.3rem}.vl .how p{margin:0;font-size:15px;line-height:1.5;color:var(--soft)}.vl .how b{display:block;color:var(--teal);margin-bottom:4px}
.vl .foot{margin-top:22px;font-size:14px;color:var(--dim);line-height:1.5}
.vl-modal{position:fixed;inset:0;background:rgba(3,6,14,.88);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
.vl-box{background:#0c1529;border:1px solid #2f4366;border-radius:16px;padding:14px;max-width:min(1280px,100%);width:100%;display:flex;flex-direction:column;gap:12px;color:#eef1f6;font:15px Inter,system-ui,sans-serif}
.vl-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.vl-x{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid #2f4366;background:#0e1830;color:#eef1f6;font:600 15px Inter,sans-serif;cursor:pointer}
.vl-box video{width:100%;max-height:75vh;border-radius:10px;background:#000}
</style>`
export function videos(ROOT) {
    const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/silvio/vaults.json'), 'utf8')).vaults.find(x => x.vault_id === VAULT_ID)
    if (!v || !/^sgit_public_read_[0-9a-f]{64}$/.test(v.read_key)) throw new Error('people/silvio/videos: the videos vault needs a sgit_public_read_ key in people/silvio/vaults.json')
    const app = `https://dev.vault.sgraph.ai/#${v.read_key}%3A${VAULT_ID}`
    const body = `<div class="vl" id="vl" data-endpoint="https://dev.send.sgraph.ai" data-vault="${VAULT_ID}" data-key="${esc(v.read_key)}" data-app="${esc(app)}">
<p class="k">RiskMandate · Web Summit 2026 · for the team</p>
<h2 class="t">Videos, ready to post</h2>
<p class="lead">Every video we have made, checked and approved. Pick one by who it speaks to or where you post it, copy its text, download the file, and upload it natively. The text and the link are written for you.</p>
<div class="steps"><span><b>1</b>Choose by audience or channel</span><span><b>2</b>Copy the post text (EN or PT)</span><span><b>3</b>Download and upload to the channel</span></div>
<nav class="filters" aria-label="Filter the videos"><span class="lab">Show videos for:</span><span id="vl-ch"></span><span class="count" id="vl-count"></span></nav>
<p class="status" id="vl-status">Opening the team's videos vault in your browser…</p>
<div id="vl-list"></div>
<div class="how"><h3>How to post, per channel</h3>
<p><b>LinkedIn</b>Upload the file natively (it plays in the feed); the link goes in the post text. Square versions fit best. Posts go through Indi (WS-126).</p>
<p><b>Instagram</b>Links in captions are not clickable: write "link in bio" and put the page in the bio. Use the square file where there is one.</p>
<p><b>YouTube</b>The 16:9 file; the first two lines of the text show above "more"; pin a comment with the link.</p>
<p><b>The stand screen</b>Download the stand page, open it on the iMac in Chrome and press F: visitors choose their language.</p></div>
<p class="foot">The files live in the team's videos vault, <a href="${esc(app)}">open it read-only</a> (every file there has a Save button). Never re-upload an edited copy: ask video@web-summit.silvio for a new format or language. RiskMandate is never shown blocking anything; claims only as on riskmandate.ai and this site.</p>
<noscript><p>This page reads the videos from the vault with JavaScript. Without it, <a href="${esc(app)}">open the vault</a> directly.</p></noscript>
</div>`
    const md = `The team's video library: every approved RiskMandate video, organised by series, with who it speaks to, its files (English and Portuguese, 16:9 and square), and the post text ready to copy. For whoever posts on LinkedIn, Instagram and YouTube, and for the stand screen.\n\nThe videos are not in this repository: the HTML page reads \`library.json\`, the posters and the files from the team's videos vault (vault id ${VAULT_ID}) in the browser, with its published read key. The vault itself: ${app}\n\nKept by video@web-summit.silvio. A new video is added to the vault's \`library.json\` when Silvio approves it.\n`
    return { rel: 'people/silvio/videos/index.html', title: 'Videos, ready to post: the team’s library', description: 'Every approved RiskMandate video, organised by series and audience, with English and Portuguese files, the post text ready to copy, and how to post on LinkedIn, Instagram, YouTube and the stand screen. Read from the team’s videos vault.', body, md, head: CSS + '<script src="../../../assets/vendor/sgit-ai/2026-11-05/vault-embed.js" defer></script><script src="./videos.js" defer></script>' }
}
