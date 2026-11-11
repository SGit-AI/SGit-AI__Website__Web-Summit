# The weather picture: data (WS-214, the storm on Wednesday 11 November 2026)

Kept by **incident.meteorologist@web-summit.dinis** for the incident team, the dashboard and, as material, Vicky's weather desk. JSON first: read these files, not pages. **Every record carries `source` (the URL read) and `read_utc` (when).** Facts, press and analysis are labelled (`kind`). Lisbon is on UTC in November (WET): IPMA's local times are UTC.

Every file carries `next_read_utc`, the time of the next scheduled refresh: trust it until then. Refreshed hourly (at :22) with `python3 -I team/incidents/2026-11-10-the-storm/data/weather/tools/refresh.py` (standard library only). Each run keeps what earlier runs saw and appends what changed to `changes.json`. A refused host is recorded under `errors` in that run, and as an ask to Dinis in `team/incidents/agents/meteorologist/status.json`.

| File | What | Source |
|---|---|---|
| `warnings.json` | IPMA's non-green warnings for the Lisbon district (`LSB`) now; red and orange warnings elsewhere; **`history`**: how Lisbon's warnings changed, seeded with what happened before this desk began (each with its own source and reader), then every change each refresh sees | [IPMA warnings open data](https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json) |
| `communiques.json` | IPMA's communiqués (CHARLES no. 2, BRUNA no. 3), full Portuguese text, kept across reads; no. 1 (no longer in the feed) from the newsroom's record | [IPMA communiqués RSS](https://www.ipma.pt/resources.www/rss/comunicados.xml) |
| `stations.json` | Hourly observations at eight stations in and next to Lisbon: mean wind, direction, rain, temperature, pressure; the latest, the maximum, kept across reads. **No gusts in this feed** | [IPMA observations](https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json) |
| `airport.json` | Lisbon airport (LPPT): the current TAF decoded (kt and km/h), every TAF issue seen, every METAR seen with its gust, the maximum gust | [NOAA AWC API: TAF](https://aviationweather.gov/api/data/taf?ids=LPPT&format=json), [METAR](https://aviationweather.gov/api/data/metar?ids=LPPT&hours=30&format=json) (IPMA issues both) |
| `forecast.json` | IPMA's daily forecast for Lisbon and its hourly model forecast (mean wind, rain, sea); each new model run recorded in `hourly_runs` | [daily](https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1110600.json), [hourly](https://api.ipma.pt/public-data/forecast/aggregate/1110600.json) |
| `gusts-vs-forecast.json` | The latest observed wind (airport gust, station means) beside what was forecast for that hour (TAF group, the red warning, the model's peak) | the above |
| `cap.json` | IPMA's warnings for Lisboa as CAP messages via MeteoAlarm, with **the time IPMA sent each** and the message it replaces (the open data has no issue time and lagged CAP by 2 h+ on 10 Nov) | [MeteoAlarm Portugal feed](https://feeds.meteoalarm.org/api/v1/warnings/feeds-portugal) |
| `forecast.json` → `second_models` | Other models for Lisbon, Wed and Thu morning, one block per source, never merged with IPMA: `met_no` (MET Norway, NLOD/CC BY 4.0), `open_meteo` (CC BY 4.0; rate-limited at first try) | [met.no](https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=38.72&lon=-9.14), [Open-Meteo](https://open-meteo.com/) |
| `madeira.json` | IPMA's Madeira stations: hourly rain and mean wind, kept, with each station's largest 6-hour rain | [IPMA observations](https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json) |
| `lisbon-rain.json` | Lisbon's eight stations in `madeira.json`'s shape (hourly rain and mean wind, largest 6-hour rain), for the warned-against-observed rain card from Wed 09:00. Both files carry `hour_label`: IPMA does not document whether a label is the hour starting or ending (our inference, labelled: hour ending, UTC) | [IPMA observations](https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json) |
| `changes.json` | **First: `thursday`** (Lisbon warnings touching Thu 12 Nov; IPMA model, daily and TAF for Thursday morning); **then `gusts_above_warned`**, every airport gust from Wed 05:00 above the gust warned for that hour (the IPMA wind warning in force, else the TAF), each with its METAR; then what each refresh found changed | this tool |
| `analysis.md`, `analysis.json` | **ANALYSIS:** when the worst arrives and ends on Wednesday; how far ahead each warning could be known | reasoning from the files |

Notes:
- IPMA's warnings feed carries **no issue time**. An issue time here comes from a read (two reads bracket it) or from press (labelled `press`).
- The TAF is a point forecast for the airport, for pilots; quoted beside IPMA's warning, never instead of it. Gusts at the airport and the warning's gusts (120, up to 140 km/h, for the district's most exposed places) are not the same measure.
- The maritime authority's figures (AMN: gusts to 168 km/h at sea) are not IPMA's land warning; they are not mixed in here.
- Public sources only; no contact details.
