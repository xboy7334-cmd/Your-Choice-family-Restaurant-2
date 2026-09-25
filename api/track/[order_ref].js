import supabase from '../db-client.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); if (req.method === 'OPTIONS') return res.status(204).end(); if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try { const reference = req.query.order_ref; if (!reference) return res.status(400).json({ error: 'Order reference is required.' }); const { data, error } = await supabase.from('orders').select('order_ref,customer_name,customer_email,customer_phone,fulfillment,delivery_charge,subtotal,total,status,payment_status,shipping_info,created_at').eq('order_ref', reference).single(); if (error || !data) return res.status(404).json({ error: 'We could not find an order with that reference.' }); return res.status(200).json(data); }
  catch (error) { console.error('Track API error:', error); return res.status(500).json({ error: 'Unable to load order tracking right now.' }); }
}
