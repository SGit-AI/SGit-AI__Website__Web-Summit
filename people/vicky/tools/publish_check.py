#!/usr/bin/env python3
"""publish_check.py: the reviewer's file checks when publishing an article from Vicky's desks.

Vicky, 18 November 2026 (conductor's audit): "Build draft-lint and publish-check in our own tools folder. Reuse
validate.js checks where possible, only add what it doesn't cover." Run it after the article is in content/articles/
and its cover is wired, before release.sh. release.sh then runs the newsroom's gate (newsroom/build/validate.js),
which already checks: title, date, author, summary and license present, title under 12 words, no em-dash in content/,
the signature, every internal link, no keys or contact details. This script does not repeat those. It checks:

  categories   the article has its entry in desks/curator/categories.json (runs newsroom/tools/categories-check.mjs)
  ai fields    ai_connection, ai_steps (0 to 3) and ai_places in the front matter, and no "Notes for the reviewer"
               block left in the text (standing answers 81, 90, 91)
  approval     the draft with the same story id has status approved or published (STYLE "Status"; R-PUB-1 records
               the approval in the draft; enforced at Vicky's word, 18 November 2026)
  cover        image: points to design/infographics/out/<slug>--paper--card.png; the four PNGs
               <slug>--{paper,ink}--{card,thumb}.png exist; index.json has their four rows, each "auto": false with a
               "hand" block; image_alt present, with no semicolon or em-dash; the body image is directly under
               "## The story" (an interview: under its first heading) with a ?v= query
               (desks/reviewer-vicky/covers/STYLE.md; standing answers 50, 82)
  figures      analysis pieces only: every "checked on <date>" in the data note (desks/analyst-vicky/data/) is at
               most 7 days old, or the piece goes back to the analyst (standing answer 86)

The adjustable values (ai_steps range, figure age, which statuses allow publishing) are in lint_rules.yaml beside
this file (Vicky, 18 November 2026), the one place they live.

Usage, in the newsroom clone:
  python3 -I <team-site>/people/vicky/tools/publish_check.py <slug> [--root <newsroom clone>] [--today YYYY-MM-DD]
Exit 0: everything passes. Exit 1: something fails (each failure printed). Exit 2: usage.
Read only: it never changes a file. The judgment calls (facts at source, tone, the PrompTugal test's substance,
the cover's look at 390 px) stay the reviewer's.
"""
import datetime
import glob
import json
import os
import re
import subprocess
import sys

try:
    import yaml
except ImportError:
    yaml = None

RULES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lint_rules.yaml')
if yaml is None:
    sys.exit('publish_check: PyYAML is needed to read lint_rules.yaml (pip install pyyaml)')
with open(RULES_FILE, encoding='utf-8') as _f:
    R = yaml.safe_load(_f)  # the adjustable values (Vicky, 18 Nov 2026): one file for both scripts
STEPS = tuple(R['ai_steps'])
MAX_AGE = int(R['figures_max_age_days'])
PUBLISH_OK = set(R['publish_ok'])

MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
          'november', 'december']


def front(path):
    t = open(path, encoding='utf-8').read().replace('\r', '')
    m = re.match(r'^---\n(.*?)\n---\n?(.*)$', t, re.S)
    if not m:
        return None, {}, t
    fm = {}
    if yaml:
        try:
            fm = yaml.safe_load(m.group(1)) or {}
        except yaml.YAMLError:
            fm = None
    return m.group(1), fm, m.group(2)


def date_of(s):
    m = re.match(r'(\d{1,2}) ([A-Za-z]+)\.? (\d{4})', s)
    if not m:
        return None
    mon = m.group(2).lower()
    for i, name in enumerate(MONTHS, 1):
        if name.startswith(mon[:3]):
            return datetime.date(int(m.group(3)), i, int(m.group(1)))
    return None


