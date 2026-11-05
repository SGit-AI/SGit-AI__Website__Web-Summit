# The 18:00 debrief of 4 November 2026: its narrative slides (moved out of show_deck.py on 5 November).
S.append(('Since the 14:30 stand-up', f'<h2>Since the 14:30 stand-up</h2>{bars(since, "Commits since 14:30, by person (their agents).")}' + items([
    '<b>Jose</b>: the team site now sends its page views (WS-37): two vaults, five lanes, an hourly drain; a view signed with his key verified',
    '<b>Silvio</b>: the merch is <b>ordered</b>; the sleeve logo confirmed by Dinis in person; Vicky\'s colours settled',
    '<b>Vicky</b>: the newsroom\'s two vaults exist; her researcher\'s second run; the outreach plan from her meeting with Nimay',
    '<b>Indi</b>: synthetic users re-tested the cards and the /meet/ pages; the most important thing each person did, on every show page (WS-149); an accountant agent (WS-148)',
    '<b>Angelo</b>: his own command centre, a kanban and a "team and the machine" board',
    '<b>Dinis\'s agents</b>: the observability pack; incident WS-151 found and fixed ("Only you can do this" first)'])))
S.append(('Indi', f'<h2>Indi: the factory, overnight</h2><div class="two">{shot("indi-factory-index.jpg", "The factory: one infographic per company")}{shot("indi-factory.jpg", "Hexamind, one of 28 companies, in normal and lay terms")}</div>' + items([
    f'<b>{per["indi"]} commits</b> from <b>{len(agents["indi"])} agents</b> ({E(", ".join(sorted(agents["indi"])))}), the first on schedule overnight',
    '<b>The factory</b> (dev@indi, 23:00 to 23:14): an infographic for <b>all 28 companies</b> we want to meet: what it does, its risk from agents, how RiskMandate helps',
    '<b>Business cards</b>: three concepts, six round-2 designs, tested by synthetic users (Record picked by 4 of 5)',
    '<b>The newsroom</b>: a review of the three earlier newsrooms and a patch that makes ours a publication (WS-141)'])))
S.append(('Indi: cards and tests', f'<h2>Indi: the cards, and agents that test like users</h2><div class="two">{shot("indi-cards.jpg", "/cards/: the designs, one at a time, for a phone")}{shot("indi-dash.jpg", "Indi\'s dashboard")}</div>'))
S.append(('Vicky', f'<h2>Vicky: {per["vicky"]} commits from {len(agents["vicky"])} agents</h2><div class="two">{shot("vicky-guide.jpg", "The plain-language onboarding guide (WS-100)")}{shot("vicky-dash.jpg", "Vicky\'s dashboard")}</div>' + items([
    '<b>The onboarding guide</b>, written from her own setup: steps 1 to 9, exact button names (pm@vicky)',
    '<b>The newsroom</b>: her researcher\'s first runs (19 captures on the summit and Portugal, then Europe and the Gender in Tech report); the research vault (pack mode) and the interview shortlist vault',
    '<b>Logistics</b>: the print date, who collects, her colours; <b>one report a day</b> from every agent to her conductor',
    '<b>Outreach</b>: the plan from her meeting with Nimay; the hot-leads rule drafted'])))
S.append(('Jose', f'<h2>Jose: observability, live in an afternoon</h2><div class="two">{shot("jose-dash.jpg", "Jose\'s dashboard")}{shot("keys.jpg", "The keys page: every agent\'s public key")}</div>' + items([
    '<b>The team site sends its page views</b> (17:08): two vaults (data, private; the app, published), <b>five lanes</b>, an hourly drain and one from inside the vault',
    'A page view sent <b>with Jose\'s site key</b> was verified as Jose: the first signed visit',
    '<b>A reviewer agent</b> that holds his conductor\'s and dashboard\'s work until it is right (two wrong claims caught)',
    '<b>Hack the Agent</b> and <b>ReachCheck</b> offered as stand demos (WS-108); WhatsApp reports through n8n (WS-39)'])))
S.append(('Angelo', f'<h2>Angelo: his own command centre</h2><div class="two">{shot("angelo-kanban.jpg", "Angelo\'s team board: the kanban")}{shot("angelo-app.jpg", "Angelo\'s command centre, extended, not copied")}</div>' + items([
    '<b>Slices 0 to 5</b> of his command centre: the kanban, filters, bookmarkable views, people and agents and the machine',
    '<b>team-collaboration@angelo</b> moved today\'s stand-up and keeps the debriefs (it still needs the transcript)',
    'The technical parts of the onboarding guide; <b>Give feedback</b> in one click (WS-140)'])))
S.append(('Silvio', f'<h2>Silvio: the merch is ordered</h2><div class="two">{shot("print-next.jpg", "/print/: the next set (generic QR, the RiskMandate mark)")}{shot("home.jpg", "The home page")}</div>' + items([
    '<b>Ordered</b> with the chosen printer; layouts and invoice on Thursday; collection asked for Monday 9 Nov',
    'The sleeves carry the RiskMandate logo (Silvio\'s choice, Dinis\'s word in person, 17:03)',
    'Vicky\'s purple T-shirts and lavender hoodie; a printer that declined publication recorded as no'])))
