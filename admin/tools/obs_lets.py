#!/usr/bin/env python3
"""LETS for the observability vaults (observability@web-summit.dinis, 5 November 2026, at Dinis Cruz's word): Load,
Extract, Transform, Save. The drain (obs_drain.py) Loads the lanes and Extracts (opens, verifies) each record; this file
Saves the raw rows by the hour they happened in, and Transforms each hour once into small, pre-computed JSON, so a page
loads one file and gets everything, already massaged.

The private data vault (kuuqr3do):
    events/<YYYY-MM-DD>/<HH>/events.jsonl   every opened record, by the hour it happened (a page event's ts, a run's run)
    inbox/*.jsonl                            records drained by a browser (Dinis's, /observability/), folded in here
    state/sessions.json                      each tab's group, kept across hours (declared signals first, then inferred)

The public vault (aym98gsm, read key published), no anonymous row in any file:
    <YYYY-MM-DD>/<HH>/hour.json   one hour: totals per group, pages, the team's reads, referrer hosts, screens, the
                                  agents' runs (whole records: they carry no secrets)
    <YYYY-MM-DD>/day.json         the day: the same, summed, plus its 24 hours per group
    latest/summary.json           all time: totals, days, the last 48 hours, top pages and agents (the home page's file)
    latest/pages.json             every page: views per group, reads, time, scroll, its days
    latest/agents.json            every agent: runs, reads (md, html, repo), what it read, what it did, last run
    latest/team.json              every person: what they read, when, how long
    latest/runs.json              the latest 200 agent runs
    latest/index.json             which days and hours exist, and when each was computed
An hour is transformed again only when new records for it arrive (a late drain), or while it is the current hour; a
finished hour is computed once. Its day and latest/ are then recomputed from the hour files, never from raw rows.
"""
import collections, json, os, time

GROUPS = ['readers', 'team', 'synthetic', 'crawlers']
CRAWLERS = {'googlebot', 'bingbot', 'bot'}

def norm(path):
    """/x/index.html and /x/ are one page."""
    path = str(path or '/')
    return path[:-len('index.html')] if path.endswith('/index.html') else path

def kind(u, said=''):
    """What an agent read: md, html, or file (a script, JSON, an image), by the URL's own extension."""
    u = str(u).split('?')[0]
    if u.endswith(('.md', 'llms.txt', 'llms-full.txt')): return 'md'
    if u.endswith(('.html', '.htm', '/')) or (u.startswith('http') and '.' not in u.rsplit('/', 1)[-1]): return 'html'
    return 'file' if '.' in u.rsplit('/', 1)[-1] else (said or 'html')

def hour_of(r):
    t = str(r.get('ts') or r.get('run') or '')
    if len(t) >= 13: return t[:10], t[11:13]
    if r.get('_received'): g = time.gmtime(r['_received'] / 1000); return time.strftime('%Y-%m-%d', g), time.strftime('%H', g)
    return None

def jload(p, default):
    try: return json.load(open(p))
    except Exception: return default

def jsave(p, obj):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f: json.dump(obj, f, indent=1, sort_keys=True)

# ---------------------------------------------------------------- save (raw, private)
def fix_clock(r):
    """A browser's clock is a claim: a test can set it to another day (5 November: a headless test of a command centre
    ran at 2026-11-10). When the claimed time is more than 6 hours from when the lane received the record, the record
    is filed by the time it was received, and the claim is kept as ts_claimed."""
    t, rcv = r.get('ts') or r.get('run'), r.get('_received')
    if not t or not rcv or len(str(t)) < 16: return r
    try: claimed = time.mktime(time.strptime(str(t)[:16], '%Y-%m-%dT%H:%M')) - time.mktime(time.gmtime(0))
    except ValueError: return r
    if abs(claimed - rcv / 1000) > 6 * 3600:
        key = 'ts' if r.get('ts') else 'run'
        r[key + '_claimed'] = r[key]; r[key] = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime(rcv / 1000))
    return r

