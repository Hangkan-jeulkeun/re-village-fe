.PHONY: commit push pr release branch

# Create branch: make branch feat 12
_BRANCH_ARGS := $(filter-out branch,$(MAKECMDGOALS))
_BRANCH_TYPE := $(word 1,$(_BRANCH_ARGS))
_BRANCH_NUM  := $(word 2,$(_BRANCH_ARGS))

branch:
	@git checkout -b $(_BRANCH_TYPE)/#$(_BRANCH_NUM)

%:
	@:

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
