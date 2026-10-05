#!/usr/bin/env python3
"""Create the demo pull requests for ShopLite.

Each folder in prs/ holds a pr.json (title, body, branch, labels) and a files/
directory with the full new content of every changed file. For each PR this
script cuts a branch from the base branch, copies the files in, commits,
pushes, and opens a pull request with the GitHub CLI.

Examples:
    python3 create_prs.py --repo ../shoplite
    python3 create_prs.py --repo ../shoplite --only 01 03 08
    python3 create_prs.py --repo ../shoplite --draft
    python3 create_prs.py --repo ../shoplite --dry_run
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


def run(cmd, cwd, check=True):
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError("Command failed: " + " ".join(cmd) + "\n" + result.stderr.strip())
    return result


def load_prs(prs_dir, only):
    prs = []
    for folder in sorted(Path(prs_dir).iterdir()):
        meta_file = folder / "pr.json"
        if not meta_file.exists():
            continue
        meta = json.loads(meta_file.read_text())
        if only and meta["id"] not in only:
            continue
        prs.append((folder, meta))
    return prs


def create_pr(folder, meta, args, repo):
    branch = meta["branch"]
    print("\n== PR %s: %s" % (meta["id"], meta["title"]))
    if args.dry_run:
        print("   would create branch %s from %s and open a PR" % (branch, args.base))
        for path in (folder / "files").rglob("*"):
            if path.is_file():
                print("   would write", path.relative_to(folder / "files"))
        return None

    run(["git", "checkout", args.base], repo)
    run(["git", "checkout", "-B", branch], repo)

    files_dir = folder / "files"
    for path in files_dir.rglob("*"):
        if path.is_file():
            target = repo / path.relative_to(files_dir)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, target)
    for rel in meta.get("delete", []):
        target = repo / rel
        if target.exists():
            target.unlink()

    run(["git", "add", "-A"], repo)
    commit = run(["git", "commit", "-m", meta["commit_message"]], repo, check=False)
    if commit.returncode != 0:
        print("   nothing to commit, skipping")
        return None
    run(["git", "push", "-u", "origin", branch, "--force"], repo)

    existing = run(["gh", "pr", "list", "--head", branch, "--state", "open", "--json", "url"], repo)
    found = json.loads(existing.stdout or "[]")
    if found:
        print("   PR already open, branch updated:", found[0]["url"])
        return found[0]["url"]

    cmd = ["gh", "pr", "create", "--base", args.base, "--head", branch,
           "--title", meta["title"], "--body", meta["body"]]
    if args.draft:
        cmd.append("--draft")
    if not args.skip_labels:
        for label in meta.get("labels", []):
            run(["gh", "label", "create", label, "--force"], repo, check=False)
            cmd += ["--label", label]
    created = run(cmd, repo, check=False)
    if created.returncode != 0 and not args.skip_labels:
        base_cmd = [c for i, c in enumerate(cmd) if c != "--label" and (i == 0 or cmd[i - 1] != "--label")]
        created = run(base_cmd, repo)
    elif created.returncode != 0:
        raise RuntimeError(created.stderr.strip())
    url = created.stdout.strip().splitlines()[-1]
    print("   opened:", url)
    return url


def main():
    parser = argparse.ArgumentParser(description="Create demo pull requests for ShopLite")
    parser.add_argument("--repo", default="../shoplite", help="path to the ShopLite git repository")
    parser.add_argument("--prs_dir", default=str(Path(__file__).parent / "prs"))
    parser.add_argument("--base", default="main")
    parser.add_argument("--only", nargs="*", default=[], help="PR ids such as 01 03 08")
    parser.add_argument("--draft", action="store_true")
    parser.add_argument("--skip_labels", action="store_true")
    parser.add_argument("--dry_run", action="store_true")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    if not (repo / ".git").exists():
        sys.exit("Not a git repository: %s (run setup_demo_repo.sh first)" % repo)
    if not args.dry_run:
        if run(["git", "status", "--porcelain"], repo).stdout.strip():
            sys.exit("Working tree is not clean. Commit or stash your changes first.")
        if run(["gh", "auth", "status"], repo, check=False).returncode != 0:
            sys.exit("GitHub CLI is not logged in. Run: gh auth login")

    prs = load_prs(args.prs_dir, args.only)
    if not prs:
        sys.exit("No PR definitions found.")

    urls = []
    try:
        for folder, meta in prs:
            url = create_pr(folder, meta, args, repo)
            if url:
                urls.append((meta["id"], url))
    finally:
        if not args.dry_run:
            run(["git", "checkout", args.base], repo, check=False)

    print("\nDone. %d pull request(s) ready." % len(urls))
    for pr_id, url in urls:
        print("  %s  %s" % (pr_id, url))


if __name__ == "__main__":
    main()
