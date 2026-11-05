#!/usr/bin/env python3
"""The team's sticker vote (WS-167): twelve funny laptop stickers in an encrypted vault, one append lane per team
person, a ranked top 10 each (Borda), plus "not for me". Built by conductor@web-summit.dinis on 5 November 2026, at Dinis's word ("put the
sticker images in a vault ... a UI to vote ... an append lane that receives the votes, with each lane's token
published encrypted to each participant's public key ... only the team votes ... Angelo, Jose and Indi can drain").

    python3 -I admin/tools/stickers_vote.py setup                 first time: the drain key, placeholder images, the app, the lanes
    python3 -I admin/tools/stickers_vote.py images [<folder>]     new images (default: the vault's images/uploads/, zips too):
                                                                  full/web/thumbs, variants (NN_..._variation_KK), content.json, the repo's
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
`images` reads the vault's images/uploads/ by default (Dinis uploads there; zips are opened safely, images only), takes
any file names (NN_..._variation_KK is variant KK of sticker NN; else a word of the sticker's name, or its number at the
start of the name), prints the mapping for checking, empties images/uploads/ and keeps what matches no sticker in
images/incoming/ (or, with --by-order, fills the numbers left). PNG, JPEG or WebP, any size.

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
CLOSES_AT = '2026-11-05T14:30:00Z'
MAX_RANKING = 10                    # the one number: a ballot ranks up to this many (Dinis, 5 November: "can you allow 10 votes?")
TAGLINE = f'Funny laptop stickers for Web Summit Lisbon, in three sets. The team ranks a top {MAX_RANKING} each: 1st = {MAX_RANKING} points, {MAX_RANKING}th = 1.'
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
    # round 3 (5 November): "creative views on the original stickers" (13 to 18, numbered by their -N suffix; 13 not yet
    # arrived) and the batch "focused on the RiskMandate gap" (19 to 24). Names from the words on the art.
    (13, 'creative-1', 'Creative take 1', 'Still on its way.', '', 'square', '#1A7F5A', '#F7F6F2', '#F2C230'),
    (14, 'rooster-root-access', 'Root access? Absolutely clucking not', 'A Barcelos rooster in sunglasses guards the giant key; the little robot asks nicely anyway.', 'ROOT ACCESS? ABSOLUTELY CLUCKING NOT.', 'square', '#161615', '#F2C230', '#C8553D'),
    (15, 'summary-machine', 'I asked for a summary', 'One small request, and the robot built a whole steam-powered city to answer it.', 'I ASKED FOR A SUMMARY. ENTHUSIASM IS NOT A MANDATE.', 'square', '#B45309', '#F7F6F2', '#1D4ED8'),
    (16, 'tiny-tram-scope-creep', 'Next stop: scope creep', 'A tram 28 that keeps adding carriages: servers, databases, the filing cabinets.', 'NEXT STOP: SCOPE CREEP.', 'square', '#F2C230', '#161615', '#1A7F5A'),
    (17, 'booked-a-table', 'I said book a table', 'Asked for dinner for two, the eight-armed robot also bought the restaurant, a tram and a yacht.', 'I SAID BOOK A TABLE.', 'square', '#C8553D', '#F7F6F2', '#1A7F5A'),
    (18, 'fado-robot', 'It had access. It had no mandate', 'A fado for the robot who could, and did, with the audit trail sung in full.', 'IT HAD ACCESS. IT HAD NO MANDATE.', 'square', '#161615', '#F7F6F2', '#C8553D'),
    (19, 'one-screw', 'One screw. Why the flamethrower?', 'Mandate: tighten one screw. Reach: the whole toolbox, rocket included.', 'ONE SCREW. WHY THE FLAMETHROWER?', 'square', '#1D4ED8', '#F7F6F2', '#F2C230'),
    (20, 'the-key-situation', 'Please only use the small key', 'The mandate is one pastel de nata; the key ring opens the rest of Lisbon.', 'PLEASE ONLY USE THE SMALL KEY.', 'square', '#1D4ED8', '#F7F6F2', '#F2C230'),
    (21, 'permissions-iceberg', 'Seems like a small task', 'Reply to one email, says the tip; payroll and the admin consoles wait below the waterline.', 'SEEMS LIKE A SMALL TASK.', 'square', '#1D4ED8', '#F7F6F2', '#5FD4C8'),
    (22, 'hope-driven-development', 'Hope-driven development', 'An octopus with every key and a sticky note that says be good. That is the security control.', 'OUR SECURITY CONTROL IS A STICKY NOTE.', 'square', '#C8553D', '#F7F6F2', '#F2C230'),
    (23, 'scope-creep-theme-park', 'One ride. All-access pass', 'The mandate is the carousel; the pass opens the whole park, haunted servers included.', 'ONE RIDE. ALL-ACCESS PASS. WHAT COULD POSSIBLY GO WRONG?', 'square', '#1A7F5A', '#F7F6F2', '#F2C230'),
    (24, 'three-bullet-points', 'I asked for three bullet points', 'Three bullets asked for, one giant robot city delivered.', 'I ASKED FOR THREE BULLET POINTS. THE REST IS RUNNING ON HOPE.', 'square', '#1D4ED8', '#F2C230', '#161615'),
]
MAX_ID = len(STICKERS)
GROUPS = [(1, 12, 'road-trip', 'The road trip'), (13, 18, 'creative', 'Creative takes'), (19, 24, 'gap', 'The gap')]
group_of = lambda n: next(g for g in GROUPS if g[0] <= n <= g[1])


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

def process(ctx, s, src, suffix=''):
    """One sticker: the original kept as given (renamed), a 1600 px WebP for the lightbox, a 480 px WebP for the grid."""
    from PIL import Image, ImageOps
    Image.MAX_IMAGE_PIXELS = None                                     # the originals may be large (about 60 MB for twelve)
    n, slug = s[0], s[1]
    nn = f'{n:02d}'
    ext = os.path.splitext(src)[1].lower().replace('.jpeg', '.jpg')
    for old in glob.glob(os.path.join(ctx.vault, f'images/full/{nn}-{slug}{suffix}.*')): os.remove(old)
    full = f'images/full/{nn}-{slug}{suffix}{ext}'
    os.makedirs(os.path.join(ctx.vault, 'images/full'), exist_ok=True)
    shutil.copyfile(src, os.path.join(ctx.vault, full))
    im = ImageOps.exif_transpose(Image.open(src))
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') and ('A' in im.mode or 'transparency' in im.info) else 'RGB')
    w, h = im.size
    out = {}
    for kind, px, q in (('web', 1600, 82), ('thumbs', 480, 70)):
        rel = f'images/{kind}/{nn}-{slug}{suffix}.webp'
        os.makedirs(os.path.join(ctx.vault, f'images/{kind}'), exist_ok=True)
        c = im.copy(); c.thumbnail((px, px), Image.LANCZOS); c.save(os.path.join(ctx.vault, rel), 'WEBP', quality=q, method=6)
        out[kind] = rel
    repo_thumb = os.path.join(ctx.root, f'assets/stickers/vote/{nn}-{slug}{suffix}.webp')
    os.makedirs(os.path.dirname(repo_thumb), exist_ok=True)
    shutil.copyfile(os.path.join(ctx.vault, out['thumbs']), repo_thumb)
    return {'full': full, 'web': out['web'], 'thumb': out['thumbs'], 'w': w, 'h': h, 'bytes': os.path.getsize(src)}

def content(ctx, files, placeholder_ids, variants=None):
    """files: {id: one image}; variants: {id: [image, ...]} (the first is the face). Both replace what content.json had."""
    variants = variants or {}
    old = {}
    p = os.path.join(ctx.vault, 'content.json')
    if os.path.exists(p): old = {x['id']: x for x in json.load(open(p)).get('stickers', [])}
    items = []
    for s in STICKERS:
        n, slug, name, joke, words, shape, bg, fg, acc = s
        o = old.get(n, {})
        if n > 12 and n not in files and n not in variants and not o.get('full'): continue      # no art yet: not in the vote
        vs = [{'v': k + 1, **v} for k, v in enumerate(variants[n])] if n in variants else (None if n in files else o.get('variants'))
        f = files.get(n) or (dict(variants[n][0]) if n in variants else {k: o.get(k) for k in ('full', 'web', 'thumb', 'w', 'h', 'bytes')})
        ph = (n in placeholder_ids) if (n in files or n in variants) else o.get('placeholder', True)
        item = {'id': n, 'nn': f'{n:02d}', 'slug': slug, 'name': name, 'joke': joke, 'words': words, 'shape': shape, 'group': group_of(n)[2], 'group_title': group_of(n)[3],
                'colour': bg, 'ink': fg, 'accent': acc, 'placeholder': ph, **{k: f.get(k) for k in ('full', 'web', 'thumb', 'w', 'h', 'bytes')}}
        if vs: item['variants'] = vs
        items.append(item)
    c = {'title': 'Pick the sticker', 'tagline': TAGLINE, 'closes_at': CLOSES_AT, 'vote_page': SITE_PAGE, 'max_ranking': MAX_RANKING,
         'groups': [{'id': g[2], 'title': g[3], 'from': g[0], 'to': g[1]} for g in GROUPS], 'stickers': items}
    wjson(p, c)
    return c


# ---------- the vault app ----------
def build_app(ctx, c=None):
    c = c or json.load(open(os.path.join(ctx.vault, 'content.json')))
    if c.get('tagline') != TAGLINE or c.get('max_ranking') != MAX_RANKING: c['tagline'] = TAGLINE; c['max_ranking'] = MAX_RANKING; wjson(os.path.join(ctx.vault, 'content.json'), c)
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


def site_stickers(ctx):
    """The stickers as the site page shows them (data/stickers-vote.json), from the vault's content.json: thumbnails in
    assets/stickers/vote/ (a sticker with variants shows v1 first), the group headings, the placeholder flag."""
    items = json.load(open(os.path.join(ctx.vault, 'content.json'))).get('stickers', [])
    out = []
    for x in items:
        base = f"assets/stickers/vote/{x['nn']}-{x['slug']}"
        item = {k: x[k] for k in ('id', 'nn', 'slug', 'name', 'joke', 'words') if k in x}
        item.update(group=group_of(x['id'])[2], group_title=group_of(x['id'])[3], placeholder=x.get('placeholder', True),
                    thumb=f'{base}-v1.webp' if x.get('variants') else f'{base}.webp')
        if x.get('variants'): item['variants'] = [{'v': v['v'], 'thumb': f"{base}-v{v['v']}.webp"} for v in x['variants']]
        out.append(item)
    return out

def write_site_data(ctx):
    """Refresh the stickers in data/stickers-vote.json without touching the lanes (re-issuing lanes makes writes 404 for minutes)."""
    p = os.path.join(ctx.root, 'data/stickers-vote.json')
    d = json.load(open(p)); d['stickers'] = site_stickers(ctx); d['max_ranking'] = MAX_RANKING; d['updated'] = now()
    wjson(p, d)


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
    out = {'about': 'The team sticker vote (WS-167, admin/tools/stickers_vote.py). One append lane per team person with a site key; each lane token is sealed to that person (ws-ecies-1, data/person-keys.json), so only their browser opens it. Votes are signed by the person, sealed to drain_public_key (sgit hybrid v2) and written to their lane. The read key is published on purpose (Dinis): it renders the vault and lets anyone list who has a vote waiting, never what they chose.',
           'agent': AGENT, 'updated': now(), 'closes_at': CLOSES_AT, 'max_ranking': MAX_RANKING,
           'endpoint': ctx.host, 'vault_id': ctx.vid, 'read_key': ctx.c['read_key_public'],
           'vault_url': f"{VIEWER}#{ctx.c['read_key_public']}:{ctx.vid}",
           'drain_public_key': bundle['encrypt'], 'drain_fingerprint': bundle['fingerprint'],
           'stickers': site_stickers(ctx),
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
    ballot(vote)                                                        # the shape first: v1 (one choice) or v2 (a ranked top 10)
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
    ok = lambda x: isinstance(x, int) and not isinstance(x, bool) and 1 <= x <= MAX_ID
    t = vote.get('type')
    if t == 'web-summit.sticker-vote/v1':
        if not ok(vote.get('choice')): raise ValueError(f'choice is not 1 to {MAX_ID}')
        return [vote['choice']], []
    if t != 'web-summit.sticker-vote/v2': raise ValueError('not a sticker vote')
    rk, nf = vote.get('ranking'), vote.get('not_for_me', [])
    # round 5: fixed slots, so a ranking may hold gaps (null) between picks; a dense list from earlier is still valid
    picks = [x for x in rk if x is not None] if isinstance(rk, list) else []
    if not isinstance(rk, list) or not 1 <= len(rk) <= MAX_RANKING or not picks or not all(x is None or ok(x) for x in rk) or len(set(picks)) != len(picks):
        raise ValueError(f'ranking is not up to {MAX_RANKING} slots of distinct stickers (empty slots null)')
    if not isinstance(nf, list) or not all(map(ok, nf)) or len(set(nf)) != len(nf) or set(nf) & set(picks): raise ValueError('not_for_me is not a list of other stickers')
    vp = vote.get('variant_pick', {})                                  # optional: {"12": 2}, the voter's favourite variant of a sticker
    if not isinstance(vp, dict) or not all(re.fullmatch(r'[1-9]\d?', str(k)) and int(k) <= MAX_ID and isinstance(v, int) and not isinstance(v, bool) and 1 <= v <= 20 for k, v in vp.items()):
        raise ValueError('variant_pick is not a map of sticker to variant')
    return rk, nf

def tally(ballots, picks=(), present=None):
    """Borda: 1st = MAX_RANKING points, 2nd one less ... (a top 10: 10 down to 1). Every ballot is scored by position with
    the same rule, so an older top 6 scores 10 to 5 and a v1 pick 10. Plus how many put each in their top (in_top), firsts,
    not for me; and the hearts
    each variant of a sticker got (variant_hearts: {"2": 3})."""
    t = {s[0]: {'id': s[0], 'name': s[2], 'points': 0, 'in_top': 0, 'firsts': 0, 'not_for_me': 0} for s in STICKERS}
    for rk, nf in ballots:
        for i, n in enumerate(rk):                                      # by slot: slot 1 = MAX_RANKING ... an empty slot scores nothing
            if n is None or n not in t: continue
            t[n]['points'] += MAX_RANKING - i; t[n]['in_top'] += 1; t[n]['firsts'] += (i == 0)
        for n in nf: t[n]['not_for_me'] += 1
    for vp in picks:
        for k, v in vp.items(): h = t[int(k)].setdefault('variant_hearts', {}); h[str(v)] = h.get(str(v), 0) + 1
    t = {n: x for n, x in t.items() if n in present} if present else t   # only the stickers in the vote
    return sorted(t.values(), key=lambda x: (-x['points'], -x['in_top'], x['not_for_me'], x['id']))

def open_envelope(key, content):
    from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
    return json.loads(PKI__Crypto().hybrid_decrypt(key, ub64(content).decode())['plaintext'])

def recount(rows, key, present=None):
    """Newest verified vote per person, received before the close, counts. Choices are counted, never listed."""
    close = CLOSES_AT
    best, late, bad = {}, 0, 0
    for r in rows:
        if not r.get('verified'): bad += 1; continue
        if r['received'] > close: late += 1; continue
        if r['person'] not in best or r['received'] > best[r['person']]['received']: best[r['person']] = r
    votes = [json.loads(open_envelope(key, r['envelope'])['signed']) for r in best.values()]
    ranking = tally([ballot(v) for v in votes], [v.get('variant_pick') or {} for v in votes], present)
    return {'v': 2, 'method': f'Borda: 1st = {MAX_RANKING} points, 2nd = {MAX_RANKING - 1} ... by position, for every ballot (an older top 6 scores {MAX_RANKING} to {MAX_RANKING - 5}; a v1 pick {MAX_RANKING})', 'max_ranking': MAX_RANKING, 'as_of': now(), 'closes_at': close, 'closed': now() >= close, 'voters_count': len(best),
            'counts': {str(x['id']): x['points'] for x in ranking}, 'ranking': ranking, 'leader': ranking[0] if ranking[0]['points'] else None,
            'voters': sorted(({'person': p, 'at': r['received']} for p, r in best.items()), key=lambda x: x['at']),
            'ballots': len(rows), 'changed_votes': sum(1 for r in rows if r.get('verified') and r['received'] <= close) - len(best),
            'late': late, 'rejected': bad, 'drained_by': AGENT + ' (CLI)',
            'note': f'A top {MAX_RANKING} per team person, ranked; a new ballot replaces the earlier one (the newest counts). Ballots stay sealed in votes/: who voted is public, what each person chose is not.'}

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
    res = recount(load_rows(ctx), key, {x['id'] for x in json.load(open(os.path.join(ctx.vault, 'content.json')))['stickers']})
    wjson(os.path.join(ctx.vault, 'results.json'), res)
    ctx.commit_push(f'drain {now()}: {len(new)} ballot(s), {res["voters_count"]} voter(s)')
    for tok, ids in done.items():                                       # only after the push: a failed push loses nothing
        for i in range(0, len(ids), 100): ctx.enum('mark-processed', {'inbox': tok, 'file_ids': ids[i:i + 100]})
    say(f'drained {len(new)} ballot(s) ({findings} rejected), pushed, marked processed; {res["voters_count"]} voter(s) so far')


# ---------- commands ----------
def make_placeholders(ctx):
    d = tempfile.mkdtemp(); files = {}
    for s in STICKERS[:12]:
        p = os.path.join(d, f'{s[0]:02d}-{s[1]}.png'); placeholder(s, p); files[s[0]] = process(ctx, s, p)
    shutil.rmtree(d)
    return content(ctx, files, {s[0] for s in STICKERS[:12]})

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

KEYWORDS = {1: r'road-?trip|patch', 2: r'tram-?ticket|(?<![a-z])ticket', 3: r'azulejo|tile', 4: r'nata|pastel', 5: r'passport|stamp', 6: r'road-?sign|crossing',
            7: r'(?<![a-z])keys?(?![a-z])', 8: r'(?<![a-z])seal(?![a-z])', 9: r'surf', 10: r'hello|name-?is|name-?tag', 11: r'privilege', 12: r'sardine',
            14: r'rooster|root-access', 15: r'summary', 16: r'tiny-tram|scope-creep(?!-theme)', 17: r'book(ed)?-a-table', 18: r'fado',
            19: r'screw|flamethrower', 20: r'key-situation|small-key', 21: r'iceberg', 22: r'hope-driven', 23: r'theme-park', 24: r'bullet-points'}
IMG = ('.png', '.jpg', '.jpeg', '.webp')
ZIP_MAX_FILE, ZIP_MAX_TOTAL, ZIP_MAX_RATIO, ZIP_MAX_FILES = 200 << 20, 1 << 30, 200, 500

def unzip_images(zpath, into):
    """Only image files, flattened to their base names (no path can leave `into`), with limits against zip bombs."""
    import zipfile
    out, total = [], 0
    with zipfile.ZipFile(zpath) as z:
        infos = [i for i in z.infolist() if not i.is_dir()]
        if len(infos) > ZIP_MAX_FILES: die(f'{os.path.basename(zpath)}: more than {ZIP_MAX_FILES} entries')
        for i in infos:
            name = os.path.basename(i.filename.replace('\\', '/'))
            if not name or name.startswith('.') or '__MACOSX' in i.filename or not name.lower().endswith(IMG): continue
            if (i.external_attr >> 16) & 0o170000 == 0o120000: say(f'skipped {i.filename}: a symbolic link'); continue
            if i.file_size > ZIP_MAX_FILE or (i.compress_size and i.file_size / i.compress_size > ZIP_MAX_RATIO): say(f'skipped {i.filename}: too large or too compressed'); continue
            total += i.file_size
            if total > ZIP_MAX_TOTAL: die(f'{os.path.basename(zpath)}: more than {ZIP_MAX_TOTAL >> 20} MB of images')
            dest = os.path.join(into, name)
            while os.path.exists(dest): dest = os.path.join(into, '1-' + os.path.basename(dest))
            with z.open(i) as src, open(dest, 'wb') as dst:
                n = 0
                for chunk in iter(lambda: src.read(1 << 20), b''):   # counts the real bytes, not what the header claims
                    n += len(chunk)
                    if n > ZIP_MAX_FILE: dst.close(); os.remove(dest); die(f'{i.filename}: larger than its header says')
                    dst.write(chunk)
            out.append(dest)
    return out

def map_images(names, by_order=False):
    """({sticker id: file}, {sticker id: [variant files in order]}, [unmatched]). A file named NN_..._variation_KK is
    variant KK of sticker NN. Otherwise its number at the start of the name (or after "sticker" or "#"), then a word of
    the sticker's name (keys, sardine, rooster, fado ...). The rest stay unmatched (or, with by_order, fill the numbers left)."""
    files = sorted((f for f in names if f.lower().endswith(IMG) and not os.path.basename(f).startswith('.')),
                   key=lambda f: [int(x) if x.isdigit() else x.lower() for x in re.split(r'(\d+)', os.path.basename(f))])
    stem = lambda f: re.sub(r'[\s_]+', '-', os.path.splitext(os.path.basename(f))[0].lower())
    got, variants, placed = {}, {}, set()
    known = {x[0] for x in STICKERS}
    for f in files:                                                   # 0. variants: NN_..._variation_KK
        m = re.match(r'^0*(\d{1,2})-.*?variation-?0*(\d+)$', stem(f))
        if m and int(m.group(1)) in known: variants.setdefault(int(m.group(1)), []).append((int(m.group(2)), f)); placed.add(f)
    variants = {n: [f for _, f in sorted(v)] for n, v in variants.items()}
    for f in files:                                                   # 1. a sticker number at the start, or after "sticker" or "#"
        if f in placed: continue                                      #    (never any number: "Access-2" is not sticker 2)
        m = re.match(r'^0*(\d{1,2})(?!\d)', stem(f)) or re.search(r'(?:sticker-?|#)0*(\d{1,2})(?!\d)', stem(f))
        if m and (n := int(m.group(1))) in known and n not in got and n not in variants: got[n] = f; placed.add(f)
    for f in files:                                                   # 2. a word of the sticker's name
        if f in placed: continue
        kw = [n for n, r in KEYWORDS.items() if re.search(r, stem(f))]
        if len(kw) == 1 and kw[0] not in got and kw[0] not in variants: got[kw[0]] = f; placed.add(f)
    for f in files:                                                   # 3. "<Title>-N" from the creative batch: sticker 12 + N
        if f in placed: continue
        m = re.search(r'[a-z].*-([1-6])$', stem(f))
        if m and not re.match(r'^\d', stem(f)) and (n := 12 + int(m.group(1))) not in got and n not in variants: got[n] = f; placed.add(f)
    rest = [f for f in files if f not in placed]
    if by_order:
        free = [s[0] for s in STICKERS if s[0] not in got and s[0] not in variants]
        for n, f in zip(free, rest): got[n] = f; placed.add(f)
        rest = [f for f in files if f not in placed]
    return got, variants, rest

