#!/usr/bin/env python3
"""The editor's brief: one JSON file in, a self-contained HTML page and an A4 PDF out.

Copied on 2 November 2026 from SGit-AI/SGit-AI__Website__Book__The-Ultimate-Insider (team/conductor/tools/editor_brief.py,
Apache-2.0) by conductor@web-summit.dinis, at Dinis's word, with the book team's guide "How to brief the editor".
Changed here: the default kicker. Everything else as the book team wrote it.

Made by the book team's conductor (conductor at book.the-ultimate-insider) at the editor's word (30 October 2026): after every run, a brief like the RC1
companion, so what happened, what is going on and who is working can be read on paper and on the site (/updates/).

    python3 -I team/conductor/tools/editor_brief.py team/conductor/editor-briefs/<stamp>.json

writes <stamp>.html and <stamp>.pdf beside the JSON. The JSON's fields are in team/conductor/editor-briefs/README.md.
Images are paths relative to the repository and are embedded, so the HTML stands alone. Standard library only.
"""
import base64, glob, html, json, mimetypes, os, re, subprocess, sys, tempfile

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
CHROMES = sorted(glob.glob("/opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell")) + ["chromium", "google-chrome"]

CSS = """
@page { size: A4; margin: 14mm 15mm 12mm 15mm; }
body { padding-bottom: 8mm; }
.foot { position: fixed; bottom: 0; left: 0; right: 0; font-family: Inter, 'DejaVu Sans', sans-serif; font-size: 7.5pt; color: #666; border-top: .5pt solid #ccc; padding-top: 2pt; }
@media screen { .foot { position: static; margin-top: 16pt; } }
.tbl td, .tbl th { font-size: 8.5pt; }
* { box-sizing: border-box; }
body { font-family: Charter, 'Bitstream Charter', 'DejaVu Serif', serif; font-size: 10.5pt; line-height: 1.42; color: #1a1a1a; margin: 0; }
.sans, .kicker, .stat, table, .chip, .tick, .meta, .src { font-family: Inter, 'DejaVu Sans', sans-serif; }
.kicker { font-size: 8pt; letter-spacing: .1em; text-transform: uppercase; color: #0f766e; font-weight: 700; margin: 0 0 4pt; }
h1 { font-size: 24pt; line-height: 1.1; margin: 0 0 6pt; }
h2 { font-size: 15pt; margin: 16pt 0 6pt; break-after: avoid; border-bottom: 1.5pt solid #1a1a1a; padding-bottom: 2pt; }
.meta { font-size: 8.5pt; color: #555; margin-bottom: 10pt; }
.headline { font-size: 12.5pt; border-left: 3pt solid #0f766e; background: #eef7f6; padding: 7pt 10pt; margin: 8pt 0 12pt; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6pt; margin: 6pt 0 4pt; }
.stat { border: 1pt solid #d6d6d6; border-radius: 4pt; padding: 6pt 8pt; break-inside: avoid; }
.stat b { display: block; font-size: 20pt; line-height: 1.05; color: #b4123c; font-family: Charter, 'DejaVu Serif', serif; }
.stat span { font-size: 8pt; color: #444; }
.card { border: 1pt solid #d6d6d6; border-radius: 4pt; padding: 7pt 9pt; margin: 0 0 6pt; break-inside: avoid; }
.card .id { font-family: Inter, sans-serif; font-size: 8pt; color: #666; }
.card .ask { font-weight: bold; }
.rec { font-family: Inter, 'DejaVu Sans', sans-serif; font-size: 8.5pt; color: #0f766e; margin-top: 4pt; }
.tick { font-size: 9pt; margin: 3pt 0 0 0; }
.tick div { margin: 2pt 0; }
.tick div::before { content: ''; display: inline-block; width: 9pt; height: 9pt; border: 1pt solid #333; margin-right: 6pt; vertical-align: -1pt; }
table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin: 2pt 0 4pt; }
th { text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .05em; color: #555; border-bottom: 1pt solid #999; padding: 3pt 4pt; }
td { vertical-align: top; border-bottom: .5pt solid #ddd; padding: 4pt; }
tr { break-inside: avoid; }
td q { font-family: Charter, 'DejaVu Serif', serif; font-style: italic; font-size: 9.5pt; }
.chip { display: inline-block; font-size: 7pt; text-transform: uppercase; letter-spacing: .05em; padding: 1pt 5pt; border-radius: 2pt; color: #fff; white-space: nowrap; }
.c-done, .c-new { background: #2f6b3a; } .c-in-progress, .c-running { background: #9a6a00; } .c-waiting, .c-old { background: #8c2a00; } .c-open { background: #1f3a5f; } .c-proposed { background: #666; }
.team { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6pt; }
.team .card { margin: 0; }
.team .who { font-weight: bold; }
.team .doing { font-size: 9pt; color: #333; }
.figs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; }
figure { margin: 0; break-inside: avoid; } figure.wide img { max-height: 105mm; border: none; } figure img { width: 100%; max-height: 62mm; object-fit: contain; border: .5pt solid #ccc; }
figcaption { font-family: Inter, sans-serif; font-size: 7.5pt; color: #555; margin-top: 2pt; }
ul { margin: 2pt 0 4pt 14pt; padding: 0; } li { margin: 1.5pt 0; }
.src { font-size: 7.5pt; color: #666; }
code { font-size: 8pt; }
@media screen { body { max-width: 190mm; margin: 12mm auto; padding: 0 12px; } }
"""


def e(s):
    return html.escape(str(s if s is not None else ""))


def slug(s):
    return re.sub(r"[^a-z]+", "-", str(s).lower()).strip("-")