def save_raw(vault, rows):
    """Append rows to events/<day>/<hour>/events.jsonl, once each (by _file). Returns the set of hours touched."""
    touched, by = set(), collections.defaultdict(list)
    for r in rows:
        fix_clock(r)
        if r.get('test') or r.get('v') != 1: continue
        h = hour_of(r)
        if h: by[h].append(r)
    for (day, hh), rs in by.items():
        p = os.path.join(vault, 'events', day, hh, 'events.jsonl'); os.makedirs(os.path.dirname(p), exist_ok=True)
        seen = {json.loads(l).get('_file') for l in open(p) if l.strip()} if os.path.exists(p) else set()
        new = [r for r in rs if r.get('_file') not in seen]
        if new:
            with open(p, 'a') as f:
                for r in new: f.write(json.dumps(r, sort_keys=True) + '\n')
            touched.add((day, hh))
    return touched

def migrate(vault):
    """Once: the first layout (drain/<date>.jsonl, reports/) into events/<day>/<hour>/."""
    old = os.path.join(vault, 'drain')
    if not os.path.isdir(old): return set()
    rows = [json.loads(l) for n in sorted(os.listdir(old)) if n.endswith('.jsonl') for l in open(os.path.join(old, n)) if l.strip()]
    touched = save_raw(vault, rows)
    for d in ('drain', 'reports'):
        p = os.path.join(vault, d)
        if os.path.isdir(p):
            for n in os.listdir(p): os.remove(os.path.join(p, n))
            os.rmdir(p)
    return touched

DRAINS = []                                                              # this run's drains, for state/drains.json

def fold_inbox(vault, extract):
    """Records a browser drained (inbox/*.jsonl: {file_id, lane, content}, still sealed) are opened and verified here by
    extract(content), exactly as the lanes' are, go into events/, and the inbox file is removed."""
    p = os.path.join(vault, 'inbox')
    if not os.path.isdir(p): return set(), 0
    touched, n = set(), 0
    for name in sorted(os.listdir(p)):
        if not name.endswith('.jsonl'): continue
        rows, meta = [], {}
        for l in open(os.path.join(p, name)):
            if not l.strip(): continue
            x = json.loads(l)
            if 'meta' in x: meta = x['meta']; continue                    # the browser's own timings
            ev = extract(x['content'])
            ev.update(_file=x['file_id'], _lane=x.get('lane', 0), _via='browser:' + name,
                      _received=int(x['file_id'][:13]) if str(x['file_id'])[:13].isdigit() else None)
            rows.append(ev)
        touched |= save_raw(vault, rows); n += len(rows)
        parts = name[:-6].split('-')                                       # browser-<person>-<ISO stamp>.jsonl
        who = parts[1] if len(parts) > 2 and parts[1].isalpha() else 'browser'
        stamp = name[len('browser-' + (who + '-' if who != 'browser' else '')):-6]
        at = (stamp[:10] + 'T' + stamp[11:13] + ':' + stamp[14:16] + 'Z') if len(stamp) >= 16 else ''
        DRAINS.append({'at': at, 'by': who, 'records': len(rows), 'via': 'browser', **{k: meta[k] for k in ('secs', 'phases', 'lanes', 'lane_count') if k in meta}})
        os.remove(os.path.join(p, name))
    return touched, n

def hour_rows(vault, day, hh):
    p = os.path.join(vault, 'events', day, hh, 'events.jsonl')
    return [json.loads(l) for l in open(p) if l.strip()] if os.path.exists(p) else []

def all_hours(vault):
    base = os.path.join(vault, 'events')
    if not os.path.isdir(base): return []
    return sorted((d, h) for d in os.listdir(base) for h in os.listdir(os.path.join(base, d)))

# ---------------------------------------------------------------- the groups (a tab's group, kept across hours)
def update_sessions(vault, rows):
    st = jload(os.path.join(vault, 'state', 'sessions.json'), {})
    for r in rows:
        if r.get('type') not in ('view', 'read') or not r.get('sid'): continue
        s = st.setdefault(r['sid'], {'first': r.get('ts', ''), 'tz': r.get('tz', ''), 'lang': r.get('lang', ''), 'agents': [], 'verified': False, 'views': 0})
        if str(r.get('ts', '')) < s['first']: s.update(first=r.get('ts', ''), tz=r.get('tz', ''), lang=r.get('lang', ''))
        if r.get('agent') and r['agent'] not in s['agents']: s['agents'].append(r['agent'])
        if r.get('verified'): s['verified'] = True
        if r.get('type') == 'view': s['views'] += 1
    for s in st.values():
        a = set(s['agents'])
        s['group'] = ('crawlers' if a & CRAWLERS else 'synthetic' if a & {'webdriver', 'headless'} else 'team' if s['verified']
                      else 'crawlers' if s['views'] > 40 else 'synthetic' if s['tz'] in ('UTC', 'Etc/UTC', '') or str(s['lang']).endswith('@posix') else 'readers')
    jsave(os.path.join(vault, 'state', 'sessions.json'), st)
    return {k: v['group'] for k, v in st.items()}

