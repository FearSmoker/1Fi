const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function fetchProducts(category) {
  const url = category
    ? `${API_BASE}/products?category=${encodeURIComponent(category)}`
    : `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(`${API_BASE}/products/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Order creation failed' }));
    throw new Error(err.error || 'Order creation failed');
  }
  return res.json();
}

export async function fetchOrderByNumber(orderNumber) {
  const res = await fetch(`${API_BASE}/orders/${orderNumber}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function fetchAllOrders(email) {
  const url = email
    ? `${API_BASE}/orders?email=${encodeURIComponent(email)}`
    : `${API_BASE}/orders`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}
