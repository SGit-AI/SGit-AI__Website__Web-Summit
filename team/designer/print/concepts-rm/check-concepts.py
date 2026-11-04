#!/usr/bin/env python3
"""The checks for the card concepts. Reads the files, not the generator's word for them.

    node team/designer/print/concepts-rm/render-concepts.mjs <scratch>       (renders at 600 dpi and measures)
    python -I team/designer/print/concepts-rm/check-concepts.py <scratch>    (needs zxing-cpp and pillow, in a scratch venv)

Per print file: 91 x 61 mm with viewBox 0 0 91 61; no live text; every element marked class="safe" (text, seal, QR)
inside the safe zone, 4 mm inside the trim, as measured by the browser; one rm-logo, with half its width clear of every
other element and of the person's colour; the QR is the person's own file byte for byte, its symbol at least 24 mm, and the
600 dpi render decodes to the person's URL. Per live copy: the name, role, line and URL as in the brief; text at 7 pt or
more, the name at 10 pt or more; WCAG AA contrast (4.5:1, or 3:1 for large text); no contact detail, no other brand.
Previews: 1004 x 650 px (85 x 55 mm at 300 dpi). Exits non-zero on any failure. By designer@web-summit.indi. Apache-2.0.
"""
import json, os, re, sys
import zxingcpp
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
SCR = sys.argv[1]
SUB = sys.argv[2] if len(sys.argv) > 2 else ''          # round2: the six Web Summit designs
BASE = os.path.join(HERE, SUB)
CONCEPTS = sorted(d for d in os.listdir(BASE) if os.path.exists(os.path.join(BASE, d, 'spec.json')))
ROUND2 = SUB in ('round2', 'round3')   # both name Web Summit and carry sourced headlines
ROUND3 = SUB == 'round3'
ROUND4 = SUB == 'round4'   # three unnamed audience cards (Indi, 4 November): no names, the team QR, a colour per audience
if ROUND4: ROUND2 = True   # Web Summit by name, sourced lines, placeholders: as rounds 2 and 3
TEAM_URL = 'https://web-summit.sgit.ai/meet/'
FINAL = {p['id']: p for p in json.load(open(os.path.join(ROOT, 'team/designer/print/final.json')))['people']}
PAIRS = [(re.sub(r'[^a-z0-9]+', ' ', ' '.join(FINAL[i]['front']).replace('\u2019', "'").lower()).strip(), FINAL[i]['tagline']) for i in ('dinis', 'silvio', 'indi')]   # the three chosen shirt pairs
NAMES = [m['name'] for m in json.load(open(os.path.join(ROOT, 'data/team.json')))['members'] if m.get('kind') == 'human'] + ['Vicky Wang']
def norm_txt(t): return re.sub(r'[^a-z0-9]+', ' ', t.replace('\u2019', "'").lower()).strip()
# round 2's copy, each checked against its source file (Dinis, 4 November: Web Summit by name, for these cards)
DESIGN_MD = open(os.path.join(ROOT, 'content/design.md')).read()
MEET_MD = open(os.path.join(ROOT, 'content/meet.md')).read() + open(os.path.join(ROOT, 'content/meet-indi.md')).read()
SOURCED = {
    'headline': ['Your customer will ask. Have an answer.', 'Would your agent pass an audit?', 'Same agent. Different reach.', 'Building is not authorising.'],
    'event': ['Web Summit Lisbon, 9 to 12 November 2026', 'find us at our stand on Thursday 12 November',
              # Indi, 4 November, evening: "'WebSummit Edition' ... and Meet us between Booths A1-30 on Thursday (12th)"
              'Web Summit Edition', 'Meet us between Booths A1-30 on Thursday (12th)'],
}
for h in SOURCED['headline']: assert h in DESIGN_MD, h
assert 'Web Summit Lisbon, 9 to 12 November 2026' in MEET_MD and 'find us at our stand on **Thursday 12 November**' in MEET_MD
BRAND_HOOK = 'Open source, and sixteen are published free.'   # riskmandate.ai/brand, "Profile"
TBC = {'Job title to confirm', 'Stand number to confirm'}   # round 3's visible placeholders
BRAND_BADGE = 'Agent Behaviour Policies: what one agent can reach, what you authorised it to do, and the gap between the two.'   # riskmandate.ai/brand, "Badge"
MEAS = json.load(open(os.path.join(SCR, 'measure.json')))
DESIGN = {p['id']: p for p in json.load(open(os.path.join(ROOT, 'data/design.json')))['people']}
TEAM = {m['id']: m for m in json.load(open(os.path.join(ROOT, 'data/team.json')))['members']}
SAFE = (7, 7, 84, 54); EPS = 0.05
fails, n_ok = [], 0
def fail(f, msg): fails.append(f'{f}: {msg}')

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def contrast(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)
def inside(b, z): return b[0] >= z[0] - EPS and b[1] >= z[1] - EPS and b[2] <= z[2] + EPS and b[3] <= z[3] + EPS
def overlap(a, b): return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]

