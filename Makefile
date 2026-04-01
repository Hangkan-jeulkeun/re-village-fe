.PHONY: commit push pr release

# Stage all & auto-commit with Claude-generated message
commit:
	@bash scripts/commit.sh

# Push current branch
push:
	@git push origin HEAD

# Stage all → commit → push (full flow)
release:
	@git add -A
	@bash scripts/commit.sh
	@git push origin HEAD
	@echo ""
	@echo "✅ Pushed. PR will be auto-created by GitHub Actions."
