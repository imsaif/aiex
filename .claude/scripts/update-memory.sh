#!/bin/bash

# update-memory.sh
# Automatically updates CLAUDE.md with session information

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Updating project memory...${NC}"

# Get git root directory
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [ -z "$GIT_ROOT" ]; then
    echo -e "${YELLOW}⚠️  Not in a git repository. Skipping memory update.${NC}"
    exit 0
fi

# Check if CLAUDE.md exists
CLAUDE_FILE="$GIT_ROOT/CLAUDE.md"
if [ ! -f "$CLAUDE_FILE" ]; then
    echo -e "${YELLOW}⚠️  CLAUDE.md not found in repository. Skipping memory update.${NC}"
    exit 0
fi

# Get session information
SESSION_DATE=$(date +"%Y-%m-%d %H:%M")
MACHINE_NAME=$(hostname -s)
if [[ "$OSTYPE" == "darwin"* ]]; then
    MACHINE_TYPE="MacBook"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    MACHINE_TYPE="Windows PC"
else
    MACHINE_TYPE="Linux"
fi

# Analyze git changes
FILES_CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
if [ "$FILES_CHANGED" -eq 0 ]; then
    FILES_CHANGED=$(git diff --name-only | wc -l | tr -d ' ')
fi

# Try to detect pattern from changed files
PATTERN_DETECTED="General updates"
if git diff --cached --name-only | grep -q "patterns/"; then
    # Extract pattern name from path like src/data/patterns/patterns/pattern-name/
    PATTERN_PATH=$(git diff --cached --name-only | grep "patterns/" | head -1)
    if [[ $PATTERN_PATH =~ patterns/([a-z-]+)/ ]]; then
        PATTERN_SLUG="${BASH_REMATCH[1]}"
        # Convert kebab-case to Title Case
        PATTERN_DETECTED=$(echo "$PATTERN_SLUG" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
    fi
fi

# Count test files changed
TESTS_CHANGED=$(git diff --cached --name-only | grep -c "test\|spec" || echo "0")

# Create session summary
SESSION_SUMMARY="### Session $SESSION_DATE ($MACHINE_TYPE)
- **Pattern:** $PATTERN_DETECTED
- **Status:** Work in progress
- **Files Changed:** $FILES_CHANGED
- **Tests Added/Modified:** $TESTS_CHANGED"

# Create a backup
cp "$CLAUDE_FILE" "$CLAUDE_FILE.backup"

# Create temporary file for the new content
TEMP_FILE=$(mktemp)

# Read the file and update Recent Sessions section
IN_RECENT_SESSIONS=false
SESSION_COUNT=0
ADDED_NEW_SESSION=false

while IFS= read -r line; do
    echo "$line" >> "$TEMP_FILE"

    # Detect Recent Sessions section
    if [[ "$line" == "## Recent Sessions" ]]; then
        IN_RECENT_SESSIONS=true
        # Skip the next line (description)
        read -r next_line
        echo "$next_line" >> "$TEMP_FILE"
        # Add blank line
        read -r blank_line
        echo "$blank_line" >> "$TEMP_FILE"
        # Add new session at the top
        echo "$SESSION_SUMMARY" >> "$TEMP_FILE"
        echo "" >> "$TEMP_FILE"
        ADDED_NEW_SESSION=true
        SESSION_COUNT=1
        continue
    fi

    # Count sessions and limit to 10
    if [ "$IN_RECENT_SESSIONS" = true ]; then
        if [[ "$line" == "### Session "* ]]; then
            SESSION_COUNT=$((SESSION_COUNT + 1))
            if [ $SESSION_COUNT -gt 10 ]; then
                # Skip this session and all lines until next ## section
                while IFS= read -r line; do
                    if [[ "$line" == "## "* ]]; then
                        echo "$line" >> "$TEMP_FILE"
                        break
                    fi
                done
                IN_RECENT_SESSIONS=false
                continue
            fi
        fi
        if [[ "$line" == "## "* ]] && [[ "$line" != "## Recent Sessions" ]]; then
            IN_RECENT_SESSIONS=false
        fi
    fi
done < "$CLAUDE_FILE"

# Replace original file with updated content
mv "$TEMP_FILE" "$CLAUDE_FILE"

echo -e "${GREEN}✅ Memory updated successfully!${NC}"
echo -e "   Session: $SESSION_DATE"
echo -e "   Pattern: $PATTERN_DETECTED"
echo -e "   Files: $FILES_CHANGED | Tests: $TESTS_CHANGED"
echo ""

# Clean up backup after successful update
rm -f "$CLAUDE_FILE.backup"
