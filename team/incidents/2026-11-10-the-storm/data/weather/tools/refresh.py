#!/usr/bin/env python3
"""The weather picture for WS-214 (the storm, Wednesday 11 November 2026), as JSON.

    python3 -I team/incidents/2026-11-10-the-storm/data/weather/tools/refresh.py

Reads public sources only (IPMA open data and RSS; NOAA Aviation Weather Center's API for IPMA's TAF and METAR
for Lisbon airport, LPPT), writes one JSON file per source next to this folder, keeps what earlier runs saw
(warning changes, TAF issues, METARs, communiqués) and appends what changed to changes.json. Every record carries
`source` (the URL read) and `read_utc` (when). Lisbon is on UTC in November (WET): IPMA's local times are UTC.
Kept by incident.meteorologist@web-summit.dinis. Standard library only.
"""
import json, os, re, sys, html, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
U = {
    'warnings': 'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json',
    'areas': 'https://api.ipma.pt/open-data/distrits-islands.json',
    'communiques': 'https://www.ipma.pt/resources.www/rss/comunicados.xml',
    'obs': 'https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json',
    'stations': 'https://api.ipma.pt/open-data/observation/meteorology/stations/stations.json',
    'daily': 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json',
    'hourly': 'https://api.ipma.pt/public-data/forecast/aggregate/1110600.json',
    'taf': 'https://aviationweather.gov/api/data/taf?ids=LPPT&format=json',
    'metar': 'https://aviationweather.gov/api/data/metar?ids=LPPT&hours=30&format=json',
}
LISBON_STATIONS = {  # IPMA station ids in and next to Lisbon (from stations.json)
    '1200535': 'Lisboa (Geofísico)', '1210580': 'Lisboa, Relógio', '1210762': 'Lisboa, Tapada da Ajuda',
    '7240919': 'Lisboa, Amoreiras (LFCL)', '6215302': 'Lisboa, Carnide (CML)', '6215360': 'Oeiras / Vila Fria (CMO)',
    '1210773': 'Almada, P.Rainha', '1210766': 'Barreiro, Lavradio',
}
DIRS = {0: 'calm', 1: 'N', 2: 'NE', 3: 'E', 4: 'SE', 5: 'S', 6: 'SW', 7: 'W', 8: 'NW', 9: 'N'}
RANK = {'green': 0, 'yellow': 1, 'orange': 2, 'red': 3}
KT = 1.852
NOW = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
changes, errors = [], []


def get(key):
    req = urllib.request.Request(U[key], headers={'User-Agent': 'ws-214-weather/1 (public data reader)'})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.read()
    except Exception as e:  # a refused host is recorded, not hidden
        errors.append({'source': U[key], 'read_utc': NOW, 'error': str(e)[:200]})
        return None


def load(name, default):
    p = os.path.join(OUT, name)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else default


def save(name, obj):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write('\n')


def kmh(kt):
    return None if kt is None else round(kt * KT)


def num(v):
    try:
        v = float(v)
        return None if v <= -99 else v
    except (TypeError, ValueError):
        return None


def utc(ts):
    return datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m-%dT%H:%MZ') if ts else None


