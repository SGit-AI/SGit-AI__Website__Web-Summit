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

## 3. Thursday morning (added 20:05 UTC, at incident.conductor@'s J4)

> **Label: ANALYSIS**, from `changes.json` → `thursday` as read at 20:04 UTC.

**Short answer (analysis):** by the facts so far, **Thursday morning is behind the storm, not in it.** The only Lisbon warning that touches Thursday is **yellow sea** (south-west waves of 4 to 5 m), and it ends at 03:00. IPMA's model has a **westerly mean wind of 18 to 24 km/h** from 00:00 to 12:00, showers likely (up to 88%), and a sea of about 4 m. The daily forecast says rain and moderate wind. Confidence: **medium-low**. The model run is from 07:55 Tuesday, older than both red warnings. The airport's TAF does not reach Thursday yet: the issue due about 23:00 will. IPMA can also still add or extend warnings overnight. Watch for:
- any Lisbon wind warning that runs past Wednesday 21:00;
- the next communiqué;
- the TAF that covers Thursday 00:00 to 06:00.

Each of these goes at the top of `changes.json` at the next wake.

## 4. Update, 21:25 UTC: IPMA's hourly model for Lisbon changed

> **Label: ANALYSIS**, from `forecast.json` → `hourly` and `hourly_runs` as read at 21:18 UTC.

**Fact:** between the 20:22 and 21:18 reads, IPMA's hourly forecast for Lisbon changed its values, but its timestamp still says 07:55 Tuesday. The refresh now compares the values as well as the timestamp, and the replaced run is kept in `hourly_runs`.
- **Wednesday's strongest mean wind:** **23 km/h at 20:00** from the north-west, down from **49 km/h at 18:00**.
- **The swing of the wind:** to north at 18:00 and north-west at 19:00, an hour or two later than the 17:00 swing in the old run.

**Analysis:**
- **The timing moves later.** The peak most likely falls **around the swing, about 17:00 to 20:00**, not 15:00 to 19:00. The worst window stays **12:00 to 18:00** (both reds) and the end stays **21:00** (the red wind).
- **A weaker mean wind does not mean a weaker storm.** A much weaker mean wind in Lisbon fits the centre passing close to the city: winds are lighter near the centre and strongest on its southern edge. Gusts in showers and thunderstorms are not in this mean.
- **Trust the warnings first.** IPMA's red warnings, made by forecasters with all of IPMA's models, are unchanged and outrank this one model's output for one point. If IPMA lowers or shortens a red warning, that will be the real signal, and it will show at the top of `changes.json`.
- **Confidence on the peak hour stays low.** The track is the uncertainty, as IPMA has said.

## 5. Update, 23:25 UTC: the airport TAF that covers Thursday (issued 23:00)

> **Label: ANALYSIS**, from `airport.json` as read at 23:22 UTC.

**Fact:** the new TAF for Lisbon airport (`TAF LPPT 102300Z 1100/1206`) is weaker than the 17:00 issue:

| Group (Wed, UTC) | 17:00 issue | 23:00 issue |
|---|---|---|
| Wind becoming, 07:00 to 09:00 | S 25 kt gusting 38 (46 / 70 km/h) | SSE 17 kt gusting 27 (31 / 50 km/h) |
| At times, from 09:00 | S 35 kt gusting 48 (65 / 89 km/h), to 18:00 | SSE 30 kt gusting 45 (56 / 83 km/h), **to 16:00**, with heavy rain, visibility 2 km |
| Thunderstorm chance, 10:00 to 18:00 | **40%**: 42 kt gusting 58 (78 / 107 km/h) | **30%**: 43 kt gusting 58 (80 / 107 km/h) |
| After | nothing later forecast | **becoming W 12 kt (22 km/h), 18:00 to 20:00**; Thursday 00:00 to 06:00 W 12 kt, no gusts |

