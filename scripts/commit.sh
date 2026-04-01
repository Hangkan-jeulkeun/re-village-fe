#!/bin/bash
set -e

# Check for staged changes
if git diff --staged --quiet; then
    echo "⚠️  No staged changes. Stage files first:"
    echo "   git add <files>  or  git add -A"
    exit 1
fi

echo "🔍 Analyzing changes..."

DIFF=$(git diff --staged)
STAT=$(git diff --staged --stat)

echo "$STAT"
echo ""

# Generate commit message using Claude CLI
MSG=$(echo "$DIFF" | claude -p "
Analyze this git diff and generate a concise conventional commit message.
Format: <type>(<optional scope>): <short description>
Types: feat, fix, docs, style, refactor, test, chore
Rules:
- description must be in Korean or English (match the project language)
- max 72 characters total
- no period at end
- output ONLY the commit message, nothing else
")

echo "✅ Generated message:"
echo "   $MSG"
echo ""

read -rp "Use this? [Y/n/e(dit)]: " choice
case "$choice" in
    [nN])
        echo "Aborted."
        exit 0
        ;;
    [eE])
        read -rp "Enter message: " MSG
        ;;
    *)
        ;;
esac

git commit -m "$MSG"
echo ""
echo "✅ Committed: $MSG"
