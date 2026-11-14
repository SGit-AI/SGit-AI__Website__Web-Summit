#!/bin/bash
# ship.sh <vault> "<label>" "<description>": check reviews parse, fill (packed), exact-secret check, commit, push (timed), register, catalogue
set -e
A=${ARCHIVE:-$HOME/session-archive}; n=$1; cd $A; VAULTS=${VAULTS:-$HOME/vaults}; AGENT=${AGENT:?set AGENT to your agent name}
python3 -I -c "
import glob,json,sys
bad=[]
for f in glob.glob('out/$n/*/review.json'):
  try: json.load(open(f))
  except Exception: bad.append(f)
print('reviews',len(glob.glob('out/$n/*/review.json')),'bad',bad); sys.exit(1 if bad else 0)"
python3 -I tools/fill_vault.py out/$n $VAULTS/$n "$2" "$3"
D=$VAULTS/$n; echo "files: $(find $D -path $D/.sg_vault -prune -o -type f -print | wc -l)"
python3 -I - $D <<'PYEND'
import os,sys,re,zipfile,gzip
sys.path.insert(0,'tools'); import build; kh={}
S=[v for k,v in os.environ.items() if re.search(r'KEY|TOKEN|SECRET|PASS',k) and v and len(v)>12 and not re.fullmatch(r'[a-z_-]{1,24}',v)]
hits=0
for r,_,fs in os.walk(sys.argv[1]):
  if '.sg_vault' in r: continue
  for f in fs:
    p=os.path.join(r,f)
    if f.endswith('.zip'):
      z=zipfile.ZipFile(p); blobs=[(gzip.decompress(z.read(m)) if m.endswith('.gz') else z.read(m)) for m in z.namelist()]
    else: blobs=[open(p,'rb').read()]
    hits+=sum(1 for b in blobs for s in S if s.encode() in b)
    for b in blobs:
      t=b.decode('utf-8','replace'); c=[0]; build.redact(t,c)
      if c[0]: kh[p]=kh.get(p,0)+c[0]
print('exact-secret check:',hits,'hits; key-pattern check:',sum(kh.values()),'hits',list(kh)[:5]); sys.exit(1 if hits or kh else 0)
PYEND
(cd $D && sgit commit -m "$AGENT: $n archived (packed)" >/dev/null 2>&1 || true)
(umask 077; printf %s "$SG_SEND_ACCESS_TOKEN" > $D/.sg_vault/local/token)
bash $A/tools/sgit_timed.sh push-$n $D push | cut -c1-200 || true
rm -f $D/.sg_vault/local/token
python3 -I tools/register.py $VAULTS/sessions-master $VAULTS vaults.json $n
python3 -c "
import json;a=json.load(open('vaults.json'));v=json.load(open('vaults-catalog.json'));n=json.load(open('vaults-catalog-now.json'))
for k in v:
  if k in a: v[k].update({x:a[k][x] for x in ('vault_id','endpoint') if x in a[k]})
n['$n']=v['$n']
for k in n: n[k]=v[k]
json.dump(v,open('vaults-catalog.json','w'),indent=1);json.dump(n,open('vaults-catalog-now.json','w'),indent=1)"
python3 -I tools/catalog.py out $VAULTS/sessions-master vaults-catalog-now.json | tail -1
