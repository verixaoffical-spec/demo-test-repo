# PR toolkit for the Verixa demo

This folder creates 16 realistic pull requests against the ShopLite demo project, so you have something to point Verixa at.

## Steps

1. Install the GitHub CLI and run `gh auth login`.
2. Create the repo from the demo project:

       ./setup_demo_repo.sh shoplite_demo

3. Create the pull requests:

       python3 create_prs.py --repo ../shoplite

   Useful options: `--only 01 03 08` for a few, `--draft`, `--dry_run`, `--base main`, `--skip_labels`.
4. Connect Verixa to the repo and let the Analysis Agent risk score the batch.
5. Compare its output with PR_CATALOG.md, which lists the expected risk and the bugs hidden in each PR.
6. To reset and start over: `./cleanup_prs.sh`

## Layout

    prs/NN_name/pr.json     title, body, branch, labels, expected risk and bugs
    prs/NN_name/files/      full new content of each changed file
    create_prs.py           branch, commit, push, open PR
    setup_demo_repo.sh      makes the GitHub repo
    cleanup_prs.sh          closes all open PRs
    PR_CATALOG.md           the answer key

## Adding your own PR

Make a new folder in prs with a pr.json (copy an existing one) and put the changed files under files, keeping their repo paths.

## Good to know

All PRs branch from main, so PRs touching the same file will conflict if you merge them together. Leave them open for Verixa, or merge one at a time.
