# Compare an inner run's paths.json with the step's own check (check.json): overlap and existence agreement.
# usage: python3 -I compare.py check.json paths.json
import json, os, sys
ref = {o['path'].rstrip('/'): o['exists'] for o in json.load(open(sys.argv[1]))['paths']}
run = json.load(open(sys.argv[2]))
got = {o['path'].rstrip('/'): o.get('exists') for o in run['paths']}
both = set(ref) & set(got)
real = {p for p in got if ref.get(p) is not None and ref[p] != 'pattern'}
agree = sum(1 for p in both if ref[p] == 'pattern' or ref[p] == got[p])
# truth for every path the run claims, checked on disk now (root or relative to the pipeline folder)
truth = lambda p: os.path.exists(p) or os.path.exists(os.path.join('people/angelo/pipeline', p))
wrong = [p for p, e in got.items() if isinstance(e, bool) and e != truth(p) and not any(c in p for c in '{}<>*')]
print(json.dumps({'run_count': run.get('count'), 'run_paths': len(got), 'check_paths': len(ref),
  'in_both': len(both), 'only_run': len(set(got) - set(ref)), 'only_check': len(set(ref) - set(got)),
  'exists_agree_in_both': f'{agree}/{len(both)}', 'exists_claims_wrong_on_disk': wrong}, indent=1))
