#!/usr/bin/env python3
"""The drain's two banners (observability@web-summit.dinis, 5 November 2026, at Dinis Cruz's word: "an ASCII art sort of
visualization of the beginning, like what you're going to do, and then one at the end ... of the stats and what you
actually collected"). obs_drain.py prints start() before it drains and end() after it publishes. Counts only: no row,
no key, no token. Run alone, it prints the end banner from the public vault's latest/ files:

    python3 -I admin/tools/obs_banner.py [--public ~/vaults/obs-dinis-public]
"""
import json, os, time

W = 78
GROUPS = ['readers', 'team', 'synthetic', 'crawlers']
LABEL = {'readers': 'readers  ', 'team': 'team(key)', 'synthetic': 'synthetic', 'crawlers': 'crawlers '}
SPARK = ' ▁▂▃▄▅▆▇█'

def box(title, lines):
    out = ['╔' + '═' * (W - 2) + '╗', '║ ' + title.ljust(W - 4)[:W - 4] + ' ║', '╠' + '═' * (W - 2) + '╣']
    for l in lines: out.append('║ ' + l.ljust(W - 4)[:W - 4] + ' ║')
    out.append('╚' + '═' * (W - 2) + '╝')
    return '\n'.join(out)

def bar(n, mx, width=34, ch='█'):
    k = 0 if not mx else round(width * n / mx)
    return (ch * k).ljust(width, '·')

def spark(vals):
    mx = max(vals) if vals else 0
    return ''.join(SPARK[0 if not mx or not v else max(1, round(8 * v / mx))] for v in vals)

def start(pending_by_lane, lanes_named, inbox_files=0):
    stamp = time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())
    total = sum(pending_by_lane.values())
    lines = [f'when     {stamp}', f'waiting  {total} sealed records in {len(pending_by_lane)} lane(s)' + (f', {inbox_files} browser drain file(s) in inbox/' if inbox_files else ''), '']
    mx = max(pending_by_lane.values()) if pending_by_lane else 0
    for i, name in enumerate(lanes_named, 1):
        n = pending_by_lane.get(i, 0)
        full = '  FULL (507)' if n >= 1000 else '  near full' if n >= 800 else ''
        lines.append(f'lane {i}  {name[:18].ljust(18)} {str(n).rjust(5)}  {bar(n, mx, 30)}{full}')
    lines += ['', 'plan     L load    list + fetch every lane (enum key)',
              '         E extract open (drain key), verify (site and agent keys)',
              '         T transform  new hours once -> their day -> latest/',
              '         S save    kuuqr3do (private, raw by hour) + aym98gsm (public)',
              '         then     push, mark processed, log this run']
    return box('OBSERVABILITY DRAIN · starting', lines)

def end(pub, drained, from_browser, bad, got, took_s, by_lane):
    L = os.path.join(pub, 'latest')
    j = lambda n: json.load(open(os.path.join(L, n)))
    S, TL, A, F, D = j('summary.json'), j('timeline.json'), j('agents.json'), j('findings.json'), j('drains.json')
    lines = [f'this run  {drained} from the lanes · {from_browser} from browser drains · {bad} unreadable · {took_s:.1f} s',
             '          ' + ('  '.join(f'lane {k}: {v}' for k, v in sorted(by_lane.items())) or 'the lanes were empty'),
             f'          {got["hours"]} hour(s) and {got["days"]} day(s) transformed; {got["pages"]} pages, {got["agents"]} agents known', '',
             'ALL TIME, views by group']
    mx = max(S['totals'][g]['views'] for g in GROUPS)
    for g in GROUPS:
        t = S['totals'][g]
        lines.append(f'  {LABEL[g]} {bar(t["views"], mx, 30)} {str(t["views"]).rjust(6)}  {t["tabs"]} tabs · {t["reads"]} reads')
    hrs = TL['hours'][-24:]
    if hrs:
        human = [h[1].get('readers', 0) + h[1].get('team', 0) for h in hrs]
        synth = [h[1].get('synthetic', 0) + h[1].get('crawlers', 0) for h in hrs]
        runs = [h[3] for h in hrs]
        lines += ['', f'LAST {len(hrs)} HOURS  ({hrs[0][0][5:].replace("T", " ")}:00 -> {hrs[-1][0][5:].replace("T", " ")}:00 UTC)',
                  f'  humans      {spark(human)}  peak {max(human)}/h',
                  f'  synthetic   {spark(synth)}  peak {max(synth)}/h',
                  f'  agent runs  {spark(runs)}  {sum(runs)} runs']
    tops = S.get('top_pages', [])[:5]
    if tops:
        lines += ['', 'TOP PAGES (all groups)']
        tmx = max(t[1] for t in tops)
        for path, n, v in tops:
            lines.append(f'  {path[:36].ljust(36)} {bar(n, tmx, 18)} {str(n).rjust(5)}  r{v.get("readers", 0)} t{v.get("team", 0)}')
    ran = [a for a in A['agents'] if a['runs']]
    lines += ['', f'AGENTS  {len(ran)} logging, {len(A["agents"]) - len(ran)} with a key not yet; {S["agents"]["runs"]} runs, {S["agents"]["signed"]} signed']
    for a in ran[:6]:
        ok = sum(1 for v in a['checklist'].values() if v)
        lines.append(f'  {a["agent"][:34].ljust(34)} {str(a["runs"]).rjust(3)} runs · last {a["last"][11:16]} · read-list {ok}/5')
    lines += ['', f'SECURITY  {F["count"]} signature findings: ' + ', '.join(f'{r} {n}' for r, n in F['by_reason'])]
    for k, n in F['by_key'][:3]: lines.append(f'  claimed key {k[:24].ljust(24)} {n}x')
    lines += ['', 'DRAINS  ' + '  '.join(f'{d["at"][11:16]} {d["by"]} {d["records"]}' for d in D['drains'][:4]),
              '', f'live      web-summit.sgit.ai/observability/ · data as of {S["generated"][11:16]} UTC']
    return box('OBSERVABILITY DRAIN · done', lines)

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser(); ap.add_argument('--public', default=os.path.expanduser('~/vaults/obs-dinis-public'))
    o = ap.parse_args()
    print(end(o.public, 0, 0, 0, {'hours': 0, 'days': 0, 'pages': 0, 'agents': 0}, 0.0, {}))
