#!/usr/bin/env python3
"""Build the RiskMandate business card as an Apple Wallet pass (.pkpass).

conductor@web-summit.indi, 9 November 2026, at Indi's word. The design is the green card ("GRC"), the team-wide card
with no names: team/designer/print/concepts-rm/round4/2-grc/.

    python3 -I team/designer/wallet/make-pass.py --out card.pkpass \
        --team-id <Apple team id> --pass-type-id pass.news.promptugal.card \
        --cert pass.pem --key pass.key --wwdr AppleWWDRCAG4.pem

Apple Wallet only opens a pass signed with a Pass Type ID certificate from an Apple Developer account (Dinis's), plus
Apple's WWDR intermediate certificate. The certificate and its key live only in the session that signs, never in this
repository (*.pem and *.key are gitignored). Without --cert, the script writes the unsigned folder's manifest and stops:
the pass's content can be checked, but Wallet will refuse it. Standard library and openssl only.
"""
import argparse, hashlib, json, os, subprocess, sys, tempfile, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'pass')

def main():
    a = argparse.ArgumentParser()
    a.add_argument('--out', default='card.pkpass'); a.add_argument('--team-id'); a.add_argument('--pass-type-id')
    a.add_argument('--cert'); a.add_argument('--key'); a.add_argument('--wwdr'); a.add_argument('--key-pass', default=os.environ.get('PASS_KEY_PASSPHRASE', ''))
    o = a.parse_args()
    with tempfile.TemporaryDirectory() as tmp:
        files = {}
        for name in sorted(os.listdir(SRC)):
            if name.startswith('.'): continue
            data = open(os.path.join(SRC, name), 'rb').read()
            if name == 'pass.json':
                p = json.loads(data)
                if o.team_id: p['teamIdentifier'] = o.team_id
                if o.pass_type_id: p['passTypeIdentifier'] = o.pass_type_id
                data = json.dumps(p, indent=1, ensure_ascii=False).encode()
            files[name] = data
        manifest = json.dumps({n: hashlib.sha1(d).hexdigest() for n, d in files.items()}, indent=1).encode()
        files['manifest.json'] = manifest
        if not (o.cert and o.key and o.wwdr and o.team_id):
            print('make-pass: unsigned (no --cert/--key/--wwdr/--team-id): manifest of', len(files) - 1, 'files; Wallet needs a signed pass')
            return 1
        mf, sig = os.path.join(tmp, 'manifest.json'), os.path.join(tmp, 'signature')
        open(mf, 'wb').write(manifest)
        cmd = ['openssl', 'smime', '-binary', '-sign', '-certfile', o.wwdr, '-signer', o.cert, '-inkey', o.key,
               '-in', mf, '-out', sig, '-outform', 'DER']
        if o.key_pass: cmd += ['-passin', 'env:PASS_KEY_PASSPHRASE']
        subprocess.run(cmd, check=True)
        files['signature'] = open(sig, 'rb').read()
        with zipfile.ZipFile(o.out, 'w', zipfile.ZIP_DEFLATED) as z:
            for n, d in files.items(): z.writestr(n, d)
    print('make-pass: wrote', o.out)
    return 0

if __name__ == '__main__': sys.exit(main())