def img(path):
    full = os.path.join(REPO, path)
    if not os.path.exists(full):
        return ""
    mime = mimetypes.guess_type(full)[0] or "image/png"
    return f"data:{mime};base64," + base64.b64encode(open(full, "rb").read()).decode()


def render(b):
    out = [f"<!doctype html><html lang='en-GB'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'>"
           f"<title>{e(b['title'])}</title><style>{CSS}</style></head><body>"]
    if b.get("number") or b.get("date"):                         # the editor's word (30 October 2026): every brief carries its number and date on every page
        out.append(f"<div class='foot'>Conductor brief {e(b.get('number', ''))} · {e(b.get('date', ''))} · {e(b['title'])}</div>")
    out.append(f"<p class='kicker'>{e(b.get('kicker', 'Web Summit 2026 · the conductor brief'))}</p><h1>{e(b['title'])}</h1>")
    out.append(f"<p class='meta'>{e(b.get('when', ''))} · {e(b.get('by', ''))}</p>")
    if b.get("headline"):
        out.append(f"<div class='headline'>{e(b['headline'])}</div>")
    if b.get("stats"):
        out.append("<div class='stats'>" + "".join(f"<div class='stat'><b>{e(s['n'])}</b><span>{e(s['label'])}</span></div>" for s in b["stats"]) + "</div>")
    if b.get("for_you"):
        out.append("<h2>For you to decide</h2>")
        for d in b["for_you"]:
            if d.get("group"):
                out.append(f"<h3 class='sans' style='margin:12pt 0 4pt;font-size:11pt'>{e(d['group'])}</h3>")
                continue
            opts = "".join(f"<div>{e(o)}</div>" for o in d.get("options", []))
            out.append(f"<div class='card'><span class='id'>{e(d.get('id', ''))}</span> <span class='ask'>{e(d['ask'])}</span>"
                       + (f"<div>{e(d['detail'])}</div>" if d.get("detail") else "") + (f"<div class='tick'>{opts}</div>" if opts else "")
                       + (f"<div class='rec'>Conductor's recommendation: {e(d['recommend'])}</div>" if d.get("recommend") else "") + "</div>")
    if b.get("you_asked"):
        out.append("<h2>What you asked, and what was done</h2><table><tr><th>When</th><th>You said</th><th>What was done</th><th></th></tr>")
        for a in b["you_asked"]:
            out.append(f"<tr><td>{e(a.get('at', ''))}</td><td><q>{e(a['said'])}</q></td><td>{e(a['done'])}"
                       + (f"<br><span class='src'>{e(a['where'])}</span>" if a.get("where") else "")
                       + f"</td><td><span class='chip c-{slug(a.get('status', 'done'))}'>{e(a.get('status', 'done'))}</span></td></tr>")
        out.append("</table>")
    if b.get("team"):
        out.append("<h2>The team</h2><div class='team'>")
        for t in b["team"]:
            out.append(f"<div class='card'><span class='who'>{e(t['id'])}</span> <span class='chip c-{slug(t.get('status', ''))}'>{e(t.get('status', ''))}</span>"
                       f"<div class='doing'>{e(t.get('doing', ''))}</div><div class='src'>{e(t.get('key', ''))}</div></div>")
        out.append("</div>")
    for i in b.get("wide", []):                                  # a full-width picture (a chart), before the sections
        src = img(i["path"])
        if src:
            out.append(f"<h2>{e(i.get('title', ''))}</h2><figure class='wide'><img src='{src}' alt='{e(i.get('caption', ''))}'>"
                       f"<figcaption>{e(i.get('caption', ''))}</figcaption></figure>")
    for sec in b.get("sections", []):
        out.append(f"<h2>{e(sec['title'])}</h2>")
        if sec.get("text"):
            out.append(f"<p>{e(sec['text'])}</p>")
        if sec.get("table"):
            t = sec["table"]
            out.append("<table class='tbl'><tr>" + "".join(f"<th>{e(h)}</th>" for h in t.get("head", [])) + "</tr>"
                       + "".join("<tr>" + "".join(f"<td>{e(c)}</td>" for c in row) + "</tr>" for row in t.get("rows", [])) + "</table>")
        if sec.get("items"):
            out.append("<ul>" + "".join(f"<li>{e(i)}</li>" for i in sec["items"]) + "</ul>")
    if b.get("images"):
        out.append("<h2>Pictures</h2><div class='figs'>")
        for i in b["images"]:
            src = img(i["path"])
            if src:
                out.append(f"<figure><img src='{src}' alt='{e(i.get('caption', ''))}'><figcaption>{e(i.get('caption', ''))}</figcaption></figure>")
        out.append("</div>")
    if b.get("next"):
        out.append("<h2>Next</h2><ul>" + "".join(f"<li>{e(n)}</li>" for n in b["next"]) + "</ul>")
    if b.get("sources"):
        out.append("<h2>Where this came from</h2><p class='src'>" + " · ".join(e(s) for s in b["sources"]) + "</p>")
    out.append("</body></html>")
    return "".join(out)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = os.path.abspath(sys.argv[1])
    b = json.load(open(src))
    page = render(b)
    if chr(0x2014) in page:
        sys.exit("editor_brief: an em-dash in the brief; the house style has none")
    base = src[:-5]
    open(base + ".html", "w").write(page)
    chrome = next((c for c in CHROMES if os.path.exists(c) or "/" not in c), None)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([chrome, "--headless", "--no-sandbox", "--disable-gpu", f"--user-data-dir={tmp}/p", "--no-pdf-header-footer",
                        f"--print-to-pdf={base}.pdf", "file://" + base + ".html"], capture_output=True, timeout=120)
    pages = re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", base + ".pdf"], capture_output=True, text=True).stdout)
    print(f"editor_brief: {base}.pdf ({pages.group(1) if pages else '?'} pages), {base}.html")


if __name__ == "__main__":
    main()
