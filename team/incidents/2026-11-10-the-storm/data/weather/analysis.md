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

### 7c. Check, 03:35 UTC 11 Nov: RTP Antena 1's 03:00 bulletin, "IPMA: depressão Charles vai atingir mais o sul do país"

- **IPMA's written channels (facts, read 03:31):**
  - **Communiqués:** the feed was rebuilt at 03:08, but there is no communiqué no. 3. No. 2 is still the latest.
  - **Warnings (CAP):** the latest message is still 21:23 Tuesday; nothing for any district since.
  - **IPMA's site news:** nothing on CHARLES; the newest item is 10 Nov 08:00, unrelated.
- **The bulletin (press, read 03:32):** [the page](https://www.rtp.pt/noticias/noticiario-antena1/3h-ipma-depressao-charles-vai-atingir-mais-o-sul-do-pais_a1_1778305) carries the title and an audio file only. It credits the bulletin to Pedro Guilherme; his role is not stated. There is no text, no named IPMA speaker and no words about Lisbon to quote.
- **7b unchanged:** the title matches what IPMA's forecasters said on radio at 22:35 (the worst further south). It adds no new IPMA fact, and Lisbon's red warnings stand.

## 9. 05:25 UTC 11 Nov: new Lisbon TAF; observed against warned begins

- **Fact:** `TAF LPPT 110500Z` keeps the 23:00 picture, but the **strong group now runs to 18:00 (was 16:00)**: at times SSE 30 kt gusting 45 (83 km/h), 09:00 to 18:00. It keeps a 30% chance of SSE 43 kt gusting 58 (107 km/h) in thunderstorms, 10:00 to 18:00, then becomes W 12 kt from 18:00 to 20:00.
- **Fact:** met.no's 05:19 update repeats its 01:19 values: strongest mean 58 km/h from 200° at 15:00, pressure bottoming at 987.7 hPa.
- **Fact, Lisbon now (05:00):** the airport has 4 kt from 200° with light rain and 1004 hPa; no gusts so far. Since 05:00, `changes.json` → `gusts_above_warned` lists any airport gust above the warned level. It is empty.
- **Analysis:** the airport forecast lengthening the strong wind to 18:00 fits the 12:00 to 18:00 worst window and the 14:00 to 17:00 peak (7b). Nothing changes in the conclusions; IPMA's red warnings for Lisbon stand.

## 10. 07:45 UTC 11 Nov: IPMA lowers Lisbon's wind warning from red to orange

- **Fact:** IPMA sent a CAP message at **07:16:30 UTC** lowering Lisbon's wind warning: **"Aviso Laranja Vento", Wednesday 09:00 to 21:00, "Rajadas até 120 km/h"**.
  - It is an Update replacing the red message sent Tuesday 07:18:40 (PO-01-1915), which had 12:00 to 21:00 and "podendo atingir 140 km/h nos locais mais expostos".
  - **Setúbal was lowered the same way, at the same time.**
  - **Red rain (09:00 to 18:00) is unchanged.**
  - The 5-minute poll caught it at 07:37:53. **IPMA's open data still showed red wind at 07:38**, so CAP led again.
  - Source: [MeteoAlarm CAP feed](https://feeds.meteoalarm.org/api/v1/warnings/feeds-portugal); kept in `cap.json`, and in `warnings.json` → `history` and `cap_leads_open_data`.
- **Lead time (fact):** sent 1 h 44 min before the orange begins (09:00), and 4 h 44 min before the red would have begun (12:00).
- **Analysis:**
  - IPMA now judges Lisbon's gusts at **up to 120 km/h**, with no 140. That fits its forecasters' radio words at 22:35 (the worst further south).
  - The wind window **opens earlier (09:00)** and **still closes at 21:00**.
  - This is a downgrade, not an all-clear. Orange is dangerous weather, and **red rain still stands from 09:00 to 18:00**.
  - The worst window stays 09:00 to 18:00 for rain, with the strongest wind most likely 14:00 to 17:00.
  - Suggested headline: **"IPMA lowers Lisbon's wind warning to orange (gusts to 120 km/h, 09:00 to 21:00); the red rain warning (09:00 to 18:00) stands."**

## 11. 08:25 UTC 11 Nov: open data still lags; Madeira's wind collapses; Lisbon's SSE wind begins

- **Fact:** at 08:22, IPMA's open data (`warnings.json` → `lisbon`) **still shows Lisbon's wind as red, 12:00 to 21:00**. CAP has had it orange (09:00 to 21:00) since 07:16:30, so the open data is now more than 66 minutes behind. Read CAP (`cap.json`) for Lisbon's wind.
- **Fact, Madeira airport:**
  - SW 37 kt gusting 48 at 07:00 and SW 22 kt gusting 34 at 07:30, then **NE 7 kt at 08:00**, with pressure 995 hPa and light rain.
  - **Analysis:** a swing like that, with the wind collapsing, usually means a low's centre is passing close to the observer. CHARLES's centre passed near Madeira's airport between about 07:30 and 08:00, later than communiqué no. 2's position (north-west of Madeira at 00 UTC) would suggest. That position was a forecast.
- **Fact, Lisbon airport, 08:00:** SSE 11 kt with rain, 1002 hPa. The TAF's strengthening from 07:00 to 09:00 is beginning. No gust above warned.
- **Fact, met.no updated 08:21:** the same shape as before. The wind backs to E (97°) at 12:00, then veers 157°, 185°, 200°, 226°, 275° from 13:00 to 17:00. The strongest mean is **55 km/h at 15:00**, with pressure lowest at 988.8 hPa at 15:00.
- **Analysis:**
  - 7b and section 10 stand. The worst wind for Lisbon is most likely 13:00 to 17:00, with the strongest around 14:00 to 16:00, under IPMA's orange (gusts to 120 km/h).
  - Red rain runs 09:00 to 18:00.
  - **The test** (a veer through SW to W at the airport, with the strongest gusts from the south before the pressure minimum) can be read this afternoon.

## 12. 09:25 UTC 11 Nov: the two models now agree; the strongest wind for Lisbon is about 14:00 to 16:00

- **Fact: IPMA's hourly model has a new run (07:56).** Mean wind for Lisbon:
  - SE then E, 17 to 18 km/h, from 10:00 to 12:00;
  - a **lull of 11.5 km/h at 13:00 (E)**;
  - then **40 km/h from the S at 14:00** and **35 km/h from the SW at 15:00**;
  - then W and NW, 21 to 25 km/h, from 16:00 to 20:00.
  - The old run (19:56) had SE all day, N at 18:00 and a peak of 23 km/h at 20:00.
- **Fact: met.no (updated 09:19)** keeps its shape: E (97°) at 12:00; then 157°, 185°, 200° and 226° from 13:00 to 16:00; strongest **55 km/h at 15:00**; pressure lowest at 988.8 hPa at 15:00.
- **Fact, observed:**
  - **Lisbon airport, 09:00:** SSE 11 kt, rain and mist, visibility 3 km, 1001 hPa; no gust so far, none above warned.
  - **Lisbon's stations:** 2 to 8 mm an hour, rising, in the hours labelled 06:00 to 08:00 (`lisbon-rain.json`); the red rain began at 09:00.
- **Analysis:**
  - **Both models now show the same pattern.** The wind backs to east before midday, there is a lull around 12:00 to 13:00, then it **veers through south and south-west to west**, strongest from the south and south-west at 14:00 to 15:00.
  - That is the pattern for the centre passing **close to Lisbon and just north of it, around 13:00 to 15:00**, with Lisbon on the stronger southern side for a few hours. This settles 7b's open question for the guidance: the side is now **"just north", medium confidence**. Observations this afternoon will decide it.
  - **The strongest wind most likely comes 14:00 to 16:00** (narrowed from 14:00 to 17:00). IPMA's orange warning (gusts to 120 km/h) covers it.
  - **The 12:00 to 13:00 lull is not the end.** The strongest wind follows it.
  - Red rain runs 09:00 to 18:00. The wind eases after 17:00, and the orange wind ends at 21:00.
- **The test** (unchanged): a veer through SW to W at the airport, with the strongest gusts from the S and SW before or at the pressure minimum, means the centre passed north.

## 13. 09:50 UTC 11 Nov: "Charles divide-se em dois núcleos e enfraquece"? (press attributes it to IPMA)

> Asked by incident.conductor@ after RTP and DN carried it, attributed to IPMA (read 09:39 by incident.weatherwatch@). Facts first, then analysis.

**What IPMA has published (facts, read 09:45):**
- **Communiqués:** the feed was rebuilt at 09:08, but **there is no communiqué no. 3**. No. 2 (17:07 Tuesday) speaks of **one** centre ("o centro da depressão").
- **CAP:** the warning texts carry no description of the low. The only message since 21:23 is Lisbon's and Setúbal's wind lowered to orange (07:16:30).
- **IPMA's hourly model:** it has **no pressure field**, only wind, rain and temperature. Its new run (07:56) weakens Lisbon's wind sharply against the earlier runs.
- **Nothing in writing from IPMA says "two centres".** The claim is press, attributed to IPMA.

**What the observations show (facts, airport METARs read 09:45):**
- **Madeira (LPMA):**
  - pressure lowest **991 hPa at 06:30** (995 at 06:00, 993 at 07:00);
  - the wind swung from **SW 37 kt gusting 48 (07:00)** to **NE 7 kt (08:00)**, then **N 19 to 22 kt (09:00 to 09:30)**;
  - pressure is rising: 996 to 997 hPa from 08:30 to 09:30.
- **Lisbon (LPPT):** pressure falling steadily, **1005 hPa at 04:00 to 1000 at 09:30** (about 1 hPa an hour), with SSE 11 to 12 kt and rain.
- **Faro and Beja** are falling more slowly: 1007 to 1003 and 1006 to 1004 hPa.
- **met.no (09:19)** has one minimum for Lisbon, **988.8 hPa at 15:00**.

**Analysis:**
- **Madeira and Lisbon are 966 km apart.** One centre passing Madeira's airport around 06:30 to 08:00 and Lisbon around 13:00 to 15:00 would have to move at **about 140 to 160 km/h**. That is far faster than lows of this kind usually move.
- Communiqué no. 2 also put the centre **north-west** of Madeira at 00 UTC. To pass over the airport at 07:00 it would have had to move south-east, away from Portugal.
- So **Madeira's wind swing and pressure minimum were most likely a separate feature** (a secondary low or a sharp trough on the system's southern side), not the centre that the models bring close to Lisbon this afternoon.
- **That is consistent with the press's "two centres"**, though it does not prove it. "Enfraquece" (weakens) is also consistent with what IPMA did: the TAF was lowered overnight and Lisbon's wind was lowered to orange.
- **Section 12 stands.** The models still bring a centre close to Lisbon, just north of it, around **13:00 to 15:00**, with the strongest wind **14:00 to 16:00**, and Lisbon's barometer is falling as they expect.
- Two centres would mean the afternoon low is **shallower** than a single merged one. That would fit gusts nearer orange than red, but it is a hypothesis.
- **Confidence:** two centres, **medium** (from observations and distance, not from IPMA in writing); timing for Lisbon, **medium**.
- **The test this afternoon:** if Lisbon's pressure bottoms near 988 to 992 hPa around 14:00 to 15:00 and the wind veers through SW, a centre passed close, whatever happened at Madeira.

## 14. 10:25 UTC 11 Nov: the airport forecast is lowered again

- **Fact: `TAF AMD LPPT 111008Z`** (amended 10:08):

  | Group | 05:00 TAF | 10:08 amendment |
  |---|---|---|
  | Prevailing | SSE 12 kt | SSE 15 kt, rain and mist, 4 km |
  | At times | 30 kt gusting 45 (83 km/h), 09:00 to 18:00 | **20 kt gusting 35 (65 km/h), 10:00 to 16:00** |
  | 30% chance, in thunderstorms | 43 kt gusting 58 (107 km/h), 10:00 to 18:00 | **40 kt gusting 55 (102 km/h), 10:00 to 16:00** |
  | Later | becoming W 12 kt, 18:00 to 20:00 | unchanged |

- **Fact, Lisbon airport, 10:00:** SSE 11 kt, rain and mist, 4 km, **999 hPa** (falling about 1 hPa an hour since 04:00); no gust so far.
- **Fact, Lisbon's stations:** 3.6 to 6.5 mm an hour in the hour labelled 09:00 (`lisbon-rain.json`); red rain 09:00 to 18:00.
- **Fact:** the orange rain warning (00:00 to 09:00) has expired.
- **Analysis:**
  - The airport's own forecaster now expects **less wind, ending earlier**. Gusts are expected to about 65 km/h at times, with a 30% chance of about 100 km/h in thunderstorms, **up to 16:00**.
  - That fits IPMA's orange (gusts to 120 km/h, in the district's most exposed places) and the "weakens" reported in the press.
  - **The strongest wind most likely comes 13:00 to 16:00**, ending earlier than section 12's 14:00 to 16:00.
  - **The red rain is now the main hazard for Lisbon.**

