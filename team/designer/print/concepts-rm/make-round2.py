#!/usr/bin/env python3
"""Round 2: six different RiskMandate business cards for Web Summit Lisbon, three of them written for one audience.

    FONTS=<dir> python3 team/designer/print/concepts-rm/make-round2.py      (from the repository root; as make-concepts.py)

Asked by Dinis on 4 November 2026 (11:02, relayed by Indi): "6 complete different variations of the cards, including
audience specific ones (C-Level Execs, Risk & Policy focused, and tech & engineering focused) ... web summit specific and
point them to our booth on the 12th". That lifts, for these cards, his rule of 2 November (no Web Summit name): the name is
set in plain text only, never Web Summit's logo. The stand location is not known yet, so the cards give the day only.

Every line of copy is sourced (COPY below). Uses make-concepts.py's toolkit: outlined type, the supplied RiskMandate
mark, each person's own QR unaltered. Writes round2/<nn-slug>/. By designer@web-summit.indi. Apache-2.0.
"""
import importlib.util, os, sys
sys.dont_write_bytecode = True    # no __pycache__ in the repository (the gate refuses gitignored files)
HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('mc', os.path.join(HERE, 'make-concepts.py'))
mc = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(mc)
from types import SimpleNamespace
Side, PT, SAFE, QR_PANEL, n, fit, width, cap = mc.Side, mc.PT, mc.SAFE, mc.QR_PANEL, mc.n, mc.fit, mc.width, mc.cap
mc.FONTS[('JetBrains Mono', 700)] = f'{mc.SYS}/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf'

# ---- colours: the brand's tokens (riskmandate.ai/brand) ----
CONTAINER, CANVAS, INK, TEXT = '#161615', '#0A0A09', '#0D0D0C', '#1A1917'
FG, BG, WHITE, MUTED, FAINT, BORDER = '#F7F6F2', '#F7F6F2', '#FFFFFF', '#4A4845', '#8A8780', '#E2DFD8'
GREEN, GREEN2, BLUE, GOLD, RED = '#1A7F5A', '#22C55E', '#1D4ED8', '#B45309', '#C0392B'

# ---- copy, each with its source ----
COPY = {
    'event':  'Web Summit Lisbon, 9 to 12 November 2026',                 # content/meet.md
    'stand':  'Find us at our stand on Thursday 12 November',              # content/meet-<id>.md
    'clevel': ['Your customer will ask.', 'Have an answer.'],              # content/design.md, "More lines to choose from"
    'risk':   ['Would your agent', 'pass an audit?'],                      # content/design.md
    'tech':   ['Same agent.', 'Different reach.'],                         # content/design.md
    'tech2':  'Building is not authorising.',                              # content/design.md
    'abp':    'Agent Behaviour Policies',                                  # riskmandate.ai/brand, boilerplate
    # riskmandate.ai/brand, the "Badge" boilerplate: "what one agent can reach, what you authorised it to do, and the gap between the two"
    'register': [('REACH', 'what one agent can reach'), ('AUTHORISED', 'what you authorised it to do'), ('GAP', 'the gap between the two')],
}
ASKS = mc.ASKS

def wrap(txt, fam, wt, size, room):
    """Greedy word wrap: the lines of txt that each fit room mm at this size."""
    out, cur = [], ''
    for w in txt.split(' '):
        t = (cur + ' ' + w).strip()
        if cur and width(t, fam, wt, size) > room: out.append(cur); cur = w
        else: cur = t
    out.append(cur); assert all(width(l, fam, wt, size) <= room + 1e-6 for l in out), (txt, room); return out
def lines(s, ls, fam, wt, size, x, y0, pitch, fill, role, anchor='start', on=None):
    for i, l in enumerate(ls): s.text(l, fam, wt, size, x, y0 + i * pitch, fill, role, anchor, on)
    return y0 + (len(ls) - 1) * pitch
