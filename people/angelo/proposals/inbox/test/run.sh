#!/usr/bin/env bash
# Local test of people/angelo/tools/inbox_lane.py: made-up mail only, a folder for the lane, a scratch vault.
set -euo pipefail
# runs in a temporary folder; needs this session's crm-angelo key for the file step
T=$(mktemp -d); R=$(cd "$(dirname "$0")" && git rev-parse --show-toplevel); TOOL=$R/people/angelo/tools/inbox_lane.py
mkdir -p "$T/lane" "$T/vault/graph" "$T/crm" "$T/mail"
echo "{\"private\":{\"name\":\"t\",\"dir\":\"$T/vault\",\"vault_id\":\"t\"}}" > "$T/crm/vaults.json"
AT=$(printf '\x40')
mk() {  # name subject
  printf 'From: Test Sender <sender%sexample.org>\r\nTo: someone%sexample.com\r\nSubject: %s\r\nDate: Sat, 07 Nov 2026 09:10:00 +0000\r\nContent-Type: text/plain\r\n\r\nA made-up test message.\r\n' "$AT" "$AT" "$2" > "$T/mail/$1.eml"
  printf '{"date":"2026-11-07T09:10:00Z","direction":"in","subject":"%s","summary":"A made-up test message."}' "$2" > "$T/mail/$1.json"
}
mk 2026-11-07T0910Z-in-a1 "Trusted test"
mk 2026-11-07T0911Z-in-b2 "Untrusted test"
SA=$(python3 -I $TOOL seal --local "$T/lane" --company example-robotics --thread 2026-11-07-test-thread --eml "$T/mail/2026-11-07T0910Z-in-a1.eml" --card "$T/mail/2026-11-07T0910Z-in-a1.json" --company-name "Example Robotics (test)" --company-website https://example.org | sed 's/Inbox-sha256: //')
python3 -I $TOOL seal --local "$T/lane" --company example-bank --thread 2026-11-07-other --eml "$T/mail/2026-11-07T0911Z-in-b2.eml" --card "$T/mail/2026-11-07T0911Z-in-b2.json" >/dev/null
echo "seal refuses a bad slug: $(python3 -I $TOOL seal --local "$T/lane" --company ../evil --thread 2026-11-07-x --eml "$T/mail/2026-11-07T0910Z-in-a1.eml" --card "$T/mail/2026-11-07T0910Z-in-a1.json" 2>&1 | head -1)"
# hostile payloads, crafted by hand (as anyone holding the write-only token could): traversal, tampered EML, conductor-only
python3 -I - "$T" "$R" "$SA" <<'EOF'
import sys, json, base64, hashlib, secrets, os
T, R, SA = sys.argv[1:4]
sys.path.insert(0, R)
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
c = PKI__Crypto(); keys = {k['id']: k for k in json.load(open(R + '/data/keys.json'))['keys']}
def put(rid, body, item=None):
    k = keys[rid]; enc = c.hybrid_encrypt(c.import_public_key_pem(k['bundle']['encrypt']), json.dumps(body))
    p = base64.b64encode(json.dumps({'v': 'angelo-inbox-1', 'item': item or secrets.token_hex(12), 'for': k['bundle']['fingerprint'], 'enc': enc}).encode()).decode()
    open(os.path.join(T, 'lane/pending', secrets.token_hex(8) + '.enc'), 'w').write(p)
eml = open(T + '/mail/2026-11-07T0910Z-in-a1.eml', 'rb').read(); good = hashlib.sha256(eml).hexdigest()
base = {'thread': '2026-11-07-test-thread', 'name': '2026-11-07T0912Z-in-c3', 'sha256': good, 'eml_b64': base64.b64encode(eml).decode(), 'card': {'sha256': good, 'subject': 'x'}}
put('crm-angelo', {**base, 'company': '../../outside'})                                   # traversal: refused by the pattern
put('crm-angelo', {**base, 'company': 'example-robotics', 'eml_b64': base64.b64encode(eml + b'tampered').decode()})   # tampered
put('conductor-angelo', {**base, 'company': 'example-robotics'})                         # not mine: left for the conductor
EOF
echo "$SA" > "$T/trust.txt"
echo "pending before: $(ls "$T/lane/pending" | wc -l)"
python3 -I $TOOL file --local "$T/lane" --vault "$T/vault" --crm "$T/crm" --key sha256:b1bdf1301e00ad2c --test-trust "$T/trust.txt"
echo "pending after: $(ls "$T/lane/pending" | wc -l), processed: $(ls "$T/lane/processed" | wc -l)"
echo "second run (idempotent):"; python3 -I $TOOL file --local "$T/lane" --vault "$T/vault" --crm "$T/crm" --key sha256:b1bdf1301e00ad2c --test-trust "$T/trust.txt"
echo "vault files:"; (cd "$T/vault" && find . -type f | sort)
echo "outside the vault: $(ls "$T" | tr '\n' ' ')"
cmp -s "$T/mail/2026-11-07T0910Z-in-a1.eml" "$T/vault/companies/example-robotics/comms/2026-11-07-test-thread/2026-11-07T0910Z-in-a1.eml" && echo "filed EML identical to the original"
node -e 'const n=require(process.argv[1]).nodes;console.log("graph:",n.map(x=>x.type+":"+(x.label||"")).join(" | "))' "$T/vault/graph/nodes.json"
echo "--test-trust without --local: $(python3 -I $TOOL file --test-trust "$T/trust.txt" --key x 2>&1 | tail -1)"