## 15. 11:30 UTC 11 Nov: heavy rain steady, wind backing, airport forecast unchanged

**Facts** (sources in airport.json and lisbon-rain.json, read 11:26:40 UTC):
- LPPT TAF issued 11:00 (routine) repeats the 10:08 amendment: base 14015KT; TEMPO 12:00–16:00 14020G35KT (gusts about 65 km/h) with rain; PROB30 TEMPO 12:00–16:00 14040G55KT (about 102 km/h) in thunderstorms; BECMG 16:00–18:00 29012KT; TEMPO 18:00–21:00 29017G27KT (about 50 km/h).
- LPPT METARs: 10:00 15011KT Q0999; 10:30 14011KT +RA Q0999; 11:00 11009KT 090V150, visibility 2000 m, heavy rain and mist, Q0998. No gust reported this morning; the highest LPPT gust in the window is still 36 kt (67 km/h) on Tuesday at 11:00.
- IPMA stations, hours labelled 06:00–10:00 (5 h): Lisboa Relógio 24.0 mm, Oeiras 27.5 mm, Carnide 19.6 mm, Tapada da Ajuda 20.2 mm; 4–6 mm in each hour, no single burst. Mean winds stay under 25 km/h.
- IPMA warnings for Lisboa unchanged: red rain 09:00–18:00, orange wind 09:00–21:00 (gusts to 120 km/h), orange sea 12:00–21:00 then yellow to 03:00 Thursday. No communiqué no. 3. No new CAP message since 07:16:30.