# ---------------------------------------------------------------- warnings
def warnings():
    prev = load('warnings.json', {})
    raw = get('warnings')
    if raw is None:
        return prev
    allw = json.loads(raw)
    src, t = U['warnings'], NOW
    lsb = sorted(({'type': w['awarenessTypeName'], 'level': w['awarenessLevelID'], 'start_utc': w['startTime'] + 'Z',
                   'end_utc': w['endTime'] + 'Z', 'text_pt': w['text'], 'source': src, 'read_utc': t}
                  for w in allw if w['idAreaAviso'] == 'LSB' and w['awarenessLevelID'] != 'green'),
                 key=lambda w: (w['type'], w['start_utc']))
    elsewhere = sorted(({'area': w['idAreaAviso'], 'type': w['awarenessTypeName'], 'level': w['awarenessLevelID'],
                         'start_utc': w['startTime'] + 'Z', 'end_utc': w['endTime'] + 'Z', 'text_pt': w['text']}
                        for w in allw if w['awarenessLevelID'] in ('red', 'orange') and w['idAreaAviso'] != 'LSB'),
                       key=lambda w: (-RANK[w['level']], w['area'], w['type']))
    sig = lambda ws: sorted((w['type'], w['level'], w['start_utc'], w['end_utc'], w['text_pt']) for w in ws)
    history = prev.get('history') or seed_history()
    old = prev.get('lisbon')
    if old is None:
        history.append({'at_utc': t, 'kind': 'fact', 'event': "first read by this desk: Lisbon's non-green warnings as in `lisbon`",
                        'state': [list(x) for x in sig(lsb)], 'source': src, 'read_utc': t, 'read_by': 'incident.meteorologist@web-summit.dinis'})
    elif sig(old) != sig(lsb):
        o, n = set(sig(old)), set(sig(lsb))
        gone = [list(x) for x in sorted(o - n)]
        new = [list(x) for x in sorted(n - o)]
        # a warning whose window has ended drops out of the feed: that is expiry, not a change by IPMA
        expired = [g for g in gone if g[3] <= NOW[:16] + ':00Z']
        entry = {'read_utc': t, 'source': src, 'kind': 'fact', 'added': new,
                 'removed': [g for g in gone if g not in expired], 'expired': expired,
                 'note': 'compared with the read at ' + prev.get('read_utc', '?')}
        history.append(entry)
        if new or entry['removed']:
            changes.append(f"IPMA Lisbon warnings changed: +{len(new)} -{len(entry['removed'])} (" +
                           '; '.join(f"{a[1]} {a[0]} {a[2][8:16]}-{a[3][8:16]}" for a in new) + ')')
        if expired:
            changes.append(f"{len(expired)} Lisbon warning(s) expired")
    peak = max((RANK[w['level']] for w in lsb), default=0)
    return {
        'about': "IPMA's weather warnings for the Lisbon district (idAreaAviso LSB), non-green only; red and orange warnings elsewhere; and how Lisbon's warnings changed over time. Times are local = UTC (WET). Warnings carry no issue time in IPMA's feed: an issue time comes from a read or from press, and says which.",
        'source': src, 'read_utc': t, 'lisbon_peak_level': [k for k, v in RANK.items() if v == peak][0],
        'lisbon': lsb, 'red_and_orange_elsewhere': {'source': src, 'read_utc': t, 'items': elsewhere},
        'history': history,
    }


