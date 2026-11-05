#!/usr/bin/env python3
"""The team's sticker vote (WS-159): twelve funny laptop stickers in an encrypted vault, one append lane per team
person, a ranked top 6 each (Borda), plus "not for me". Built by conductor@web-summit.dinis on 5 November 2026, at Dinis's word ("put the
sticker images in a vault ... a UI to vote ... an append lane that receives the votes, with each lane's token
published encrypted to each participant's public key ... only the team votes ... Angelo, Jose and Indi can drain").

    python3 -I admin/tools/stickers_vote.py setup                 first time: the drain key, placeholder images, the app, the lanes
    python3 -I admin/tools/stickers_vote.py images <folder>       the real images: full/web/thumbs, content.json, the repo's
                                                                  thumbnails, the app rebuilt; commits and pushes the vault
    python3 -I admin/tools/stickers_vote.py lanes                 re-issue the lanes when person keys change (all anchors in one call)
    python3 -I admin/tools/stickers_vote.py drain                 the CLI drain: the same steps as the vault app's Drain panel
    python3 -I admin/tools/stickers_vote.py status                pending votes per lane (counts only)
    python3 -I admin/tools/stickers_vote.py app                   rebuild the vault's index.html, app.json and README, push
    python3 -I admin/tools/stickers_vote.py seal-drainers [--person <id>]   seal the vault key and the drain passphrase (angelo, jose, indi, dinis)
    python3 -I admin/tools/stickers_vote.py purge --person <id>   delete a lane's files (pending and processed): test clean-up
    python3 -I admin/tools/stickers_vote.py placeholders          redraw the twelve placeholder images (before the real ones)

Options: --root <repo> (default: this repository; a scratch copy for tests), --creds (default
~/.sg-send/lanes/stickers-vote.json, mode 0600: the tokens, the enum key, the drain passphrase; never committed).
`images` takes any file names: a file whose name holds one sticker number (1 to 12) or a slug goes to that sticker,
the rest fill the numbers left in natural order; the mapping is printed for checking. PNG, JPEG or WebP, any size.

The keys. The vault key (in the clone's .sg_vault/local/, never printed) is the master key: it derives the write key
(configure, purge) and the read key. The read key is PUBLISHED on purpose (Dinis's choice), in data/stickers-vote.json,
so the site page can render the vault and list the lanes. Because the read key is public, everything in the vault is
public too, so the drain's private keys are kept WRAPPED (identity/private/drain-key.sealed.json, AES-256-GCM under
PBKDF2-SHA256 of a passphrase), the passphrase is sealed to the drainers with the vault key, and votes/ keeps each
ballot as the sealed envelope it arrived in: who voted is public, what they chose is counted, never listed.
Prints counts only, never a key, a token or a ballot.
"""
import argparse, base64, collections, datetime, glob, hashlib, json, os, re, secrets, shutil, subprocess, sys, tempfile, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
AGENT = 'conductor@web-summit.dinis'
VAULT_NAME = 'ws-stickers-vote'
CLOSES_AT = '2026-11-05T18:00:00Z'
TAGLINE = 'Twelve funny laptop stickers for Web Summit Lisbon. The team ranks a top 6 each: 1st = 6 points, 6th = 1.'
DRAINERS = ['angelo', 'jose', 'indi', 'dinis']
SITE_PAGE = 'https://web-summit.sgit.ai/stickers/vote/index.html'
VIEWER = 'https://dev.vault.sgraph.ai/'
PBKDF2_ITER = 310000