def check(root, slug, today):
    fails, notes, warns = [], [], []
    art = os.path.join(root, 'content/articles', slug + '.md')
    if not os.path.exists(art):
        return ['no article file content/articles/%s.md' % slug], []
    fm_text, fm, body = front(art)
    if fm is None:
        return ['front matter is not valid YAML'], []
    if yaml is None:
        notes.append('PyYAML is not installed: front matter read by pattern only')

    # categories: reuse the newsroom's own tool
    tool = os.path.join(root, 'newsroom/tools/categories-check.mjs')
    if os.path.exists(tool):
        r = subprocess.run(['node', tool, slug], cwd=root, capture_output=True, text=True)
        if r.returncode:
            fails.append((r.stderr or r.stdout).strip())
        else:
            notes.append(r.stdout.strip())
    else:
        fails.append('newsroom/tools/categories-check.mjs not found')

    # the AI connection
    def field(k):
        if fm:
            return fm.get(k)
        m = re.search(r'^%s:\s*(.+)$' % k, fm_text or '', re.M)
        return m.group(1).strip('"\'') if m else None
    for k in ('ai_connection', 'ai_steps', 'ai_places'):
        if field(k) in (None, ''):
            fails.append('front matter has no %s (standing answer 91)' % k)
    st = field('ai_steps')
    if st not in (None, '') and not (re.match(r'^\d+$', str(st).strip()) and STEPS[0] <= int(str(st).strip()) <= STEPS[1]):
        fails.append('ai_steps is "%s"; it is a number from %d to %d (standing answer 81)' % (st, STEPS[0], STEPS[1]))
    if re.search(r'^## Notes for the reviewer', body, re.M):
        fails.append('the "Notes for the reviewer" block is still in the text: move it to the front matter (standing answer 91)')

    # approval recorded in the draft
    story = str(field('story') or '')
    if story:
        drafts = [d for d in glob.glob(os.path.join(root, 'desks/*-vicky/drafts/*.md'))
                  if re.search(r'^story:\s*"?%s"?\s*$' % re.escape(story), open(d, encoding='utf-8').read(), re.M)]
        if not drafts:
            notes.append('no draft with story %s found in desks/*-vicky/drafts/' % story)
        for d in drafts:
            s = re.search(r'^status:\s*(\S+)', open(d, encoding='utf-8').read(), re.M)
            if not s or s.group(1) not in PUBLISH_OK:
                fails.append('draft %s has status %s: record the approval in the draft first (status: approved; Vicky, 18 Nov 2026)'
                             % (os.path.relpath(d, root), s.group(1) if s else 'none'))
    else:
        notes.append('no story id in the front matter: approval not checked')

    # the cover
    out = os.path.join(root, 'design/infographics/out')
    want = ['%s--%s--%s.png' % (slug, t, s) for t in ('paper', 'ink') for s in ('card', 'thumb')]
    for f in want:
        if not os.path.exists(os.path.join(out, f)):
            fails.append('cover file missing: design/infographics/out/' + f)
    image = str(field('image') or '')
    if not image.endswith('/design/infographics/out/%s--paper--card.png' % slug):
        fails.append('image: should point to design/infographics/out/%s--paper--card.png (it is "%s")' % (slug, image))
    alt = str(field('image_alt') or '')
    if not alt:
        fails.append('no image_alt in the front matter')
    elif ';' in alt or '\u2014' in alt:
        fails.append('image_alt has a semicolon or an em-dash')
    try:
        idx = json.load(open(os.path.join(out, 'index.json'), encoding='utf-8'))
        rows = [r for r in (idx.get('images') or idx.get('rows') or idx.get('items') or
                            next((v for v in idx.values() if isinstance(v, list) and v and isinstance(v[0], dict) and 'file' in v[0]), []))
                if r.get('slug') == slug]
        files = {r.get('file') for r in rows}
        for f in want:
            if f not in files:
                fails.append('index.json has no row for ' + f)
        for r in rows:
            if r.get('auto') is not False or not isinstance(r.get('hand'), dict):
                fails.append('index.json row %s needs "auto": false and a "hand" block' % r.get('file'))
    except (OSError, ValueError) as e:
        fails.append('design/infographics/out/index.json not readable: %s' % e)
    m = re.search(r'^## [^\n]+\n+(.*)', body[body.find('## The story'):] if '## The story' in body else body, re.S)
    first = (m.group(1).lstrip().split('\n', 1)[0] if m else '')
    if not first.startswith('!['):
        fails.append('no image directly under "## The story" (standing answer 50)')
    elif '--paper--card.png' in first and not re.search(r'%s--paper--card\.png\?v=' % re.escape(slug), first):
        fails.append('the cover image under "## The story" has no ?v= query (covers STYLE.md)')
    elif '--paper--card.png' not in first:
        notes.append('the image under "## The story" is not the cover (an analysis chart?): fine if intended')

    # dated figures, analysis only
    if str(field('beat') or '').lower() == 'analysis':
        dn = os.path.join(root, 'desks/analyst-vicky/data', slug + '.md')
        cands = [dn] + glob.glob(os.path.join(root, 'desks/analyst-vicky/data', '%s*.md' % story.lower()))
        dn = next((c for c in cands if os.path.exists(c)), None)
        if not dn:
            fails.append('analysis piece: no data note found in desks/analyst-vicky/data/ (standing answer 86)')
        else:
            old = []
            for s in re.findall(r'checked on (\d{1,2} [A-Za-z]+\.? \d{4})', open(dn, encoding='utf-8').read(), re.I):
                d = date_of(s)
                if d and (today - d).days > MAX_AGE:
                    old.append(s)
            if old:
                fails.append('%d figure(s) in %s checked more than %d days ago (%s): re-check them at source; '
                             'if one changed, the piece goes back to the analyst (standing answer 86)'
                             % (len(old), os.path.relpath(dn, root), MAX_AGE, ', '.join(sorted(set(old)))))
            else:
                notes.append('figures: every "checked on" date in the data note is %d days old or less' % MAX_AGE)
    return fails, warns + notes


def main(argv):
    args = [a for a in argv if not a.startswith('--')]
    opts = dict(zip(argv[::1], argv[1::1]))
    if not args:
        print(__doc__.split('\n\n')[-2]); return 2
    root = os.path.abspath(opts.get('--root', '.'))
    today = datetime.date.fromisoformat(opts['--today']) if '--today' in opts else datetime.date.today()
    slug = re.sub(r'\.(md|html)$', '', args[0].rsplit('/', 1)[-1])
    if '--root' in opts:
        args = [a for a in args if a != opts['--root']]
    if '--today' in opts:
        args = [a for a in args if a != opts['--today']]
    fails, notes = check(root, slug, today)
    print('%s publish-check %s' % ('FAIL' if fails else 'OK', slug))
    for f in fails:
        print('  fail: ' + f)
    for n in notes:
        print('  ' + n if n.startswith('warn: ') else '  note: ' + n)
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