# ---------------------------------------------------------------- transform (public)
def zero(): return {g: 0 for g in GROUPS}

def hour_stats(day, hh, rows, groups):
    pages, seen = [], set()
    for r in rows:                                                       # a read re-sent from the next page can arrive twice
        if r.get('type') not in ('view', 'read') or not r.get('path'): continue
        k = (r.get('sid'), r.get('type'), r.get('path'), r.get('ts'), r.get('visible_s'), r.get('scroll'), r.get('src'))
        if r.get('type') == 'read' and k in seen: continue
        seen.add(k); pages.append(r)
    runs = sorted([r for r in rows if r.get('type') == 'web-summit.agent-run/v1'], key=lambda r: r.get('run', ''))
    totals = {g: {'views': 0, 'reads': 0, 'tabs': 0} for g in GROUPS}
    tabs = collections.defaultdict(set)
    P = collections.defaultdict(lambda: {'views': zero(), 'reads': 0, 'visible_s': 0, 'scroll_sum': 0})
    T = collections.defaultdict(lambda: {'views': 0, 'reads': 0, 'visible_s': 0, 'max_scroll': 0, 'last': ''})
    refs, screens = collections.Counter(), collections.Counter()
    for r in pages:
        g = groups.get(r.get('sid'), 'readers'); tabs[g].add(r.get('sid'))
        p = P[norm(r['path'])]
        if r['type'] == 'view':
            totals[g]['views'] += 1; p['views'][g] += 1
            if r.get('ref') and r['ref'] not in ('web-summit.sgit.ai',): refs[r['ref']] += 1
            screens[r.get('screen', '')] += 1
        else:
            totals[g]['reads'] += 1; p['reads'] += 1; p['visible_s'] += r.get('visible_s', 0); p['scroll_sum'] += r.get('scroll', 0)
        if r.get('verified') and r.get('person'):
            t = T[(r['person'], norm(r['path']))]; t['last'] = max(t['last'], str(r.get('ts', '')))
            if r['type'] == 'view': t['views'] += 1
            else: t['reads'] += 1; t['visible_s'] += r.get('visible_s', 0); t['max_scroll'] = max(t['max_scroll'], r.get('scroll', 0))
    for g in GROUPS: totals[g]['tabs'] = len(tabs[g])
    M = collections.defaultdict(zero)
    for r in pages:
        if r['type'] == 'view': M[str(r.get('ts', ''))[14:16]][groups.get(r.get('sid'), 'readers')] += 1
    keep = ('agent', 'run', 'trigger', 'repo', 'read', 'did', 'tokens', 'notes', 'signed', 'key_id', 'sig_finding')
    return {'v': 1, 'day': day, 'hour': hh, 'computed': time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime()),
            'totals': totals,
            'pages': [{'path': k, **v} for k, v in sorted(P.items())],
            'team': [{'person': p, 'path': path, **v} for (p, path), v in sorted(T.items())],
            'referrers': refs.most_common(), 'screens': screens.most_common(),
            'minutes': sorted([m, v] for m, v in M.items() if m),
            'runs': [{k: r[k] for k in keep if k in r} for r in runs],
            'findings': {'page_signatures': sum(1 for r in pages if r.get('sig_finding')), 'agent_signatures': sum(1 for r in runs if r.get('sig_finding'))}}

