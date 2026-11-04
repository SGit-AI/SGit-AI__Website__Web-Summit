#!/usr/bin/env python3
"""Round 3: the revamp, from the synthetic user tests (the handover, 4 November 2026). Record for everyone, and a Terminal
version for engineers (Indi's answer to the handover's question).

    FONTS=<dir> python3 team/designer/print/concepts-rm/make-round3.py

The brief, from the handover's "Must have" and "Avoid":
- what RiskMandate does, in words, on the front: the brand's own line (Indi's choice), word for word;
- RiskMandate's name in words on the front, beside the mark;
- a plain job title under the name: none is known yet except Vicky's, so a grey "Job title to confirm" (Indi's choice);
- "Web Summit Lisbon" and the stand beside "Thursday 12 November": the stand number is not known, so a grey placeholder;
- the QR as it is, 24 mm, black on white, the URL printed beside it;
- no personal slogans, no "Talk to my agent" (the page says "coming this week"), no "Meet me" / "Book a meeting" pair.
Uses make-round2.py's toolkit. Writes round3/<nn-slug>/. By designer@web-summit.indi. Apache-2.0.
"""
import importlib.util, os, sys
sys.dont_write_bytecode = True    # no __pycache__ in the repository
HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('r2', os.path.join(HERE, 'make-round2.py'))
r2 = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(r2)
mc = r2.mc
Side, PT, SAFE, QR_PANEL, n, fit, width = mc.Side, mc.PT, mc.SAFE, mc.QR_PANEL, mc.n, mc.fit, mc.width
wrap, lines, url_lines, MTOP, MBOT, G, BC, JB = r2.wrap, r2.lines, r2.url_lines, r2.MTOP, r2.MBOT, r2.G, r2.BC, r2.JB
CANVAS, INK, TEXT, FG, BG, MUTED, FAINT, BORDER = r2.CANVAS, r2.INK, r2.TEXT, r2.FG, r2.BG, r2.MUTED, r2.FAINT, r2.BORDER
GREEN, GREEN2, GOLD = r2.GREEN, r2.GREEN2, r2.GOLD

COPY = dict(r2.COPY)
COPY['hook'] = 'Open source, and sixteen are published free.'   # riskmandate.ai/brand, the "Profile" boilerplate
COPY['badge_tail'] = 'what one agent can reach, what you authorised it to do, and the gap between the two.'   # the "Badge" line, after "Agent Behaviour Policies:"
TITLE_TBC, STAND_TBC = 'Job title to confirm', 'Stand number to confirm'

def title_of(p):
    """A plain job title: the person's own (people/<id>/business-card.json), else a grey placeholder."""
    own = os.path.join(mc.ROOT, f'people/{p["pid"]}/business-card.json')
    import json
    t = json.load(open(own)).get('title') if os.path.exists(own) else None
    return (t, False) if t else (TITLE_TBC, True)

def brand_row(s, cut, ink):
    """The seal and RISK MANDATE in words, top left: the mark 8 mm with 4 mm clear."""
    s.logo(12, 12, 8, cut)
    s.wordmark(20, 12, 2.8, ink)

def event_block(s, p, x, ink, muted, accent):
    s.raw(f'<rect x="{x}" y="{n(MTOP)}" width="16" height="1.6" fill="{p["colour"]}"/>')
    s.text('WEB SUMMIT LISBON', JB, 500, 7 * PT, x, MTOP + 5.6, muted, 'event')
    s.text('Thursday 12 November', BC, 700, 12 * PT, x, MTOP + 11.2, ink, 'event')
    s.text(STAND_TBC, G, 500, 7 * PT, x, MTOP + 15, muted, 'tbc')
    lines(s, url_lines(p['pid']), G, 400, 7 * PT, x, MBOT - 3.4, 3.4, ink, 'url')

def name_block(s, p, fam, wt, ink, title_ink, muted):
    x = 8
    s.text(p['name'], fam, wt, fit(p['name'], fam, wt, 17 * PT, 76, 10 * PT), x, 15, ink, 'name')
    t, tbc = title_of(p)
    s.text(t, G, 500, 7.5 * PT, x, 20.4, muted if tbc else title_ink, 'tbc' if tbc else 'role')