def url_lines(pid): return ['web-summit.sgit.ai', f'/meet/{pid}/']
MTOP, MBOT = SAFE[3] - QR_PANEL + 4 * 24 / 29, SAFE[3] - 4 * 24 / 29        # module edges of a QR set at the bottom
G, BC, JB = 'Geist', 'Barlow Condensed', 'JetBrains Mono'

# ---------- 1. Seal (general): B, with the stand day on the front ----------
def seal_front(p, pid):
    s = Side(CONTAINER)
    s.logo(45.5, 19, 20, 'knockout')                       # 20 mm as drawn; 10 mm clear, so nothing from y 39 up
    s.wordmark(45.5, 40.9, 3.4, FG, 'middle')
    s.text(p['line'], G, 500, 7.5 * PT, 45.5, 47.2, FG, 'line', 'middle')
    s.text(COPY['stand'], G, 500, 7 * PT, 45.5, 51.4, GREEN2, 'event', 'middle')
    mc.spectrum(s, 54, 7, mc.STRIP_DARK, p['colour'])
    return s

# ---------- 2. Pass (general, Web Summit): the card as a ticket with a stub ----------
def pass_front(p, pid):
    s = Side(WHITE)
    s.raw(f'<line x1="63" y1="0" x2="63" y2="61" stroke="{FAINT}" stroke-width="0.25" stroke-dasharray="1 1"/>')   # the perforation
    x, room = 8, 51
    s.text('WEB SUMMIT LISBON', JB, 500, 7 * PT, x, 11.5, MUTED, 'event')
    s.text('9 TO 12 NOVEMBER 2026', JB, 500, 7 * PT, x, 15, MUTED, 'event')
    s.text(p['name'], BC, 800, fit(p['name'], BC, 800, 22 * PT, room, 10 * PT), x, 27.5, INK, 'name')
    lines(s, wrap(p['role'], G, 500, 7 * PT, room), G, 500, 7 * PT, x, 32.5, 3.2, GREEN, 'role')
    s.text('FIND US AT OUR STAND ON', JB, 500, 7 * PT, x, 45, MUTED, 'event')
    s.text('Thursday 12 November', BC, 700, 13 * PT, x, 52, INK, 'event')
    s.logo(73.5, 17, 10, 'containered')                    # the stub: the seal, 5 mm clear
    s.raw(f'<rect x="63.6" y="32" width="27.4" height="29" fill="{p["colour"]}"/>')   # and the person's colour
    return s
def pass_back(p, pid):
    s = Side(WHITE)
    s.qr(pid, SAFE[0], (61 - QR_PANEL) / 2)
    x = SAFE[0] + QR_PANEL + 5
    s.wordmark(x, 13.5, 3.0, INK)
    s.raw(f'<rect x="{n(x)}" y="18.6" width="16" height="1.6" fill="{p["colour"]}"/>')
    lines(s, ASKS, G, 600, 7.5 * PT, x, 26, 4.2, INK, 'asks')
    lines(s, url_lines(pid), G, 400, 7 * PT, x, 40.5, 3.4, INK, 'url')
    s.text('WEB SUMMIT LISBON', JB, 500, 7 * PT, x, 49, MUTED, 'event')
    s.text('9 TO 12 NOVEMBER 2026', JB, 500, 7 * PT, x, 52.5, MUTED, 'event')
    return s

# ---------- 3. Record (Risk & Policy): the card as a policy record ----------
def record_front(p, pid):
    s = Side(BG)
    x = 8
    s.text(COPY['abp'].upper(), JB, 500, 7 * PT, x, 11.5, MUTED, 'label')
    lines(s, COPY['risk'], G, 600, 15 * PT, x, 20, 6.2, INK, 'headline')
    s.logo(77.5, 14.5, 10, 'containered')                  # the seal as the record's stamp, top right
    y = 33.5
    for i, (k, v) in enumerate(COPY['register']):
        yy = y + i * 6.4
        s.raw(f'<line x1="{x}" y1="{n(yy - 4.3)}" x2="84" y2="{n(yy - 4.3)}" stroke="{BORDER}" stroke-width="0.25"/>')
        s.text(k, JB, 700, 7 * PT, x, yy, GOLD if k == 'GAP' else MUTED, 'register')
        s.text(v, G, 400, 7.5 * PT, x + 21, yy, TEXT, 'register')
    s.raw(f'<line x1="{x}" y1="{n(y + 2 * 6.4 + 2.1)}" x2="84" y2="{n(y + 2 * 6.4 + 2.1)}" stroke="{BORDER}" stroke-width="0.25"/>')
    return s
