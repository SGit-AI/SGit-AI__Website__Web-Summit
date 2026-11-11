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
from datetime import datetime, timezone, timedelta

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
    'cap': 'https://feeds.meteoalarm.org/api/v1/warnings/feeds-portugal',
    'met_no': 'https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=38.72&lon=-9.14',
    'open_meteo': 'https://api.open-meteo.com/v1/forecast?latitude=38.72&longitude=-9.14&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation&timezone=UTC&start_date=2026-11-11&end_date=2026-11-12',
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
CAP_INDEX = {}  # (areaDesc, type_pt, level, onset 'YYYY-MM-DDTHH:MM', expires) -> [sent_utc, ...], from the latest CAP read
AREA_CAP = {'AVR': 'Aveiro', 'BJA': 'Beja', 'BRG': 'Braga', 'BGC': 'Bragança', 'CBO': 'Castelo Branco', 'CBR': 'Coimbra',
            'EVR': 'Évora', 'FAR': 'Faro', 'GDA': 'Guarda', 'LRA': 'Leiria', 'LSB': 'Lisboa', 'PTG': 'Portalegre', 'PTO': 'Porto',
            'STM': 'Santarém', 'STB': 'Setúbal', 'VCT': 'Viana do Castelo', 'VRL': 'Vila Real', 'VIS': 'Viseu',
            'ACE': 'Açores - Grupo Central', 'AOC': 'Açores - Grupo Ocidental', 'AOR': 'Açores - Grupo Oriental',
            'MCN': 'Madeira - Costa Norte', 'MCS': 'Madeira - Costa Sul', 'MPS': 'Madeira - Porto Santo', 'MRM': 'Madeira - Regiões Montanhosas'}
OTHER_SEEN, OTHER_IN_FEED = {}, set()
CAP_LEVEL = {'Amarelo': 'yellow', 'Laranja': 'orange', 'Vermelho': 'red', 'Verde': 'green'}


def sent_for(area, typ, level, start, end):
    """The CAP sent time of the message matching this warning exactly (area, type, level, window), else None. Never a guess."""
    hits = CAP_INDEX.get((AREA_CAP.get(area), typ, level, start[:16], end[:16]), [])
    return max(hits) if hits else None


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


def next_read():
    """The next scheduled refresh: the hourly wake at :22 (UTC)."""
    now = datetime.now(timezone.utc).replace(second=0, microsecond=0)
    nxt = now.replace(minute=22)
    if nxt <= now:
        nxt = nxt + timedelta(hours=1)
    return nxt.strftime('%Y-%m-%dT%H:%MZ')