# ---------- R3-1 Record: for everyone ----------
def record_front(p, pid):
    s = Side(BG); x = 8
    brand_row(s, 'containered', INK)
    s.text(COPY['abp'].upper(), JB, 500, 7 * PT, x, 22.4, MUTED, 'label')
    lines(s, COPY['risk'], G, 600, 11 * PT, x, 28, 4.8, INK, 'headline')
    y = 39.4
    for i, (k, v) in enumerate(COPY['register']):
        yy = y + i * 5.2
        s.raw(f'<line x1="{x}" y1="{n(yy - 3.6)}" x2="84" y2="{n(yy - 3.6)}" stroke="{BORDER}" stroke-width="0.25"/>')
        s.text(k, JB, 700, 7 * PT, x, yy, GOLD if k == 'GAP' else MUTED, 'register')
        s.text(v, G, 400, 7.5 * PT, x + 21, yy, TEXT, 'register')
    s.raw(f'<line x1="{x}" y1="{n(y + 2 * 5.2 + 1.8)}" x2="84" y2="{n(y + 2 * 5.2 + 1.8)}" stroke="{BORDER}" stroke-width="0.25"/>')
    return s
def record_back(p, pid):
    s = Side(BG)
    name_block(s, p, BC, 700, INK, GREEN, MUTED)
    s.qr(pid, SAFE[2] - QR_PANEL, SAFE[3] - QR_PANEL)
    event_block(s, p, 8, INK, MUTED, GREEN)
    return s

# ---------- R3-2 Terminal: for engineers ----------
def term_front(p, pid):
    s = Side(CANVAS); x = 8
    brand_row(s, 'knockout', FG)
    s.text(COPY['abp'].upper(), JB, 500, 7 * PT, x, 22.4, FAINT, 'label')
    size = min(11 * PT, 76 / width(COPY['tech2'], JB, 700, 1))
    s.text(COPY['tech2'], JB, 700, size, x, 29, GREEN2, 'headline')
    y = lines(s, wrap(COPY['badge_tail'], JB, 400, 7 * PT, 76), JB, 400, 7 * PT, x, 35.6, 3.5, FG, 'register')
    s.text(COPY['hook'], JB, 500, 7 * PT, x, max(y + 6, 50.6), GREEN2, 'hook')
    return s
def term_back(p, pid):
    s = Side(CANVAS)
    name_block(s, p, JB, 700, FG, GREEN2, FAINT)
    s.qr(pid, SAFE[2] - QR_PANEL, SAFE[3] - QR_PANEL)   # black on its own white panel
    event_block(s, p, 8, FG, FAINT, GREEN2)
    return s

ROUND3 = {
    '1-record': {'name': 'R3-1 Record', 'audience': 'everyone', 'build': lambda p, pid: (record_front(p, pid), record_back(p, pid)),
        'rationale': 'The test winner, fixed: RiskMandate and what it does on the front, a plain title, Web Summit Lisbon and the stand beside the QR.',
        'palette': [('Warm background', BG), ('Ink', INK), ('Text', TEXT), ('Muted (labels, to-confirm)', MUTED), ('Border', BORDER), ('Green', GREEN), ('Gold (the gap)', GOLD)],
        'type': 'Geist + JetBrains Mono (labels); Barlow Condensed for the name, the day and the wordmark',
        'notes': ['The front is all product: the seal and RISK MANDATE, the category, the question, and the brand\'s own line as the three rows.',
                  'Grey "Job title to confirm" and "Stand number to confirm" are placeholders that cannot be mistaken for copy; nothing prints until they are filled.',
                  'The three asks are gone: the URL sits beside the QR, which the tests said a careful reader checks first.']},
    '2-terminal': {'name': 'R3-2 Terminal', 'audience': 'engineers', 'build': lambda p, pid: (term_front(p, pid), term_back(p, pid)),
        'rationale': 'For engineering conversations: the line engineers liked, the same product line as Record, and a number that is true.',
        'palette': [('Canvas', CANVAS), ('Warm white', FG), ('Faint (labels, to-confirm)', FAINT), ('Lighter green', GREEN2)],
        'type': 'JetBrains Mono throughout + Barlow Condensed for the day and the wordmark; Geist for the title and URL',
        'notes': ['"Building is not authorising." leads, as the engineer persona asked; "Same agent. Different reach." is dropped for room.',
                  'The number hook is the brand\'s own: "Open source, and sixteen are published free."',
                  'Same back as Record, on the dark canvas, so the two read as one family.']},
}
for v in ROUND3.values(): v['kind'] = 'round 3,'

def build():
    for pid, p in mc.PEOPLE.items(): p['pid'] = pid
    mc.build(ROUND3, os.path.join(HERE, 'round3'), mc.ONLY)

if __name__ == '__main__':
    build()