def seed_history():
    """What happened before this desk's first read, each with its own source (kind: fact or press)."""
    d = 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/weather-vicky/live.md'
    return [
        {'at_utc': '2026-11-09T13:17Z', 'kind': 'fact', 'event': "IPMA communiqué no. 1 names the low CHARLES; says orange warnings will be issued for the mainland, an upgrade not ruled out; worse weather 'a partir do final da manhã do dia 11'.",
         'source': 'https://www.ipma.pt/pt/otempo/comunicados/', 'read_utc': '2026-11-10T16:53Z', 'read_by': 'weather@PrompTugal.vicky (via ' + d + ')'},
        {'at_utc': '2026-11-09T20:30Z', 'kind': 'fact', 'event': "ANEPC public warning Aviso 21 on CHARLES (gusts to 120 km/h; avoid unnecessary travel). Civil protection's, not IPMA's.",
         'source': 'https://prociv.gov.pt/pt/avisos-a-populacao/aviso-21-depressao-charles-agravamento-da-situacao-meteorologica-chuva-e-vento-forte-medidas-preventivas/', 'read_utc': '2026-11-10T17:01Z', 'read_by': 'weather@PrompTugal.vicky (via ' + d + ')'},
        {'at_utc': '2026-11-10T08:31Z', 'kind': 'press', 'event': "IPMA's warnings update 'divulgada às 08h31 de terça-feira': red wind for eight mainland districts on Wednesday; Lisbon red wind 12:00 to 21:00, gusts to 120 km/h, up to 140 km/h in the most exposed places (Lusa, as published by AWAY at 08:46 UTC). The first public time for Lisbon's red wind found so far.",
         'source': 'https://away.iol.pt/aviso-vermelho-ipma/vento/alerta-vermelho-ipma-admite-cenario-semelhante-ao-da-tempestade-kristin-e-aponta-lisboa-como-uma-das-regioes-mais-atingidas/20261110/6af2d9fd0cf2cb2507aa81b4', 'read_utc': '2026-11-10T19:00Z', 'read_by': 'incident.meteorologist@web-summit.dinis'},
        {'at_utc': '2026-11-10T12:10Z', 'kind': 'fact', 'event': "The government's alert situation for the mainland on Wednesday cites IPMA: gusts that may reach 120 km/h and, if a sting jet forms, above 150 km/h.",
         'source': 'https://portugal.gov.pt/gc25/comunicacao/noticias/governo-declara-situacao-de-alerta-em-todo-o-territorio-continental-1', 'read_utc': '2026-11-10T17:01Z', 'read_by': 'weather@PrompTugal.vicky (via ' + d + ')'},
        {'at_utc': '2026-11-10T16:52Z', 'kind': 'fact', 'event': 'IPMA warnings read: Lisbon red wind Wed 12:00-21:00; rain orange Wed (05:00 onwards); sea orange Wed 12:00-21:00; a yellow sea warning added Wed 21:00-Thu 03:00.',
         'source': U['warnings'], 'read_utc': '2026-11-10T16:52Z', 'read_by': 'weather@PrompTugal.vicky (via ' + d + ')'},
        {'at_utc': '2026-11-10T17:07Z', 'kind': 'fact', 'event': "IPMA communiqué no. 2: worse weather on the mainland 'a partir do início da manhã do dia 11' (moved earlier from late morning); red and orange warnings issued; further upgrades not ruled out.",
         'source': 'https://www.ipma.pt/resources.www/rss/comunicados.xml', 'read_utc': NOW, 'read_by': 'incident.meteorologist@web-summit.dinis'},
        {'at_utc': 'between 2026-11-10T16:52Z and 17:42Z', 'kind': 'fact', 'event': 'IPMA raises Lisbon rain to RED Wed 12:00-18:00 (orange now 05:00-12:00 only). First read at 17:42.',
         'source': U['warnings'], 'read_utc': '2026-11-10T17:42Z', 'read_by': 'weather@PrompTugal.vicky (via ' + d + ')'},
    ]


# ---------------------------------------------------------------- communiqués
def communiques():
    prev = load('communiques.json', {})
    raw = get('communiques')
    if raw is None:
        return prev
    root = ET.fromstring(raw)
    built = (root.findtext('channel/lastBuildDate') or '').strip()
    seen = {c['title']: c for c in prev.get('items', [])}
    for it in root.findall('channel/item'):
        title = re.sub(r'\s+', ' ', it.findtext('title') or '').strip()
        text = re.sub(r'\s+', ' ', re.sub('<[^>]+>', ' ', html.unescape(it.findtext('description') or ''))).strip()
        if 'Sismo' in title:
            continue
        m = re.search(r'válido entre (\S+ \S+) e (\S+ \S+)', text)
        rec = {'title': title, 'issued_utc': (it.findtext('pubDate') or '').strip().replace(' ', 'T')[:16] + 'Z',
               'valid_from_utc': m and m.group(1).replace(' ', 'T') + 'Z', 'valid_to_utc': m and m.group(2).replace(' ', 'T') + 'Z',
               'link': (it.findtext('link') or '').strip(), 'text_pt': text, 'source': U['communiques'], 'read_utc': NOW}
        if title not in seen:
            changes.append('New IPMA communiqué: ' + title)
            seen[title] = rec
        elif seen[title]['text_pt'] != text:
            changes.append('IPMA communiqué text changed: ' + title)
            rec['first_read_utc'] = seen[title].get('first_read_utc', seen[title]['read_utc'])
            seen[title] = rec
        else:
            seen[title]['last_seen_utc'] = NOW
    items = sorted(seen.values(), key=lambda c: c['issued_utc'], reverse=True)
    earlier = prev.get('not_in_feed') or [{
        'title': 'Depressão CHARLES - Comunicado nº1', 'issued_utc': '2026-11-09T13:17Z', 'valid_to_utc': '2026-11-11T23:59Z',
        'summary_en': "Names CHARLES; expected north of Madeira at 00 UTC on 11 Nov, then towards the mainland, 'com elevada incerteza na trajetória e intensidade'. Mainland: worse weather from late morning on the 11th; centre most likely between Sines and Cabo Carvoeiro; gusts 100-120 km/h on its southern edge, locally higher; orange warnings to be issued, upgrade not ruled out.",
        'source': 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/weather-vicky/live.md', 'read_utc': '2026-11-10T16:53Z',
        'note': 'No longer in the RSS feed (replaced by no. 2); read by weather@PrompTugal.vicky at the time; quoted from its record.'}]
    return {'about': "IPMA's communiqués (special weather information) from its RSS feed, kept across reads; earthquake notices left out.",
            'source': U['communiques'], 'feed_built_local': built, 'read_utc': NOW, 'items': items, 'not_in_feed': earlier}


