#!/usr/bin/env bash
# Closes every open PR in the ShopLite repo and deletes their branches.
# Use it to reset the demo before creating the PRs again.
set -euo pipefail

cd "$(dirname "$0")/../shoplite"
for number in $(gh pr list --state open --json number --jq '.[].number'); do
  gh pr close "$number" --delete-branch
done
git checkout main
echo "All open PRs closed."