def save(name, obj):
    if isinstance(obj, dict):
        obj['next_read_utc'] = next_read()  # until when to trust this file (the librarian's now.json reads it)
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
    for x in lsb:
        x['sent_utc'] = sent_for('LSB', x['type'], x['level'], x['start_utc'], x['end_utc'])
    for x in elsewhere:
        x['sent_utc'] = sent_for(x['area'], x['type'], x['level'], x['start_utc'], x['end_utc'])
    peak = max((RANK[w['level']] for w in lsb), default=0)
    return {
        'about': "IPMA's weather warnings for the Lisbon district (idAreaAviso LSB), non-green only; red and orange warnings elsewhere; and how Lisbon's warnings changed over time. Times are local = UTC (WET). IPMA's open data carries no issue time: `sent_utc` is the sent time of the CAP message (MeteoAlarm, cap.json) matching the warning's area, type, level and window exactly, or null where none matches (never guessed).",
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
            changes.insert(0, 'NEW IPMA COMMUNIQUÉ: ' + title)
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
        # IPMA can change the values without changing dataUpdate (seen 10 Nov, 20:22-21:18): compare the values too
        key = lambda rs: json.dumps([(r['time_utc'], r['wind_mean_kmh'], r['wind_dir']) for r in rs if r['time_utc'] >= '2026-11-11'])
        old = prev.get('hourly') or {}
        if old and (upd != old.get('updated_local') or key(rows) != key(old.get('rows', []))):
            changes.append(f'IPMA hourly forecast changed (dataUpdate {upd}' + (', unchanged stamp' if upd == old.get('updated_local') else '') + ')')
            runs = prev.get('hourly_runs', [])
            runs.append({'updated_local': old.get('updated_local'), 'source': U['hourly'], 'read_utc': old.get('read_utc'),
                         'replaced_at_or_before_utc': NOW, 'wed_peak': old.get('wed_peak'),
                         'wed_rows': [r for r in old.get('rows', []) if r['time_utc'].startswith('2026-11-11')]})
            out['hourly_runs'] = runs
        wed = [r for r in rows if r['time_utc'].startswith('2026-11-11') and r['wind_mean_kmh'] is not None]
        pk = max(wed, key=lambda r: r['wind_mean_kmh'], default=None)
        out['hourly'] = {'source': U['hourly'], 'read_utc': NOW, 'updated_local': upd, 'wed_peak': pk, 'rows': rows}
    return out


def gusts_above_warned(w, a):
    """METAR gusts from Wed 05:00 above the gust warned for that hour (facts; no analysis)."""
    out, wind = [], [x for x in (w.get('lisbon') or []) if x['type'] == 'Vento']
    groups = (a.get('taf') or {}).get('groups') or []
    for m in a.get('metars') or []:
        if m['time_utc'] < '2026-11-11T05:00Z' or not m.get('gust_kmh'):
            continue
        t = m['time_utc'][:16]
        warn = next((x for x in wind if x['start_utc'][:16] <= t < x['end_utc'][:16]), None)
        if warn:
            nums = [int(n) for n in re.findall(r'(\d+) km/h', warn['text_pt'])]
            warned, by = (min(nums) if nums else None), f"IPMA {warn['level']} wind warning: {warn['text_pt']}"
        else:
            g = [x['gust_kmh'] for x in groups if x['gust_kmh'] and x['from_utc'] and x['from_utc'] <= t < x['to_utc']]
            warned, by = (max(g) if g else None), 'no IPMA wind warning in force; highest TAF gust for that hour'
        if warned and m['gust_kmh'] > warned:
            out.append({'time_utc': m['time_utc'], 'gust_kmh': m['gust_kmh'], 'gust_kt': m['gust_kt'], 'warned_kmh': warned,
                        'warned_by': by, 'metar': m['raw'], 'source': m['source'], 'read_utc': m['read_utc']})
    return out


def thursday(w, f, a, prev):
    """Thursday 12 November (day 3): Lisbon's warnings touching it and the forecasts for its morning (facts, sourced)."""
    T0, T1 = '2026-11-12T00:00', '2026-11-13T00:00'
    warns = [x for x in (w.get('lisbon') or []) if x['start_utc'][:16] < T1 and x['end_utc'][:16] > T0]
    rows = [r for r in (f.get('hourly') or {}).get('rows', []) if T0 <= r['time_utc'][:16] < '2026-11-12T13:00']
    day = next((d for d in (f.get('daily') or {}).get('days') or [] if d.get('forecastDate') == '2026-11-12'), None)
    taf = a.get('taf') or {}
    tg = [g for g in taf.get('groups', []) if g['to_utc'] and g['to_utc'] > T0 + 'Z']
    winds = [r['wind_mean_kmh'] for r in rows if r['wind_mean_kmh'] is not None]
    seas = [r['sea_total_m'] for r in rows if r['sea_total_m'] is not None]
    out = {
        'about': "Thursday 12 November (Web Summit's day 3): every IPMA warning for Lisbon that touches Thursday, and what IPMA's model and the airport TAF say for Thursday morning (00:00-12:00 UTC = Lisbon time). Facts, each with its source; no analysis here.",
        'read_utc': NOW,
        'lisbon_warnings_touching_thursday': {'source': U['warnings'], 'read_utc': NOW, 'items': warns,
                                              'none_above_yellow': all(x['level'] in ('yellow', 'green') for x in warns)},
        'ipma_model_thursday_morning': {'source': U['hourly'], 'read_utc': NOW, 'model_updated_local': (f.get('hourly') or {}).get('updated_local'),
                                        'wind_mean_kmh_range': winds and [min(winds), max(winds)],
                                        'wind_dirs': sorted({r['wind_dir'] for r in rows if r['wind_dir']}),
                                        'rain_prob_pct_max': max((r['rain_prob_pct'] for r in rows if r['rain_prob_pct'] is not None), default=None),
                                        'sea_total_m_range': seas and [min(seas), max(seas)], 'rows': rows},
        'ipma_daily_thursday': day and {'source': U['daily'], 'read_utc': NOW, 'updated_local': (f.get('daily') or {}).get('updated_local'), **day},
        'taf_groups_into_thursday': {'source': U['taf'], 'read_utc': NOW, 'taf_issue_utc': taf.get('issue_utc'),
                                     'taf_valid_to_utc': taf.get('valid_to_utc'), 'groups': tg},
    }
    sig = lambda o: json.dumps([o['lisbon_warnings_touching_thursday']['items'] and [(x['type'], x['level'], x['start_utc'], x['end_utc']) for x in o['lisbon_warnings_touching_thursday']['items']],
                                o['ipma_model_thursday_morning']['model_updated_local'], (o.get('ipma_daily_thursday') or {}).get('updated_local'), o['taf_groups_into_thursday']['taf_issue_utc']])
    if not prev or sig(prev) != sig(out):
        tq = out['taf_groups_into_thursday']
        if tq['groups'] and (not prev or not prev['taf_groups_into_thursday']['groups']):
            changes.insert(0, f"FIRST TAF COVERING THURSDAY: issued {tq['taf_issue_utc']}, valid to {tq['taf_valid_to_utc']}")
        changes.insert(0, 'THURSDAY: warnings ' + (', '.join(f"{x['level']} {x['type']} {x['start_utc'][8:16]}-{x['end_utc'][8:16]}" for x in warns) or 'none') +
                       (f"; model Thu 00-12 mean wind {min(winds)}-{max(winds)} km/h" if winds else ''))
    return out


def cap():
    """IPMA's warnings for Lisboa as CAP messages through MeteoAlarm: these carry the time IPMA SENT each one."""
    prev = load('cap.json', {})
    raw = get('cap')
    if raw is None:
        return prev
    seen = {m['identifier']: m for m in prev.get('lisbon_messages', [])}  # every message once seen is kept, never dropped
    OTHER_SEEN.clear(); OTHER_IN_FEED.clear()
    for m_ in prev.get('other_messages', []):
        OTHER_SEEN[m_['identifier'] + '|' + ','.join(m_['areas'])] = m_
    in_feed = set()
    for x in json.loads(raw).get('warnings', []):
        al = x.get('alert', {})
        for i in al.get('info', []):
            if not i.get('language', '').startswith('pt'):
                continue
            m = re.match(r'Aviso (\w+) (.+)$', i.get('event') or '')
            if m and al.get('sent') and i.get('onset') and i.get('expires'):
                for z in i.get('area', []):
                    k = (z.get('areaDesc'), m.group(2), CAP_LEVEL.get(m.group(1)), i['onset'][:16], i['expires'][:16])
                    CAP_INDEX.setdefault(k, []).append(datetime.fromisoformat(al['sent']).astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'))
            areas = [z.get('areaDesc') for z in i.get('area', [])]
            if 'Lisboa' not in areas:
                if m and (CAP_LEVEL.get(m.group(1)) == 'red' or any(a_.startswith('Madeira') for a_ in areas)):
                    oid = al.get('identifier') + '|' + ','.join(areas)
                    OTHER_SEEN.setdefault(oid, {'identifier': al.get('identifier'), 'areas': areas, 'sent_utc': al.get('sent'), 'msg_type': al.get('msgType'),
                                                'event_pt': i.get('event'), 'onset_utc': i.get('onset'), 'expires_utc': i.get('expires'),
                                                'replaces': [{'identifier': r.split(',')[1], 'sent_utc': r.split(',')[2]} for r in (al.get('references') or '').split(' ') if r.count(',') == 2],
                                                'source': U['cap'], 'read_utc': NOW})
                    OTHER_IN_FEED.add(oid)
                continue
            ident = al.get('identifier')
            in_feed.add(ident)
            if ident in seen:
                seen[ident]['last_seen_utc'] = NOW
                seen[ident].pop('left_feed_utc', None)
                seen[ident].pop('status', None)
                continue
            refs = [r.split(',') for r in (al.get('references') or '').split(' ') if r.count(',') == 2]
            rec = {'identifier': ident, 'sent_utc': al.get('sent'), 'msg_type': al.get('msgType'), 'event_pt': i.get('event'),
                   'severity': i.get('severity'), 'onset_utc': i.get('onset'), 'expires_utc': i.get('expires'),
                   'description_pt': i.get('description'), 'replaces': [{'identifier': r[1], 'sent_utc': r[2]} for r in refs],
                   'source': U['cap'], 'read_utc': NOW}
            seen[ident] = rec
            if prev and (rec['sent_utc'] or '') >= '2026-11-10':
                changes.insert(0, f"IPMA CAP (MeteoAlarm) sent {rec['sent_utc'][11:19]}: {rec['event_pt']} {(rec['onset_utc'] or '')[8:16]}-{(rec['expires_utc'] or '')[8:16]}")
    for ident, m in seen.items():
        if ident not in in_feed and 'left_feed_utc' not in m:
            m['left_feed_utc'] = NOW
            m['status'] = f'left the feed at {NOW} (time read)'
    msgs = sorted(seen.values(), key=lambda m: (m['sent_utc'] or '', m['identifier']))
    for oid, m_ in OTHER_SEEN.items():
        if oid in OTHER_IN_FEED:
            m_.pop('left_feed_utc', None); m_.pop('status', None); m_['last_seen_utc'] = NOW
        elif 'left_feed_utc' not in m_:
            m_['left_feed_utc'] = NOW; m_['status'] = f'left the feed at {NOW} (time read)'
    others = sorted(OTHER_SEEN.values(), key=lambda m: (m['sent_utc'] or '', m['identifier']))
    reads = prev.get('reads_utc', [])
    log = os.environ.get('CAP_POLL_LOG')  # the session's 5-minute poll writes its read times here
    if log and os.path.exists(log):
        reads += [l.strip() for l in open(log) if l.strip()]
    reads = sorted(set(reads + [NOW]))
    disclaimer = ('Time delays between this website and the www.meteoalarm.org website are possible. For the most up-to-date awareness '
                  'information as published by the participating National Meteorological and Hydrological Services, please refer to www.meteoalarm.org.')
    return {'about': f"IPMA's warnings for the Lisbon district as CAP messages (Common Alerting Protocol), read through MeteoAlarm's public feed (https://www.meteoalarm.org). A dated record, not a live feed: read {NOW}. MeteoAlarm: \"{disclaimer}\" Unlike IPMA's open data, each message carries `sent_utc`, the time IPMA issued it, and `replaces`, the message it updates (with that one's sent time). Every message once seen is kept; one no longer in the feed is marked `left_feed_utc` (the time read). Messages that left the feed before this desk's first read (10 Nov 23:51) were never seen. Facts.",
            'terms': {'source': 'https://www.meteoalarm.org', 'feed': U['cap'], 'disclaimer': disclaimer,
                      'record': f'a dated record, not a live feed (read {NOW})', 'publisher_of_the_warnings': 'IPMA (Instituto Português do Mar e da Atmosfera), via MeteoAlarm'},
            'source': U['cap'], 'read_utc': NOW, 'reads_utc': reads, 'lisbon_messages': msgs,
            'other_messages_about': 'Beyond Lisbon: every CAP message for a Madeira area, and every red message for any district, kept once seen (from 11 Nov 01:50 UTC; earlier ones that had left the feed were never seen).',
            'other_messages': others}


def second_models(prev):
    """Other models for Lisbon (38.72N 9.14W), Wednesday and Thursday morning: each in its own block, never merged with IPMA."""
    out = dict(prev or {})
    raw = get('met_no')
    if raw:
        m = json.loads(raw)
        rows = []
        for t in m['properties']['timeseries']:
            if not ('2026-11-11T00' <= t['time'][:13] <= '2026-11-12T12'):
                continue
            d = t['data']['instant']['details']
            n1 = (t['data'].get('next_1_hours') or {}).get('details', {})
            rows.append({'time_utc': t['time'][:16] + 'Z', 'wind_mean_kmh': d.get('wind_speed') is not None and round(d['wind_speed'] * 3.6, 1) or None,
                         'gust_kmh': d.get('wind_speed_of_gust') is not None and round(d['wind_speed_of_gust'] * 3.6, 1) or None,
                         'wind_from_deg': d.get('wind_from_direction'), 'rain_mm_next_1h': n1.get('precipitation_amount'),
                         'pressure_hpa': d.get('air_pressure_at_sea_level')})
        upd = m['properties']['meta'].get('updated_at')
        if upd != (out.get('met_no') or {}).get('updated_utc'):
            changes.append(f'met.no forecast updated {upd}')
        out['met_no'] = {'name': 'MET Norway Locationforecast 2.0 (complete)', 'licence': 'NLOD 2.0 / CC BY 4.0, data from MET Norway',
                         'source': U['met_no'], 'read_utc': NOW, 'updated_utc': upd, 'units': 'km/h (converted from m/s), mm, hPa', 'rows': rows}
    raw = get('open_meteo')
    if raw:
        o = json.loads(raw)
        h = o.get('hourly') or {}
        rows = [{'time_utc': t + 'Z', 'wind_mean_kmh': w, 'gust_kmh': g, 'wind_from_deg': d, 'rain_mm': r}
                for t, w, g, d, r in zip(h.get('time', []), h.get('wind_speed_10m', []), h.get('wind_gusts_10m', []), h.get('wind_direction_10m', []), h.get('precipitation', []))
                if t <= '2026-11-12T12:00']
        out['open_meteo'] = {'name': 'Open-Meteo (best match)', 'licence': 'CC BY 4.0, Open-Meteo.com', 'source': U['open_meteo'], 'read_utc': NOW, 'rows': rows}
    elif 'open_meteo' not in out:
        out['open_meteo'] = {'name': 'Open-Meteo (best match)', 'source': U['open_meteo'], 'read_utc': NOW, 'rows': [],
                             'not_read': 'refused: see changes.json errors (429 daily limit on first try, 23:50 UTC)'}
    return out


def madeira():
    """IPMA's Madeira stations: hourly rain and mean wind, kept across reads, and each station's largest 6-hour rain."""
    prev = load('madeira.json', {})
    raw, meta = get('obs'), get('stations')
    if raw is None or meta is None:
        return prev
    obs = json.loads(raw)
    names = {str(f['properties']['idEstacao']): (f['properties']['localEstacao'], f['geometry']['coordinates'][::-1]) for f in json.loads(meta)}
    ids = [k for k, (n, _) in names.items() if n.startswith('Madeira') or 'Funchal' in n or 'Porto Santo' in n]
    keep = {s_['id']: {r['time_utc']: r for r in s_['hourly']} for s_ in prev.get('stations', [])}
    out = []
    for sid in ids:
        rows = keep.get(sid, {})
        for hour in sorted(obs):
            o = (obs[hour] or {}).get(sid)
            if o:
                rows[hour + 'Z'] = {'time_utc': hour + 'Z', 'rain_mm': num(o.get('precAcumulada')), 'wind_mean_kmh': num(o.get('intensidadeVentoKM')), 'wind_dir': DIRS.get(o.get('idDireccVento'))}
        hourly = [rows[k] for k in sorted(rows)]
        if not hourly:
            continue
        best = None
        for i in range(len(hourly)):
            win = hourly[max(0, i - 5):i + 1]
            # six consecutive hourly values (hours labelled h-5 .. h): the 6 h ending at hour h
            if len(win) == 6 and all(r['rain_mm'] is not None for r in win):
                t = round(sum(r['rain_mm'] for r in win), 1)
                if best is None or t > best['mm']:
                    best = {'mm': t, 'hours_labelled': [win[0]['time_utc'], win[-1]['time_utc']]}
        out.append({'id': sid, 'name': names[sid][0], 'lat_lon': names[sid][1], 'source': U['obs'], 'read_utc': NOW, 'max_6h_rain': best, 'hourly': hourly})
    out.sort(key=lambda s_: -((s_['max_6h_rain'] or {}).get('mm') or 0))
    top = out[0] if out else None
    if top and top['max_6h_rain'] and top['max_6h_rain'] != ((prev.get('stations') or [{}])[0].get('max_6h_rain')):
        changes.append(f"Madeira: largest 6 h rain {top['max_6h_rain']['mm']} mm at {top['name']} (hours {top['max_6h_rain']['hours_labelled'][0][8:13]}-{top['max_6h_rain']['hours_labelled'][1][8:13]})")
    return {'about': "IPMA's hourly station observations in Madeira (rain in mm per hour, mean wind), kept across reads (the feed holds 24 hours), sorted by each station's largest rain over six consecutive hourly values. Facts.",
            'source': U['obs'], 'stations_source': U['stations'], 'read_utc': NOW, 'stations': out}


def main():
    k = cap()  # first: warnings() takes each warning's issue time (sent_utc) from it
    w, c, s, a, f = warnings(), communiques(), stations(), airport(), forecast()
    f['second_models'] = second_models(f.get('second_models'))
    mad = madeira()
    for name, obj in (('warnings.json', w), ('communiques.json', c), ('stations.json', s), ('airport.json', a), ('forecast.json', f), ('cap.json', k), ('madeira.json', mad)):
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
    log = load('changes.json', {'runs': []})
    thu = thursday(w, f, a, log.get('thursday'))
    above = gusts_above_warned(w, a)
    if above and len(above) > len(log.get('gusts_above_warned', [])):
        changes.insert(0, f"OBSERVED GUST ABOVE WARNED: {above[-1]['gust_kmh']} km/h at {above[-1]['time_utc']} (warned {above[-1]['warned_kmh']})")
    log['runs'].append({'read_utc': NOW, 'changes': changes or ['no change'], 'errors': errors})
    an = load('analysis.json', None)
    if an is not None:
        save('analysis.json', an)
    save('changes.json', {'thursday': thu, 'gusts_above_warned': above,
                          'about': 'thursday (first): Lisbon warnings touching Thursday 12 Nov and the forecasts for its morning. gusts_above_warned: every LPPT METAR gust from Wed 05:00 above the gust warned for that hour (the IPMA wind warning in force, from its text; outside a wind warning, the highest gust in the TAF groups covering that hour). Facts, each with its source. Then what each refresh found changed, newest last. Written by tools/refresh.py.',
                          'runs': log['runs']})
    print(NOW, '|', '; '.join(changes) or 'no change', '| errors:', len(errors))
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