# ---------------------------------------------------------------- stations
def stations():
    prev = load('stations.json', {})
    raw, meta = get('obs'), get('stations')
    if raw is None:
        return prev
    obs = json.loads(raw)
    coords = {}
    if meta:
        for f in json.loads(meta):
            coords[str(f['properties']['idEstacao'])] = f['geometry']['coordinates'][::-1]
    keep = {s['id']: {r['time_utc']: r for r in s['hourly']} for s in prev.get('stations', [])}
    out = []
    for sid, name in LISBON_STATIONS.items():
        rows = keep.get(sid, {})
        for hour in sorted(obs):
            o = (obs[hour] or {}).get(sid)
            if not o:
                continue
            rows[hour + 'Z'] = {'time_utc': hour + 'Z', 'wind_mean_kmh': num(o.get('intensidadeVentoKM')),
                                'wind_dir': DIRS.get(o.get('idDireccVento')), 'rain_mm': num(o.get('precAcumulada')),
                                'temp_c': num(o.get('temperatura')), 'pressure_hpa': num(o.get('pressao')),
                                'humidity_pct': num(o.get('humidade'))}
        hourly = [rows[k] for k in sorted(rows)]
        winds = [r for r in hourly if r['wind_mean_kmh'] is not None]
        mx = max(winds, key=lambda r: r['wind_mean_kmh'], default=None)
        out.append({'id': sid, 'name': name, 'lat_lon': coords.get(sid), 'source': U['obs'], 'read_utc': NOW,
                    'latest': hourly[-1] if hourly else None,
                    'max_wind_mean': mx and {'kmh': mx['wind_mean_kmh'], 'time_utc': mx['time_utc']},
                    'rain_sum_mm_hours_kept': round(sum(r['rain_mm'] or 0 for r in hourly), 1), 'hourly': hourly})
    latest = max((s['latest']['time_utc'] for s in out if s['latest']), default=None)
    if latest and latest != prev.get('latest_hour_utc'):
        top = max((s for s in out if s['latest'] and s['latest']['wind_mean_kmh'] is not None),
                  key=lambda s: s['latest']['wind_mean_kmh'], default=None)
        if top:
            changes.append(f"stations to {latest[11:16]}: top mean wind {top['latest']['wind_mean_kmh']} km/h at {top['name']}")
    return {'about': "IPMA's hourly station observations in and next to Lisbon, kept across reads (the feed holds 24 hours). Mean wind only: this feed has NO gusts; gusts are in the airport's METAR (airport.json).",
            'source': U['obs'], 'stations_source': U['stations'], 'read_utc': NOW, 'latest_hour_utc': latest, 'stations': out}


