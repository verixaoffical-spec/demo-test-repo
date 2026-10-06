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

## 2. Put it on GitHub

    gh auth login
    cd pr_toolkit
    ./setup_demo_repo.sh shoplite_demo

## 3. Create the pull requests

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
