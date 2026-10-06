# Verixa demo kit

shoplite     the demo project (Node, no dependencies, modules for auth, products, cart, pricing, orders, plus a small web page)
pr_toolkit   scripts and 16 pull request definitions to run against it

## 1. Run the demo project

    cd shoplite
    npm start                 # opens on http://localhost:3000
    npm test                  # unit and API tests, no install needed

Optional, needs npm install first:

    npm install
    npm run test:api          # Newman collection, server must be running
    npm run test:e2e          # Playwright

Demo logins: customer@shoplite.test / Customer123! and admin@shoplite.test / Admin123!

## 2. Put it on GitHub (only the shoplite folder is pushed)

Important: the git repo lives inside the shoplite folder, not in verixa_demo. Only shoplite is pushed to GitHub. The pr_toolkit folder stays on your computer and is never pushed. Do not run git init in verixa_demo, or the script will not find the repo.

One time setup:

1. Create an empty repo on GitHub, for example demo_test_repo (no README, no .gitignore).
2. Install the GitHub CLI and log in:

       gh auth login

3. Turn shoplite into the repo and push it. On Windows use Command Prompt or PowerShell:

       cd shoplite
       git init -b main
       git add -A
       git commit -m "Initial ShopLite demo project"
       git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
       git push -u origin main

   Use the https address instead if you have no SSH key set up.

4. Check it worked. This should print origin and your repo address:

       git remote -v

Shortcut for Mac, Linux or Git Bash, which creates the GitHub repo and pushes in one go:

    cd pr_toolkit
    ./setup_demo_repo.sh shoplite_demo

If you ran git init in the wrong folder, delete that stray .git folder first:

    cd verixa_demo
    rmdir /s /q .git

## 3. Create the pull requests

Run these from the pr_toolkit folder. On Windows use py instead of python3.

    cd pr_toolkit
    python3 create_prs.py --repo ../shoplite                  # all 16
    python3 create_prs.py --repo ../shoplite --only 01        # just PR 01
    python3 create_prs.py --repo ../shoplite --only 01 03 08  # a few
    python3 create_prs.py --repo ../shoplite --draft          # open as drafts
    python3 create_prs.py --repo ../shoplite --dry_run        # preview only

## 4. Create one PR by hand (PR 01 example)

    cd shoplite
    git checkout main
    git checkout -b feature/coupon_discount
    # copy everything from pr_toolkit/prs/01_coupon_discount/files into the repo
    git add -A
    git commit -m "Add coupon codes to checkout"
    git push -u origin feature/coupon_discount
    gh pr create --base main --head feature/coupon_discount --title "Add coupon codes to checkout"

## 5. Reset the demo

    cd pr_toolkit
    ./cleanup_prs.sh          # closes all open PRs and deletes their branches

## Where to look

    pr_toolkit/README.md      more detail on the toolkit
    pr_toolkit/PR_CATALOG.md  expected risk and hidden bugs for each PR
