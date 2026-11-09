#!/usr/bin/env python3
"""The RiskMandate business card for Google Wallet: an "Add to Google Wallet" link.

conductor@web-summit.indi, 9 November 2026, at Indi's word. The same green card as the Apple Wallet pass
(pass/pass.json): one generic pass class and one generic pass object, carried inside a signed JWT, so nothing
needs to exist on Google's side before someone taps the link.

    python3 -I team/designer/wallet/make-google-pass.py --issuer-id 3388000000012345678 --sa-key key.json

Needs (from a Google account; none of it is ever committed):
- an Issuer account in the Google Pay & Wallet Console (its issuer ID);
- a Google Cloud project with the Google Wallet API on, and a service account with a JSON key,
  added to the Issuer account as a user.
Prints the link https://pay.google.com/gp/v/save/<jwt>. The link holds only the card's public text and a signature;
publishing it is safe. While the Issuer account is in demo mode, only its test users can save the pass, and the title
starts with "[TEST ONLY]". Standard library and openssl only.
"""
import argparse, base64, json, os, subprocess, sys, tempfile, time

SITE = 'https://web-summit.sgit.ai'
WALLET = SITE + '/team/designer/wallet'


def b64url(b):
    return base64.urlsafe_b64encode(b).rstrip(b'=').decode()


def card(issuer):
    cls, obj = f'{issuer}.riskmandate_card_2026', f'{issuer}.riskmandate_card_2026_grc'
    generic_class = {'id': cls, 'multipleDevicesAndHoldersAllowedStatus': 'MULTIPLE_HOLDERS'}
    generic_object = {
        'id': obj, 'classId': cls, 'state': 'ACTIVE',
        'cardTitle': {'defaultValue': {'language': 'en-GB', 'value': 'RiskMandate'}},
        'header': {'defaultValue': {'language': 'en-GB', 'value': 'Know their reach. Define their mandate. Control the gap.'}},
        'subheader': {'defaultValue': {'language': 'en-GB', 'value': 'Agent Behaviour Policies'}},
        'hexBackgroundColor': '#161615',
        'logo': {'sourceUri': {'uri': WALLET + '/pass/thumbnail@3x.png'},
                 'contentDescription': {'defaultValue': {'language': 'en-GB', 'value': 'RiskMandate seal'}}},
        'heroImage': {'sourceUri': {'uri': WALLET + '/google-hero.png'},
                      'contentDescription': {'defaultValue': {'language': 'en-GB', 'value': 'Know their reach. Define their mandate. Control the gap.'}}},
        'barcode': {'type': 'QR_CODE', 'value': SITE + '/meet/', 'alternateText': 'web-summit.sgit.ai/meet/'},
        'textModulesData': [
            {'id': 'when', 'header': 'Meet us at Web Summit Lisbon', 'body': 'Thursday 12 November, between Booths A1-30'},
            {'id': 'what', 'header': 'Agent Behaviour Policies', 'body': 'What one agent can reach, what you authorised it to do, and the gap between the two.'},
        ],
        'linksModuleData': {'uris': [
            {'id': 'web', 'uri': 'https://riskmandate.ai', 'description': 'riskmandate.ai'},
            {'id': 'meet', 'uri': SITE + '/meet/', 'description': 'Meet the team'},
        ]},
    }
    return generic_class, generic_object


def main():
    a = argparse.ArgumentParser()
    a.add_argument('--issuer-id', required=True); a.add_argument('--sa-key', required=True)
    o = a.parse_args()
    sa = json.load(open(o.sa_key))
    cls, obj = card(o.issuer_id)
    claims = {'iss': sa['client_email'], 'aud': 'google', 'typ': 'savetowallet', 'iat': int(time.time()),
              'origins': [SITE], 'payload': {'genericClasses': [cls], 'genericObjects': [obj]}}
    head = b64url(json.dumps({'alg': 'RS256', 'typ': 'JWT', 'kid': sa.get('private_key_id', '')}).encode())
    body = b64url(json.dumps(claims, separators=(',', ':')).encode())
    with tempfile.TemporaryDirectory() as tmp:
        kp = os.path.join(tmp, 'k.pem'); fd = os.open(kp, os.O_WRONLY | os.O_CREAT, 0o600)
        os.write(fd, sa['private_key'].encode()); os.close(fd)
        sig = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', kp], input=f'{head}.{body}'.encode(),
                             capture_output=True, check=True).stdout
    print(f'https://pay.google.com/gp/v/save/{head}.{body}.{b64url(sig)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
