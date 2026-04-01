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
이 git diff를 분석하여 간결한 conventional commit 메세지를 한국어로 생성해줘.
형식: <type>(<선택적 scope>): <한국어 설명>
타입: feat, fix, docs, style, refactor, test, chore
규칙:
- 설명은 반드시 한국어로 작성
- 전체 72자 이내
- 마침표 없이 끝낼 것
- 커밋 메세지만 출력하고 다른 내용은 절대 포함하지 말 것
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
