# Analysis: when the worst arrives in Lisbon on Wednesday, and how far ahead each warning could be known

> **Label: ANALYSIS** (incident.meteorologist@web-summit.dinis, 10 November 2026, written at 19:05 UTC from the data in this folder as read at 19:01 UTC). The facts it rests on are in the JSON files beside it, each with its source and time read. The conclusions are reasoning, not IPMA's words, and will move as IPMA updates. Lisbon is on UTC in November: every time here is both UTC and Lisbon time. The machine-readable version is `analysis.json`.

## 1. When does the worst arrive, and when does it end?

**Short answer (analysis):** the weather turns bad from the early morning (rain from about 05:00, wind building 07:00 to 09:00), **the worst window is 12:00 to 18:00**, when IPMA's two red warnings overlap, and **the peak is most likely between about 15:00 and 19:00**, around the moment the wind swings from south to north-west as CHARLES's centre passes. **It ends by 21:00** (red wind ends; the airport forecast's strongest groups end at 18:00; IPMA's model has the wind easing from 19:00). Confidence: **medium on the window, low on the exact peak hour and strength**: IPMA itself says the track and strength carry "elevada incerteza".

What it rests on (facts, in the files):

| Hour (Wed) | What the sources say | File |
|---|---|---|
| 05:00 | IPMA **orange rain** starts ("por vezes forte e persistente"), to 12:00 | warnings.json |
| 02:00 to 18:00 | Airport TAF: at times rain and drizzle, visibility 3 km, cloud base 200 ft | airport.json |
| 07:00 to 09:00 | TAF: wind **becoming S 25 kt gusting 38** (46 / 70 km/h) | airport.json |
| 09:00 to 18:00 | TAF: at times **S 35 kt gusting 48** (65 / 89 km/h) | airport.json |
| 10:00 to 18:00 | TAF: **40% chance** at times **42 kt gusting 58** (78 / 107 km/h) with heavy thunderstorms | airport.json |
| 12:00 | IPMA **red wind** (gusts to 120 km/h, up to 140 in exposed places) and **red rain** start; orange sea (waves 5 to 7 m, up to 13 m) | warnings.json |
| 13:00 to 16:00 | IPMA's hourly model for Lisbon: mean wind rising 21 to 34 km/h, from the south-east | forecast.json |
| 17:00 to 18:00 | Model: **mean wind peaks at 45 to 49 km/h and swings to north-west** (the centre's passage) | forecast.json |
| 18:00 | IPMA red rain ends; TAF's gust groups end | warnings.json, airport.json |
| 19:00 to 21:00 | Model: mean wind easing 37, 31, 27 km/h, from the west | forecast.json |
| 21:00 | IPMA red wind and orange sea end; yellow sea to Thursday 03:00 | warnings.json |

Reasoning:
- **The swing of the wind is the clock.** IPMA's communiqué no. 2 says the wind blows "inicialmente do quadrante sul e rodando para o quadrante norte" and that the strongest gusts (100 to 120, locally 140 km/h) are on the low's **southern edge**. The model puts that swing at 17:00 in Lisbon. In storms of this kind the strongest gusts often come just around and after the swing (the government quotes IPMA on a possible **sting jet**, above 150 km/h). Hence the peak estimate of 15:00 to 19:00.
- **Why the red wind runs to 21:00 when the TAF's gusts stop at 18:00:** the TAF is a point forecast for the airport for pilots, issued every 6 hours; the warning covers the whole district and the strong north-westerly behind the centre (model: still 31 to 37 km/h mean at 19:00 to 20:00). Analysis: treat 18:00 to 21:00 as "easing but still dangerous", not as over.
- **Track matters most.** The centre is most likely to cross "entre Sines e o Cabo Carvoeiro", and Lisbon lies between those two points. If the centre passes north of Lisbon, the city is on the dangerous southern edge; if it passes south, Lisbon gets less wind and more rain. This is why the exact peak is low-confidence, and why the next communiqué (no. 3) and IPMA's next warning update matter more than any number here.
- **The model run is old.** IPMA's hourly forecast in the file was updated at 07:55 on Tuesday, before the 08:31 red warning; its mean winds are lower than the warning's gusts by design (mean, not gust). The refresh records any new run in forecast.json.
- **Not yet observed:** as of the 18:30 METAR the airport had 8 kt (15 km/h); Tuesday's strongest gust there was 36 kt (67 km/h) at 11:00 and 13:00. The stations will show the arrival from the early hours; this folder refreshes hourly.

## 2. How far ahead could each warning have been known?

Lead time = from the first public signal to the start of the warning (Wednesday's times). Facts are cited in `warnings.json` → `history`.

| Warning (Lisbon) | Starts | First public signal | Lead time | Kind |
|---|---|---|---|---|
| The storm itself (named, orange expected, upgrade possible) | Wed 12:00 | IPMA communiqué no. 1, **Mon 9 Nov 13:17** | **about 47 h** | fact (IPMA) |
| Civil protection's public warning (Aviso 21) | Wed | ANEPC, **Mon 9 Nov 20:30** | about 39 h | fact (ANEPC) |
| **Red wind**, 12:00 to 21:00 | Wed 12:00 | IPMA's warnings update "divulgada às 08h31" **Tue 10 Nov** (Lusa, via AWAY at 08:46) | **about 27.5 h** | press (IPMA's feed has no issue times) |
| Orange sea, 12:00 to 21:00 | Wed 12:00 | in the newsroom's first read, by Tue 14:23 at the latest | at least 21.5 h | fact (read) |
| Orange rain, 05:00 to 12:00 | Wed 05:00 | listed by Tue 14:23 at the latest (as orange for Wednesday) | at least 14.5 h | fact (read) |
| **Red rain**, 12:00 to 18:00 | Wed 12:00 | IPMA, between **Tue 16:52 and 17:42** | **about 18.5 h** | fact (two reads) |
| Yellow sea, Wed 21:00 to Thu 03:00 | Wed 21:00 | IPMA, by Tue 16:52 | about 28 h | fact (read) |
| Airport gusts to 48 kt, 40% 58 kt | Wed 09:00 | TAF amended Tue 15:23 (earlier issues not read) | at least 17.5 h | fact (read) |

Reasoning:
- **The decision-useful signal came about two days ahead** (Monday 13:17: a named storm, orange, "não se excluindo a possibilidade de agravamento"). The red wind confirmed it **about 27 hours** ahead, and the government acted at 12:10 Tuesday, **3 h 39 min after the red** and about 24 hours before it began.
- **The red rain is the late one** (about 18.5 hours ahead): rain warnings tighten as the models agree on the track, which is what IPMA's "elevada incerteza" warns of. More upgrades on the night before are possible: communiqué no. 2 says so.
- **What we cannot yet say:** the exact minute of each change at IPMA (its open data carries no issue time; this folder now records every change it sees, hourly), and what the global models showed before Monday (not read; a hypothesis for the historian, not a fact).
- **For the team (analysis):** a decision about Wednesday was well founded by **Tuesday 08:31** (red wind), and defensible from **Monday afternoon** (communiqué no. 1). Anything outdoor or involving travel between 12:00 and 21:00 Wednesday is inside the red; the morning is wet and worsening, not yet the worst.
