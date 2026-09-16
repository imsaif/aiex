#!/usr/bin/env bash
# Diagnostic: do the skills fire when someone is WORKING rather than ASKING?
#
# The A/B corpus is all prose design questions, and none of them loaded a skill. But the
# pack's own README promises skills trigger "when you work on a surface that pattern
# covers" — editing a component, not asking for advice. That is a different condition and
# it is the one the pack is sold on, so a zero result on asking does not settle it.
#
# This copies a real flawed component into the scratch repo and phrases the same underlying
# problem as work on that file. If skills load here, the pack works for builders and is
# invisible to askers — a positioning finding. If they still do not, the claim on the tin
# is wrong.
set -euo pipefail

ARENA="${TMPDIR:-/tmp}/aiux-skill-evals"
HERE="$(cd "$(dirname "$0")" && pwd)"
KEY=$(grep -m1 '^ANTHROPIC_API_KEY=' /Users/imranmohammed/aiex/.env.local | cut -d= -f2- | tr -d '"')
export ANTHROPIC_API_KEY="$KEY"
export CLAUDE_CONFIG_DIR="$ARENA/config"

mkdir -p "$ARENA/repo-with/src/components"
cp "$HERE/fixtures/InvoiceForm.tsx" "$ARENA/repo-with/src/components/InvoiceForm.tsx"
cd "$ARENA/repo-with"

report () {
  python3 -c "
import json,sys
calls=[]
for line in sys.stdin:
    line=line.strip()
    if not line or 'tool_use' not in line: continue
    try: e=json.loads(line)
    except: continue
    c=(e.get('message') or {}).get('content')
    if not isinstance(c,list): continue
    for b in c:
        if isinstance(b,dict) and b.get('type')=='tool_use':
            n=b.get('name'); i=b.get('input') or {}
            if n=='Skill': calls.append('SKILL:'+str(i.get('skill')))
            else: calls.append(n)
skills=[c for c in calls if c.startswith('SKILL:')]
print('  tools used :', ', '.join(calls) if calls else 'NONE')
print('  skills     :', ', '.join(skills) if skills else 'NONE')
"
}

run () {
  echo "=== $1 ==="
  /Users/imranmohammed/.local/bin/claude -p "$2" \
    --model claude-sonnet-4-6 \
    --permission-mode acceptEdits \
    --output-format stream-json --verbose 2>/dev/null | report
}

run "D. work on the file, no nudge" \
"Look at src/components/InvoiceForm.tsx. We pre-fill the client and amount from billing history and it's wrong about half the time, so people have to clear the fields before they can type. Fix the component."

run "E. work on the file, design framing" \
"Look at src/components/InvoiceForm.tsx. Our AI pre-fills the client and amount and it's wrong half the time. Redesign how the prediction is presented so it stops getting in the user's way, and change the code."