def cmd_images(ctx, o):
    """Process new images: from images/uploads/ in the vault (the default; zips too), or from a folder. Processed files
    leave images/uploads/; files that match no sticker go to images/incoming/ (kept, unprocessed) for the next round."""
    uploads = os.path.join(ctx.vault, 'images/uploads')
    src = os.path.abspath(o.folder) if o.folder else uploads
    tmp = tempfile.mkdtemp(); paths = []
    try:
        for f in sorted(os.listdir(src)):
            p = os.path.join(src, f)
            if not os.path.isfile(p) or os.path.islink(p): continue
            if f.lower().endswith('.zip'): paths += [(x, p) for x in unzip_images(p, tmp)]
            elif f.lower().endswith(IMG): paths.append((p, p))
        origin = dict(paths)
        got, variants, rest = map_images([x for x, _ in paths], by_order=o.by_order)
        if not got and not variants and not rest: die(f'no images in {src}')
        say('the mapping (check it):')
        for n in sorted(set(got) | set(variants)):
            for k, f in enumerate(variants.get(n) or [got[n]]):
                say(f"  {n:2d} {STICKERS[n - 1][2][:30]:<30}{' v' + str(k + 1) if n in variants else '   '} <- {os.path.basename(f)}")
        for f in rest: say(f'  -- not matched, kept in images/incoming/: {os.path.basename(f)}')
        processed = {n: process(ctx, STICKERS[n - 1], f) for n, f in got.items()}
        var = {n: [process(ctx, STICKERS[n - 1], f, f'-v{k + 1}') for k, f in enumerate(fs)] for n, fs in variants.items()}
        for n in var:                                                 # the face is v1; the single image it replaces goes
            for old in glob.glob(os.path.join(ctx.root, f'assets/stickers/vote/{n:02d}-{STICKERS[n - 1][1]}.webp')): os.remove(old)
            for kind in ('full', 'web', 'thumbs'):
                for old in glob.glob(os.path.join(ctx.vault, f'images/{kind}/{n:02d}-{STICKERS[n - 1][1]}.*')): os.remove(old)
        if rest:
            os.makedirs(os.path.join(ctx.vault, 'images/incoming'), exist_ok=True)
            for f in rest:
                dest = os.path.join(ctx.vault, 'images/incoming', re.sub(r'[^a-z0-9.]+', '-', os.path.basename(f).lower()).strip('-'))
                shutil.copyfile(f, dest)
        if src == uploads:                                            # empty the upload folder, keep it (and its README)
            for _, p in paths:
                if os.path.exists(p): os.remove(p)
        c = content(ctx, processed, set(), var)
        build_app(ctx, c)
        write_site_data(ctx)
        n_img = len(processed) + sum(len(v) for v in var.values())
        ctx.commit_push(f'images: {n_img} processed ({", ".join(str(n) for n in sorted(set(got) | set(var)))}), {len(rest)} kept in images/incoming/')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    say(f"Done. Now commit assets/stickers/vote/ and data/stickers-vote.json in the site repository and release (AGENT={AGENT} admin/tools/release.sh).")

