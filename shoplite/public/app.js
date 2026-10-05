let token = null;

const $ = (id) => document.getElementById(id);
const money = (cents) => (cents / 100).toFixed(2);

function setMessage(text) {
  $('message').textContent = text;
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadProducts() {
  const products = await api('/api/products');
  const list = $('product_list');
  list.innerHTML = '';
  products.forEach((p) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'product_' + p.id);
    li.textContent = p.name + ' (' + money(p.price) + ') ';
    const button = document.createElement('button');
    button.textContent = 'Add to cart';
    button.setAttribute('data-testid', 'add_to_cart_' + p.id);
    button.addEventListener('click', () => addToCart(p.id));
    li.appendChild(button);
    list.appendChild(li);
  });
}

async function loadCart() {
  if (!token) return;
  const cart = await api('/api/cart');
  const list = $('cart_list');
  list.innerHTML = '';
  cart.items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name + ' x ' + item.quantity;
    list.appendChild(li);
  });
  $('cart_total').textContent = money(cart.subtotal);
}

async function login() {
  try {
    const result = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: $('email').value, password: $('password').value }),
    });
    token = result.token;
    $('user_label').textContent = result.user.email;
    setMessage('Logged in');
    await loadCart();
  } catch (err) {
    setMessage(err.message);
  }
}

async function addToCart(productId) {
  if (!token) return setMessage('Please login first');
  try {
    await api('/api/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity: 1 }) });
    await loadCart();
    setMessage('Added to cart');
  } catch (err) {
    setMessage(err.message);
  }
}

async function checkout() {
  if (!token) return setMessage('Please login first');
  try {
    const order = await api('/api/orders', { method: 'POST', body: JSON.stringify({}) });
    setMessage('Order placed: #' + order.id);
    await loadCart();
  } catch (err) {
    setMessage(err.message);
  }
}

$('login_button').addEventListener('click', login);
$('checkout_button').addEventListener('click', checkout);
loadProducts();