def record_back(p, pid):
    s = Side(BG)
    x, room = 8, 76
    s.wordmark(SAFE[2], 9.4, 2.6, INK, 'end')              # the wordmark, small, top right
    s.text(p['name'], BC, 700, fit(p['name'], BC, 700, 17 * PT, 50, 10 * PT), x, 15, INK, 'name')
    lines(s, wrap(p['role'], G, 500, 7 * PT, room), G, 500, 7 * PT, x, 20, 3.2, GREEN, 'role')
    s.qr(pid, SAFE[2] - QR_PANEL, SAFE[3] - QR_PANEL)
    s.raw(f'<rect x="{x}" y="{n(MTOP)}" width="16" height="1.6" fill="{p["colour"]}"/>')
    s.text('FIND US AT OUR STAND ON', JB, 500, 7 * PT, x, MTOP + 7.4, MUTED, 'event')
    s.text('Thursday 12 November', BC, 700, 12 * PT, x, MTOP + 13.2, INK, 'event')
    lines(s, url_lines(pid), G, 400, 7 * PT, x, MBOT - 3.4, 3.4, TEXT, 'url')
    return s

# ---------- 4. Boardroom (C-Level): one question, a lot of quiet ----------
def board_front(p, pid):
    s = Side(INK)
    x = 8
    size = min(15 * PT, 76 / max(width(l, G, 600, 1) for l in COPY['clevel']))
    lines(s, COPY['clevel'], G, 600, size, x, 19, size * 1.3, FG, 'headline')
    s.raw(f'<rect x="{x}" y="29" width="12" height="1" fill="{GREEN}"/>')
    s.logo(13, 40.5, 10, 'knockout')                       # 5 mm clear: y 30.5 to 50.5
    s.wordmark(23, 40.5, 3.2, FG)
    s.text('WEB SUMMIT LISBON \u00b7 9 TO 12 NOVEMBER 2026', JB, 500, 7 * PT, x, 53, FAINT, 'event')
    return s
def board_back(p, pid):
    s = Side(WHITE)
    x, room = 8, 76
    s.text(p['name'], BC, 800, fit(p['name'], BC, 800, 20 * PT, room, 10 * PT), x, 16, INK, 'name')
    lines(s, wrap(p['role'], G, 500, 7.5 * PT, room), G, 500, 7.5 * PT, x, 21.3, 3.4, GREEN, 'role')
    s.qr(pid, SAFE[2] - QR_PANEL, SAFE[3] - QR_PANEL)
    s.raw(f'<rect x="{x}" y="{n(MTOP)}" width="16" height="1.6" fill="{p["colour"]}"/>')
    lines(s, ['Find us at our stand on', 'Thursday 12 November'], G, 600, 8 * PT, x, MTOP + 7.6, 3.8, INK, 'event')
    lines(s, url_lines(pid), G, 400, 7 * PT, x, MBOT - 3.4, 3.4, TEXT, 'url')
    return s

# ---------- 5. Terminal (Tech & Engineering): machine-output type on the canvas ----------
def term_front(p, pid):
    s = Side(CANVAS)
    x = 8
    s.text(COPY['abp'].upper(), JB, 500, 7 * PT, x, 11.5, FAINT, 'label')
    size = min(14 * PT, 76 / max(width(l, JB, 700, 1) for l in COPY['tech']))
    lines(s, COPY['tech'], JB, 700, size, x, 20, size * 1.3, GREEN2, 'headline')
    s.text(COPY['tech2'], JB, 500, 7.5 * PT, x, 31.2, FG, 'headline')
    s.logo(13, 41.5, 9, 'knockout')                        # 4.5 mm clear: y 32.5 to 50.5
    s.wordmark(22, 41.5, 3.0, FG)
    s.text('WEB SUMMIT LISBON \u00b7 9 TO 12 NOVEMBER 2026', JB, 500, 7 * PT, x, 53.6, FAINT, 'event')
    return s
