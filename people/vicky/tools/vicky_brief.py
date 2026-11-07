#!/usr/bin/env python3
"""Vicky's daily brief: the team's editor_brief look, with her action section at the top of page 1.

Written by conductor@web-summit.vicky at Vicky's word (7 November 2026): the brief is compact, and page 1 opens with
1. Urgent / Risks, 2. Actions & Replies for Vicky grouped by window (each with why it matters and a copy-paste reply),
3. Agent runs, 4. Usage & Checks. It reuses team/conductor/tools/editor_brief.py (its CSS, rendering and PDF step,
unchanged) and adds two fields to the JSON:

    "urgent":  ["one line", ...]                      (or ["None"])
    "actions": [{"window": "reviewer window", "items": [{"what": "...", "why": "...", "reply": "..."}]}]

Everything else is the editor_brief JSON (sections with "table" or "items"; "for_you" and "you_asked" are not used).

    python3 -I people/vicky/tools/vicky_brief.py people/vicky/briefs/<stamp>.json

writes <stamp>.html and <stamp>.pdf beside the JSON. Standard library only.
"""
import html, importlib.util, json, os, re, subprocess, sys, tempfile

sys.dont_write_bytecode = True   # no __pycache__ beside the shared tool (the gate refuses one)

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
spec = importlib.util.spec_from_file_location("editor_brief", os.path.join(REPO, "team/conductor/tools/editor_brief.py"))
eb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(eb)

EXTRA = """
body { font-size: 9.5pt; line-height: 1.35; }
h1 { font-size: 15pt; margin: 0 0 2pt; } h2 { font-size: 11.5pt; margin: 10pt 0 4pt; }
.tbl td, .tbl th { font-size: 8pt; padding: 2pt 4pt; }
.act { border: 1pt solid #0f766e; border-radius: 3pt; padding: 6pt 8pt; margin: 6pt 0 8pt; }
.act h2 { margin: 6pt 0 3pt; font-family: Inter, 'DejaVu Sans', sans-serif; font-size: 10.5pt; color: #0f766e; }
.act h3 { margin: 6pt 0 2pt; font-family: Inter, 'DejaVu Sans', sans-serif; font-size: 9pt; text-transform: uppercase; letter-spacing: .06em; color: #333; }
.act .item { margin: 2pt 0 6pt; break-inside: avoid; }
.act .what { font-weight: 700; } .act .why { color: #333; }
.act pre { font-family: 'DejaVu Sans Mono', Menlo, monospace; font-size: 8pt; background: #f1f5f4; border: .5pt solid #b7cfca;
  border-radius: 2pt; padding: 4pt 6pt; margin: 2pt 0 0; white-space: pre-wrap; word-break: break-word; }
.act .urgent li { color: #9a1c1c; }
"""


def e(s):
    return html.escape(str(s if s is not None else ""))


def action_html(b):
    out = ["<div class='act'><h2>1. Urgent / Risks</h2><ul class='urgent'>"]
    out += [f"<li>{e(u)}</li>" for u in (b.get("urgent") or ["None"])]
    out.append("</ul><h2>2. Actions &amp; Replies for Vicky, by window</h2>")
    if not b.get("actions"):
        out.append("<p>Nothing waits on you.</p>")
    for g in b.get("actions", []):
        out.append(f"<h3>{e(g['window'])}</h3>")
        for i in g.get("items", []):
            out.append(f"<div class='item'><span class='what'>{e(i['what'])}</span><div class='why'><b>Why:</b> {e(i['why'])}</div>"
                       + (f"<pre>{e(i['reply'])}</pre>" if i.get("reply") else "") + "</div>")
    out.append("</div>")
    return "".join(out)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = os.path.abspath(sys.argv[1])
    b = json.load(open(src))
    rest = {k: v for k, v in b.items() if k not in ("for_you", "you_asked", "urgent", "actions", "stats", "headline")}
    page = eb.render(rest).replace("</style>", EXTRA + "</style>", 1)
    m = re.search(r"<p class='meta'>.*?</p>", page)
    page = page[:m.end()] + action_html(b) + page[m.end():]
    if chr(0x2014) in page:
        sys.exit("vicky_brief: an em-dash in the brief; the house style has none")
    base = src[:-5]
    open(base + ".html", "w").write(page)
    chrome = next((c for c in eb.CHROMES if os.path.exists(c) or "/" not in c), None)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([chrome, "--headless", "--no-sandbox", "--disable-gpu", f"--user-data-dir={tmp}/p", "--no-pdf-header-footer",
                        f"--print-to-pdf={base}.pdf", "file://" + base + ".html"], capture_output=True, timeout=120)
    pages = re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", base + ".pdf"], capture_output=True, text=True).stdout)
    print(f"vicky_brief: {base}.pdf ({pages.group(1) if pages else '?'} pages), {base}.html")


if __name__ == "__main__":
    main()
