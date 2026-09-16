#!/usr/bin/env bash
# Diagnostic: is the runner's own prompt suffix suppressing skill loading?
#
# The corpus prompts are sent with a suffix ("Answer as a senior product designer... Do not
# write or edit any files."). That suffix exists to make the two arms comparable, but a
# harness that tells the model to answer in prose and touch nothing may be discouraging the
# very tool call it is trying to measure. If so, a zero loading rate is an artifact of this
# file, not a fact about the pack.
#
# Sends the same task three ways and reports which skills each one loaded.
set -euo pipefail

ARENA="${TMPDIR:-/tmp}/aiux-skill-evals"
KEY=$(grep -m1 '^ANTHROPIC_API_KEY=' /Users/imranmohammed/aiex/.env.local | cut -d= -f2- | tr -d '"')
export ANTHROPIC_API_KEY="$KEY"
export CLAUDE_CONFIG_DIR="$ARENA/config"
cd "$ARENA/repo-with"

TASK="I design an invoicing tool for small agencies. When someone starts a new invoice we pre-fill the customer and the amount based on what they've billed before. It's wrong maybe half the time and people have to clear the fields before typing. My PM wants to 'make the prediction smarter'. What should I actually do to the design?"

SUFFIX=$'\n\nAnswer as a senior product designer would in a working session: what is actually going wrong, what you would change, and what that change costs. Be concrete enough that someone could act on it. Do not write or edit any files.'

run () {
  local label="$1"; local prompt="$2"
  echo "=== $label ==="
  /Users/imranmohammed/.local/bin/claude -p "$prompt" \
    --model claude-sonnet-4-6 \
    --output-format stream-json --verbose 2>/dev/null \
  | python3 -c "
import json,sys
loaded=[]
for line in sys.stdin:
    line=line.strip()
    if not line or 'tool_use' not in line: continue
    try: e=json.loads(line)
    except: continue
    c=(e.get('message') or {}).get('content')
    if not isinstance(c,list): continue
    for b in c:
        if isinstance(b,dict) and b.get('type')=='tool_use':
            loaded.append(b.get('name')+':'+str((b.get('input') or {}).get('skill','')))
print('  tool calls:', loaded if loaded else 'NONE')
"
}

run "A. with harness suffix"    "$TASK$SUFFIX"
run "B. bare task, no suffix"   "$TASK"
run "C. explicit nudge"         "$TASK"$'\n\nUse any relevant skills you have available.'
