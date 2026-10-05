# PR Catalog

Use this as the answer key when you check what Verixa produced for each PR.

| ID | Title | Expected risk | Existing npm test after PR |
|----|-------|---------------|----------------------------|
| 01 | Add coupon codes to checkout | high | pass |
| 02 | Fix typo in README | low | pass |
| 03 | Add remember me option to login | high | pass |
| 04 | Paginate the products list | medium | FAIL |
| 05 | Reduce stock when an order is placed | high | pass |
| 06 | Add endpoint to change cart quantity | medium | pass |
| 07 | Refresh button colors and spacing | low | pass |
| 08 | Let customers cancel an order | high | pass |
| 09 | Rate limit failed logins | medium | pass |
| 10 | Refactor product service helpers | low | pass |
| 11 | Add product search by name | medium | pass |
| 12 | Add admin endpoint to delete a product | high | pass |
| 13 | Bump version and test tool dependencies | low | pass |
| 14 | Add flat shipping fee with free shipping threshold | high | FAIL |
| 15 | Validate and normalize email on registration | medium | pass |
| 16 | Show cart item count in the header | medium | pass |

Note: these PRs are all cut from the same base branch, so those touching the same file will conflict if you merge them together. Leave them open, or merge one at a time and recreate the rest.

## 01: Add coupon codes to checkout

Branch: `feature/coupon_discount`. Expected risk: **high**.

What Verixa should cover or catch:

* Valid percent coupon reduces the total by 10 percent
* Lowercase coupon code is accepted
* Unknown coupon returns 400
* Fixed coupon on a cart cheaper than 5.00 must not make the total negative (BUG: it does)
* Checkout without a coupon still works

## 02: Fix typo in README

Branch: `docs/readme_typo_fix`. Expected risk: **low**.

What Verixa should cover or catch:

* Documentation only change, no test cases needed
* Verixa should label it low risk and skip Run Now

## 03: Add remember me option to login

Branch: `feature/remember_me_login`. Expected risk: **high**.

What Verixa should cover or catch:

* Login without rememberMe gives a 1 hour token
* Login with rememberMe gives a 30 day token
* Expired normal token is rejected
* Token with remember flag must still expire (BUG: it never expires)
* Tampered token is rejected

## 04: Paginate the products list

Branch: `feature/products_pagination`. Expected risk: **medium**.

What Verixa should cover or catch:

* page and limit return the right slice
* total reflects the filtered count
* page 0 or negative page is handled
* Response shape changed from array to object, so the demo page and Newman collection break (BUG: not updated)
* Category filter still works with pagination

## 05: Reduce stock when an order is placed

Branch: `feature/stock_decrement_on_checkout`. Expected risk: **high**.

What Verixa should cover or catch:

* Stock drops by the ordered quantity
* Two customers with carts that together exceed stock must not oversell (BUG: stock goes negative)
* Failed checkout leaves stock unchanged
* Cart add still blocks quantity above stock

## 06: Add endpoint to change cart quantity

Branch: `feature/cart_quantity_update`. Expected risk: **medium**.

What Verixa should cover or catch:

* Valid quantity updates the line total
* Unknown product in cart returns 404
* Quantity 0, negative, decimal or text must be rejected (BUG: no validation)
* Quantity above stock must be rejected (BUG: not checked)
* Unauthenticated call returns 401

## 07: Refresh button colors and spacing

Branch: `style/button_style_refresh`. Expected risk: **low**.

What Verixa should cover or catch:

* Visual only change
* Existing Playwright flow should still pass
* Verixa should label it low risk

## 08: Let customers cancel an order

Branch: `feature/order_cancellation`. Expected risk: **high**.

What Verixa should cover or catch:

* Owner can cancel a PLACED order and refundTotal equals the order total
* A customer must not cancel another customer's order (BUG: no ownership check)
* Cancelling twice must not refund twice (BUG: refund doubles)
* Unknown order returns 404
* Unauthenticated call returns 401

## 09: Rate limit failed logins

Branch: `feature/login_rate_limit`. Expected risk: **medium**.

What Verixa should cover or catch:

* Fifth failure locks the account and returns 429
* Correct password during lock is still refused
* Counter should reset after a successful login (BUG: it never resets)
* Lock is per email, so an attacker can lock out a real user
* Unknown email is counted the same way

## 10: Refactor product service helpers

Branch: `refactor/product_helpers`. Expected risk: **low**.

What Verixa should cover or catch:

* No behavior change, regression run only
* Verixa should label it low risk and suggest a small regression set
* A good Analysis Agent output says tests exist and nothing new is needed

## 11: Add product search by name

Branch: `feature/product_search`. Expected risk: **medium**.

What Verixa should cover or catch:

* q=Mouse returns the mouse
* Search should be case insensitive (BUG: it is case sensitive)
* q with regex characters such as ( must not crash the server (BUG: returns 500)
* q combined with category works
* Empty q returns all products

## 12: Add admin endpoint to delete a product

Branch: `feature/admin_delete_product`. Expected risk: **high**.

What Verixa should cover or catch:

* Admin can delete a product
* Customer must get 403 (BUG: any logged in user can delete)
* Unknown id returns 404
* Cart that already holds the deleted product must still load (BUG: cart returns 404)
* Unauthenticated call returns 401

## 13: Bump version and test tool dependencies

Branch: `chore/dependency_bump`. Expected risk: **low**.

What Verixa should cover or catch:

* Only dev dependencies change, no runtime code touched
* Smoke run of Playwright and Newman is enough
* Verixa should label it low risk

## 14: Add flat shipping fee with free shipping threshold

Branch: `feature/shipping_fee`. Expected risk: **high**.

What Verixa should cover or catch:

* Cart under the threshold pays 4.99 shipping
* Cart of exactly 50.00 should ship free (BUG: it is charged)
* Cart over the threshold ships free
* Existing checkout test expects no shipping and now fails (BUG: test not updated)
* Total equals subtotal plus shipping

## 15: Validate and normalize email on registration

Branch: `fix/email_validation`. Expected risk: **medium**.

What Verixa should cover or catch:

* Invalid formats such as a@b or spaces are rejected
* Registering the same email in different case returns 409
* Login with the original mixed case email must work (BUG: login does not normalize)
* Whitespace around email is trimmed
* Valid email still registers

## 16: Show cart item count in the header

Branch: `feature/cart_badge_ui`. Expected risk: **medium**.

What Verixa should cover or catch:

* Count increases after each Add to cart click
* Count should go back to 0 after checkout (BUG: it stays)
* Count should show existing cart items after login (BUG: starts at 0)
* Guest click does not change the count
