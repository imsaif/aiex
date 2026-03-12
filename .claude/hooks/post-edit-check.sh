#!/bin/bash
# Post-edit quality check — runs after Edit/Write on .ts/.tsx files
# Catches type errors, lint issues, and broken tests in real time

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Skip if no file path or not a TS/TSX file
if [ -z "$FILE_PATH" ]; then
  exit 0
fi
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

# Get relative path for cleaner output
PROJECT_DIR="/Users/imranmohammed/aiex"
REL_PATH="${FILE_PATH#$PROJECT_DIR/}"

ERRORS=""

# 1. TypeScript type check (fast — single file context)
TSC_OUTPUT=$(cd "$PROJECT_DIR" && npx tsc --noEmit 2>&1 | grep -A 2 "$REL_PATH" || true)
if [ -n "$TSC_OUTPUT" ]; then
  ERRORS="$ERRORS\n⛔ TYPE ERRORS in $REL_PATH:\n$TSC_OUTPUT\n"
fi

# 2. ESLint check
LINT_OUTPUT=$(cd "$PROJECT_DIR" && npx eslint "$FILE_PATH" --no-warn-ignored 2>&1 || true)
if echo "$LINT_OUTPUT" | grep -q "error"; then
  ERRORS="$ERRORS\n⛔ LINT ERRORS in $REL_PATH:\n$LINT_OUTPUT\n"
fi

# 3. Find and run related tests (if they exist)
BASENAME=$(basename "$FILE_PATH" | sed 's/\.\(ts\|tsx\)$//')
TEST_FILE=$(find "$PROJECT_DIR/src" -path "*__tests__*" -name "${BASENAME}*.test.*" 2>/dev/null | head -1)
if [ -n "$TEST_FILE" ]; then
  TEST_REL="${TEST_FILE#$PROJECT_DIR/}"
  TEST_OUTPUT=$(cd "$PROJECT_DIR" && npx jest "$TEST_FILE" --no-coverage --silent 2>&1 || true)
  if echo "$TEST_OUTPUT" | grep -q "FAIL"; then
    FAILED_TESTS=$(echo "$TEST_OUTPUT" | grep -E "●|FAIL" | head -10)
    ERRORS="$ERRORS\n⛔ BROKEN TESTS ($TEST_REL):\n$FAILED_TESTS\n"
  fi
fi

# Report errors if any
if [ -n "$ERRORS" ]; then
  echo -e "\n🔍 POST-EDIT CHECK for $REL_PATH$ERRORS" >&2
  exit 2
fi

exit 0