# ---------------------------------------------------------------- airport
def airport():
    prev = load('airport.json', {})
    traw, mraw = get('taf'), get('metar')
    tafs = {t['issue_utc']: t for t in prev.get('taf_history', [])}
    taf = prev.get('taf')
    if traw:
        for t in json.loads(traw):
            groups = [{'change': g.get('fcstChange') or 'BASE', 'prob': g.get('probability'),
                       'from_utc': utc(g.get('timeFrom')), 'to_utc': utc(g.get('timeTo')),
                       'becoming_by_utc': utc(g.get('timeBec')), 'wind_dir': g.get('wdir'),
                       'wind_kt': g.get('wspd'), 'gust_kt': g.get('wgst'), 'wind_kmh': kmh(g.get('wspd')),
                       'gust_kmh': kmh(g.get('wgst')), 'visibility': g.get('visib'), 'weather': g.get('wxString')}
                      for g in t.get('fcsts', [])]
            taf = {'issue_utc': t['issueTime'][:16] + 'Z', 'raw': t['rawTAF'], 'valid_from_utc': utc(t.get('validTimeFrom')),
                   'valid_to_utc': utc(t.get('validTimeTo')), 'groups': groups, 'source': U['taf'], 'read_utc': NOW}
            if taf['issue_utc'] not in tafs:
                changes.append(f"new LPPT TAF {taf['issue_utc'][8:16]}: " + taf['raw'][:40] + '...')
                tafs[taf['issue_utc']] = {k: taf[k] for k in ('issue_utc', 'raw', 'source', 'read_utc')}
    mets = {m['time_utc']: m for m in prev.get('metars', [])}
    if mraw:
        for m in json.loads(mraw):
            tm = m['reportTime'][:16] + 'Z'
            if tm not in mets:
                mets[tm] = {'time_utc': tm, 'raw': m['rawOb'], 'wind_dir': m.get('wdir'), 'wind_kt': m.get('wspd'),
                            'gust_kt': m.get('wgst'), 'wind_kmh': kmh(m.get('wspd')), 'gust_kmh': kmh(m.get('wgst')),
                            'visibility': m.get('visib'), 'weather': m.get('wxString'), 'pressure_hpa': m.get('altim'),
                            'source': U['metar'], 'read_utc': NOW}
    metars = [mets[k] for k in sorted(mets)]
    gusts = [m for m in metars if m['gust_kt']]
    mx = max(gusts, key=lambda m: m['gust_kt'], default=None)
    if metars and metars[-1]['time_utc'] != (prev.get('metars') or [{}])[-1].get('time_utc'):
        last = metars[-1]
        changes.append(f"LPPT METAR {last['time_utc'][11:16]}: {last['wind_kmh']} km/h" + (f" gust {last['gust_kmh']}" if last['gust_kt'] else ''))
    # earlier issues seen by the newsroom before this desk began
    if 'TAF_AMD_101523Z' not in json.dumps(list(tafs.values())):
        tafs['2026-11-10T15:23Z'] = {'issue_utc': '2026-11-10T15:23Z', 'id': 'TAF_AMD_101523Z',
                                     'summary_en': 'Wind S becoming 25 kt G38 (about 70 km/h) Wed 07-09 UTC; TEMPO 35 kt G48 (89 km/h) 09-18 UTC; PROB40 TEMPO 42 kt G58 (107 km/h) +TSRA 10-18 UTC.',
                                     'source': 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/weather-vicky/live.md', 'read_utc': '2026-11-10T16:54Z'}
    return {'about': "IPMA's aeronautical forecast (TAF) and observations (METAR) for Lisbon airport (LPPT), read through the US NOAA Aviation Weather Center's public API. Knots, with km/h (1 kt = 1.852 km/h). A point forecast for pilots at the airport, 8 km north of the centre; not a public warning.",
            'read_utc': NOW, 'taf': taf, 'taf_history': [tafs[k] for k in sorted(tafs)],
            'metars': metars, 'max_gust': mx and {'kt': mx['gust_kt'], 'kmh': mx['gust_kmh'], 'time_utc': mx['time_utc'], 'source': mx['source']}}


# ---------------------------------------------------------------- forecast
def forecast():
    prev = load('forecast.json', {})
    d, h = get('daily'), get('hourly')
    out = dict(prev)
    out['about'] = "IPMA's own forecast for Lisbon (globalIdLocal 1110600): the 5-day daily forecast and the hourly model forecast (mean wind, no gusts). IPMA's wind classes: 1 weak, 2 moderate, 3 strong, 4 very strong."
    if d:
        dd = json.loads(d)
        out['daily'] = {'source': U['daily'], 'read_utc': NOW, 'updated_local': dd.get('dataUpdate'), 'days': dd.get('data')}
    if h:
        hh = json.loads(h)
        rows = [{'time_utc': x['dataPrev'][:16] + 'Z', 'wind_mean_kmh': num(x.get('ffVento')), 'wind_dir': x.get('ddVento'),
                 'rain_prob_pct': num(x.get('probabilidadePrecipita')), 'rain_intensity_class': x.get('idIntensidadePrecipita'),
                 'temp_c': num(x.get('tMed')), 'sea_total_m': num(x.get('marTotal'))} for x in hh if x.get('idPeriodo') == 1]
        upd = hh[0].get('dataUpdate') if hh else None
        if upd and upd != (prev.get('hourly') or {}).get('updated_local'):
            changes.append(f'IPMA hourly forecast updated {upd}')
            runs = prev.get('hourly_runs', [])
            if prev.get('hourly'):
                runs.append({'updated_local': prev['hourly']['updated_local'], 'source': U['hourly'], 'read_utc': prev['hourly']['read_utc'],
                             'wed_peak': prev['hourly'].get('wed_peak')})
            out['hourly_runs'] = runs
        wed = [r for r in rows if r['time_utc'].startswith('2026-11-11') and r['wind_mean_kmh'] is not None]
        pk = max(wed, key=lambda r: r['wind_mean_kmh'], default=None)
        out['hourly'] = {'source': U['hourly'], 'read_utc': NOW, 'updated_local': upd, 'wed_peak': pk, 'rows': rows}
    return out


def main():
    w, c, s, a, f = warnings(), communiques(), stations(), airport(), forecast()
    for name, obj in (('warnings.json', w), ('communiques.json', c), ('stations.json', s), ('airport.json', a), ('forecast.json', f)):
        if obj:
            save(name, obj)
    # gusts against the forecast, now
    wind = next((x for x in (w.get('lisbon') or []) if x['type'] == 'Vento' and x['level'] == 'red'), None)
    last = (a.get('metars') or [None])[-1]
    taf_now = None
    if a.get('taf') and last:
        t = last['time_utc']
        taf_now = [g for g in a['taf']['groups'] if g['from_utc'] and g['from_utc'] <= t < g['to_utc'] and (g['wind_kt'] or g['gust_kt'])]
    peaks = sorted(((st['latest']['wind_mean_kmh'], st['name'], st['latest']['time_utc']) for st in s.get('stations', [])
                    if st.get('latest') and st['latest']['wind_mean_kmh'] is not None), reverse=True)
    save('gusts-vs-forecast.json', {
        'about': 'The latest observed wind in Lisbon against what was forecast for that hour. Facts with sources; no analysis here (see analysis.md).',
        'read_utc': NOW,
        'observed_airport_latest': last,
        'observed_airport_max_gust': a.get('max_gust'),
        'observed_stations_latest_mean': [{'kmh': k, 'station': n, 'time_utc': tm, 'source': U['obs'], 'read_utc': NOW} for k, n, tm in peaks[:5]],
        'forecast_taf_groups_for_that_hour': {'source': U['taf'], 'read_utc': NOW, 'groups': taf_now},
        'forecast_ipma_red_wind_warning': wind and {'gusts_kmh': '120, up to 140 in the most exposed places', **wind},
        'forecast_ipma_hourly_wed_peak_mean': (f.get('hourly') or {}).get('wed_peak') and {**f['hourly']['wed_peak'], 'source': U['hourly'], 'read_utc': NOW},
    })
    log = load('changes.json', {'about': 'What each refresh found changed, newest last. Written by tools/refresh.py.', 'runs': []})
    log['runs'].append({'read_utc': NOW, 'changes': changes or ['no change'], 'errors': errors})
    save('changes.json', log)
    print(NOW, '|', '; '.join(changes) or 'no change', '| errors:', len(errors))
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
