#!/usr/bin/env bash
# Turns the shoplite folder into a GitHub repo with a main branch.
# Usage: ./setup_demo_repo.sh [repo_name] [public|private]
set -euo pipefail

NAME="${1:-shoplite_demo}"
VISIBILITY="${2:-public}"
cd "$(dirname "$0")/../shoplite"

if [ ! -d .git ]; then
  git init -b main
  git add -A
  git commit -m "Initial ShopLite demo project"
fi

gh repo create "$NAME" "--$VISIBILITY" --source . --remote origin --push
echo "Repo ready. Next: cd ../pr_toolkit && python3 create_prs.py --repo ../shoplite"
