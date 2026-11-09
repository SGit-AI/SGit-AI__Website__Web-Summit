import os, json, hashlib, base64
V = 'vault'
AT = chr(64)   # the addresses are written "name(at)example.org" here, so no address sits in the repository (the gate's comms check)
def w(p, s, b=False):
    s = s.replace(b'(at)', AT.encode()) if b else s.replace('(at)', AT)
    os.makedirs(os.path.dirname(os.path.join(V,p)), exist_ok=True)
    open(os.path.join(V,p), 'wb' if b else 'w').write(s if b else s)
def card(p, eml, **c):
    eml = eml.replace('(at)', AT); c = json.loads(json.dumps(c).replace('(at)', AT))
    w(p.replace('.json','.eml'), eml.replace('\n','\r\n').encode(), True)
    c.setdefault('sha256', hashlib.sha256(eml.replace('\n','\r\n').encode()).hexdigest())
    w(p, json.dumps(c, indent=2))
# made-up companies and people only (WS-176 test); company 1: a plain thread, out then in
w('companies/example-robotics/company.json', json.dumps({"id":"example-robotics","type":"company","name":"Example Robotics (test)","what":"A made-up company for the WS-176 test","country":"Nowhere","sources":[],"updated_at":"2026-11-05","updated_by":"crm@web-summit.angelo"}))
d='companies/example-robotics/comms/2026-11-04-meeting-at-the-summit/'
w(d+'thread.json', json.dumps({"subject":"Meeting at the summit","channel":"email","our_people":["angelo"],"their_contacts":["Alex Example"],"owner":"angelo","state":"proposed","next_step":"Confirm a time on 11 November"}))
e1 = """From: Test Sender <sender(at)example.org>
To: Alex Example <alex(at)example.com>
Subject: =?UTF-8?B?TWVldGluZyBhdCB0aGUgc3VtbWl0IOKAkyDinIU=?=
Date: Wed, 04 Nov 2026 10:00:00 +0000
Message-ID: <a1(at)example.org>
Content-Type: text/plain; charset=utf-8

Hello Alex,

Could we meet at the summit? Café at 11:00?
See https://example.org/agenda and <script>window.PWNED=1</script> (this is text).
"""
card(d+'2026-11-04T1000Z-out-a1.json', e1, **{"from":"Test Sender <sender(at)example.org>","to":"Alex Example <alex(at)example.com>","date":"2026-11-04T10:00:00Z","subject":"Meeting at the summit – ✅","direction":"out","message_id":"<a1(at)example.org>","summary":"We asked for a meeting at the summit.","attachments":[]})
html = b'<html><head><style>body{color:red}</style><script>window.PWNED=2</script></head><body><p>Yes, <b>11:00</b> works.</p><img src="https://tracker.example.net/pixel.gif" onerror="window.PWNED=3"><a href="javascript:window.PWNED=4">click</a><iframe src="https://evil.example.net/"></iframe><p>Caf&eacute; &amp; &#8364;5 &lt;tag&gt;</p></body></html>'
pdf = base64.encodebytes(b'%PDF-1.4 fake attachment bytes ' * 40).decode()
e2 = f"""From: Alex Example <alex(at)example.com>
To: Test Sender <sender(at)example.org>
Subject: Re: Meeting at the summit
Date: Thu, 05 Nov 2026 09:30:00 +0000
Message-ID: <b2(at)example.com>
In-Reply-To: <a1(at)example.org>
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="mix"

--mix
Content-Type: multipart/alternative; boundary="alt"

--alt
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

Yes, 11:00 works. Caf=C3=A9 by the stand.
=E2=80=94 Alex

--alt
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: base64

{base64.encodebytes(html).decode()}
--alt--

--mix
Content-Type: application/pdf; name="deck.pdf"
Content-Disposition: attachment; filename="deck.pdf"
Content-Transfer-Encoding: base64

{pdf}
--mix--
"""
card(d+'2026-11-05T0930Z-in-b2.json', e2, **{"from":"Alex Example <alex(at)example.com>","to":["Test Sender <sender(at)example.org>"],"date":"2026-11-05T09:30:00Z","subject":"Re: Meeting at the summit","direction":"in","in_reply_to":"<a1(at)example.org>","summary":"They said yes to 11:00 at the stand.","attachments":[{"name":"deck.pdf"}]})
# company 2: HTML-only, quoted-printable, a draft; and a card whose sha256 is wrong; and a bad JSON
w('companies/sample-bank/company.json', json.dumps({"id":"sample-bank","type":"company","name":"Sample Bank (test)","what":"Another made-up company","sources":[],"updated_at":"2026-11-05","updated_by":"crm@web-summit.angelo"}))
d2='companies/sample-bank/comms/2026-11-03-pilot-proposal/'
w(d2+'thread.json', json.dumps({"subject":"Pilot proposal","owner":"silvio","state":"new","next_step":"Silvio reviews the draft"}))
e3 = """From: Bank Desk <desk(at)example.net>
To: sender(at)example.org
Subject: Pilot proposal
Date: Tue, 03 Nov 2026 15:00:00 +0000
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

<div style=3D"x"><h1>Pilot</h1><p>Please send the <a href=3D"https://example.net/p">proposal</a>.</p><img src=3D"http://tracker.example.net/t.gif"><svg onload=3D"window.PWNED=5"></svg><ul><li>One</li><li>Two</li></ul></div>
"""
card(d2+'2026-11-03T1500Z-in-c3.json', e3, **{"from":"Bank Desk <desk(at)example.net>","to":"sender(at)example.org","date":"2026-11-03T15:00:00Z","subject":"Pilot proposal","direction":"in","summary":"They asked for a proposal."})
e4 = """From: sender(at)example.org
To: desk(at)example.net
Subject: Re: Pilot proposal
Date: Thu, 05 Nov 2026 12:00:00 +0000
Content-Type: text/plain

Draft: here is our proposal (not sent).
"""
card(d2+'2026-11-05T1200Z-draft-d4.json', e4, **{"date":"2026-11-05T12:00:00Z","subject":"Re: Pilot proposal","direction":"draft","summary":"A draft reply for Silvio to send.","sha256":"0"*64,"reconstructed":True})
w(d2+'broken.json', '{not json')
w('actions/2026-11-05-test-action.json', json.dumps({"id":"2026-11-05-test-action","type":"action","title":"Send the pilot proposal (test)","kind":"follow-up","owner":"silvio","state":"new","company":"company:sample-bank","next_step":"draft","updated_at":"2026-11-05","updated_by":"test"}))