def term_back(p, pid):
    s = Side(CANVAS)
    x, room = 8, 76
    s.text(p['name'], JB, 700, fit(p['name'], JB, 700, 13 * PT, room, 10 * PT), x, 13.5, FG, 'name')
    y = lines(s, wrap(p['role'], JB, 400, 7 * PT, room), JB, 400, 7 * PT, x, 17.8, 3.2, GREEN2, 'role')
    assert y <= 21.2, (pid, y)
    s.qr(pid, SAFE[2] - QR_PANEL, SAFE[3] - QR_PANEL)      # black on its own white panel
    lines(s, ['› ' + a for a in ASKS], JB, 500, 7.5 * PT, x, 30.1, 3.8, FG, 'asks')
    lines(s, ['Find us at our stand on', 'Thursday 12 November'], JB, 400, 7 * PT, x, 42.1, 3.4, FAINT, 'event')
    lines(s, url_lines(pid), JB, 400, 7 * PT, x, 49.9, 3.4, FG, 'url')
    return s

# ---------- 6. Signature (general): the name, as big as the card allows ----------
def sig_front(p, pid):
    s = Side(WHITE)
    x, room = 8, 76
    s.text(p['name'], BC, 800, fit(p['name'], BC, 800, 34 * PT, room, 10 * PT), x, 21, INK, 'name')
    s.raw(f'<rect x="0" y="25" width="91" height="2.2" fill="{p["colour"]}"/>')     # the person's colour, edge to edge
    y = lines(s, wrap(p['role'], G, 500, 7.5 * PT, room), G, 500, 7.5 * PT, x, 33, 3.4, GREEN, 'role')
    lines(s, wrap(p['line'], G, 500, 9 * PT, room), G, 500, 9 * PT, x, y + 6.2, 4.2, INK, 'line')
    s.text(COPY['stand'].upper(), JB, 500, 7 * PT, x, 52, MUTED, 'event')
    return s
def sig_back(p, pid):
    s = Side(CONTAINER)
    s.logo(20, 21, 16, 'knockout')                         # 8 mm clear
    s.wordmark(20, 39.5, 3.0, FG, 'middle')
    lines(s, url_lines(pid), G, 400, 7 * PT, 8, 48.6, 3.4, FG, 'url')
    s.qr(pid, SAFE[2] - QR_PANEL, (61 - QR_PANEL) / 2)     # black on its own white panel
    return s

