#!/bin/bash
# usage: run.sh <label> <openrouter model id>
S=/tmp/claude-0/-home-user-SGit-AI--Website--Web-Summit/5c417159-3ecc-5f99-bad5-9a86d8c661fe/scratchpad
L=$1; M=$2; W=$S/work-$L; H=$S/home-$L
rm -rf $W $H; mkdir -p $H
git clone -q --local /home/user/SGit-AI__Website__Web-Summit $W && git -C $W remote remove origin
TASK='In people/angelo/pipeline/, list every file path named in ROLES.md, QUEUE.md, skills/*.md and formats/*.md and say for each whether it exists in this repository. Write paths.json at the repository root: {"count": N, "paths": [{"path": "...", "exists": true|false, "named_in": ["ROLES.md", ...]}]}. Then print the count. Do not commit or push anything.'
before=$(curl -sS https://openrouter.ai/api/v1/key | python3 -c 'import json,sys;print(json.load(sys.stdin)["data"]["usage"])')
t0=$(date +%s)
cd $W && env -i PATH="$PATH" HOME=$H TERM=dumb \
  HTTPS_PROXY="$HTTPS_PROXY" https_proxy="$https_proxy" NO_PROXY="$NO_PROXY" no_proxy="$no_proxy" \
  NODE_EXTRA_CA_CERTS="$NODE_EXTRA_CA_CERTS" NODE_OPTIONS="$NODE_OPTIONS" SSL_CERT_FILE="$SSL_CERT_FILE" \
  ANTHROPIC_BASE_URL=https://openrouter.ai/api ANTHROPIC_AUTH_TOKEN=proxy-injected ANTHROPIC_API_KEY= \
  ANTHROPIC_MODEL=$M ANTHROPIC_DEFAULT_SONNET_MODEL=$M ANTHROPIC_DEFAULT_HAIKU_MODEL=$M ANTHROPIC_DEFAULT_OPUS_MODEL=$M CLAUDE_CODE_SUBAGENT_MODEL=$M \
  DISABLE_TELEMETRY=1 DISABLE_ERROR_REPORTING=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \
  timeout 900 claude -p "$TASK" --model "$M" --output-format json --max-turns 40 \
    --permission-mode acceptEdits --allowedTools "Read,Glob,Grep,Write,Edit,Bash(ls:*),Bash(test:*),Bash(find:*),Bash(node:*),Bash(python3:*),Bash(grep:*),Bash(cat:*)" \
    > $S/out-$L.json 2> $S/err-$L.txt
rc=$?; t1=$(date +%s)
sleep 20
after=$(curl -sS https://openrouter.ai/api/v1/key | python3 -c 'import json,sys;print(json.load(sys.stdin)["data"]["usage"])')
echo "{\"label\":\"$L\",\"model\":\"$M\",\"exit\":$rc,\"seconds\":$((t1-t0)),\"or_usage_before\":$before,\"or_usage_after\":$after}" > $S/meta-$L.json
cat $S/meta-$L.json
