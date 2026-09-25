import supabase from './db-client.js';
const cors = (res) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); };
export default async function handler(req, res) {
  cors(res); if (req.method === 'OPTIONS') return res.status(204).end(); if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { customer_name, customer_email, customer_phone, notes = '', fulfillment, delivery_charge, subtotal, total, items } = req.body || {};
    if (!customer_name || !customer_email || !customer_phone || !['delivery', 'pickup'].includes(fulfillment) || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Please provide your contact details and at least one menu item.' });
    if (!/^\+?[0-9\s-]{10,15}$/.test(customer_phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
    const ids = items.map((item) => String(item.product_id));
    if (items.length > 40 || items.some((item) => !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 50)) return res.status(400).json({ error: 'One or more item quantities are invalid.' });
    const { data: products, error: productsError } = await supabase.from('products').select('id,name,price,available').in('id', ids);
    if (productsError) throw productsError;
    if (!products || products.length !== new Set(ids).size || products.some((product) => !product.available)) return res.status(400).json({ error: 'A menu item is no longer available. Please refresh your cart.' });
    const normalized = items.map((item) => { const product = products.find((entry) => entry.id === String(item.product_id)); return { product_id: product.id, name: product.name, price: Number(product.price), quantity: Number(item.quantity) }; });
    const computedSubtotal = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const computedDelivery = fulfillment === 'delivery' ? 40 : 0;
    const reference = `YC${Date.now().toString(36).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const { data, error } = await supabase.from('orders').insert({ order_ref: reference, customer_name: customer_name.trim(), customer_email: customer_email.trim(), customer_phone: customer_phone.trim(), notes: String(notes).slice(0, 400), fulfillment, delivery_charge: computedDelivery, subtotal: computedSubtotal, total: computedSubtotal + computedDelivery, status: 'Pending', payment_status: 'due', otp_code: otp, otp_verified: false, items: normalized, shipping_info: fulfillment === 'delivery' ? 'A delivery partner will be assigned once payment is confirmed.' : 'Your order will be ready for pickup at Your Choice family Restaurant, Haldia.' }).select('order_ref').single();
    if (error) throw error;
    return res.status(201).json({ order_ref: data.order_ref, otp_sent: true, ...(process.env.NODE_ENV !== 'production' ? { demo_otp: otp } : {}) });
  } catch (error) { console.error('Order API error:', error); return res.status(500).json({ error: 'We could not place your order. Please try again.' }); }
}