# id, slug, name, the joke (content/stickers-creative.md), the words on it (content/stickers-chatgpt.md), shape, colours
STICKERS = [
    (1, 'road-trip-patch', 'The road-trip patch', 'A retro travel patch: the bridge at sunset, a little green robot in a convertible holding a map labelled MANDATE.', 'RISKMANDATE · WEB SUMMIT EDITION · LISBON 2026', 'circle', '#1A7F5A', '#F7F6F2', '#F2C230'),
    (2, 'tram-ticket', 'The tram ticket', 'A yellow Lisbon tram 28 ticket for agents, with the small print that matters.', 'AGENT PASS · VALID WITHIN MANDATE ONLY', 'ticket', '#F2C230', '#161615', '#C8553D'),
    (3, 'azulejo-tile', 'The azulejo tile', 'A blue-and-white Portuguese tile whose pattern is the gap bar: authorised, then the gap.', 'CONTROL THE GAP', 'square', '#1D4ED8', '#F7F6F2', '#F2C230'),
    (4, 'pastel-de-nata', 'The pastel de nata', 'A golden custard tart wearing a tiny green tick like a medal, looking smug.', 'FULLY AUTHORISED', 'circle', '#B45309', '#F7F6F2', '#1A7F5A'),
    (5, 'passport-stamp', 'The passport stamp', 'An entry stamp in green ink: the agent has landed, with paperwork.', 'MANDATE APPROVED · LIS · 09-12 NOV 2026', 'circle', '#F7F6F2', '#1A7F5A', '#161615'),
    (6, 'road-sign', 'The road sign', 'A warning sign: a small robot striding confidently towards a cliff edge.', 'AGENT CROSSING: KNOW THEIR REACH', 'square', '#C8553D', '#F7F6F2', '#161615'),
    (7, 'the-keys', 'The keys', 'Our robot, visibly sweating, holding an enormous ring of keys of every size.', 'WITH GREAT ACCESS COMES GREAT RESPONSIBILITY', 'square', '#161615', '#F2C230', '#1A7F5A'),
    (8, 'the-seal', 'The seal', 'An official starburst seal in gold and green, a big tick in the middle.', 'VERIFIED MANDATE', 'circle', '#1A7F5A', '#F2C230', '#F7F6F2'),
    (9, 'surfs-up', "Surf's up", 'The robot surfing a giant Nazare wave made of data, perfectly calm.', 'RIDING THE WAVE, WITHIN MANDATE', 'square', '#1D4ED8', '#F7F6F2', '#5FD4C8'),
    (10, 'hello-my-name-is', 'Hello, my name is', "The name-tag classic, with a blank to fill in at the stand.", "HELLO, MY AGENT'S MANDATE IS ____", 'tag', '#C8553D', '#F7F6F2', '#161615'),
    (11, 'least-privilege', 'Least privilege', 'A 1970s souvenir bumper sticker, with a big red heart.', 'I LOVE LEAST PRIVILEGE', 'ticket', '#F7F6F2', '#1A7F5A', '#C8553D'),
    (12, 'sardine-tin', 'The sardine tin', 'A Portuguese sardine tin: every sardine is an agent, and one of them wears a green tag.', 'ONE OF THESE HAS A MANDATE', 'tag', '#1D4ED8', '#F2C230', '#C8553D'),
]


def die(m): sys.exit('stickers_vote: ' + m)
def say(m): print('stickers_vote: ' + m)
def sha(s): return hashlib.sha256(s.encode() if isinstance(s, str) else s).hexdigest()
def now(): return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def b64(b): return base64.b64encode(b).decode()
def ub64(s): return base64.b64decode(s)
def wjson(path, obj, mode=None, indent=2):
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    with open(path, 'w') as f: f.write(json.dumps(obj, indent=indent, ensure_ascii=False) + '\n')
    if mode: os.chmod(path, mode)


class Ctx:
    def __init__(self, o):
        self.root = os.path.abspath(o.root)
        self.creds_path = os.path.expanduser(o.creds)
        if not os.path.exists(self.creds_path): die(f'no creds file {self.creds_path}: it is made when the vault is created (see the README in the vault)')
        self.c = json.load(open(self.creds_path))
        self.vault = self.c['vault_dir']
        self.host = self.c['host']
        self.vid = self.c['vault_id']

    def save(self): wjson(self.creds_path, self.c, 0o600)

    def vault_key(self):
        return open(os.path.join(self.vault, '.sg_vault', 'local', 'vault_key')).read().strip()

    def write_key(self):
        from sgit_ai.crypto.Vault__Crypto import Vault__Crypto
        return Vault__Crypto().derive_keys_from_vault_key(self.vault_key())['write_key']

    def post(self, op, body, headers):
        req = urllib.request.Request(f'{self.host}/api/vault/append/{op}/{self.vid}', data=json.dumps(body).encode(), method='POST',
                                     headers={'Content-Type': 'application/json', **headers})
        try:
            with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read() or b'{}')
        except urllib.error.HTTPError as e:
            die(f'{op} answered {e.code}' + (' (a bad key, token or vault id answers 404)' if e.code == 404 else ''))

    def enum(self, op, body): return self.post(op, body, {'x-sgraph-vault-enum-key': self.c['enum_key']})
    def owner(self, op, body):
        tok = os.environ.get('SG_SEND_ACCESS_TOKEN') or die('SG_SEND_ACCESS_TOKEN is not set')
        return self.post(op, body, {'x-sgraph-vault-write-key': self.write_key(), 'x-sgraph-access-token': tok})

    def sgit(self, *args, ok_fail=False):
        r = subprocess.run(['sgit', *args], cwd=self.vault, capture_output=True, text=True)
        if r.returncode and not ok_fail: die(f'sgit {args[0]} failed (exit {r.returncode}): ' + re.sub(r'[0-9a-f]{32,}', '<hex>', (r.stderr or r.stdout)[-400:]))
        return r

    def commit_push(self, msg):
        st = self.sgit('status', ok_fail=True).stdout
        r = self.sgit('commit', '-m', msg, ok_fail=True)
        if r.returncode and 'nothing to commit' not in (r.stdout + r.stderr).lower(): die('sgit commit failed: ' + (r.stderr or r.stdout)[-300:])
        self.sgit('push')
        say(f'vault pushed: {msg}')

    def team(self):
        """Team people (humans on data/team.json) with an active site key: one lane each."""
        members = [m for m in json.load(open(os.path.join(self.root, 'data/team.json')))['members'] if m.get('kind') == 'human']
        keys = {k['person']: k for k in json.load(open(os.path.join(self.root, 'data/person-keys.json')))['keys'] if k.get('status') == 'active'}
        return [(m['id'], m['name'], keys[m['id']]) for m in members if m['id'] in keys]


