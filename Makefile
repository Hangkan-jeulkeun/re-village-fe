.PHONY: commit push pr release branch clean-branches

# Create branch: make branch feat 12 [description words...]
_BRANCH_ARGS       := $(filter-out branch,$(MAKECMDGOALS))
_BRANCH_TYPE       := $(word 1,$(_BRANCH_ARGS))
_BRANCH_NUM        := $(word 2,$(_BRANCH_ARGS))
_BRANCH_DESC_WORDS := $(wordlist 3,$(words $(_BRANCH_ARGS)),$(_BRANCH_ARGS))
_EMPTY             :=
_SPACE             := $(_EMPTY) $(_EMPTY)
_BRANCH_DESC       := $(subst $(_SPACE),-,$(_BRANCH_DESC_WORDS))

branch:
	@if [ -n "$(_BRANCH_DESC)" ]; then \
		git checkout -b $(_BRANCH_TYPE)/#$(_BRANCH_NUM)-$(_BRANCH_DESC); \
	else \
		git checkout -b $(_BRANCH_TYPE)/#$(_BRANCH_NUM); \
	fi

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

# Delete all local branches except main
clean-branches:
	@git branch | grep -v '^\* main$$' | grep -v '^  main$$' | xargs -r git branch -D
	@echo "✅ All branches except main deleted."