**Analysis (medium):** the rain is behaving as IPMA's red warning says, "forte e persistente": steady, not torrential, about 5 mm an hour, so by 18:00 Lisbon could reach 50–60 mm on today alone at this rate (a projection, not a forecast). Wind is so far far below the orange threshold.

**Hypothesis (low; one hour of data at one site, direction variable 090–150):** the airport wind has backed from SSE to ESE while the pressure falls. Wind backing ahead of a low usually means its centre passes to the south of the observer, which would cut against section 12 (centre just north). The TAF's later swing to 290° fits either side once it has passed. The test stays the same: the pressure minimum and the direction the wind turns through between 13:00 and 16:00.

## 16. 12:25 UTC 11 Nov: the wind keeps backing, pressure falls fast, the heaviest rain hour since the red warning began

*Corrected 12:35 UTC: the heading said "the heaviest rain hour so far". Not true of the whole storm: Barreiro had 18.9 mm in the hour labelled 01:00 on 10 Nov, and Tapada da Ajuda 16.1 mm in the hour labelled 04:00 on 10 Nov (lisbon-rain.json). Found by incident.stories@web-summit.dinis.*

**Facts** (airport.json and lisbon-rain.json, read 12:23:12 UTC):
- LPPT METARs: 11:00 11009KT Q0998; 11:30 07013KT +RA Q0995; 12:00 08015KT visibility 2500 m, heavy rain and mist, Q0994, BECMG 14015KT. Pressure fell 4 hPa in the hour to 12:00 (999 at 10:00). Still no gust reported; the highest LPPT gust in the window is 36 kt (67 km/h), on Tuesday.
- IPMA stations, hour labelled 11:00: Oeiras 17.9 mm, Relógio 17.2 mm, Tapada da Ajuda 14.6 mm, Barreiro 12.5 mm, Carnide 11.9 mm, Amoreiras 11.5 mm: three times the earlier hourly rate. Wind direction turned to E or NE at every station; mean winds 9–24 km/h.
- Hours labelled 06:00–11:00 (6 h): Oeiras 45.4 mm, Relógio 41.2 mm, Tapada 34.8 mm.
- LPPT TAF 11:00 unchanged (no amendment); it still expects 140° winds to 16:00. Warnings for Lisboa unchanged; no communiqué no. 3; no new CAP message (poll read every 5 min to 12:18:19).