# ---------- the drain key: RSA-4096 (encrypt) + ECDSA P-256 (sign), the private halves wrapped by a passphrase ----------
def _kdf(passphrase, salt):
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.hazmat.primitives import hashes
    return PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=PBKDF2_ITER).derive(passphrase.encode())

def make_drain_key(ctx):
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    pki = PKI__Crypto()
    enc_priv, enc_pub = pki.generate_encryption_key_pair()
    sig_priv, sig_pub = pki.generate_signing_key_pair()
    der = lambda k: k.private_bytes(serialization.Encoding.DER, serialization.PrivateFormat.PKCS8, serialization.NoEncryption())
    passphrase = secrets.token_hex(16)
    salt, iv = os.urandom(16), os.urandom(12)
    inner = json.dumps({'encrypt_pkcs8': b64(der(enc_priv)), 'sign_pkcs8': b64(der(sig_priv))}).encode()
    ct = AESGCM(_kdf(passphrase, salt)).encrypt(iv, inner, None)
    bundle = {'label': f'{VAULT_NAME} drain key', 'agent': AGENT, 'created': now(),
              'encrypt': pki.export_public_key_pem(enc_pub), 'fingerprint': pki.compute_fingerprint(enc_pub),
              'sign': pki.export_public_key_pem(sig_pub), 'signing_fingerprint': pki.compute_fingerprint(sig_pub),
              'about': 'Votes are sealed to `encrypt` (sgit hybrid v2: RSA-OAEP-4096 wraps an AES-256-GCM key). The private halves are in identity/private/drain-key.sealed.json, wrapped; the passphrase is sealed to the drainers.'}
    wrapped = {'v': 1, 'alg': 'PBKDF2-SHA256 -> AES-256-GCM', 'iterations': PBKDF2_ITER, 'salt': b64(salt), 'iv': b64(iv), 'ct': b64(ct),
               'fingerprint': bundle['fingerprint'], 'holds': 'JSON {encrypt_pkcs8, sign_pkcs8}: the drain key private halves, PKCS8 DER base64',
               'about': 'This vault read key is published, so this file is public: the private keys stay wrapped. The passphrase is sealed with the vault key to angelo, jose and indi (data/sealed/<id>/ on the site).'}
    wjson(os.path.join(ctx.vault, 'identity/public-bundle.json'), bundle)
    wjson(os.path.join(ctx.vault, 'identity/private/drain-key.sealed.json'), wrapped)
    ctx.c['drain_passphrase'] = passphrase
    ctx.save()
    say(f"drain key made: {bundle['fingerprint']} (passphrase in the creds file only)")

def drain_key(ctx):
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    w = json.load(open(os.path.join(ctx.vault, 'identity/private/drain-key.sealed.json')))
    inner = json.loads(AESGCM(_kdf(ctx.c['drain_passphrase'], ub64(w['salt']))).decrypt(ub64(w['iv']), ub64(w['ct']), None))
    return serialization.load_der_private_key(ub64(inner['encrypt_pkcs8']), password=None)


# ---------- images ----------
def find_font(bold=True):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf']:
        if os.path.exists(f): return f
    return None

