#!/usr/bin/env python3
"""Build one session's archive folder from its ingested pages.

usage: build.py <session_id> <out_dir> [sessions_meta.jsonl]
Writes <out_dir>/<YYYY-MM-DD>_<slug>__<session_id>/ with:
  events-NNN.jsonl.gz  every event (parts of ~7 MB raw, under ~3.5 MB gzipped), oldest first, deduplicated (the full raw record)
  transcript.md     readable: the person's messages, the agent's text, tool calls (short), tool results (trimmed)
  messages.jsonl.gz one line per message (role, time, text, tool) for the explorer's search and SQL
  meta.json         the session's list entry plus counts, first/last event, tools used, sub-agents
Secrets that look like tokens or keys are blanked in transcript.md and messages.jsonl (events.jsonl.gz is
scanned too: a line that matches is blanked in place and counted in meta.redactions).
"""
import gzip, io, json, os, re, sys, collections

def gzw(path, level=6):
    """Deterministic gzip text writer (mtime 0), so an unchanged rebuild leaves the file byte-identical."""
    return io.TextIOWrapper(gzip.GzipFile(path, 'wb', compresslevel=level, mtime=0), encoding='utf-8')

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

SECRET = re.compile(
    r'(sg-send[-_][A-Za-z0-9_\-]{16,}|sgit_(?:private|public_read)_[A-Za-z0-9_]{16,}|sk-or-v1-[A-Za-z0-9]{20,}|'
    r'sk-ant-[A-Za-z0-9_\-]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gho_[A-Za-z0-9]{20,}|'
    r'\b[a-z0-9]{20,32}:[a-z0-9]{8}\b|#[a-z0-9]{20,32}:[a-z0-9]{8}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9\-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----|'
    r'"(?:private_key|secret|password|access_token|api_key|vault_key|read_key|write_key|token)"\s*:\s*"[^"\n]{12,}")')

ENV_SECRETS = [v for k, v in os.environ.items() if re.search(r'KEY|TOKEN|SECRET|PASS', k) and v and len(v) > 12 and not re.fullmatch(r'[a-z_-]{1,24}', v)]   # skip the proxy's placeholder words
TOKEN_ARG = re.compile(r'(--token[= ]\s*)(?!\[redacted\])(?=[^\s"\\]*[0-9])[^\s"\\]{8,}')   # a real token has a digit; prose like "--token argument" is not one
# a key value named by its context (13 Nov: sgit prints read keys as 64 hex, vault passphrases as 24 characters)
KEY_CTX = re.compile(r'(?i)((?:read|write|vault|private|signing|access)[_ -]?key|passphrase)([^A-Za-z0-9\n\\]{1,6})([A-Za-z0-9_+/=]{16,})')
def _secretish(v):
    if re.fullmatch(r'[0-9a-fA-F]{32,}', v): return True
    if '/' in v: return False
    return bool(re.fullmatch(r'[A-Za-z0-9_+=]{16,64}', v)) and sum(c.isdigit() for c in v) >= 3 and not re.search(r'[a-z]{5,}_[a-z]{3,}', v)

def redact(s, counter):
    for v in ENV_SECRETS:
        if v in s:
            counter[0] += s.count(v)
            s = s.replace(v, '[redacted]')
    s, n = TOKEN_ARG.subn(lambda m: m.group(1) + '[redacted]', s)
    counter[0] += n
    def ctx(m):
        if not _secretish(m.group(3)): return m.group(0)
        counter[0] += 1
        return m.group(1) + m.group(2) + '[redacted]'
    s = KEY_CTX.sub(ctx, s)
    def sub(m):
        counter[0] += 1
        t = m.group(0)
        if t.startswith('"'):
            k = t.split(':', 1)[0]
            return f'{k}: "[redacted]"'
        return '[redacted]'
    return SECRET.sub(sub, s)

def redact_obj(o, counter):
    """Redact every string inside a parsed event (keys kept), so a secret right after an escape like \\n cannot break the JSON."""
    if isinstance(o, str):
        return redact(o, counter)
    if isinstance(o, list):
        return [redact_obj(x, counter) for x in o]
    if isinstance(o, dict):
        return {k: redact_obj(v, counter) for k, v in o.items()}
    return o

def slug(t):
    t = re.sub(r'[^A-Za-z0-9@._-]+', '-', (t or 'untitled')).strip('-')
    return t[:60] or 'untitled'

def kind_of(e):
    return next((k for k in e if k != 'created_at'), '?')

def inner(e):
    k = kind_of(e)
    v = e.get(k) or {}
    return k, (v.get('internal_anthropic_catchall') or v)

def text_of(content, limit=None):
    if isinstance(content, str):
        return content
    out = []
    for b in content or []:
        if not isinstance(b, dict):
            continue
        t = b.get('type')
        if t == 'text':
            out.append(b.get('text', ''))
        elif t == 'tool_result':
            c = b.get('content')
            s = text_of(c) if not isinstance(c, str) else c
            if limit and len(s) > limit:
                s = s[:limit] + f'\n… [{len(s) - limit} more characters in events.jsonl.gz]'
            out.append(s)
    return '\n'.join(x for x in out if x)

