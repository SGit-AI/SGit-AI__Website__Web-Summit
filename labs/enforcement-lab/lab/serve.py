#!/usr/bin/env python3
"""Local server for the enforcement lab dashboard: serves the files and runs one real experiment on request.

  python3 serve.py                  # http://127.0.0.1:8787/dashboard/
  python3 serve.py --host 0.0.0.0   # reachable from an iPad on the same network (see README: risks)

GET  /api/health          -> {"live": true, "runs_left": n}
POST /api/run {"scenario": "S1-restricted-file", "model": "A"|"B"|"C", "variant": "direct"|"pressure"}
                          -> the run's record (a real headless Claude Code session, 20 to 60 s)
One run at a time; at most --max-live runs per server start (a cost cap). Nothing here deploys anything.
"""
import argparse, http.server, json, threading
from pathlib import Path
import run_lab

ROOT = Path(__file__).resolve().parent.parent
LOCK = threading.Lock()
STATE = {'left': 30}

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)

    def _json(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(b)))
        self.end_headers(); self.wfile.write(b)

    def _page(self, name):
        b = (ROOT / 'dashboard' / name).read_bytes()
        self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(b)))
        self.end_headers(); self.wfile.write(b)

    def do_GET(self):
        if self.path.startswith('/api/health'):
            return self._json(200, {'live': True, 'runs_left': STATE['left']})
        # the pages are kept as .tpl so the site's gate does not treat them as site pages; this server is how they are opened
        if self.path.split('?')[0] in ('/', '/dashboard', '/dashboard/'):
            return self._page('index.tpl')
        if self.path.split('?')[0] == '/dashboard/report':
            return self._page('report.tpl')
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith('/api/run'):
            return self._json(404, {'error': 'not found'})
        try:
            req = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0)) or 0) or b'{}')
        except Exception:
            return self._json(400, {'error': 'bad json'})
        sc, m, v = req.get('scenario'), req.get('model'), req.get('variant', 'direct')
        pt = req.get('policy')
        if pt is not None and (not isinstance(pt, str) or len(pt) > 4000):
            return self._json(400, {'error': 'the policy text must be at most 4000 characters'})
        if sc not in run_lab.SCEN or m not in run_lab.MODELS or v not in ('direct', 'pressure'):
            return self._json(400, {'error': 'unknown scenario, model or variant'})
        if STATE['left'] <= 0:
            return self._json(429, {'error': 'the live-run cap for this server start is used up'})
        if not LOCK.acquire(blocking=False):
            return self._json(409, {'error': 'a run is already in progress'})
        try:
            STATE['left'] -= 1
            rec = run_lab.run_one(sc, m, 0, ARGS.tier, ARGS.max_turns, v, pt)
            rec['live'] = True
            run_lab.summarise()
            return self._json(200, rec)
        except Exception as e:
            return self._json(500, {'error': str(e)[:300]})
        finally:
            LOCK.release()

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--host', default='127.0.0.1'); ap.add_argument('--port', type=int, default=8787)
    ap.add_argument('--tier', default=__import__('os').environ.get('LAB_MODEL')); ap.add_argument('--max-turns', type=int, default=12)
    ap.add_argument('--max-live', type=int, default=30)
    ARGS = ap.parse_args(); STATE['left'] = ARGS.max_live
    if not ARGS.tier:
        raise SystemExit('set LAB_MODEL (or --tier) to the model alias for the agent under test')
    print('enforcement lab on http://%s:%d/dashboard/  (live runs left: %d)' % (ARGS.host, ARGS.port, STATE['left']))
    http.server.ThreadingHTTPServer((ARGS.host, ARGS.port), H).serve_forever()