S.append(('Dinis\'s agents', f'<h2>Dinis\'s agents: {per["dinis"]} commits from {len(agents["dinis"])} agents</h2><div class="two">{shot("newsroom-brief.jpg", "The newsroom\'s brief pack: Dinis\'s vision, verbatim, and nine pages")}{shot("dinis-app.jpg", "Dinis\'s command centre")}</div>' + items([
    '<b>The newsroom</b>: the brief pack live; the newsroom agent\'s site; Indi\'s and Vicky\'s desks starting',
    '<b>Keys flying</b>: five people with keys, signed messages verified, the big "Add your key" on every page',
    '<b>The observability pack</b> (from the PHP site\'s vaults), picked up by Jose within the hour',
    '<b>Incident WS-151</b>: why WS-145 was buried; found, fixed, "Only you can do this" first'])))
S.append(('Keys', f'<h2>Keys: who can be known by the site</h2><div class="keys">' + ''.join(f'<div class="k {"on" if m["id"] in klist else ""}" style="--c:{COL.get(m["id"], "#555")}"><b>{E(m["name"].split()[0])}</b><span>{"key issued" if m["id"] in klist else "no key yet"}</span></div>' for m in humans if m['id'] not in ('daniela', 'sarah')) + '</div><p class="cap">WS-136. Next: Silvio and Nimay. Then the vault-to-vault lanes (WS-120), and signed page views for everyone (WS-37).</p>'))
S.append(('The 14:30, looked back', '<h2>The 14:30 stand-up: what we know came out of it</h2>' + items([
    '<b>Settled since, outside the call</b>: the merch ordered (Silvio); the sleeve logo (Dinis, in person); Vicky\'s colours; the generic QR accepted by Dinis (in chat) and the next print set ready on /print/#next',
    '<b>Not on the record</b>: no decision from the 14:30 was written down; team-collaboration@angelo still waits for the transcript (WS-96, WS-107)',
    '<b>Asked of Dinis and still open</b>: Indi\'s write access to the newsroom (WS-145), Indi\'s patch and the desks split (WS-141); protect main (WS-105)',
    '<b>Raised by Dinis after it</b>: briefs as pages with "I have read this", a RACI per person, observability for people and agents (now live for the site)'])))
RACI = [('The newsroom', 'A', 'I', 'C', 'I', 'R', 'I', 'R'), ('Merch and print', 'A', 'R', 'I', 'I', 'C', 'I', 'C'), ('Observability', 'A', 'I', 'I', 'C', 'I', 'R', 'I'),
        ('Keys and identity', 'A', 'R', 'R', 'R', 'R', 'R', 'R'), ('Outreach: the first five, the message', 'C', 'R', 'A', 'I', 'R', 'I', 'C'), ('The site and the home page', 'A', 'I', 'I', 'R', 'I', 'C', 'C'),
        ('Stand-ups and decisions', 'A', 'I', 'I', 'R', 'C', 'I', 'I'), ('Onboarding (the guide)', 'I', 'I', 'I', 'C', 'A', 'I', 'C')]
hdr = ['Dinis', 'Silvio', 'Nimay', 'Angelo', 'Vicky', 'Jose', 'Indi']
S.append(('RACI, a first cut', '<h2>RACI, a first cut for Dinis to mark up</h2><table class="raci"><tr><th>Workstream</th>' + ''.join(f'<th>{h}</th>' for h in hdr) + '</tr>' + ''.join('<tr><td>' + E(r[0]) + '</td>' + ''.join(f'<td class="r{x}">{x}</td>' for x in r[1:]) + '</tr>' for r in RACI) + '</table><p class="cap"><b>R</b> does it · <b>A</b> answers for it (one per row) · <b>C</b> is asked first · <b>I</b> is told. Each person\'s dashboard will lead with their A and R rows.</p>'))
S.append(('To decide now', '<h2>To decide at this stand-up</h2><ol class="decide">' + ''.join(f'<li>{x}</li>' for x in [
    '<b>The RACI</b>: accept the first cut, or mark it up now',
    '<b>The newsroom</b>: write access for Indi (WS-145) and Vicky; apply Indi\'s patch; the desks split (WS-141)',
    '<b>Observability</b>: a public vault for the team\'s reads (per person), counts only for everyone else; who sees /stats/',
    '<b>Print</b>: the next set on /print/#next (generic QR, the RiskMandate mark, Vicky Wang): yes; who collects on Monday',
    '<b>WS-151</b>: "Only you can do this" first on Dinis\'s dashboard, and on everyone\'s',
    '<b>Who records the decisions</b> (WS-107): team-collaboration@angelo drafts, the chair confirms (Vicky\'s choice)']) + '</ol>'))
S.append(('Follow-ups', '<h2>Follow-ups, each with an owner</h2>' + items([
    '<b>Silvio and Nimay</b>: add their site keys tonight (their conductors issue them)',
    '<b>Jose</b>: /stats/ with the team\'s reads; the agent lane (every agent logs what it read and did)',
    '<b>Indi and Vicky</b>: the newsroom\'s first desks running from its brief pack; three articles by Saturday',
    '<b>The designer</b>: the print set\'s re-signs as soon as Dinis says yes on /print/#next',
    '<b>Dinis\'s conductor</b>: briefs as pages with "I have read this"; the RACI on every dashboard; this deck before every stand-up'])))