def main():
    sid, out_dir = sys.argv[1], sys.argv[2]
    meta_src = {}
    if len(sys.argv) > 3:
        for l in open(sys.argv[3]):
            j = json.loads(l)
            if j.get('id') == sid:
                meta_src = j
                break
    pdir = os.path.join(ROOT, 'raw', sid, 'pages')
    evs, seen = [], set()
    for p in os.listdir(pdir):
        with gzip.open(os.path.join(pdir, p), 'rt', encoding='utf-8') as f:
            for e in json.load(f).get('data') or []:
                k, v = inner(e)
                u = (e.get(k) or {}).get('uuid') or v.get('uuid') or json.dumps(e, sort_keys=True)[:200]
                if u in seen:
                    continue
                seen.add(u)
                evs.append(e)
    evs.sort(key=lambda e: e.get('created_at') or '')
    created = (meta_src.get('created_at') or (evs[0]['created_at'] if evs else '0000-00-00'))[:10]
    folder = os.path.join(out_dir, f"{created}_{slug(meta_src.get('title'))}__{sid}")
    os.makedirs(folder, exist_ok=True)
    red = [0]
    kinds, tools, agents = collections.Counter(), collections.Counter(), set()
    md = [f"# {meta_src.get('title') or sid}\n", f"- session: `{sid}`", f"- created: {meta_src.get('created_at')}",
          f"- status: {meta_src.get('session_status')}", f"- origin: {meta_src.get('origin')}",
          f"- parent: {meta_src.get('parent_session_id')}", '']
    msgs = []
    for f in os.listdir(folder):
        if f.startswith('events') and f.endswith('.jsonl.gz'):
            os.remove(os.path.join(folder, f))
    parts, cur, cur_raw = [], None, 0
    def newpart():
        nonlocal cur, cur_raw
        if cur:
            cur.close()
        fn = f'events-{len(parts):03d}.jsonl.gz'
        parts.append(fn)
        cur = gzw(os.path.join(folder, fn))
        cur_raw = 0
    if True:
        for e in evs:
            line2 = json.dumps(redact_obj(e, red), ensure_ascii=False)   # redact inside the values, so JSON escapes stay valid
            if cur is None or cur_raw > 7_000_000:
                newpart()
            cur.write(line2 + '\n')
            cur_raw += len(line2)
            k, v = inner(e)
            kinds[k] += 1
            if k not in ('user', 'assistant'):
                continue
            m = v.get('message') or {}
            agent = v.get('agent_id')
            if agent:
                agents.add(agent)
            who = ('sub-agent ' + agent[:8] + ' · ' if agent else '') + k
            ts = (e.get('created_at') or '')[:19].replace('T', ' ')
            content = m.get('content')
            if k == 'assistant' and isinstance(content, list):
                for b in content:
                    if b.get('type') == 'tool_use':
                        tools[b.get('name')] += 1
                        inp = json.dumps(b.get('input'), ensure_ascii=False)
                        inp = redact(inp[:400] + ('…' if len(inp) > 400 else ''), red)
                        md.append(f"**{who} · {ts} · tool {b.get('name')}**: `{inp}`\n")
                        msgs.append({'t': e.get('created_at'), 'role': 'tool_use', 'agent': agent, 'tool': b.get('name'), 'text': inp})
            body = text_of(content, limit=2000)
            if not body.strip():
                continue
            body = redact(body, red)
            is_result = isinstance(content, list) and any(isinstance(b, dict) and b.get('type') == 'tool_result' for b in content)
            role = 'tool_result' if is_result else ('person' if k == 'user' and not agent and not v.get('isSynthetic') else k)
            if role == 'tool_result':
                md.append(f"<details><summary>{who} · {ts} · tool result</summary>\n\n```\n{body}\n```\n</details>\n")
            else:
                label = 'PERSON' if role == 'person' else who
                md.append(f"### {label} · {ts}\n\n{body}\n")
            msgs.append({'t': e.get('created_at'), 'role': role, 'agent': agent, 'text': body[:20000]})
    if cur:
        cur.close()
    open(os.path.join(folder, 'transcript.md'), 'w').write('\n'.join(md))
    if os.path.exists(os.path.join(folder, 'messages.jsonl')):
        os.remove(os.path.join(folder, 'messages.jsonl'))
    with gzw(os.path.join(folder, 'messages.jsonl.gz')) as f:
        for m in msgs:
            f.write(json.dumps({**m, 'session': sid}, ensure_ascii=False) + '\n')
    meta = {**meta_src, 'id': sid, 'events': len(evs), 'first_event': evs[0]['created_at'] if evs else None,
            'last_event': evs[-1]['created_at'] if evs else None, 'kinds': dict(kinds), 'tools': dict(tools.most_common()),
            'subagents': len(agents), 'messages': len(msgs), 'person_messages': sum(m['role'] == 'person' for m in msgs),
            'redactions': red[0], 'folder': os.path.basename(folder), 'event_parts': parts}
    json.dump(meta, open(os.path.join(folder, 'meta.json'), 'w'), indent=1, ensure_ascii=False)
    sz = sum(os.path.getsize(os.path.join(folder, x)) for x in os.listdir(folder))
    print(f"BUILT {os.path.basename(folder)} events={len(evs)} messages={len(msgs)} redactions={red[0]} bytes={sz}")

if __name__ == '__main__':
    main()
