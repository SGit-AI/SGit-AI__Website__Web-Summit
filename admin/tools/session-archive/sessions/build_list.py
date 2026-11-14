import json,sys,glob,collections
D=sys.argv[1]
keys=["id","title","session_status","status_bucket","created_at","updated_at","origin","tags","parent_session_id"]
seen={};order=[]
for f in sorted(glob.glob(D+"/pages/p*.txt")):
    t=open(f).read(); i=t.find('{"ccr"')
    o,_=json.JSONDecoder().raw_decode(t[i:])
    for s in o["ccr"]["data"]:
        if s["id"] in seen: continue
        seen[s["id"]]={k:s.get(k) for k in keys}; order.append(s["id"])
with open(D+"/all.jsonl","w") as w:
    for i in order: w.write(json.dumps(seen[i])+"\n")
c=collections.Counter(seen[i]["session_status"] for i in order)
cr=sorted(seen[i]["created_at"] for i in order)
print(len(order),dict(c),cr[0],cr[-1])