def merge(stats_list, extra=None):
    """Sum hour (or day) stats into one."""
    out = {'totals': {g: {'views': 0, 'reads': 0, 'tabs': 0} for g in GROUPS}, 'pages': {}, 'team': {}, 'referrers': collections.Counter(),
           'screens': collections.Counter(), 'runs': [], 'findings': {'page_signatures': 0, 'agent_signatures': 0}}
    for s in stats_list:
        for g in GROUPS:
            for k in ('views', 'reads', 'tabs'): out['totals'][g][k] += s['totals'][g][k]
        for p in s['pages']:
            q = out['pages'].setdefault(p['path'], {'path': p['path'], 'views': zero(), 'reads': 0, 'visible_s': 0, 'scroll_sum': 0})
            for g in GROUPS: q['views'][g] += p['views'][g]
            for k in ('reads', 'visible_s', 'scroll_sum'): q[k] += p[k]
        for t in s['team']:
            q = out['team'].setdefault((t['person'], t['path']), {'person': t['person'], 'path': t['path'], 'views': 0, 'reads': 0, 'visible_s': 0, 'max_scroll': 0, 'last': ''})
            for k in ('views', 'reads', 'visible_s'): q[k] += t[k]
            q['max_scroll'] = max(q['max_scroll'], t['max_scroll']); q['last'] = max(q['last'], t['last'])
        out['referrers'].update(dict(s['referrers'])); out['screens'].update(dict(s['screens'])); out['runs'] += s['runs']
        for k in out['findings']: out['findings'][k] += s['findings'][k]
    out['pages'] = sorted(out['pages'].values(), key=lambda p: -sum(p['views'].values()))
    out['team'] = sorted(out['team'].values(), key=lambda t: t['last'], reverse=True)
    out['referrers'] = out['referrers'].most_common(); out['screens'] = out['screens'].most_common()
    out['runs'] = sorted(out['runs'], key=lambda r: r.get('run', ''), reverse=True)
    return {**out, **(extra or {})}

EXPECT = {'claude_md': lambda u: u.endswith('CLAUDE.md'), 'agents_page': lambda u: '/agents/' in u or u.endswith('content/agents.md'),
          'brief': lambda u: '/brief-' in u or 'content/brief-' in u, 'abp': lambda u: '/abp/' in u or 'content/abp/' in u,
          'board': lambda u: '/briefs/' in u or 'board/' in u}

def agents_of(runs):
    A = {}
    for r in sorted(runs, key=lambda r: r.get('run', '')):
        a = A.setdefault(r.get('agent', '?'), {'agent': r.get('agent', '?'), 'runs': 0, 'signed': 0, 'read_md': 0, 'read_html': 0, 'read_repo': 0,
                                               'read_file': 0, 'did': 0, 'first': r.get('run', ''), 'last': '', 'triggers': collections.Counter(), 'reads': {}, 'done': [], 'tokens': 0, '_seen': set(), 'acted_blind': 0})
        a['runs'] += 1; a['signed'] += 1 if r.get('signed') else 0; a['last'] = r.get('run', ''); a['triggers'][r.get('trigger', '')] += 1
        t = r.get('tokens') or {}; a['tokens'] += sum(v for v in t.values() if isinstance(v, (int, float)))
        for x in r.get('read', []):
            u = str(x.get('url', '')); k = kind(u[5:] if u.startswith('repo:') else u, x.get('as', ''))
            a['read_repo' if u.startswith('repo:') else 'read_md' if k == 'md' else 'read_html' if k == 'html' else 'read_file'] += 1
            e = a['reads'].setdefault(u, {'url': u, 'as': 'repo' if u.startswith('repo:') else k, 'times': 0, 'first': r.get('run', ''), 'last': ''}); e['times'] += 1; e['last'] = r.get('run', '')
        for x in r.get('did', []):
            if str(x.get('subject', '')).startswith('site v'): continue                 # CI's release commit, not the agent's
            key = x.get('commit') or x.get('release') or x.get('file') or x.get('message_to') or x.get('note')
            if key in a['_seen']: continue
            a['_seen'].add(key); a['did'] += 1; a['done'].append({**x, 'run': r.get('run', '')})
        a['acted_blind'] += 1 if (r.get('did') and not any('board/' in str(x.get('url', '')) or '/briefs/' in str(x.get('url', '')) or '/inbox/' in str(x.get('url', '')) for x in r.get('read', []))) else 0
    out = []
    for a in A.values():
        urls = list(a['reads'])
        a['checklist'] = {k: any(f(u) for u in urls) for k, f in EXPECT.items()}
        a['reads'] = sorted(a['reads'].values(), key=lambda e: (-e['times'], e['url']))[:300]
        a['done'] = a['done'][-100:][::-1]; a['triggers'] = dict(a['triggers']); a.pop('_seen')
        out.append(a)
    return sorted(out, key=lambda a: a['last'], reverse=True)

