#!/usr/bin/env bash
# Diagnostic: does a headless `claude -p` session actually see project skills?
#
# The A/B runner's control check reported "no skills loaded in either arm". That has two
# very different causes and they need different fixes:
#   (a) the skills are not advertised to a -p session at all, or
#   (b) they are advertised and the model chose not to load one.
# This tells them apart. Run it from the repo root.
set -euo pipefail

ARENA="${TMPDIR:-/tmp}/aiux-skill-evals"
KEY=$(grep -m1 '^ANTHROPIC_API_KEY=' /Users/imranmohammed/aiex/.env.local | cut -d= -f2- | tr -d '"')

export ANTHROPIC_API_KEY="$KEY"
export CLAUDE_CONFIG_DIR="$ARENA/config"

cd "$ARENA/repo-with"

echo "=== init event: skills advertised to the session ==="
/Users/imranmohammed/.local/bin/claude -p "hi" \
  --model claude-haiku-4-5-20251001 \
  --output-format stream-json --verbose 2>/dev/null \
  | head -1 \
  | python3 -c "
import json,sys
e=json.load(sys.stdin)
for k in ('slash_commands','tools','skills','agents'):
    v=e.get(k)
    if isinstance(v,list):
        aiux=[x for x in v if 'aiux' in str(x).lower()]
        print(f'{k}: {len(v)} total, {len(aiux)} aiux')
        for a in aiux[:5]: print('   ', a)
"