def cmd_app(ctx, o): build_app(ctx); write_site_data(ctx); ctx.commit_push('the app rebuilt')
def cmd_lanes(ctx, o): lanes(ctx); ctx.commit_push('the lanes re-issued')
def cmd_drain(ctx, o): drain(ctx, dry=o.dry)
def cmd_status(ctx, o): drain(ctx, dry=True)

def cmd_seal_drainers(ctx, o):
    stamp = time.strftime('%Y-%m-%dT%H%MZ', time.gmtime())
    for pid in (o.person or DRAINERS):
        out = os.path.join(ctx.root, f'data/sealed/{pid}/{stamp}-stickers-vault-key.json')
        seal_to(ctx, pid, {'title': 'The sticker vote: the vault key, so you can drain the votes',
                           'text': f'This is the vault key of {VAULT_NAME} ({ctx.vid}), the team sticker vote (WS-167), and the passphrase of its drain key. It lets you drain the votes inside the vault: open https://dev.vault.sgraph.ai/#<the vault key below>, add the SG/Send access token in the vault host (the lock button) so the vault is writable, scroll to Drain the votes, paste the drain passphrase and press Drain. It also gives full write access to the vault, so use it only for that, and keep it in your password manager. Votes close Thursday 5 November, 18:00 UTC. From {AGENT}.',
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
    p = sub.add_parser('images'); p.add_argument('folder', nargs='?', help='default: images/uploads/ in the vault')
    p.add_argument('--by-order', action='store_true', help='files that match no sticker fill the numbers left, in order')
    p = sub.add_parser('drain'); p.add_argument('--dry', action='store_true')
    p = sub.add_parser('purge'); p.add_argument('--person', required=True)
    o = a.parse_args()
    {'setup': cmd_setup, 'images': cmd_images, 'app': cmd_app, 'lanes': cmd_lanes, 'drain': cmd_drain, 'status': cmd_status,
     'seal-drainers': cmd_seal_drainers, 'purge': cmd_purge, 'placeholders': cmd_placeholders}[o.cmd](Ctx(o), o)

if __name__ == '__main__':
    main()