**Analysis (medium, up from low):** in three hours the wind at the airport has backed from SSE (150°) through ESE to ENE (070–080°), and the city stations agree (E/NE), while the pressure falls faster. On the northern hemisphere a wind that backs as a low approaches puts the observer on the north side of its path. So the centre now looks likely to pass **over or just south of Lisbon**, not just north as section 12 said; section 12's timing (closest about 13:00–15:00) still fits the pressure trend. Consequences, to be watched, not asserted: the strongest wind on the south side (the SW/W sector) may fall south of the Tagus (Setúbal) rather than in Lisbon; Lisbon's peak wind may come after the centre passes, from the NW/W, when the TAF has 290° at 16:00–18:00 with gusts about 50 km/h at times from 18:00. The airport's forecast 140° does not match what is observed; the TAF may be amended.

**Hazard (medium):** the rain is now the story: 11–18 mm in one hour across the city, under a red warning to 18:00. Wind so far is far below IPMA's orange (gusts to 120 km/h).

**Test:** the pressure minimum (now 994 and falling) and the turn: through N to NW means the centre passed south; through S to SW means north.

## 17. 12:30 UTC 11 Nov: IPMA communiqué no. 3: two centres, less deepening, weaker wind

**Fact** (IPMA communiqués page https://www.ipma.pt/opencms/pt/otempo/comunicados/index.jsp, read 12:28:13 UTC; edited 12:16:26, valid 12:07–23:59; it is not in IPMA's RSS feed, which no longer carries no. 2 either). Our translation of the substance: CHARLES passed north of Madeira and **split into two distinct low-pressure centres, unlike the models' first forecasts**. As it nears the mainland this means **less deepening and so less wind than yesterday's forecast**. Rain persistent and at times heavy continues, moving from south-west to north-east. Wind strengthens in the South, gusts about **70–90 km/h**, especially on the coast, up to **110 km/h** on the most exposed coast and hills. "Os avisos meteorológicos foram ajustados tendo em conta as atualizações dos modelos numéricos."

**Fact:** at 12:28:46 neither IPMA's open data nor the MeteoAlarm CAP feed shows a Lisbon warning change after 07:16:30 (wind lowered to orange, gusts to 120 km/h). Lisbon still reads red rain 09:00–18:00, orange wind 09:00–21:00 and orange sea 12:00–21:00. "Ajustados" may refer to that 07:16 change; if a new change follows the communiqué, MeteoAlarm has carried IPMA's changes 16–21 min late before, so the 5-minute poll should see it by about 12:40.

**Analysis (medium-high):** the communiqué settles section 13 in writing: two centres, as the press reported. It also agrees with what Lisbon is seeing: no gust all morning and wind at the airport under 30 km/h. IPMA's own number, 70–90 km/h in the South, sits below Lisbon's orange threshold (gusts to 120 km/h) and near the airport's TAF (gusts about 65 km/h at times, a 30% chance of about 100 km/h). Rain stays the main hazard. Section 16's track (centre over or south of Lisbon) is not contradicted; the communiqué does not say where the centres go.

## 18. 12:36 UTC 11 Nov: the warnings "ajustados": IPMA's CAP batch sent 12:18:03

**Facts** (MeteoAlarm CAP feed, cap.json other_messages, read 12:35:31 UTC; weatherwatch saw the batch in the feed at 12:33):
- IPMA sent a batch at 12:18:03, two minutes after communiqué no. 3 was edited. Of its red and orange messages: **rain lowered from red to orange, 12:19–18:00, for Castelo Branco, Leiria, Portalegre** (replacing messages sent 10 Nov 16:30:01) **and Beja** (replacing 21:23:00). **Faro keeps red rain, 12:19–18:00** (replacing 21:23:00). The batch's other messages (yellow) are not kept by cap.json.
- **No message for Lisboa.** Lisbon still reads red rain 09:00–18:00, orange wind 09:00–21:00 (gusts to 120 km/h) and orange sea 12:00–21:00. Setúbal and Santarém, red rain on their last reads, had no message in the batch.
- IPMA's open data (warnings_www.json) did not yet show the change at 12:35:31.
- The 5-minute poll watches Lisbon and Madeira only, so it did not flag this batch. From this read on, cap.json also keeps orange messages for every district.

**Analysis (medium):** IPMA lowered red rain only inland and in Beja, and kept it where the rain is falling now (Faro, and Lisbon, which had 11–18 mm in the last hour). Lisbon's red rain warning still stands, and so does its orange wind, although IPMA's own figure for the South (70–90 km/h) is now below Lisbon's threshold. A further Lisbon change this afternoon is possible; that is a judgement, not a statement from IPMA.

## 19. 12:50 UTC 11 Nov: IPMA cuts Lisbon's warnings (CAP sent 12:33:13)

**Facts** (MeteoAlarm CAP feed, cap.json lisbon_messages; the 5-minute poll first saw the batch at 12:46:20; a read at 12:46:37 still got the older copy of the feed, which served 196 messages at 12:47:01 and 198 at 12:47:06, so reads can lag by a few minutes):
- **Rain: red shortened to 12:34–15:00** ("Precipitação forte e persistente"), replacing the red 09:00–18:00 sent 10 Nov 21:23:00; then **yellow 15:00–18:00** ("Precipitação por vezes forte", our translation: rain, at times heavy), a new alert.
- **Wind: orange, now 12:34–18:00** (was to 21:00), and its text lowered: **"Rajadas até 90 km/h, podendo atingir 110 km/h nos locais mais expostos"** (our translation: gusts up to 90 km/h, possibly reaching 110 km/h in the most exposed places), replacing the 07:16:30 message (gusts to 120 km/h).
- Same batch: Setúbal red rain 12:34–15:00 and orange wind 12:34–18:00; Beja orange wind 12:34–18:00.
- Sea warnings (orange 12:00–21:00, yellow 21:00–03:00) had no message in the batch, so they stand.
- MeteoAlarm carried it 13 min after it was sent at the latest (poll read 12:41:18 did not have it; 12:46:20 did). IPMA's open data (warnings_www.json) did not show it at 12:49:59; warnings.json still holds the old windows until it does.

**Analysis (medium-high):** IPMA has now put in its warnings what communiqué no. 3 said: weaker wind, rain easing from mid-afternoon. For Lisbon the worst is now bounded at **15:00 for the heavy rain and 18:00 for the wind**, three hours earlier than this morning's warnings. Its new wind figure (90, 110 exposed) matches what the airport's TAF has said since 10:08 (gusts about 65 km/h at times, a 30% chance of about 100). Observed so far: no gust above warned; wind at the airport under 30 km/h at 12:30.

## 20. 13:25 UTC 11 Nov: the rain at its heaviest at Relógio, the centre not yet past

**Facts** (airport.json and lisbon-rain.json, read 13:24:33 UTC):
- LPPT METARs: 12:30 07015KT +RA visibility 2000 m Q0992; 13:00 10011KT +RA visibility 1500 m Q0991. Pressure has fallen 8 hPa since 10:00 and is still falling (about 1–2 hPa per half hour). Still no gust; the highest LPPT gust in the window is 36 kt (67 km/h), on Tuesday. TAF 11:00 not amended.
- IPMA stations, hour labelled 12:00: Relógio 18.7 mm (its heaviest hour in the window), Geofísico 18.1 mm (its first rain figures in the window), Tapada 14.3, Amoreiras 12.0, Carnide 10.3, Oeiras 9.2, Barreiro 8.7. Wind E or NE, means 9–30 km/h.
- **Relógio 57.7 mm in the 6 hours labelled 07:00–12:00**, the largest 6-hour total at any of our Lisbon stations in the window (Tapada had 56.5 mm on Tuesday 03:00–08:00). The storm's heaviest single hour is still Barreiro's 18.9 mm on 10 Nov 01:00.
- Warnings: the CAP 12:33:13 messages stand (red rain to 15:00, yellow to 18:00, orange wind to 18:00, gusts to 90 km/h). **IPMA's open data still had the old windows at 13:24:33, 51 minutes after the CAP was sent**, so warnings.json still shows red rain to 18:00 and orange wind to 21:00 at 120 km/h. Treat cap.json as current. No new CAP message since 12:33:13 (poll read every 5 min to 13:20:58).

**Analysis (medium):** the wind still comes from the east and the pressure is still falling: the centre has not reached Lisbon. Section 16 stands (track over or just south, the wind backing). Section 12's timing for closest approach (13:00–15:00) now looks like the early end, more likely 14:00–16:00. The rain is at its heaviest now, as the centre nears; IPMA expects it to ease from 15:00.

**Test (unchanged):** the pressure minimum, then the wind turning through N to NW (centre passed south) or S to SW (north).

## 21. 14:25 UTC 11 Nov: the wind swings south and strengthens at the airport; the heaviest hour of the storm at Oeiras

**Facts** (airport.json, lisbon-rain.json, warnings.json, read 14:23:25–14:23:47 UTC):
- LPPT METARs: 13:30 10009KT 060V200, rain eased (RERA), visibility 6000 m, 17/17, Q0990; **14:00 19029G40KT, visibility 3000 m (runway 20: 900 m), heavy rain and mist, 19/19, Q0989, wind shear reported on runway 20 (WS R20)**. In 30 minutes: the wind turned from 100° to 190°, mean 9 kt to 29 kt (54 km/h), the first gust of the day, 40 kt (74 km/h), and the temperature rose 2 °C. **74 km/h is the highest LPPT gust in the window** (Tuesday's was 67 km/h). It is below IPMA's current orange wind figure (gusts to 90 km/h, 110 exposed). The TAF had forecast 140° with gusts of 35 kt at times; there is no amendment yet.
- IPMA stations, hour labelled 13:00: **Oeiras 26.2 mm, the heaviest hour at any of our Lisbon stations in the window** (above Barreiro's 18.9 mm on 10 Nov 01:00); Relógio 20.7, Geofísico 17.0, Tapada 15.8, Carnide 14.4, Amoreiras 12.3, Barreiro 5.9. **Oeiras 73.4 mm in the 6 hours labelled 08:00–13:00**; Relógio's 6 h total now above its 57.7 mm too. Station winds still E or SE at 13:00 (the airport's turn came after).
- IPMA's open data caught up by 14:23:25 (more than 1 h 50 min after the CAP was sent): red rain 12:34–15:00, yellow 15:00–18:00, orange wind 12:34–18:00 (90/110). It also shows **orange sea 12:34–21:00** (was 12:00–21:00) with no matching CAP message for Lisboa (sent_utc null; not seen in the 12:33:13 batch). No new CAP message since 12:33:13 (poll every 5 min to 14:20:45).

**Analysis (medium; revises section 16):** a sudden turn to south with a jump in wind and temperature is the warm air on the southern side of the low, or its front, reaching Lisbon. With the pressure still falling (989), the centre is still to the west or north-west. On the test in sections 16 and 20 (the wind turning through S to SW means the centre passes north), **the centre now looks more likely to pass just north of Lisbon, as section 12 said**. Section 16's reading of the morning's backing wind (centre to the south) does not hold: the backing came as the low approached, not as it passed. Lisbon is now in the strongest-wind part of the storm. The wind should stay strong from S to SW, then turn W–NW once the pressure starts rising (TAF: 290° from 16:00–18:00).

**Hazard now (medium-high):** gusts of 74 km/h observed, more possible in the next two hours inside IPMA's orange (to 90, 110 exposed); rain still heavy (20–26 mm an hour at two stations) under the red to 15:00.

## 22. 15:25 UTC 11 Nov: the rain eases, the wind stays SW and strong, pressure bottoms at 989

**Facts** (airport.json, lisbon-rain.json, read 15:22:56–15:23:13 UTC):
- LPPT METARs: 14:30 21025KT, rain easing (RERA), visibility 8000 m, Q0989, wind shear R20; 15:00 21022G33KT (gusts 61 km/h), visibility 10 km or more, 19/18, **Q0989 for the third half hour running**, wind shear R20 still reported. The highest LPPT gust in the window stays 40 kt (74 km/h) at 14:00. TAF 11:00 still not amended.
- IPMA stations, hour labelled 14:00: rain **1.2–6.8 mm** (from 12–26 mm the hour before); wind turned to **SW** at every station but Carnide and Barreiro (S), with the day's strongest means: **Oeiras 41.0 km/h**, Relógio 34.2, Carnide 32.8, Geofísico 31.3.
- 6-hour totals: **Relógio 74.0 mm (hours 09:00–14:00)**, Oeiras 73.4, Geofísico 64.7, Tapada 58.1, Carnide 52.2.
- Warnings unchanged since the 12:33:13 CAP: red rain ended 15:00, yellow rain to 18:00, orange wind to 18:00 (90, 110 exposed), orange sea to 21:00, yellow sea to 03:00. No new CAP message (poll every 5 min to 15:20:19); no new communiqué.

**Analysis (medium-high):** the pressure has stopped falling at 989 hPa and the wind sits at SW: the centre is passing just north of Lisbon now, as section 21 said, and the heavy rain has gone with the front, as IPMA's red-to-15:00 said. What is left: strong SW wind (gusts 60–75 km/h at the airport) until the pressure rises and the wind turns W–NW, which the TAF puts at 16:00–18:00; then lighter. Rain: showers, inside the yellow. The worst of Wednesday in Lisbon was **12:00–14:30 for rain (12–26 mm an hour) and 14:00–15:00 so far for wind**.

## 23. 16:10 UTC 11 Nov: IPMA ends Lisbon's orange wind at 15:56 (CAP sent 15:55:03)

**Facts** (MeteoAlarm CAP feed, cap.json, read 16:09:31 UTC; the poll first saw it at 16:09:15, not at 16:04:13, so MeteoAlarm carried it 9–14 min after it was sent):
- **Lisboa: orange wind, Update, window now 12:00–15:56** (replacing the 12:33:13 message, which ran to 18:00), same text (gusts to 90 km/h, 110 exposed). In effect the orange wind ended at 15:56. No yellow wind message for Lisboa followed in the feed by 16:09:31.
- Same batch: Setúbal and Beja orange wind also cut to end 15:56; **Faro orange wind 15:56–18:00**.
- Lisbon still has: yellow rain to 18:00 (CAP 12:33:13), orange sea to 21:00, yellow sea 21:00–03:00. IPMA's open data at 16:09:31 still showed orange wind to 18:00 (window start restamped 15:06); warnings.json lags again, use cap.json.
- **LPPT TAF amended at 14:36:** 21023G38KT (gusts about 70 km/h) from 15:00, becoming 29012KT 16:00–18:00, TEMPO 18:00–21:00 29017G27KT. LPPT METARs: 15:30 21020G33KT Q0989; 16:00 21021KT, light rain and drizzle, visibility 2500 m, Q0989, wind shear R20 still reported. The highest LPPT gust in the window stays 40 kt (74 km/h) at 14:00.
- IPMA stations, hour labelled 15:00: top mean wind 36.7 km/h at Relógio.

**Analysis (medium-high):** IPMA judges Lisbon's orange wind over, two hours early. The observations agree: no gust since 15:30, mean wind easing slowly from the SW. The pressure is still flat at 989, so the wind's turn to W–NW (TAF 16:00–18:00) is still to come, and with it possibly some stronger gusts (TAF TEMPO 27 kt, about 50 km/h, 18:00–21:00), now inside no wind warning. **For Lisbon the storm's peak has passed: rain 12:00–14:30, wind 14:00–15:30.** Sea warnings stay in force until Thursday 03:00.

## 24. 16:25 UTC 11 Nov: easing; waiting for the turn to W–NW

**Facts** (read 16:22:30–16:22:55 UTC): no new LPPT METAR since 16:00 (21021KT, light rain and drizzle, Q0989, wind shear R20); TAF AMD 14:36 unchanged; highest LPPT gust in the window still 40 kt (74 km/h) at 14:00. IPMA stations, hour labelled 15:00: rain 0.0–1.2 mm; wind SW, means 18–37 km/h (Relógio 36.7). No new CAP message since 15:55:03 (poll every 5 min to 16:21:01). IPMA's open data still showed Lisbon's orange wind to 18:00 at 16:22:55, 27 min after the CAP ended it; cap.json is current (orange wind ended 15:56; yellow rain to 18:00; orange sea to 21:00; yellow sea to 03:00).

**Analysis (medium-high):** the rain has stopped in all but name; the wind is slowly easing from the SW. Pressure flat at 989 since 14:00: the centre is lingering to the north, and the turn to W–NW with rising pressure (TAF: 16:00–18:00) has not come yet. When it does, a short spell of gusts near 50 km/h is possible (TAF TEMPO 18:00–21:00), under no warning. Section 23's peak times stand.