ROUND2 = {
    '1-seal': {'name': '1. Seal', 'audience': 'general', 'build': lambda p, pid: (seal_front(p, pid), mc.b_back(p, pid)),
        'rationale': 'The chosen B, now pointing to the stand: the seal leads on the container black, the brand strip ends in your colour.',
        'palette': [('Container', CONTAINER), ('Warm white', FG), ('Ink', INK), ('White', WHITE), ('Green', GREEN), ('Lighter green', GREEN2), ('Blue', BLUE), ('Gold', GOLD), ('Red', RED)],
        'type': 'Barlow Condensed (name, wordmark) + Geist',
        'notes': ['The stand day sits in the lighter green under the line, the only place it is used as text (8:1 on the container).',
                  'The seal is 20 mm (B had 22 mm) to make room for the stand line within its 10 mm clear space.',
                  'The back is B\'s back unchanged: name, role, QR, asks, URL, the strip.']},
    '2-pass': {'name': '2. Pass', 'audience': 'general, Web Summit', 'build': lambda p, pid: (pass_front(p, pid), pass_back(p, pid)),
        'rationale': 'The card as a ticket to our stand: Web Summit and the day on the main part, the seal and your colour on the stub.',
        'palette': [('White', WHITE), ('Ink', INK), ('Muted', MUTED), ('Faint (perforation)', FAINT), ('Green', GREEN)],
        'type': 'Barlow Condensed (name, day) + Geist (role, asks, URL) + JetBrains Mono for the ticket labels: three faces, one over the brief, as the brand pairs a sans with a mono',
        'notes': ['The perforation is a printed dashed line, not a die cut: no extra cost, no finish.',
                  'The stub\'s colour block bleeds off the top-right edge only; the seal sits on white above it, 5 mm clear.',
                  'The QR is on the back with the asks, so the ticket face can stay about the place and the day.']},
    '3-record': {'name': '3. Record', 'audience': 'Risk & Policy', 'build': lambda p, pid: (record_front(p, pid), record_back(p, pid)),
        'rationale': 'For risk and policy people: the card reads like the record RiskMandate makes, the reach, the mandate and the gap, with the seal as its stamp.',
        'palette': [('Warm background', BG), ('Ink', INK), ('Text', TEXT), ('Muted', MUTED), ('Border', BORDER), ('Green', GREEN), ('Gold (the gap)', GOLD)],
        'type': 'Geist (headline, register) + JetBrains Mono (labels); Barlow Condensed for the name and day',
        'notes': ['The three rows are the brand\'s own badge line, word for word: what one agent can reach, what you authorised it to do, and the gap between the two.',
                  'GAP is the one word in gold, the brand\'s caution colour, used once.',
                  'The warm background is the brand\'s page colour; the QR keeps its own white panel on it.']},
    '4-boardroom': {'name': '4. Boardroom', 'audience': 'C-Level', 'build': lambda p, pid: (board_front(p, pid), board_back(p, pid)),
        'rationale': 'For executives: one question about what their customers will ask, a lot of quiet, and a meeting at our stand.',
        'palette': [('Ink', INK), ('Warm white', FG), ('Faint', FAINT), ('White', WHITE), ('Green', GREEN)],
        'type': 'Geist (headline, details) + Barlow Condensed (name, wordmark); JetBrains Mono for the event line',
        'notes': ['No strip and no asks list on this one: fewer things, said more slowly, as a board member reads.',
                  'The seal is small (12 mm) beside the wordmark, as the brand advises for a serious register: "keep it small, keep it quiet".',
                  'The back gives the day to meet in place of the three asks; the QR still leads to the person\'s page.']},
    '5-terminal': {'name': '5. Terminal', 'audience': 'Tech & Engineering', 'build': lambda p, pid: (term_front(p, pid), term_back(p, pid)),
        'rationale': 'For engineers: set in the brand\'s machine-output face on the darkest canvas, about reach, not models.',
        'palette': [('Canvas', CANVAS), ('Warm white', FG), ('Faint', FAINT), ('Lighter green', GREEN2), ('Green', GREEN)],
        'type': 'JetBrains Mono throughout + Barlow Condensed for the wordmark',
        'notes': ['The headline is in the lighter green, which the brand keeps for dark surfaces.',
                  'The back is dark too, with the QR on its own white panel and quiet zone, as the print rule asks.',
                  'The asks carry a › prompt, a little playful; the stand day and the URL follow in the same face.']},
    '6-signature': {'name': '6. Signature', 'audience': 'general', 'build': lambda p, pid: (sig_front(p, pid), sig_back(p, pid)),
        'rationale': 'Name first, as big as the card allows, over a line in your colour; the seal and the QR together on the dark back.',
        'palette': [('White', WHITE), ('Ink', INK), ('Muted', MUTED), ('Green', GREEN), ('Container', CONTAINER), ('Warm white', FG)],
        'type': 'Barlow Condensed (name, wordmark) + Geist; JetBrains Mono for the stand line',
        'notes': ['The colour line runs edge to edge, so the seven together read as a set across a table.',
                  'The person\'s own line stays on the front, under the role.',
                  'The back pairs the knockout seal with the QR, on the container black.']},
}
for v in ROUND2.values(): v['kind'] = 'round 2,'

if __name__ == '__main__':
    mc.build(ROUND2, os.path.join(HERE, 'round2'), mc.ONLY)