**Analysis:**
- **At the airport, the strongest wind moves earlier.** The TAF puts it **09:00 to 16:00**, from the south-south-east, ahead of the centre. A 30% chance of thunderstorm gusts near 107 km/h lasts to 18:00. After the wind swings west (18:00 to 20:00) it is light. IPMA's hourly model puts its strongest mean wind later (around 19:00 to 20:00, north-west).
- **The two sources disagree on the peak hour**, so I am widening it back: **the peak most likely falls between 12:00 and 18:00**, inside the overlap of the two red warnings. I no longer narrow it to 17:00 to 20:00. **The worst window stays 12:00 to 18:00; it is over by 21:00** (red wind's end); the airport forecast is lighter from 18:00 to 20:00.
- **A weaker forecast for the airport is not a downgrade of the warning.** IPMA's red warnings (gusts to 120, up to 140 km/h in exposed places) are unchanged as of 23:22. The airport is one point. Read together, the model and the TAF fit **a centre passing close to Lisbon**: strong south-easterlies before it, a lull and a swing as it passes, lighter westerlies after.
- **Thursday (analysis): behind the storm, now with more confidence.** The TAF has **west 12 kt, no gusts, from 00:00 to 06:00 Thursday**. The model has mean wind of 16 to 24 km/h. The only Thursday warning is yellow sea to 03:00. Confidence: **medium**. It drops back to low if IPMA extends any warning past Wednesday 21:00.

## 6. Update, 23:58 UTC: red rain from 09:00; IPMA's real issue times; a second model

> **Label: ANALYSIS** on the facts below. Read at 23:51 UTC, from MeteoAlarm's CAP feed (`cap.json`), IPMA's open data (`warnings.json`) and met.no (`forecast.json` → `second_models`).

**Facts:**
- **IPMA moved Lisbon's red rain earlier, to Wednesday 09:00 to 18:00** (was 12:00). Orange rain now runs from 00:00 to 09:00 (was 05:00 to 12:00), and a yellow rain warning runs from Tuesday 21:24 to midnight. The CAP message carrying this was **sent at 21:23 UTC**.
- **IPMA's open data lagged that by more than two hours.** My reads at 22:04, 22:23 and 23:22 still showed the old warnings; the 23:51 read showed the new ones. From now on the CAP feed is read every hour too, and its messages go to the top of `changes.json`.
- **IPMA's real issue times (CAP `sent`)** replace the press and bracket times I used before:
  - **red wind: Tuesday 07:18:40** (press said 08:31). It updated a wind message sent on Monday at 13:27:16, which is no longer in the feed, so its level is unknown.
  - **red rain, first issued: Tuesday 16:30:01.**
  - **orange sea: Tuesday 12:09:08.**
- **Second model, met.no (updated 23:20 UTC):** mean wind of 16 to 28 km/h from the south-east through Wednesday, then **36 km/h at 18:00 as the wind swings north**. Its timing agrees with IPMA's latest run. It gives no gusts for this point. Open-Meteo refused with "daily limit exceeded" (429). That is a limit of the free service for our shared address, not this environment's network.

**Analysis:**
- **The worst window starts earlier: 09:00 to 18:00** for heavy rain (red), with **12:00 to 18:00 the core**, when both reds overlap. **The peak most likely falls between 12:00 and 18:00.** **It is over by 21:00.** The morning is no longer just "wet and worsening": from 09:00 it is red for rain, and orange from midnight.
- **Lead times, revised with the issue times:**
  - red wind about **28.7 h** ahead (was 27.5 h);
  - red rain about **19.5 h** ahead for its first window;
  - only **11.6 h** for its move to 09:00;
  - the orange rain from midnight only **2.6 h** ahead.

  The late changes are rain timing, as expected when the track tightens.
- **For anyone deciding (analysis):** the open data and the site maps can trail IPMA by hours. The CAP feed is the earliest public source this desk has found for when IPMA issues a warning.

## 7. Hypothesis, 00:05 UTC 11 Nov: is the official data consistent with a track further south, close to Lisbon or just south of it?

> **Label: HYPOTHESIS**, with reasons for and against. The prompt was a signal from watcher@web-summit.jose: an undated image on a public weather page, not IPMA. **It is not evidence here.** Only the official and model data in this folder is weighed. Read at 23:51 to 23:57 UTC.

**Hypothesis:** CHARLES's centre passes **very close to Lisbon at about 17:00 to 18:00 Wednesday, more likely just south of the city than north of it**. That would be further south than the run of the models available on Tuesday morning implied.

**For (facts, then why they point that way):**
1. **The wind backs, it does not veer, before the passage.** met.no: from 220° at 00:00 to 160° at 09:00, then **123° (ESE) at 12:00**, then **SSE 155° at 17:00, jumping to N 353° at 18:00**. IPMA's latest hourly run: SE all day, **N at 18:00**, then NW and W. Why it matters: for a low moving east or north-east, a place **north of the track** sees the wind back (S to SE to E) as the centre approaches, then swing to north as it passes. A place **south of the track** sees it veer (S to SW to W). Both models show the north-of-track pattern.
2. **The models moved that way.** IPMA's run read on Tuesday evening (stamped 07:55) went **SE to S at 16:00, then NW at 17:00**. That is a veer through south, the south-of-track pattern. The current values go **SE straight to N**, with no south or south-west stage.
3. **A deep, close minimum and a sudden swing.** met.no's sea-level pressure falls to **986.7 hPa at 17:00 to 18:00**, then rises 5 hPa in the next hour. The wind turns about 160° in one hour. Both are what an almost overhead passage looks like. The communiqué gave **989 hPa** for the centre at 00 UTC Wednesday.
4. **Weaker wind for Lisbon in the newer guidance.** IPMA's model peak mean dropped from 49 to 23 km/h. met.no peaks at 36 km/h at the swing. The 23:00 TAF is weaker than the 17:00 one (gusts 45 kt, not 48; thunderstorm chance 30%, not 40%; the strong group ends at 16:00). Why it matters: IPMA's communiqué no. 2 says the strongest gusts are on the **southern edge** of the low. Being on the north side, or near the centre, means less wind.
5. **More rain, earlier.** IPMA moved Lisbon's **red rain earlier, to 09:00** (CAP sent 21:23). Heavy, persistent rain on the poleward (north) side of a low's centre fits this track. This is a weaker reason: rain timing has other causes.

**Against, or not settled:**
1. **IPMA has not changed the red wind warning** for Lisbon (12:00 to 21:00, gusts to 120, up to 140 km/h), and its forecasters see far more than two point models. If the centre crosses just south of Lisbon, Setúbal and the coast to its south take the southern edge. Lisbon could still get violent gusts around the centre and as the wind swings to north, especially on exposed ground.
2. **IPMA's only stated track** (communiqué no. 2, 17:07 Tuesday) is "between Sines and Cabo Carvoeiro", with "elevada incerteza". Lisbon lies inside that range, so "just south of Lisbon" does not contradict IPMA. No communiqué no. 3 has said anything newer.
3. **These are point models, and they move.** IPMA's own hourly values changed by a factor of two between 20:22 and 21:18 without a new stamp. The next runs could shift back.
4. **The TAF still forecasts SSE 30 kt gusting 45, 09:00 to 16:00, and a 30% chance of 58 kt gusts.** That is a strong pre-frontal wind, not a quiet north side.
5. **Open-Meteo, a third model, could not be read** (rate limit), so this rests on two models plus the TAF.

**Weighing (analysis):** the official and model data is **consistent with** a track close to Lisbon, more likely just south of it. Reasons 1 to 3 for are the strongest. **This does not lower the danger**: the red warnings stand, and the timing of the worst moves towards the passage (about 16:00 to 19:00), with a short lull near the centre that should not be mistaken for the end. **Confidence: low to medium.**

**How Wednesday will test it (for J3, observed against warned):**
- At the airport (METAR) and the stations: if the wind **backs to E or NE before turning north**, and pressure bottoms near 987 hPa around 17:00 to 18:00, the centre passed south. If it **veers through SW to W**, it passed north.
- The pressure minimum's timing across the stations (Lisbon, Oeiras, Almada, Barreiro) gives the centre's path.

These go into `gusts-vs-forecast.json` and `changes.json` as observed.

### 7a. Evidence added 00:40 UTC 11 Nov: the press quoting IPMA (separate from IPMA's official text)

> **Label: EVIDENCE (press quoting IPMA), then ANALYSIS.** Press and official text are kept apart. Read 00:30 to 00:40 UTC by this desk; the headlines were first read at 00:29 by incident.weatherwatch@.

**Official text (facts):**
- **IPMA's communiqués:** the RSS feed was rebuilt at 00:08 UTC, but **no communiqué no. 3**. The latest is still no. 2 (17:07 Tuesday: "between Sines and Cabo Carvoeiro", "elevada incerteza").
- **IPMA's warnings (CAP, read 00:35):** **no Lisbon warning sent after 21:23**, and **no downgrade or changed window**. Lisbon's red wind stands (Wed 12:00 to 21:00, sent 07:18:40 Tuesday). So does red rain (09:00 to 18:00, sent 21:23).
- **The 21:23 issue added red rain for Beja and Faro** (09:00 to 18:00), both further south. It also moved the red rain earlier for Lisbon and Setúbal.

**Press quoting IPMA (evidence; the quotes as relayed by the outlet, not read at IPMA):**
- **Observador's live blog, entry at 22:35:24 Tuesday: IPMA meteorologist Paula Leitão on Rádio Observador.**
  - The depression "deverá entrar entre a região de Lisboa e o Cabo de São Vicente (Sagres)".
  - "Isto ainda atinge a zona de Lisboa", but if very strong winds form, they are likely further south.
  - "a zona entre o Cabo Carvoeiro e o Cabo de São Vicente parece agora ser a que terá um impacto mais importante".
  - At 23:19, the same meteorologist said more red warnings had been needed ("foi necessário emitir mais avisos vermelhos").
  - Source: [Observador live](https://observador.pt/liveblogs/manifestantes-detidos-no-porto-pronunciam-se-sobre-suspensao-provisoria-do-processo/). Quotes read at source by incident.conductor@ at 2026-11-11T00:36Z; entry time 22:35:24Z confirmed by incident.media@ from the page's data.
- **Renascença: "Depressão Charles desvia-se para sul e poderá entrar em Portugal pelo Algarve"** (10 Nov). A search summary attributes to IPMA meteorologist Cristina Simões that the south, up to Lisbon and Setúbal, is more exposed. **Not read:** the page refused automated reads (403). [rr.pt](https://rr.pt/noticia/pais/2026/11/10/depressao-charles-desvia-se-para-sul-e-podera-entrar-em-portugal-pelo-algarve/493004/)
- Público, Observador and Notícias ao Minuto headlines (read by incident.weatherwatch@ at 00:29): Charles passing further south and its wind less intense. They are not separate sources of IPMA's words.

**Where IPMA said it, and when (answer to the conductor's question 1):**
- **By voice, on radio and TV, from about 22:35 Tuesday**, by IPMA meteorologists (Paula Leitão on Rádio Observador; Cristina Simões, not verified).
- **Not in a communiqué, and not in a warning change.** At 00:35 IPMA's written channels still say "between Sines and Cabo Carvoeiro", and Lisbon's warnings are unchanged.
- The "more red warnings" she mentioned match, in time and content, the CAP issue of **21:23**: new red rain in Beja and Faro, and red rain earlier in Lisbon and Setúbal. That last link is analysis.

**Analysis (section 7 updated):**
- **The hypothesis is strengthened.** IPMA's forecasters now say aloud what the models showed: an entry between Lisbon and Sagres, with the worst between Cabo Carvoeiro and Cabo de São Vicente. That is south of where the communiqué had it.
- **Confidence: medium, up from low to medium.**
- **The headline fact has not changed.** Lisbon's red wind and red rain stand. "Ainda atinge a zona de Lisboa" (it still reaches the Lisbon area) is IPMA's own caution. Until IPMA sends a CAP update lowering or shortening a Lisbon warning, the site should say "IPMA's forecasters expect the strongest winds south of Lisbon; Lisbon's red warnings stand", not "the storm misses Lisbon".
- **Watching (question 3):** the 5-minute CAP poll flags any Lisbon message at once. A downgrade (red to orange) or a shorter window is the fact that would move the headline.

## 8. Madeira's rain, and where CHARLES came from (01:55 UTC 11 Nov; leads from incident.wikipedia@, checked at source)

### 8a. Madeira's measured rain: FACT, verified at IPMA

- incident.wikipedia@'s lead (Portuguese Wikipedia, citing DN Madeira): Chão do Areeiro had 133.9 mm in 6 h by 22:00 Tuesday.
- **At source it stands exactly.** At IPMA station **1210973, "Madeira, Areeiro"**, the hourly rain values labelled 17:00 to 22:00 UTC on 10 Nov (0.8 + 4.0 + 7.1 + 29.7 + 47.6 + 44.7) sum to **133.9 mm**.
- It went on raining. By the 01:46 read, the largest 6 hours at the same station is **230.5 mm** (hours labelled 20:00 to 01:00).
- Other stations: Santo da Serra 124.4 mm, Pico do Areeiro 123.9 mm and Pico Alto 116.7 mm over the same hours.
- Source: [IPMA observations](https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json), now kept hourly in `madeira.json`.
- For scale: IPMA's communiqué no. 2 forecast more than 100 mm in 12 h in places.

### 8b. Where CHARLES came from: HYPOTHESIS

**Established (facts, from the [US National Hurricane Center's archived Tropical Weather Outlooks](https://www.nhc.noaa.gov/archive/text/TWOAT/2026/), read 01:50 UTC):**
- **2 Nov, 11:38 UTC:** NHC expects a low to form "along a weakening frontal boundary a few hundred miles northeast of the Bahamas" (7-day formation chance 20%). The 1 Nov outlooks expected nothing.
- **3 to 5 Nov:** the chance rises to **50%** (4 Nov), for possible subtropical development south of Bermuda.
- **6 Nov, 11:37 UTC:** the system is labelled **AL94** ("Invest 94L"), a gale-force non-tropical low south of Bermuda. NHC says it will move east and "become absorbed by a new non-tropical low pressure system to its east". Wikipedia's "7 Nov" for 94L is a day late against NHC's own text.
- **7 Nov, 23:21 UTC:** last mention: "merges with a frontal system over the next day or two". **8 Nov, 05:16 UTC:** dropped ("Tropical cyclone formation is not expected").
- **9 Nov, 13:17 UTC:** IPMA names CHARLES in communiqué no. 1, expecting it north-west of Madeira at 00 UTC on 11 Nov. As read by the newsroom, the communiqué says nothing of where the low came from.

**Hypothesis:** the "new non-tropical low to its east" that absorbed AL94 is the system IPMA named CHARLES, or one that became part of it.
- **For:** the timing (absorption forecast "early next week", that is 9 to 10 Nov, the days CHARLES was named and tracked), the direction (east across the subtropical Atlantic, towards 34°N 21°W) and the type (non-tropical lows, fronts).
- **Against, or not established:** no source read says so. NHC never names the absorbing low. IPMA does not say where CHARLES came from. Wikipedia's own editor's note says the sources do not state it. The subtropical Atlantic often holds several lows at once. **Not established.**

**What it means for "how far ahead could we have known" (analysis):** if the hypothesis holds, a precursor was visible in public outlooks about **9 days ahead** (2 Nov), and as a named invest about **5 days ahead** (6 Nov). That would be a weak signal, not a warning. NHC's outlooks are about tropical formation over the western Atlantic, not about impact in Portugal. The first impact signal for Portugal stays IPMA's communiqué no. 1 (about 47 h ahead). The red wind came about 28.7 h ahead.

### 7b. Re-weighed, 02:35 UTC 11 Nov: the inputs moved

> **Label: HYPOTHESIS, re-weighed.** The versions above (7, written 00:05; 7a, 00:40) stay as written, dated. This one supersedes them. It was prompted by the stories agent's catch, passed on by incident.conductor@.

**What changed in the inputs (facts):**
- **met.no's run updated 01:19 UTC** (read 02:22) is different from the 23:20 run I used:
  - the wind backs to ESE (118° at 12:00), then **veers through south and south-west to west**: 140° at 13:00, 180° at 14:00, 200° at 15:00, 232° at 16:00, 283° at 17:00;
  - **its strongest mean wind is 56 to 58 km/h from the south and south-south-west at 14:00 to 15:00** (was 36 km/h at 18:00);
  - **pressure bottoms at 987.7 hPa at 15:00** (was 986.7 at 17:00 to 18:00);
  - there is **no swing to north** any more.
- **IPMA's hourly model** is unchanged since its 19:56 run (SE all day, N at 18:00, then NW). It is now the older guidance.
- **The 23:00 TAF**, re-read: SSE (160°) gusting 45 kt 09:00 to 16:00, a 30% chance of S (180°) gusting 58 kt 10:00 to 18:00, then **becoming W (260°) 18:00 to 20:00**. That is a veer through south to west, which I did not weigh before.
- **IPMA's forecasters on radio** (22:35, quotes verified at source): entry "entre a região de Lisboa e o Cabo de São Vicente", the biggest impact between Cabo Carvoeiro and Cabo de São Vicente, "ainda atinge a zona de Lisboa".

**Re-weighed (analysis):**
- **The newest model now points the other way.** A veer through south-west to west, with the strongest wind from the south-south-west before the minimum, is the pattern for a place **south of the centre's track, on its stronger southern edge**. On the 01:19 run, the centre passes **close to Lisbon and just north of it, around 15:00**. The 23:00 TAF's veer through south to west is consistent with that. IPMA's older hourly run (and met.no's previous run) had the north-side pattern. IPMA's forecasters, by voice, put the centre's entry from Lisbon southwards.
- **So the side of Lisbon the centre passes on is now unsettled.** The guidance disagrees, and the newest model favours the more dangerous side for the city. **The "just south of Lisbon" hypothesis drops to low confidence.** What stands across all inputs: **the centre passes very close to Lisbon, between about 15:00 and 18:00.**
- **What it means for the worst:** on met.no's newest run, Lisbon's strongest wind comes **14:00 to 16:00 from the south and south-west**, ahead of and at the minimum. A 56 to 58 km/h mean implies gusts well above 90 km/h (rule of thumb, analysis). That fits IPMA's red wind warning (gusts to 120, up to 140 km/h in exposed places), which IPMA has never lowered. **The worst window stays 12:00 to 18:00, and the peak most likely 14:00 to 17:00.** Red rain runs 09:00 to 18:00; red wind ends at 21:00.
- **For the site (analysis):** "less wind for Lisbon" is **not supported** by the current inputs. Better: "the models disagree on which side of Lisbon the centre passes; IPMA's red warnings for Lisbon stand".
- **Confidence:**
  - the timing of the passage (15:00 to 18:00): medium;
  - which side it passes on: low;
  - Lisbon's red warnings being right to stand: they are IPMA's, unchanged since 21:23.

**The test on Wednesday (as before):** at Lisbon airport, a **veer through south-west to west**, with the strongest gusts from the south before the pressure minimum, means the centre passed north (the dangerous side). A **back through east to north** means it passed south.
