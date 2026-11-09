# The 18:00 stand-up of Friday 6 November 2026: its narrative slides.
S.append(('Since the 12:00', f'<h2>Since the 12:00: who moved what</h2>{bars(since, "Commits on the team site since the 12:00, by person (their agents).")}' + items([
    '<b>Algarve Evolution</b>: Dinis\'s call with António Pinto Guerreiro; his paragraph is <b>live</b> on PrompTugal; three emails drafted in the private CRM',
    '<b>The comms protocol</b> (WS-184): every private conversation in this team\'s CRM; PrompTugal stays 100% public',
    '<b>Two new agents for Dinis</b>: investors@ (the investors\' section, two decks) and inbox@ (Gmail drafts, never sends)',
    '<b>The daily newsletter</b> (WS-186): morning and evening, from Saturday; the team subscribed',
    '<b>Angelo</b>: his agents renamed to @PrompTugal.angelo; the whole-team map full screen; his 18 companies checked'])))
S.append(('The first person who used it', f'<h2>Algarve Evolution: the first person who just used it</h2><div class="two">{shot("algarve.jpg", "promptugal.news/portugal/algarve-evolution/: his paragraph, live")}{shot("investors.jpg", "web-summit.sgit.ai/investors/: the investors\' section")}</div>' + items([
    '<b>The loop</b>: a call, a page about his organisation, his words on it, an email that leads with it',
    '<b>The emails</b>: inbox@web-summit.dinis turns the drafts into Gmail drafts once Gmail is connected; a person sends',
    '<b>Saved back</b>: what is sent and every reply, as EML in the private CRM'])))
S.append(('To decide now', '<h2>To decide at this stand-up</h2><ol class="decide">' + ''.join(f'<li>{x}</li>' for x in [
    '<b>Which mailbox</b> inbox@ drafts in: Dinis\'s own, or a promptugal.news one (and who reads those)',
    '<b>Send António\'s emails</b>: emails 2 and 1 tonight; email 3 with the first newsletter',
    '<b>Silvio on PrompTugal</b>: still open from the 12:00',
    '<b>Access tokens per agent</b>: crm, inbox and investors first',
    '<b>HTTPS on promptugal.news</b>']) + '</ol>'))
S.append(('Follow-ups', '<h2>Follow-ups, each with an owner</h2>' + items([
    '<b>Dinis</b>: connect Gmail to inbox@\'s session; review and send the drafts',
    '<b>Everyone</b>: read the first newsletter on Saturday morning and say what is missing',
    '<b>Angelo</b>: the email twin with António\'s thread as its first real one',
    '<b>Vicky, Indi</b>: stories through review to PrompTugal',
    '<b>Dinis\'s conductor</b>: record this stand-up; Saturday\'s schedule'])))
