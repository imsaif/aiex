#!/bin/bash
# Quick post-edit check — only TypeScript errors (fast, ~2-3s)
# Use this instead of post-edit-check.sh if full checks are too slow

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

PROJECT_DIR="/Users/imranmohammed/aiex"
REL_PATH="${FILE_PATH#$PROJECT_DIR/}"

# TypeScript check only — catches missing imports, wrong types, missing enum values
TSC_OUTPUT=$(cd "$PROJECT_DIR" && npx tsc --noEmit 2>&1 | grep -A 2 "$REL_PATH" || true)
if [ -n "$TSC_OUTPUT" ]; then
  echo -e "\n⛔ TYPE ERRORS in $REL_PATH:\n$TSC_OUTPUT" >&2
  exit 2
fi

exit 0
