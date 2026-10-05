# ShopLite

ShopLite is a tiny shop backend used to demonstrate automated quality engineering. It lets customers register, browse products, fill a cart and recieve an order.

It has zero runtime dependencies, so it starts with plain Node 18 or newer.

## Run it

    npm start

Open http://localhost:3000 for the demo page.

## Demo accounts

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@shoplite.test    | Admin123!    |
| Customer | customer@shoplite.test | Customer123! |

## Modules

| Module   | Path                      | What it does                         |
|----------|---------------------------|--------------------------------------|
| core     | src/core                  | router, http helpers, tokens, hashing |
| auth     | src/modules/auth          | register, login, token check          |
| products | src/modules/products      | list, get, create products            |
| cart     | src/modules/cart          | add and remove cart items             |
| pricing  | src/modules/pricing       | totals for a list of items            |
| orders   | src/modules/orders        | checkout and order history            |

## API

| Method | Path                         | Auth     |
|--------|------------------------------|----------|
| GET    | /health                      | none     |
| POST   | /api/auth/register           | none     |
| POST   | /api/auth/login              | none     |
| GET    | /api/auth/me                 | customer |
| GET    | /api/products                | none     |
| GET    | /api/products/:id            | none     |
| POST   | /api/products                | admin    |
| GET    | /api/cart                    | customer |
| POST   | /api/cart/items              | customer |
| DELETE | /api/cart/items/:productId   | customer |
| POST   | /api/orders                  | customer |
| GET    | /api/orders                  | customer |
| GET    | /api/orders/:id              | customer |

All prices are integer cents.

## Tests

    npm test            # unit and API tests, no install needed
    npm run test:api    # Newman collection, server must be running
    npm run test:e2e    # Playwright, needs npm install first