def placeholder(s, out):
    """A 2048 px placeholder: the sticker's shape, colours, number and words. Swapped for the real file by `images`."""
    from PIL import Image, ImageDraw, ImageFont
    n, slug, name, joke, words, shape, bg, fg, acc = s
    W = 2048; im = Image.new('RGB', (W, W), '#F7F6F2'); d = ImageDraw.Draw(im)
    font = lambda sz: ImageFont.truetype(find_font(), sz)
    # a soft dotted ground, then the sticker's shape
    for y in range(40, W, 96):
        for x in range(40 + (48 if (y // 96) % 2 else 0), W, 96): d.ellipse([x - 6, y - 6, x + 6, y + 6], fill='#E5E1D5')
    m = 150
    if shape == 'circle':
        d.ellipse([m, m, W - m, W - m], fill=bg, outline='#161615', width=28); box = (m + 260, m + 330, W - m - 260, W - m - 330)
    elif shape == 'square':
        d.rounded_rectangle([m, m, W - m, W - m], radius=120, fill=bg, outline='#161615', width=28); box = (m + 150, m + 300, W - m - 150, W - m - 300)
    elif shape == 'ticket':
        d.rounded_rectangle([90, 520, W - 90, W - 520], radius=70, fill=bg, outline='#161615', width=24)
        for y in range(580, W - 560, 70): d.ellipse([W - 420 - 14, y, W - 420 + 14, y + 28], fill='#F7F6F2')
        box = (190, 600, W - 520, W - 600)
    else:
        d.rounded_rectangle([110, 380, W - 110, W - 380], radius=90, fill=bg, outline='#161615', width=24)
        d.rectangle([110 + 12, 380 + 12, W - 110 - 12, 680], fill=acc); box = (220, 720, W - 220, W - 480)
    # no number on the art: the page and the app put their own badge on every card
    # the words, wrapped to fit the box
    x0, y0, x1, y1 = box
    def wrap(text, f, width):
        lines, cur = [], ''
        for w in text.split():
            t = (cur + ' ' + w).strip()
            if d.textlength(t, font=f) <= width or not cur: cur = t
            else: lines.append(cur); cur = w
        return lines + ([cur] if cur else [])
    for sz in range(190, 60, -10):
        f = font(sz); lines = wrap(name.upper(), f, x1 - x0)
        if len(lines) * sz * 1.15 <= (y1 - y0) * 0.55: break
    head = len(lines) * int(sz * 1.15) + 40
    for sz2 in range(96, 30, -6):
        f2 = font(sz2); l2 = wrap(words, f2, x1 - x0)
        if head + len(l2) * sz2 * 1.25 <= y1 - y0: break
    y = int((y0 + y1) / 2 - (head + len(l2) * int(sz2 * 1.25)) / 2)
    for l in lines:
        d.text(((x0 + x1) / 2, y), l, font=f, fill=fg, anchor='ma'); y += int(sz * 1.15)
    y += 40
    for l in l2:
        d.text(((x0 + x1) / 2, y), l, font=f2, fill=fg, anchor='ma'); y += int(sz2 * 1.25)
    f3 = font(54); d.text((W / 2, W - 70), 'PLACEHOLDER  ·  the real sticker is on its way', font=f3, fill='#5C5F66', anchor='ms')
    im.save(out, 'PNG', optimize=True)

def process(ctx, s, src):
    """One sticker: the original kept as given (renamed), a 1600 px WebP for the lightbox, a 480 px WebP for the grid."""
    from PIL import Image, ImageOps
    Image.MAX_IMAGE_PIXELS = None                                     # the originals may be large (about 60 MB for twelve)
    n, slug = s[0], s[1]
    nn = f'{n:02d}'
    ext = os.path.splitext(src)[1].lower().replace('.jpeg', '.jpg')
    for old in glob.glob(os.path.join(ctx.vault, f'images/full/{nn}-{slug}.*')): os.remove(old)
    full = f'images/full/{nn}-{slug}{ext}'
    os.makedirs(os.path.join(ctx.vault, 'images/full'), exist_ok=True)
    shutil.copyfile(src, os.path.join(ctx.vault, full))
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') and ('A' in im.mode or 'transparency' in im.info) else 'RGB')
    w, h = im.size
    out = {}
    for kind, px, q in (('web', 1600, 82), ('thumbs', 480, 80)):
        rel = f'images/{kind}/{nn}-{slug}.webp'
        os.makedirs(os.path.join(ctx.vault, f'images/{kind}'), exist_ok=True)
        c = im.copy(); c.thumbnail((px, px), Image.LANCZOS); c.save(os.path.join(ctx.vault, rel), 'WEBP', quality=q, method=6)
        out[kind] = rel
    repo_thumb = os.path.join(ctx.root, f'assets/stickers/vote/{nn}-{slug}.webp')
    os.makedirs(os.path.dirname(repo_thumb), exist_ok=True)
    shutil.copyfile(os.path.join(ctx.vault, out['thumbs']), repo_thumb)
    return {'full': full, 'web': out['web'], 'thumb': out['thumbs'], 'w': w, 'h': h, 'bytes': os.path.getsize(src)}

def content(ctx, files, placeholder_ids):
    old = {}
    p = os.path.join(ctx.vault, 'content.json')
    if os.path.exists(p): old = {x['id']: x for x in json.load(open(p)).get('stickers', [])}
    items = []
    for s in STICKERS:
        n, slug, name, joke, words, shape, bg, fg, acc = s
        f = files.get(n) or {k: old.get(n, {}).get(k) for k in ('full', 'web', 'thumb', 'w', 'h', 'bytes')}
        ph = (n in placeholder_ids) if n in files else old.get(n, {}).get('placeholder', True)
        items.append({'id': n, 'nn': f'{n:02d}', 'slug': slug, 'name': name, 'joke': joke, 'words': words, 'shape': shape,
                      'colour': bg, 'ink': fg, 'accent': acc, 'placeholder': ph, **f})
    c = {'title': 'Pick the sticker', 'tagline': TAGLINE,
         'closes_at': CLOSES_AT, 'vote_page': SITE_PAGE, 'stickers': items}
    wjson(p, c)
    return c


# ---------- the vault app ----------
def build_app(ctx, c=None):
    c = c or json.load(open(os.path.join(ctx.vault, 'content.json')))
    if c.get('tagline') != TAGLINE: c['tagline'] = TAGLINE; wjson(os.path.join(ctx.vault, 'content.json'), c)
    tpl = open(os.path.join(HERE, 'stickers_vote_app.html.tpl')).read()
    compact = json.dumps(c, ensure_ascii=False)
    assert '\n' not in compact
    marker = 'const FALLBACK = /*__DATA__*/{}'
    if marker not in tpl: die('the app template has no FALLBACK marker')
    open(os.path.join(ctx.vault, 'index.html'), 'w').write(tpl.replace(marker, 'const FALLBACK = /*__DATA__*/' + compact))
    manifest = {'entry': 'index.html', 'present': True, 'auto_open': True, 'title': 'Pick the sticker: the team vote',
                'hud': {'mode': 'minimal'},
                'permissions': {'fs': {'read': True, 'write': ['votes/', 'results.json']},
                                'append': {'list': True, 'read': True, 'markProcessed': True}}}
    wjson(os.path.join(ctx.vault, 'app.json'), manifest)
    wjson(os.path.join(ctx.vault, '.vault/app.json'), manifest)
    open(os.path.join(ctx.vault, 'README.md'), 'w').write(open(os.path.join(HERE, 'stickers_vote_vault_README.md.tpl')).read())


# ---------- lanes ----------
def seal_to(ctx, person, plain, out):
    d = tempfile.mkdtemp(dir=os.path.expanduser('~/.sg-send'))
    os.chmod(d, 0o700)
    try:
        src = os.path.join(d, 'plain.json'); wjson(src, plain, 0o600)
        r = subprocess.run(['node', os.path.join(ctx.root, 'admin/tools/person-key.mjs'), 'seal', '--person', person, '--in', src, '--out', out, '--by', AGENT], capture_output=True, text=True)
        if r.returncode: die(f'sealing to {person} failed: {r.stderr.strip()[:200]}')
    finally:
        shutil.rmtree(d, ignore_errors=True)

def lanes(ctx):
    people = ctx.team()
    toks = ctx.c.setdefault('tokens', {})
    for pid, _, _ in people: toks.setdefault(pid, secrets.token_hex(32))
    for gone in [p for p in toks if p not in {x[0] for x in people}]: toks.pop(gone)
    anchors = [sha(toks[p]) for p, _, _ in people]
    r = ctx.owner('configure', {'append_anchors': anchors, 'enum_key_hash': sha(ctx.c['enum_key'])})
    if r.get('status') != 'configured': die(f'configure answered {r}')
    ctx.save()
    listed = ctx.enum('list', {'include_content': False, 'limit': 1})          # proves the enum key is the one the server holds
    say(f"{len(anchors)} lanes configured on {ctx.vid} ({', '.join(p for p, _, _ in people)}); listing with the enum key works ({len(listed.get('entries', []))} pending shown)")
    bundle = json.load(open(os.path.join(ctx.vault, 'identity/public-bundle.json')))
    out = {'about': 'The team sticker vote (WS-159, admin/tools/stickers_vote.py). One append lane per team person with a site key; each lane token is sealed to that person (ws-ecies-1, data/person-keys.json), so only their browser opens it. Votes are signed by the person, sealed to drain_public_key (sgit hybrid v2) and written to their lane. The read key is published on purpose (Dinis): it renders the vault and lets anyone list who has a vote waiting, never what they chose.',
           'agent': AGENT, 'updated': now(), 'closes_at': CLOSES_AT,
           'endpoint': ctx.host, 'vault_id': ctx.vid, 'read_key': ctx.c['read_key_public'],
           'vault_url': f"{VIEWER}#{ctx.c['read_key_public']}:{ctx.vid}",
           'drain_public_key': bundle['encrypt'], 'drain_fingerprint': bundle['fingerprint'],
           'stickers': [{'id': s[0], 'nn': f'{s[0]:02d}', 'slug': s[1], 'name': s[2], 'joke': s[3], 'words': s[4], 'thumb': f'assets/stickers/vote/{s[0]:02d}-{s[1]}.webp'} for s in STICKERS],
           'lanes': []}
    for pid, name, key in people:
        tmp = os.path.join(os.path.expanduser('~/.sg-send/stickers'), f'sealed-{pid}.json')
        seal_to(ctx, pid, {'type': 'web-summit.sticker-vote/lane', 'person': pid, 'vault_id': ctx.vid, 'append_token': toks[pid]}, tmp)
        env = json.load(open(tmp)); os.remove(tmp)
        out['lanes'].append({'person': pid, 'name': name, 'lane': sha(toks[pid]), 'key': key['fingerprint'], 'sealed_token': env})
    wjson(os.path.join(ctx.root, 'data/stickers-vote.json'), out)
    wjson(os.path.join(ctx.vault, 'identity/lanes.json'), {'about': 'Each lane, by the SHA-256 of its token (the anchor the server holds): the token itself is sealed to its person on the site.',
                                                           'lanes': {sha(toks[p]): p for p, _, _ in people}})
    keys = json.load(open(os.path.join(ctx.root, 'data/person-keys.json')))
    wjson(os.path.join(ctx.vault, 'identity/person-keys.json'), {'about': 'A copy of data/person-keys.json from web-summit.sgit.ai, for the in-vault drain to verify signatures.', 'copied': now(), 'keys': keys['keys']})
    say(f'data/stickers-vote.json written: {len(out["lanes"])} sealed tokens')


# ---------- the drain ----------
def verify_vote(payload, lane_person, keys):
    """payload = {vote, signed, sig, key}: the person signed `signed` (JSON of the vote) with their site key."""
    from cryptography.hazmat.primitives.asymmetric import ec, utils
    from cryptography.hazmat.primitives import hashes
    vote = json.loads(payload['signed'])
    ballot(vote)                                                        # the shape first: v1 (one choice) or v2 (a top 6)
    k = next((k for k in keys if k['person'] == vote.get('person') and k['fingerprint'] == payload.get('key')), None)
    if not k: raise ValueError(f"no published key {payload.get('key')} for {vote.get('person')}")
    if k.get('status') != 'active': raise ValueError(f"key {k['fingerprint']} is {k.get('status')}")
    bi = lambda x: int.from_bytes(base64.urlsafe_b64decode(x + '=' * (-len(x) % 4)), 'big')
    pub = ec.EllipticCurvePublicNumbers(bi(k['sign']['x']), bi(k['sign']['y']), ec.SECP256R1()).public_key()
    raw = ub64(payload['sig'])
    pub.verify(utils.encode_dss_signature(int.from_bytes(raw[:32], 'big'), int.from_bytes(raw[32:], 'big')), payload['signed'].encode(), ec.ECDSA(hashes.SHA256()))
    if vote['person'] != lane_person: raise ValueError(f"signed by {vote['person']} but written on {lane_person}'s lane")
    return vote

def ballot(vote):
    """A ballot's ranking and its "not for me" list, from v2 (ranking, up to 6, and not_for_me) or v1 (one choice)."""
    ok = lambda x: isinstance(x, int) and not isinstance(x, bool) and 1 <= x <= 12
    t = vote.get('type')
    if t == 'web-summit.sticker-vote/v1':
        if not ok(vote.get('choice')): raise ValueError('choice is not 1 to 12')
        return [vote['choice']], []
    if t != 'web-summit.sticker-vote/v2': raise ValueError('not a sticker vote')
    rk, nf = vote.get('ranking'), vote.get('not_for_me', [])
    if not isinstance(rk, list) or not 1 <= len(rk) <= 6 or not all(map(ok, rk)) or len(set(rk)) != len(rk): raise ValueError('ranking is not 1 to 6 distinct stickers')
    if not isinstance(nf, list) or not all(map(ok, nf)) or len(set(nf)) != len(nf) or set(nf) & set(rk): raise ValueError('not_for_me is not a list of other stickers')
    return rk, nf

def tally(ballots):
    """Borda: 1st = 6 points ... 6th = 1; plus how many put each in their top 6, first, and not for me."""
    t = {s[0]: {'id': s[0], 'name': s[2], 'points': 0, 'top6': 0, 'firsts': 0, 'not_for_me': 0} for s in STICKERS}
    for rk, nf in ballots:
        for i, n in enumerate(rk): t[n]['points'] += 6 - i; t[n]['top6'] += 1; t[n]['firsts'] += (i == 0)
        for n in nf: t[n]['not_for_me'] += 1
    return sorted(t.values(), key=lambda x: (-x['points'], -x['top6'], x['not_for_me'], x['id']))

def open_envelope(key, content):
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    return json.loads(PKI__Crypto().hybrid_decrypt(key, ub64(content).decode())['plaintext'])

def recount(rows, key):
    """Newest verified vote per person, received before the close, counts. Choices are counted, never listed."""
    close = CLOSES_AT
    best, late, bad = {}, 0, 0
    for r in rows:
        if not r.get('verified'): bad += 1; continue
        if r['received'] > close: late += 1; continue
        if r['person'] not in best or r['received'] > best[r['person']]['received']: best[r['person']] = r
    ranking = tally([ballot(json.loads(open_envelope(key, r['envelope'])['signed'])) for r in best.values()])
    return {'v': 2, 'method': 'Borda: 1st = 6 points, 2nd = 5 ... 6th = 1; a v1 ballot is a top 6 of one', 'as_of': now(), 'closes_at': close, 'closed': now() >= close, 'voters_count': len(best),
            'counts': {str(x['id']): x['points'] for x in ranking}, 'ranking': ranking, 'leader': ranking[0] if ranking[0]['points'] else None,
            'voters': sorted(({'person': p, 'at': r['received']} for p, r in best.items()), key=lambda x: x['at']),
            'ballots': len(rows), 'changed_votes': sum(1 for r in rows if r.get('verified') and r['received'] <= close) - len(best),
            'late': late, 'rejected': bad, 'drained_by': AGENT + ' (CLI)',
            'note': 'A top 6 per team person, ranked; a new ballot replaces the earlier one (the newest counts). Ballots stay sealed in votes/: who voted is public, what each person chose is not.'}

def load_rows(ctx):
    rows = []
    for f in sorted(glob.glob(os.path.join(ctx.vault, 'votes/*.jsonl'))):
        rows += [json.loads(l) for l in open(f) if l.strip()]
    return rows

def drain(ctx, dry=False):
    ctx.sgit('pull', ok_fail=True)
    entries, after = [], None
    while True:
        r = ctx.enum('list', {'include_content': False, 'limit': 200, **({'after_file_id': after} if after else {})})
        page = r.get('entries', []); entries += page
        if not r.get('truncated') or not page: break
        after = page[-1]['file_id']
    by_tok = {v: k for k, v in ctx.c.get('tokens', {}).items()}
    lanes = collections.OrderedDict()
    for e in entries: lanes.setdefault(e['inbox'], []).append(e['file_id'])
    say(f"{len(entries)} pending in {len(lanes)} lane(s)" + ''.join(f"; {by_tok.get(t, 'an unknown lane')}: {len(ids)}" for t, ids in lanes.items()))
    if dry or not entries: return
    key = drain_key(ctx)
    keys = json.load(open(os.path.join(ctx.root, 'data/person-keys.json')))['keys']
    seen = {r['file'] for r in load_rows(ctx)}
    new, done, findings = [], collections.defaultdict(list), 0
    for tok, ids in lanes.items():
        for i in range(0, len(ids), 50):
            for f in ctx.enum('fetch', {'inbox': tok, 'file_ids': ids[i:i + 50]}).get('files', []):
                fid = f['file_id']; done[tok].append(fid)
                if fid in seen: continue
                ms = int(fid[:13]) if fid[:13].isdigit() else 0
                row = {'file': fid, 'received': datetime.datetime.fromtimestamp(ms / 1000, datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
                       'lane': by_tok.get(tok), 'person': None, 'verified': False, 'finding': None, 'envelope': f['content']}
                try:
                    v = verify_vote(open_envelope(key, f['content']), by_tok.get(tok), keys)
                    row.update(person=v['person'], verified=True)
                except Exception as e:
                    row['finding'] = f'{type(e).__name__}: {e}'[:200]; findings += 1
                new.append(row); seen.add(fid)
    day = time.strftime('%Y-%m-%d', time.gmtime())
    os.makedirs(os.path.join(ctx.vault, 'votes'), exist_ok=True)
    with open(os.path.join(ctx.vault, f'votes/{day}.jsonl'), 'a') as out:
        for r in new: out.write(json.dumps(r, sort_keys=True) + '\n')
    res = recount(load_rows(ctx), key)
    wjson(os.path.join(ctx.vault, 'results.json'), res)
    ctx.commit_push(f'drain {now()}: {len(new)} ballot(s), {res["voters_count"]} voter(s)')
    for tok, ids in done.items():                                       # only after the push: a failed push loses nothing
        for i in range(0, len(ids), 100): ctx.enum('mark-processed', {'inbox': tok, 'file_ids': ids[i:i + 100]})
    say(f'drained {len(new)} ballot(s) ({findings} rejected), pushed, marked processed; {res["voters_count"]} voter(s) so far')


# ---------- commands ----------
def make_placeholders(ctx):
    d = tempfile.mkdtemp(); files = {}
    for s in STICKERS:
        p = os.path.join(d, f'{s[0]:02d}-{s[1]}.png'); placeholder(s, p); files[s[0]] = process(ctx, s, p)
    shutil.rmtree(d)
    return content(ctx, files, {s[0] for s in STICKERS})

def cmd_placeholders(ctx, o):
    build_app(ctx, make_placeholders(ctx)); ctx.commit_push('placeholder images redrawn')

def cmd_setup(ctx, o):
    if not os.path.exists(os.path.join(ctx.vault, 'identity/private/drain-key.sealed.json')): make_drain_key(ctx)
    if not os.path.exists(os.path.join(ctx.vault, 'content.json')): make_placeholders(ctx)
    build_app(ctx)
    os.makedirs(os.path.join(ctx.vault, 'votes'), exist_ok=True)
    if not os.listdir(os.path.join(ctx.vault, 'votes')): open(os.path.join(ctx.vault, 'votes/README.md'), 'w').write('Drained ballots, one JSON line each, still sealed to the drain key. Written by the drain (the app\'s Drain panel, or admin/tools/stickers_vote.py drain).\n')
    if not os.path.exists(os.path.join(ctx.vault, 'results.json')):
        wjson(os.path.join(ctx.vault, 'results.json'), {'v': 1, 'as_of': now(), 'closes_at': CLOSES_AT, 'closed': False, 'voters_count': 0,
                                                        'counts': {str(s[0]): 0 for s in STICKERS}, 'ranking': [], 'leader': None, 'voters': [], 'ballots': 0,
                                                        'note': 'No votes drained yet.'})
    ctx.commit_push('the sticker vote: images, app, drain key (wrapped)')
    lanes(ctx)
    ctx.commit_push('the lanes: identity/lanes.json and identity/person-keys.json')

KEYWORDS = {1: r'road-?trip|patch', 2: r'tram|ticket', 3: r'azulejo|tile', 4: r'nata|pastel', 5: r'passport|stamp', 6: r'road-?sign|crossing',
            7: r'(?<![a-z])keys?(?![a-z])', 8: r'(?<![a-z])seal(?![a-z])', 9: r'surf', 10: r'hello|name-?is|name-?tag', 11: r'privilege', 12: r'sardine'}

def map_images(names):
    """{sticker id: file name} and the names placed by order. A word of the sticker's name in the file name places it
    first (keys, sardine, surf ...); then a name holding exactly one number from 1 to 12; the rest fill the numbers
    left, in natural order (2 before 10)."""
    files = sorted((f for f in names if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and not f.startswith('.')),
                   key=lambda f: [int(x) if x.isdigit() else x.lower() for x in re.split(r'(\d+)', f)])
    stem = lambda f: re.sub(r'[\s_]+', '-', os.path.splitext(f)[0].lower())
    got, placed = {}, set()
    for f in files:                                                   # 1. a word of the sticker's name
        kw = [s[0] for s in STICKERS if re.search(KEYWORDS[s[0]], stem(f))]
        if len(kw) == 1 and kw[0] not in got: got[kw[0]] = f; placed.add(f)
    for f in files:                                                   # 2. exactly one sticker number
        if f in placed: continue
        nums = {int(x) for x in re.findall(r'(?<!\d)0*(\d{1,2})(?!\d)', stem(f)) if 1 <= int(x) <= 12}
        if len(nums) == 1 and (n := nums.pop()) not in got: got[n] = f; placed.add(f)
    rest = [f for f in files if f not in placed]
    free = [s[0] for s in STICKERS if s[0] not in got]                # 3. by order, into the numbers left
    for n, f in zip(free, rest): got[n] = f
    for f in rest[len(free):]: say(f'skipped {f}: all twelve already have a file')
    return got, set(rest)

def cmd_images(ctx, o):
    src = os.path.abspath(o.folder)
    got, rest = map_images(os.listdir(src))
    if not got: die(f'no images in {src}')
    say('the mapping (check it):')
    for n in sorted(got): say(f'  {n:2d} {STICKERS[n - 1][2]:<22} <- {got[n]}' + ('' if got[n] not in rest else '   (by order)'))
    processed = {n: process(ctx, next(s for s in STICKERS if s[0] == n), os.path.join(src, f)) for n, f in got.items()}
    c = content(ctx, processed, set())
    build_app(ctx, c)
    ctx.commit_push(f'the real sticker images: {len(processed)} of 12')
    missing = [s[0] for s in STICKERS if s[0] not in got]
    say(f"{len(processed)} images in the vault and in assets/stickers/vote/" + (f"; still placeholders: {missing}" if missing else '') +
        f". Now commit assets/stickers/vote/ in the site repository and release (AGENT={AGENT} admin/tools/release.sh).")

def cmd_app(ctx, o): build_app(ctx); ctx.commit_push('the app rebuilt')
def cmd_lanes(ctx, o): lanes(ctx); ctx.commit_push('the lanes re-issued')
def cmd_drain(ctx, o): drain(ctx, dry=o.dry)
def cmd_status(ctx, o): drain(ctx, dry=True)

def cmd_seal_drainers(ctx, o):
    stamp = time.strftime('%Y-%m-%dT%H%MZ', time.gmtime())
    for pid in (o.person or DRAINERS):
        out = os.path.join(ctx.root, f'data/sealed/{pid}/{stamp}-stickers-vault-key.json')
        seal_to(ctx, pid, {'title': 'The sticker vote: the vault key, so you can drain the votes',
                           'text': f'This is the vault key of {VAULT_NAME} ({ctx.vid}), the team sticker vote (WS-159), and the passphrase of its drain key. It lets you drain the votes inside the vault: open https://dev.vault.sgraph.ai/#<the vault key below>, add the SG/Send access token in the vault host (the lock button) so the vault is writable, scroll to Drain the votes, paste the drain passphrase and press Drain. It also gives full write access to the vault, so use it only for that, and keep it in your password manager. Votes close Thursday 5 November, 18:00 UTC. From {AGENT}.',
                           'fields': {'Vault key': ctx.vault_key(), 'Drain passphrase': ctx.c['drain_passphrase'], 'Vault id': ctx.vid}}, out)
        say(f'sealed to {pid}: {os.path.relpath(out, ctx.root)}')

def cmd_purge(ctx, o):
    tok = ctx.c.get('tokens', {}).get(o.person) or die(f'no lane for {o.person}')
    for folder in ('pending', 'processed'): ctx.owner('purge', {'inbox': tok, 'folder': folder})
    say(f"{o.person}'s lane purged (pending and processed)")

def main():
    a = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    a.add_argument('--root', default=os.path.dirname(os.path.dirname(HERE)))
    a.add_argument('--creds', default='~/.sg-send/lanes/stickers-vote.json')
    sub = a.add_subparsers(dest='cmd', required=True)
    for n in ('setup', 'app', 'lanes', 'status', 'placeholders'): sub.add_parser(n)
    p = sub.add_parser('seal-drainers'); p.add_argument('--person', action='append', help='only these (repeatable); default: ' + ', '.join(DRAINERS))
    p = sub.add_parser('images'); p.add_argument('folder')
    p = sub.add_parser('drain'); p.add_argument('--dry', action='store_true')
    p = sub.add_parser('purge'); p.add_argument('--person', required=True)
    o = a.parse_args()
    {'setup': cmd_setup, 'images': cmd_images, 'app': cmd_app, 'lanes': cmd_lanes, 'drain': cmd_drain, 'status': cmd_status,
     'seal-drainers': cmd_seal_drainers, 'purge': cmd_purge, 'placeholders': cmd_placeholders}[o.cmd](Ctx(o), o)

if __name__ == '__main__':
    main()
