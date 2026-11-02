#!/usr/bin/env python3
"""The team's hours as a picture: commits reaching dev, by member and by hour, from the git log alone.

Made by the book team's conductor (conductor at book.the-ultimate-insider) for the editor's day-in-review briefs (31 October 2026); copied on
2 November 2026 by conductor@web-summit.dinis (Apache-2.0). Changed here: members are read from the commit subjects
("<agent>@web-summit.<person>: ..."), and CI's release commits ("site v...", by GitHub Actions) are the release row.

    python3 -I team/conductor/tools/day_heatmap.py <since ISO> <until ISO> <out.svg>

One hue, light to dark (a count, not a category); an empty hour is the surface grey. Each cell carries its count,
so nothing rests on colour alone. Release commits ("site v...") are counted on their own row; merges are left out.
Standard library only.
"""
import collections, re, subprocess, sys
from datetime import datetime, timedelta

MEMBERS = []   # filled from the log: every "<agent>@web-summit.<person>" that committed in the window
RAMP = ["#e6f2f0", "#b9ddd7", "#86c4bb", "#4fa89c", "#1f877b", "#0f6158"]   # one teal hue, light to dark
INK, MUTED, GRID = "#1a1a1a", "#666666", "#ffffff"


def counts(since, until):
    log = subprocess.run(["git", "log", "origin/dev", f"--since={since}", f"--until={until}", "--format=%cI|%s"],
                         capture_output=True, text=True, check=True).stdout.splitlines()
    by, rel = collections.Counter(), collections.Counter()
    for line in log:
        t, s = line.split("|", 1)
        h = t[:13]
        if s.startswith("site v"):
            rel[h] += 1
            continue
        m = re.match(r"([a-z0-9-]+@web-summit\.[a-z0-9-]+):", s)
        if m:
            if m.group(1) not in MEMBERS:
                MEMBERS.append(m.group(1))
            by[(h, m.group(1))] += 1
    return by, rel


def colour(n, top):
    if n == 0:
        return "#f1f1f1"
    return RAMP[min(len(RAMP) - 1, 1 + int((n - 1) * (len(RAMP) - 2) / max(1, top - 1)))]


def main():
    since, until, out = sys.argv[1:4]
    by, rel = counts(since, until)
    t0 = datetime.fromisoformat(since.replace("Z", "+00:00"))
    t1 = datetime.fromisoformat(until.replace("Z", "+00:00"))
    hours = []
    t = t0
    while t < t1:
        hours.append(t.strftime("%Y-%m-%dT%H"))
        t += timedelta(hours=1)
    top = max([*by.values(), 1])
    cw, ch, lw, th = 30, 20, 86, 26
    rows = MEMBERS + ["releases"]
    W, H = lw + cw * len(hours) + 4, th + ch * len(rows) + 12
    o = [f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H}' font-family='Inter, DejaVu Sans, sans-serif' "
         f"role='img' aria-label='Commits reaching dev by member and hour, {since} to {until}'>"]
    o.append(f"<rect width='{W}' height='{H}' fill='#ffffff'/>")
    for i, h in enumerate(hours):
        x = lw + i * cw + cw / 2
        o.append(f"<text x='{x}' y='{th - 8}' font-size='9' fill='{MUTED}' text-anchor='middle'>{h[11:13]}</text>")
    for r, name in enumerate(rows):
        y = th + r * ch
        if name == "releases":
            y += 6
        o.append(f"<text x='{lw - 6}' y='{y + ch / 2 + 3.5}' font-size='10' fill='{INK}' text-anchor='end'"
                 f"{' font-style=\"italic\"' if name == 'releases' else ''}>{name}</text>")
        for i, h in enumerate(hours):
            n = rel[h] if name == "releases" else by[(h, name)]
            fill = "#ece6da" if name == "releases" and n else colour(n, top)
            x = lw + i * cw
            o.append(f"<rect x='{x + 1}' y='{y + 1}' width='{cw - 2}' height='{ch - 2}' rx='2' fill='{fill}' stroke='{GRID}'/>")
            if n:
                dark = name != "releases" and fill in RAMP[3:]
                o.append(f"<text x='{x + cw / 2}' y='{y + ch / 2 + 3.5}' font-size='9' text-anchor='middle' "
                         f"fill='{'#ffffff' if dark else INK}'>{n}</text>")
    total = sum(by.values())
    o.append("</svg>")
    open(out, "w").write("".join(o))
    print(f"day_heatmap: {out}: {total} commits, {sum(rel.values())} releases, {len(hours)} hours")


if __name__ == "__main__":
    main()