def own_card(pid):
    f = os.path.join(ROOT, f'people/{pid}/business-card.json'); return json.load(open(f)) if os.path.exists(f) else {}

for concept in CONCEPTS:
    SPEC = json.load(open(os.path.join(BASE, concept, 'spec.json')))
    for pid in (['team'] if ROUND4 else DESIGN):
        team = pid == 'team'
        url = TEAM_URL if team else f'https://web-summit.sgit.ai/meet/{pid}/'
        name, line = (None, None) if team else (own_card(pid).get('name', DESIGN[pid]['name']), DESIGN[pid]['line'])
        colour = SPEC['files']['team-card-front.svg']['accent']['hex'] if team else DESIGN[pid]['colour']
        for side in ['front', 'back']:
            rel = f'{concept}/{pid}-card-{side}.svg'; f = os.path.join(BASE, rel)
            if not os.path.exists(f): fail(rel, 'missing'); continue
            s = open(f).read(); live = open(os.path.join(BASE, concept, 'live', f'{pid}-card-{side}.svg')).read()
            # size and bleed
            if not re.match(r'<svg [^>]*width="91mm" height="61mm" viewBox="0 0 91 61"', s): fail(rel, 'not 91 x 61 mm with viewBox 0 0 91 61')
            if '<text' in s: fail(rel, 'live text in a print file')
            if re.search(r'<image', s): fail(rel, 'a raster image')
            # safe zone, measured
            items = MEAS[rel]
            for it in items:
                if it['role'] != 'qr' and not inside(it['box'], SAFE): fail(rel, f'{it["role"]} outside the safe zone: {[round(v, 2) for v in it["box"]]}')
            # the seal: one, and clear space of half its width
            logos = re.findall(r'<g id="rm-logo"[^>]*data-d="([\d.]+)"', s)
            if len(logos) > 1: fail(rel, 'more than one rm-logo')
            for lg in [i for i in items if i['role'] == 'logo']:
                d = float(logos[0]); b = lg['box']; zone = (b[0] - d / 2, b[1] - d / 2, b[2] + d / 2, b[3] + d / 2)
                for it in items:
                    if it['role'] not in ('logo', 'placeholder') and overlap(zone, it['box']): fail(rel, f'{it["role"]} inside the seal\'s clear space')
                for x, y, w, h, fill in re.findall(r'<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="(#[0-9a-fA-F]{6})"/>', s):
                    if fill.lower() == colour.lower() and overlap(zone, (float(x), float(y), float(x) + float(w), float(y) + float(h))):
                        fail(rel, 'the person\'s colour inside the seal\'s clear space')
                bg = re.search(r'<rect x="0" y="0" width="91" height="61" fill="(#[0-9a-fA-F]{6})"', s).group(1)
                if bg.lower() == colour.lower():
                    fail(rel, 'the seal on the person\'s colour')
            # the seal is the supplied file: its ring and ticks verbatim, its RM the EPS's outline numbers in order
            for lg in re.findall(r'<g id="rm-logo"[^>]*data-src="([^"]+)"[^>]*>(.*?)</g></g>|<g id="rm-logo"[^>]*data-src="([^"]+)"[^>]*>(.*?)</g>(?=<)', s, re.S):
                srcf, body = (lg[0], lg[1]) if lg[0] else (lg[2], lg[3])
                sup = open(os.path.join(HERE, srcf)).read()
                for el in re.findall(r'<(?:circle|line|rect)[^>]*/>', sup):
                    el = el.replace('stroke="rgba(247,246,242,.22)"', 'stroke="#484746"')
                    if el not in s: fail(rel, f'seal element not as supplied: {el[:50]}')
                eps = open(os.path.join(HERE, 'brand/riskmandate-mark.eps')).read()
                rm = eps[eps.index('% RM, as outlines'):]; rm = rm[:rm.index('\nfill')]
                nums = re.findall(r'-?\d+\.\d+', rm.split('newpath', 1)[1])
                path = re.search(r'<path d="([^"]+)" fill="#F7F6F2"', s)
                if not path or re.findall(r'-?\d+\.\d+', path.group(1)) != nums: fail(rel, 'the RM lettering is not the EPS outline')
            if 'RM LOGO' in live or 'data-role="placeholder"' in s: fail(rel, 'a logo placeholder is left')
            # the QR
            if 'id="qr"' in s:
                src = open(os.path.join(ROOT, 'team/designer/qr/qr-meet.svg' if team else f'team/designer/qr/qr-meet-{pid}.svg')).read()
                body = re.search(r'</desc>(.*)</svg>', src, re.S).group(1)
                emb = re.search(r'<g id="qr"[^>]*data-url="([^"]+)"[^>]*scale\(([\d.]+)\)">(.*?)</g>', s, re.S)
                if not emb or emb.group(3) != body: fail(rel, 'the QR is not the person\'s file, byte for byte')
                if emb.group(1) != url: fail(rel, f'QR marked for {emb.group(1)}')
                k = float(emb.group(2))
                if 29 * k < 24 - 1e-6: fail(rel, f'QR symbol {29 * k:.2f} mm, under 24')
                q = [i for i in items if i['role'] == 'qr'][0]['box']
                if not inside(q, SAFE): fail(rel, f'QR panel outside the safe zone: {[round(v, 2) for v in q]}')
                img = Image.open(os.path.join(SCR, f'{concept}--{pid}-card-{side}.png')).convert('L')
                rs = zxingcpp.read_barcodes(img, formats=zxingcpp.BarcodeFormat.QRCode)
                got = [r.text for r in rs]
                if got != [url]: fail(rel, f'QR reads {got}, expected {url}')
            # the copy, the sizes, the contrast (live copy)
            texts = [dict(zip(['role', 'bg', 'size', 'fill', 'weight', 'text'], (m[0], m[1], float(m[2]), m[3], int(m[4]), m[5])))
                     for m in re.findall(r'<text class="safe" data-role="(\w+)" data-bg="(#\w+)"[^>]*font-weight="(\d+)" font-size="([\d.]+)" fill="(#\w+)">([^<]*)</text>', live)
                     for m in [(m[0], m[1], m[3], m[4], m[2], m[5])]]
            import html as H
            for t in texts:
                t['text'] = H.unescape(t['text']); pt = t['size'] / (25.4 / 72)
                if t['role'] == 'placeholder': continue
                if pt < 7 - 0.01: fail(rel, f'{t["role"]} "{t["text"]}" at {pt:.1f} pt')
                if t['role'] == 'name' and pt < 10 - 0.01: fail(rel, f'name at {pt:.1f} pt')
                large = pt >= 18 or (pt >= 14 and t['weight'] >= 700)
                cr = contrast(t['fill'], t['bg'])
                if cr < (3 if large else 4.5): fail(rel, f'{t["role"]} contrast {cr:.2f} on {t["bg"]}')
                low = t['text'].lower()
                if re.search(r'@|\+\d|\d{3}[ .-]\d{3}|www\.|linkedin|twitter|instagram|\.com', low): fail(rel, f'contact or other brand: "{t["text"]}"')
            by = lambda r: [t['text'] for t in texts if t['role'] == r]
            norm = lambda x: x.replace('’', "'").strip('“”')
            if team:   # no individual names, anywhere on the card; the chosen pair, word for word
                for nm in NAMES:
                    if nm.lower() in ' '.join(t['text'].lower() for t in texts): fail(rel, f'a person\'s name on a team card: {nm}')
                if by('headline') or by('tagline'):
                    pair = (norm_txt(' '.join(by('headline'))), ' '.join(by('tagline')))
                    if pair not in PAIRS: fail(rel, f'main line and tagline not one of the chosen pairs: {pair}')
                    if by('headline'):
                        hs = min(t['size'] for t in texts if t['role'] == 'headline'); ts = max(t['size'] for t in texts if t['role'] == 'tagline')
                        if hs < 2.5 * ts: fail(rel, f'main line only {hs / ts:.1f} times the tagline')
            elif 'name' in by('name') or by('name'):
                if by('name') != [name]: fail(rel, f'name {by("name")} != {name}')
            if by('role'):
                role = ' '.join(by('role')); ok_role = own_card(pid).get('title') == role or role in TEAM[pid]['role'].replace('RiskMandate, ', '')
                if not ok_role: fail(rel, f'role "{role}" not from the brief')
            if not ROUND2 and 'web summit' in ' '.join(t['text'].lower() for t in texts): fail(rel, 'the Web Summit name, outside round 2')
            # round 2's copy: every headline, event and register line from its source
            if ROUND2:
                hl = norm_txt(' '.join(by('headline')))
                ok_hl = [norm_txt(h) for h in SOURCED['headline']]
                if hl and not team and not (hl in ok_hl or hl in [a + ' ' + b for a in ok_hl for b in ok_hl]): fail(rel, f'headline not from content/design.md: "{hl}"')
                ev = norm_txt(' '.join(by('event'))); evs = [norm_txt(e) for e in SOURCED['event']]
                if ev and ev not in evs + [evs[0] + ' ' + evs[1], evs[1] + ' ' + evs[0]] and not all(norm_txt(t['text']) in ' '.join(evs) for t in texts if t['role'] == 'event'):
                    fail(rel, f'event line not from content/meet*.md: "{ev}"')
                for t in [t for t in texts if t['role'] == 'hook']:
                    if t['text'] != BRAND_HOOK: fail(rel, f'hook not the brand\'s line: "{t["text"]}"')
                for t in [t for t in texts if t['role'] == 'tbc']:
                    if t['text'] not in TBC: fail(rel, f'unknown placeholder: "{t["text"]}"')
                for t in [t for t in texts if t['role'] in ('register', 'label')]:
                    if norm_txt(t['text']) not in norm_txt(BRAND_BADGE): fail(rel, f'{t["role"]} not from the brand badge line: "{t["text"]}"')
            # nothing collides: text, QR panel and seal boxes (as measured, shrunk 0.4 mm for ascenders and descenders)
            bx = [(it['role'], [it['box'][0] + .4, it['box'][1] + .4, it['box'][2] - .4, it['box'][3] - .4]) for it in items if it['role'] not in ('placeholder',)]
            for i in range(len(bx)):
                for j in range(i + 1, len(bx)):
                    if overlap(bx[i][1], bx[j][1]): fail(rel, f'{bx[i][0]} and {bx[j][0]} overlap')
            if by('line') and norm(' '.join(by('line'))) != line: fail(rel, f'line "{" ".join(by("line"))}" != "{line}"')
            u = ''.join(by('url'))
            if u and u != url.replace('https://', ''): fail(rel, f'URL text "{u}"')
            pv = os.path.join(BASE, concept, f'{pid}-card-{side}.png')
            if Image.open(pv).size != (1004, 650): fail(rel, 'preview not 1004 x 650')
            n_ok += 1
        # each person's card carries name, line, QR and URL across its two sides
        both = open(os.path.join(BASE, concept, 'live', f'{pid}-card-front.svg')).read() + open(os.path.join(BASE, concept, 'live', f'{pid}-card-back.svg')).read()
        needs = ['data-role="name"', 'data-role="role"', 'data-role="url"', 'id="qr"', 'id="rm-logo"', 'data-role="wordmark"']
        if team: needs = ['data-role="headline"', 'data-role="tagline"', 'data-role="url"', 'id="qr"', 'id="rm-logo"', 'data-role="wordmark"', 'data-role="register"']
        needs += ['data-role="event"'] if ROUND2 else ['data-role="line"']
        if team and 'data-role="name"' in both: fail(f'{concept}/{pid}', 'a name on a team card')
        if ROUND3 and 'data-role="role"' not in both and 'Job title to confirm' in both: needs.remove('data-role="role"')
        for need in needs:
            if need not in both: fail(f'{concept}/{pid}', f'no {need} on either side')

print(f'{n_ok} sides checked')
if fails: print('\n'.join('FAIL ' + f for f in fails)); sys.exit(1)
print('OK')