def save_drains(data_vault, pub_vault, entry):
    """Add one drain (when, by whom, how many, how long, each phase, each lane's pending count) to the log."""
    dl = jload(os.path.join(data_vault, 'state', 'drains.json'), []) + [entry]
    jsave(os.path.join(data_vault, 'state', 'drains.json'), dl[-1000:])
    jsave(os.path.join(pub_vault, 'latest', 'drains.json'), {'v': 1, 'generated': entry['at'], 'drains': dl[-200:][::-1]})

def transform(data_vault, pub_vault, dirty, now_hour, roster=()):
    """Recompute the dirty hours (and the current hour), their days, and latest/. Returns what was computed."""
    groups = update_sessions(data_vault, [r for d, h in all_hours(data_vault) for r in hour_rows(data_vault, d, h)]) if dirty else \
        {k: v['group'] for k, v in jload(os.path.join(data_vault, 'state', 'sessions.json'), {}).items()}
    hours = all_hours(data_vault)
    idx = jload(os.path.join(pub_vault, 'latest', 'index.json'), {'hours': {}})
    todo = {h for h in hours if h in dirty or h == now_hour or f'{h[0]}/{h[1]}' not in idx['hours']}
    for day, hh in sorted(todo):
        jsave(os.path.join(pub_vault, day, hh, 'hour.json'), hour_stats(day, hh, hour_rows(data_vault, day, hh), groups))
        idx['hours'][f'{day}/{hh}'] = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    days = sorted({d for d, _ in hours}); dirty_days = {d for d, _ in todo}
    for day in days:
        if day not in dirty_days and os.path.exists(os.path.join(pub_vault, day, 'day.json')): continue
        hs = [jload(os.path.join(pub_vault, day, h, 'hour.json'), None) for h in sorted(os.listdir(os.path.join(pub_vault, day))) if h.isdigit()]
        hs = [h for h in hs if h]
        series = [[h['hour'], {g: h['totals'][g]['views'] for g in GROUPS}] for h in hs]
        th = collections.defaultdict(dict)                                  # the heatmap: person -> hour -> [views, reads, pages]
        for hr in hs:
            for t in hr['team']:
                c = th[t['person']].setdefault(hr['hour'], [0, 0, []]); c[0] += t['views']; c[1] += t['reads']
                if t['path'] not in c[2] and len(c[2]) < 6: c[2].append(t['path'])
        jsave(os.path.join(pub_vault, day, 'day.json'), merge(hs, {'v': 1, 'day': day, 'hours': series, 'team_hours': th, 'computed': time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())}))
    D = [jload(os.path.join(pub_vault, d, 'day.json'), None) for d in days]; D = [d for d in D if d]
    allstats = merge(D)
    last48 = []
    for day, hh in hours[-48:]:
        h = jload(os.path.join(pub_vault, day, hh, 'hour.json'), None)
        if h: last48.append([f'{day}T{hh}', {g: h['totals'][g]['views'] for g in GROUPS}, sum(h['totals'][g]['reads'] for g in GROUPS), len(h['runs'])])
    agents = agents_of(allstats['runs'])
    page_days = collections.defaultdict(list)
    for d in D:
        for p in d['pages']: page_days[p['path']].append([d['day'], sum(p['views'].values())])
    pages = [{**p, 'total': sum(p['views'].values()), 'read_s_avg': round(p['visible_s'] / p['reads']) if p['reads'] else 0,
              'scroll_avg': round(p['scroll_sum'] / p['reads']) if p['reads'] else 0, 'days': page_days[p['path']]} for p in allstats['pages']]
    people = collections.defaultdict(list)
    for t in allstats['team']: people[t['person']].append(t)
    gen = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    L = os.path.join(pub_vault, 'latest')
    jsave(os.path.join(L, 'summary.json'), {'v': 1, 'generated': gen, 'groups': GROUPS, 'totals': allstats['totals'],
        'days': [[d['day'], {g: d['totals'][g]['views'] for g in GROUPS}, sum(d['totals'][g]['reads'] for g in GROUPS), len(d['runs'])] for d in D],
        'last48': last48, 'pages': len(pages), 'top_pages': [[p['path'], p['total'], p['views']] for p in pages[:10]],
        'agents': {'count': len(agents), 'runs': len(allstats['runs']), 'signed': sum(1 for r in allstats['runs'] if r.get('signed')),
                   'latest': [[r.get('run'), r.get('agent'), len(r.get('read', [])), len(r.get('did', []))] for r in allstats['runs'][:8]]},
        'team': {'people': len(people), 'views': allstats['totals']['team']['views']},
        'referrers': allstats['referrers'][:20], 'screens': allstats['screens'], 'findings': allstats['findings'],
        'about': 'observability@web-summit.dinis, admin/tools/obs_drain.py + obs_lets.py: drained from the private vault kuuqr3do, transformed by the hour. Anonymous readers are counts only; the team is named only when signed by their site key; every record is an untrusted claim.'})
    jsave(os.path.join(L, 'pages.json'), {'v': 1, 'generated': gen, 'pages': pages})
    logged = {a['agent'] for a in agents}
    for name in roster:                                                    # agents with a key that never logged: silent
        if name not in logged: agents.append({'agent': name, 'runs': 0, 'signed': 0, 'read_md': 0, 'read_html': 0, 'read_file': 0, 'read_repo': 0, 'did': 0,
                                              'first': '', 'last': '', 'triggers': {}, 'reads': [], 'done': [], 'tokens': 0, 'acted_blind': 0, 'checklist': {k: False for k in EXPECT}})
    jsave(os.path.join(L, 'agents.json'), {'v': 1, 'generated': gen, 'expect': list(EXPECT), 'roster': sorted(roster), 'agents': agents})
    nowt = time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())
    def hours_since(t):
        if not t: return None
        return round((time.mktime(time.strptime(nowt, '%Y-%m-%dT%H:%MZ')) - time.mktime(time.strptime(t[:16] + 'Z', '%Y-%m-%dT%H:%MZ'))) / 3600, 1)
    read_index = collections.defaultdict(lambda: {'people': {}, 'agents': {}})
    for t in allstats['team']: read_index[t['path']]['people'][t['person']] = max(read_index[t['path']]['people'].get(t['person'], ''), t['last'])
    for a in agents:
        for e in a['reads']:
            u = e['url']; u = norm('/' + u.split('://', 1)[1].split('/', 1)[1]) if u.startswith('https://web-summit.sgit.ai/') else u
            u = u[:-len('index.md')] if u.endswith('/index.md') else u
            read_index[u]['agents'][a['agent']] = max(read_index[u]['agents'].get(a['agent'], ''), e['last'])
    jsave(os.path.join(L, 'widgets.json'), {'v': 1, 'generated': gen,
        'silent_24h': sorted(([a['agent'], a['last'], hours_since(a['last'])] for a in agents if not a['last'] or hours_since(a['last']) > 24), key=lambda x: (x[2] is not None, x[2] or 0), reverse=True),
        'checklist_incomplete': [[a['agent'], [k for k, ok in a['checklist'].items() if not ok]] for a in agents if not all(a['checklist'].values())],
        'acted_without_board': [[a['agent'], a['acted_blind'], a['runs']] for a in agents if a['acted_blind']],
        'md_vs_html': [[a['agent'], a['read_md'], a['read_html'], a['read_file'], a['read_repo'], round(a['tokens'] / a['runs']) if a['runs'] else 0] for a in agents if a['runs']],
        'read_index': read_index})
    jsave(os.path.join(L, 'team.json'), {'v': 1, 'generated': gen, 'people': {p: rows for p, rows in sorted(people.items())}})
    # flows: how tabs move from page to page (counts only; a tab's own sequence never leaves the private vault)
    seqs = collections.defaultdict(list)
    for d, hh in hours:
        for r in hour_rows(data_vault, d, hh):
            if r.get('type') == 'view' and r.get('sid') and r.get('path'): seqs[r['sid']].append((str(r.get('ts', '')), norm(r['path'])))
    edges, entries = collections.Counter(), collections.Counter()
    for sid, seq in seqs.items():
        seq.sort(); g = groups.get(sid, 'readers')
        entries[(seq[0][1], g)] += 1
        for (_, a), (_, b) in zip(seq, seq[1:]):
            if a != b: edges[(a, b, g)] += 1
    jsave(os.path.join(L, 'flows.json'), {'v': 1, 'generated': gen,
        'edges': [[a, b, g, n] for (a, b, g), n in edges.most_common()],
        'entries': [[p, g, n] for (p, g), n in entries.most_common()],
        'about': 'Page to next page within one tab, counted per group. Only counts are published.'})
    jsave(os.path.join(L, 'runs.json'), {'v': 1, 'generated': gen, 'runs': allstats['runs'][:200]})
    # timeline: every hour so far
    tl = []
    for day, hh in hours:
        h = jload(os.path.join(pub_vault, day, hh, 'hour.json'), None)
        if h: tl.append([f'{day}T{hh}', {g: h['totals'][g]['views'] for g in GROUPS}, sum(h['totals'][g]['reads'] for g in GROUPS), len(h['runs']), len({t['person'] for t in h['team']})])
    jsave(os.path.join(L, 'timeline.json'), {'v': 1, 'generated': gen, 'hours': tl})
    # feed: the newest events of the last 12 hours; anonymous traffic only as per-minute counts per page and group
    feed = []
    for day, hh in hours[-12:]:
        traffic = collections.Counter()
        for r in hour_rows(data_vault, day, hh):
            t = r.get('type')
            if t == 'web-summit.agent-run/v1':
                feed.append({'ts': r.get('run', ''), 'kind': 'agent', 'agent': r.get('agent'), 'trigger': r.get('trigger', ''), 'read': len(r.get('read', [])),
                             'did': len(r.get('did', [])), 'signed': bool(r.get('signed')), 'notes': (r.get('notes') or '')[:160]})
            elif t in ('view', 'read') and r.get('path'):
                g = groups.get(r.get('sid'), 'readers')
                if r.get('verified') and r.get('person'):
                    feed.append({'ts': r.get('ts', ''), 'kind': 'team', 'person': r['person'], 'type': t, 'path': norm(r['path']),
                                 **({'visible_s': r.get('visible_s', 0), 'scroll': r.get('scroll', 0)} if t == 'read' else {})})
                elif t == 'view': traffic[(str(r.get('ts', ''))[:16], norm(r['path']), g)] += 1
            if r.get('sig_finding'): pass
        feed += [{'ts': ts + ('Z' if not ts.endswith('Z') else ''), 'kind': 'traffic', 'path': p, 'group': g, 'n': n} for (ts, p, g), n in traffic.items()]
    feed.sort(key=lambda e: e['ts'], reverse=True)
    jsave(os.path.join(L, 'feed.json'), {'v': 1, 'generated': gen, 'events': feed[:300]})
    # findings: every signature that failed (a claimed key that is not published, or not active, or a bad signature)
    import re
    fnd = []
    for day, hh in hours:
        for r in hour_rows(data_vault, day, hh):
            f = r.get('sig_finding')
            if not f: continue
            m = re.search(r'(sha256:[0-9a-f]{16}|key [^ ]+)', f)
            reason = 'unknown key' if 'no published key' in f else 'not active' if 'not active' in f or 'is ' in f and 'not' in f else 'signature or content mismatch' if 'differs' in f or 'Invalid' in f else f.split(':')[0]
            fnd.append({'ts': r.get('ts') or r.get('run', ''), 'kind': 'agent' if r.get('type') == 'web-summit.agent-run/v1' else 'page', 'reason': reason,
                        'claimed_key': (m.group(1).replace('key ', '') if m else '')[:40], 'path': norm(r.get('path', '')) if r.get('path') else ''})
    fnd.sort(key=lambda e: e['ts'], reverse=True)
    jsave(os.path.join(L, 'findings.json'), {'v': 1, 'generated': gen, 'count': len(fnd), 'by_reason': collections.Counter(f['reason'] for f in fnd).most_common(),
                                             'by_key': collections.Counter(f['claimed_key'] for f in fnd).most_common(20), 'recent': fnd[:200]})
    # drains: every drain, the hourly one and the ones run from a browser
    dl = jload(os.path.join(data_vault, 'state', 'drains.json'), [])
    dl += DRAINS; DRAINS.clear()
    jsave(os.path.join(data_vault, 'state', 'drains.json'), dl[-1000:])
    jsave(os.path.join(L, 'drains.json'), {'v': 1, 'generated': gen, 'drains': dl[-200:][::-1]})
    idx.update(v=1, generated=gen, days=days)
    jsave(os.path.join(L, 'index.json'), idx)
    return {'hours': len(todo), 'days': len(dirty_days), 'agents': len(agents), 'pages': len(pages)}
