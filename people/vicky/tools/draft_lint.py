#!/usr/bin/env python3
"""draft_lint.py: the mechanical checks on a draft from Vicky's desks, before review.

Vicky, 18 November 2026 (conductor's audit): "Build draft-lint and publish-check in our own tools folder. Reuse
validate.js checks where possible, only add what it doesn't cover." The newsroom's gate (newsroom/build/validate.js)
skips every file with status: draft, so it never sees a draft; this script does, and nothing else. It checks only what
is right or wrong by rule; facts, tone, angle and the PrompTugal test stay the reviewer's judgment.

Rules, with where they come from (desks/journalist-vicky/STYLE.md in the newsroom; standing answers in
people/vicky/decisions.md on the team site):
  front matter: valid YAML (reviewer rule, 5 Nov); fields title, date, story, author, summary, status, beat, license,
    tags, in that order (STYLE "Match the published format"); status one of seven (STYLE "Status");
    title under 12 words (brief 8, rule 6: the gate checks it again on publish)
  body: no "# Title" line; "In short" with 3 to 5 bullets, "The story", "What this does not claim",
    "Where this comes from" (STYLE "Format"); no em-dash (STYLE "Style"); the spelling PrompTugal (newsroom CLAUDE.md)
  sources: each line "- [Publisher, "Title"](url) ..., read D Month YYYY", or "- Tried and not reached: ...", or
    "- From the curator's map: ..."; never <url> (STYLE; standing answer 9)
  images: alt text present; the first image directly under "## The story" with its caption under it (standing
    answer 50); files in drafts/img/ named <story>-<what>-<YYYY-MM-DD>.<ext> (STYLE "Images")
  the AI connection: a "Notes for the reviewer" block with ai_connection, ai_steps (0 to 3) and ai_places
    (standing answers 90 and 91; the analyst's pieces keep it in their data note, so not checked there)
  update notes (a draft with "updates:" in its front matter): a quote block starting **Update, D Month YYYY.**,
    no semicolons (standing answer 95)
  warnings only (the reviewer judges): length outside 300 to 700 (news) or 400 to 900 (analysis), counted from
    "In short" to the end of "What this does not claim" (standing answer 92); semicolons; STYLE's filler words;
    sentences ending in a trailing ", -ing" clause (standing answer 60)

The adjustable values (word limits, title limit, bullets, banned words, statuses, ai_steps, the spelling) are not in
this file: they are in lint_rules.yaml beside it (Vicky, 18 November 2026), the one place they live.

Usage (from anywhere; paths are files in the newsroom clone):
  python3 -I people/vicky/tools/draft_lint.py <draft.md> [<draft.md> ...] [--json]
Exit 0: no errors (warnings may be printed). Exit 1: at least one error. Exit 2: usage.
Read only: it never changes a file.
"""
import json
import os
import re
import sys

try:
    import yaml
except ImportError:  # the reviewer's sessions have PyYAML (it parses front matter with yaml.safe_load since 5 Nov)
    yaml = None

RULES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lint_rules.yaml')


def load_rules():
    """The adjustable values (word limits, title limit, banned words, statuses) live in lint_rules.yaml (Vicky, 18 Nov)."""
    if yaml is None:
        sys.exit('draft_lint: PyYAML is needed to read lint_rules.yaml (pip install pyyaml)')
    with open(RULES_FILE, encoding='utf-8') as f:
        return yaml.safe_load(f)


R = load_rules()
FIELDS = list(R['front_matter_order'])
STATUSES = set(R['statuses'])
SECTIONS = ['## ' + x for x in R['sections']]
FILLER = list(R['banned_words'])
NEWS, ANALYSIS = tuple(R['length']['news']), tuple(R['length']['analysis'])
TITLE_MAX = int(R['title_max_words'])
BULLETS = tuple(R['in_short_bullets'])
STEPS = tuple(R['ai_steps'])
SPELLING = R['spelling']
ING_OK = list(R['trailing_ing_allowed'])
MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'
READ = re.compile(r'read \d{1,2} (%s) \d{4}' % MONTHS)
LINK = re.compile(r'!?\[([^\]]*)\]\(([^)\s]+)[^)]*\)')


def split(text):
    m = re.match(r'^---\n(.*?)\n---\n?(.*)$', text, re.S)
    return (m.group(1), m.group(2)) if m else (None, text)


def section(body, head):
    """The text under a '## head' heading, up to the next '## ' heading."""
    m = re.search(r'^%s\s*$(.*?)(?=^## |\Z)' % re.escape(head), body, re.M | re.S)
    return m.group(1) if m else None


def prose(body):
    """Body text without code, links' targets and source lines: what a reader reads."""
    t = re.sub(r'```.*?```', '', body, flags=re.S)
    t = re.sub(r'`[^`]*`', '', t)
    t = re.sub(r'\]\([^)]*\)', ']', t)
    t = re.sub(r'https?://\S+', '', t)
    return t


