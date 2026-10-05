const { hashPassword } = require('../core/crypto');

const db = {
  users: [
    { id: 1, email: 'admin@shoplite.test', name: 'Admin', role: 'admin', passwordHash: hashPassword('Admin123!') },
    { id: 2, email: 'customer@shoplite.test', name: 'Demo Customer', role: 'customer', passwordHash: hashPassword('Customer123!') },
  ],
  products: [
    { id: 1, name: 'Wireless Mouse', price: 2499, stock: 25, category: 'electronics' },
    { id: 2, name: 'Mechanical Keyboard', price: 7999, stock: 10, category: 'electronics' },
    { id: 3, name: 'USB C Cable', price: 799, stock: 100, category: 'electronics' },
    { id: 4, name: 'Notebook A5', price: 349, stock: 200, category: 'stationery' },
    { id: 5, name: 'Desk Lamp', price: 3499, stock: 15, category: 'home' },
    { id: 6, name: 'Coffee Mug', price: 1299, stock: 40, category: 'home' },
  ],
  carts: {},
  orders: [],
  nextUserId: 3,
  nextProductId: 7,
  nextOrderId: 1,
};

module.exports = db;
