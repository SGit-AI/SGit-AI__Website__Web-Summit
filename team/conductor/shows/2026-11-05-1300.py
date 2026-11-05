# The stand-up of Thursday 5 November 2026 (moved from 13:00 to 12:00): its narrative slides.
import subprocess as _sp
_vote = _sp.run(['python3', '-I', 'admin/tools/stickers_vote.py', 'status'], capture_output=True, text=True).stdout.strip().splitlines()
_vote = _vote[-1] if _vote else 'the vote status could not be read'
S.append(('Since yesterday 18:00', f'<h2>Since yesterday\'s 18:00: who moved what</h2>{bars(since, "Commits since 18:00 yesterday, by person (their agents).")}' + items([
    '<b>Dinis</b>, through the night with his agents: the newsroom became <b>The Lisbon Wire</b>; the sticker vote; observability; his cockpit; the cards redesigned (design A)',
    '<b>Vicky</b>: the agenda released (209 items), the shortlist vault\'s read key sent to the conductor (WS-153), her side of the garments, cards and stickers done',
    '<b>Jose</b>: his watcher ran team-wide for the first time; n8n flows brought to 3.0 practice (WS-74); brief 8 put the vote first',
    '<b>Angelo</b>: a lane to his conductor, the signature rule (signed messages count for tiers 1 and 2), his command centre answers; the daily note (overdue 24 to 73)',
    '<b>Silvio</b>: four video storyboards, the stand loop\'s shot list, a 30-second film; WS-166, every key on every device; <b>the first sticker vote</b>',
    '<b>Indi</b>: newsroom push access confirmed (WS-145), her patch live; WS-133 measured; in person today'])))
S.append(('The Lisbon Wire', f'<h2>The newsroom is now The Lisbon Wire</h2><div class="two">{shot("nr-front.jpg", "web-summit.newsroom.sgit.ai: the front page")}{shot("nr-graph.jpg", "The graph: companies, sessions, people, places")}</div>' + items([
    '<b>109 company profiles</b>, the agenda by day, pages for events, people, organisations, topics and places; the data as JSON with an API',
    'Search, an <b>Ask the newsroom</b> chat, a control centre with every run and agent, a reading meter',
    '<b>Unblocked this morning</b>: Vicky\'s programme and curator desks were held by the newsroom\'s gate; the release script now derives the data itself'])))
S.append(('The sticker vote', f'<h2>The sticker vote: closes 14:30 today</h2><div class="two">{shot("ws-vote.jpg", "/stickers/vote/: rank your top 10")}{shot("ws-home.jpg", "On the home page")}</div>' + items([
    f'<b>Now:</b> {E(_vote)}',
    '<b>Everyone with a site key</b>: vote before 14:30; it tests the whole flow (key, sealed lane, signed ballot, drain)',
    '<b>Drainers</b>: Angelo, Jose, Indi, Dinis: /stickers/vote/vault/'])))
S.append(('Observability and the cockpit', f'<h2>Observability, and Dinis\'s cockpit</h2><div class="two">{shot("ws-obs.jpg", "/observability/: read from an encrypted vault in the browser")}{shot("ws-cockpit.jpg", "Dinis\'s cockpit: decide in one click, signed")}</div>' + items([
    '<b>Every agent logs its runs</b> (WS-160): 9 already do',
    '<b>The cockpit\'s first action</b> (WS-145, Indi\'s newsroom access) was drained, verified and done; Angelo\'s dashboard agent proposes it as his pattern'])))
S.append(('The cards', f'<h2>The cards: design A, ordered</h2><div class="two">{shot("ws-cards.jpg", "Three audiences: executives, GRC, security")}{shot("ws-print.jpg", "/cards/print/: the order for ProntaPrint Chiswick")}</div>' + items([
    '<b>600 team cards with no names</b> (200 each colour), collection <b>Friday 6 November</b>',
    '<b>Open:</b> personal cards too, or only these three? (Vicky: "whatever Dinis decides")'])))
S.append(('Keys', f'<h2>Keys: who can be known by the site</h2><div class="keys">' + ''.join(f'<div class="k {"on" if m["id"] in klist else ""}" style="--c:{COL.get(m["id"], "#555")}"><b>{E(m["name"].split()[0])}</b><span>{"key issued" if m["id"] in klist else "no key yet"}</span></div>' for m in humans if m['id'] in ('dinis', 'silvio', 'nimay', 'angelo', 'vicky', 'indi', 'jose')) + '</div><p class="cap">WS-166: every person\'s key on every phone and iPad before Monday. Nimay still has none.</p>'))
S.append(('To decide now', '<h2>To decide at this stand-up</h2><ol class="decide">' + ''.join(f'<li>{x}</li>' for x in [
    '<b>Personal business cards</b>: still printed, or only the three team cards?',
    '<b>Outreach</b>: 28 emails drafted in Silvio\'s Gmail wait for Dinis\'s yes on the claims',
    '<b>Jose\'s site and UI issues</b>: Angelo\'s and Dinis\'s dev agents own them, Jose reviews',
    '<b>The garments</b>: collection day, and who collects (Silvio)',
    '<b>WS-165</b>: one vault for the requests we receive, option A or B',
    '<b>Overdue: 73</b>, 100 of 143 open issues unowned: five minutes for owners to move their own dates']) + '</ol>'))
S.append(('Follow-ups', '<h2>Follow-ups, each with an owner</h2>' + items([
    '<b>Everyone</b>: vote before 14:30; say what broke',
    '<b>Angelo, Jose, Indi</b>: one drain each after a few votes',
    '<b>Nimay</b>: accept the repository invitation (WS-09) and get a site key',
    '<b>Silvio</b>: unstick the dashboard step (L3 for more than a day)',
    '<b>Dinis\'s conductor</b>: record today\'s decisions with team-collaboration@angelo; the 18:00 deck'])))