def words(text):
    t = re.sub(r'!\[[^\]]*\]', '', prose(text))
    return len(re.findall(r"[A-Za-zÀ-ÿ0-9€%][\w'’€%.,-]*", t))


def lint(path):
    errors, warnings = [], []
    text = open(path, encoding='utf-8').read().replace('\r', '')
    fm_text, body = split(text)
    name = os.path.basename(path)
    analysis = '/analyst-vicky/' in path.replace(os.sep, '/')

    # front matter
    fm = {}
    if fm_text is None:
        errors.append('no front matter (--- ... --- at the top)')
    else:
        if yaml is None:
            warnings.append('PyYAML is not installed: front matter not parsed as YAML')
        else:
            try:
                fm = yaml.safe_load(fm_text) or {}
                if not isinstance(fm, dict):
                    errors.append('front matter is not a set of fields'); fm = {}
            except yaml.YAMLError as e:
                errors.append('front matter is not valid YAML (a value with a colon goes in double quotes): %s'
                              % str(e).splitlines()[0])
        keys = [k for k in re.findall(r'^([A-Za-z_]+):', fm_text, re.M)]
        missing = [k for k in FIELDS if k not in keys]
        if missing:
            errors.append('front matter has no ' + ', '.join(missing))
        order = [k for k in keys if k in FIELDS]
        if not missing and order != FIELDS:
            errors.append('front matter order should be ' + ', '.join(FIELDS) + ' (it is ' + ', '.join(order) + ')')
        status = str(fm.get('status', re.search(r'^status:\s*(\S+)', fm_text, re.M).group(1)
                     if re.search(r'^status:\s*(\S+)', fm_text, re.M) else '')).strip()
        if status and status not in STATUSES:
            errors.append('status "%s" is not one of %s' % (status, ', '.join(sorted(STATUSES))))
        title = str(fm.get('title', '')) if fm else (re.search(r'^title:\s*(.+)$', fm_text, re.M) or [None, ''])[1]
        n = len(str(title).strip('"\'').split())
        if n > TITLE_MAX and not re.search(r'^updates:', fm_text, re.M):
            errors.append('title has %d words; the rule is at most %d (lint_rules.yaml)' % (n, TITLE_MAX))

    update = bool(fm.get('updates')) if fm else bool(fm_text and re.search(r'^updates:', fm_text, re.M))

    # whole text
    for i, line in enumerate(text.split('\n'), 1):
        if '\u2014' in line:
            errors.append('line %d: em-dash' % i)
    for m in re.finditer(r'(?<![@./\w-])%s(?![./\w-])' % re.escape(SPELLING), prose(body), re.I):
        if m.group(0) != SPELLING:
            errors.append('"%s": the one spelling is %s' % (m.group(0), SPELLING))
    if re.search(r'<https?://', body):
        errors.append('a source written as <url>: write it as a link, [Publisher, "Title"](url)')

    if update:
        q = re.search(r'^> \*\*Update, \d{1,2} (%s) \d{4}\.\*\*' % MONTHS, body, re.M)
        if not q:
            errors.append('update note: no quote block starting **Update, D Month YYYY.** (standing answer 95)')
        note = '\n'.join(l for l in body.split('\n') if l.startswith('>'))
        if ';' in prose(note):
            errors.append('update note: a semicolon (standing answer 95: no semicolons)')
        # standing answer 95: the intro line says what changed "and giving the source, linked, with its date"
        # (reviewer's suggestion, Vicky's go, 18 Nov 2026). The intro is the note's first paragraph; its source is a
        # link to an outside page (a link to one of our own articles is not the source).
        if q:
            intro = []
            for l in body[q.start():].split('\n'):
                if not l.startswith('>') or l.strip() == '>':
                    break
                intro.append(l)
            links = [u for u in re.findall(r'\]\((https?://[^)\s]+)', '\n'.join(intro))
                     if not re.match(r'https?://([\w-]+\.)*promptugal\.news/', u, re.I)]
            if not links:
                errors.append('update note: the intro line does not link its source (an outside page, with its date; '
                              'standing answer 95)')
    else:
        if re.search(r'^# ', body, re.M):
            errors.append('a "# Title" line in the body: the page takes its title from the front matter')
        for s in SECTIONS:
            if not re.search(r'^%s\s*$' % re.escape(s), body, re.M):
                errors.append('no "%s" section' % s[3:])
        short = section(body, '## In short')
        if short is not None:
            b = len(re.findall(r'^- ', short, re.M))
            if not BULLETS[0] <= b <= BULLETS[1]:
                errors.append('"In short" has %d bullets; the rule is %d to %d (lint_rules.yaml)' % (b, BULLETS[0], BULLETS[1]))
        if re.search(r'^## Who made this', body, re.M):
            errors.append('a "Who made this" section: the publisher adds it')

        # sources
        src = section(body, '## Where this comes from')
        if src is not None:
            for line in src.split('\n'):
                if not line.startswith('- '):
                    continue
                if line.startswith('- Tried and not reached') or line.startswith("- From the curator's map") or line.startswith("- From the analyst's topics"):
                    continue
                if not re.match(r'- \[[^\]]+\]\(https?://', line):
                    errors.append('source line is not a link [Publisher, "Title"](url): ' + line[:70])
                elif not READ.search(line):
                    errors.append('source line has no "read D Month YYYY": ' + line[:70])

        # images
        story = section(body, '## The story')
        imgs = list(re.finditer(r'!\[([^\]]*)\]\(([^)\s]+)', body))
        for m in imgs:
            if not m.group(1).strip():
                errors.append('an image has no alt text: ' + m.group(2)[:60])
            f = m.group(2).split('?')[0].rsplit('/', 1)[-1]
            if '/drafts/img/' in m.group(2) and not re.match(r'^[A-Za-z]?\d*[\w]*-.+-\d{4}-\d{2}-\d{2}\.(png|svg|webp|jpe?g)$', f):
                warnings.append('image file name is not <story>-<what>-<YYYY-MM-DD>.<ext>: ' + f)
        if imgs and story is not None:
            lines = [l for l in story.split('\n') if l.strip()]
            if not lines or not lines[0].startswith('!['):
                errors.append('the main image is not directly under "## The story" (standing answer 50)')
            elif len(lines) < 2 or not re.match(r'^\*[^*].*\*$', lines[1].strip()):
                warnings.append('no one-line caption (*...*) directly under the main image')

        # the AI connection (standing answers 90, 91): journalists only; the analyst keeps it in its data note
        if not analysis:
            notes = section(body, '## Notes for the reviewer')
            if notes is None:
                errors.append('no "Notes for the reviewer" block with the AI connection (standing answers 90, 91)')
            else:
                for k in ('ai_connection', 'ai_steps', 'ai_places'):
                    if not re.search(r'%s:\s*\S' % k, notes):
                        errors.append('"Notes for the reviewer" has no %s' % k)
                st = re.search(r'ai_steps:\s*"?(\d+)', notes)
                if st and not STEPS[0] <= int(st.group(1)) <= STEPS[1]:
                    errors.append('ai_steps is %s; a story is within %d to %d steps of AI (standing answer 81)' % (st.group(1), STEPS[0], STEPS[1]))

        # warnings: length, semicolons, filler, trailing -ing
        span = re.search(r'^## In short\s*$(.*?)(?=^## Where this comes from|\Z)', body, re.M | re.S)
        if span:
            n = words(span.group(1))
            lo, hi = ANALYSIS if analysis or str(fm.get('beat', '')).lower() == 'analysis' else NEWS
            kind = 'analysis' if (lo, hi) == ANALYSIS else 'news'
            if n > hi:
                warnings.append('%d words (%s usually %d to %d, lint_rules.yaml): longer only with a reason in the notes (standing answer 92)' % (n, kind, lo, hi))
            elif n < lo:
                warnings.append('%d words (%s usually %d to %d): is it enough to tell the story? (standing answer 92)' % (n, kind, lo, hi))

    text_body = prose(re.sub(r'^## (Where this comes from|Notes for the reviewer)\s*$.*?(?=^## |\Z)', '', body, flags=re.M | re.S))
    semis = [l.strip()[:60] for l in text_body.split('\n') if ';' in l]
    if semis and not update:
        warnings.append('%d line(s) with a semicolon (STYLE: no semicolons), first: %s' % (len(semis), semis[0]))
    low = text_body.lower()
    hits = sorted({w for w in FILLER if re.search(r'\b%s\b' % re.escape(w), low)})
    if hits:
        warnings.append('filler words (STYLE "Write like a person"): ' + ', '.join(hits))
    ing = re.findall(r',\s+(?!(?:%s)\b)\w+ing\b[^.!?\n]*[.!?]' % '|'.join(map(re.escape, ING_OK)), text_body)
    if ing:
        warnings.append('%d sentence(s) ending in a trailing ", -ing" clause, first: %s' % (len(ing), ing[0].strip()[:60]))

    return {'file': path, 'errors': errors, 'warnings': warnings}


def main(argv):
    files = [a for a in argv if not a.startswith('--')]
    if not files:
        print(__doc__.split('\n\n')[-2]); return 2
    results = [lint(f) for f in files]
    if '--json' in argv:
        print(json.dumps(results, ensure_ascii=False, indent=1))
    else:
        for r in results:
            state = 'FAIL' if r['errors'] else 'OK'
            print('%s %s: %d error(s), %d warning(s)' % (state, r['file'], len(r['errors']), len(r['warnings'])))
            for e in r['errors']:
                print('  error: ' + e)
            for w in r['warnings']:
                print('  warn:  ' + w)
    return 1 if any(r['errors'] for r in results) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
