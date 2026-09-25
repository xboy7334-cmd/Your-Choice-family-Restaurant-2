import supabase from './db-client.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); if (req.method === 'OPTIONS') return res.status(204).end(); if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try { const { order_ref } = req.body || {}; if (!order_ref) return res.status(400).json({ error: 'Order reference is required.' }); const otp = String(Math.floor(100000 + Math.random() * 900000)); const { data, error } = await supabase.from('orders').update({ otp_code: otp, otp_sent_at: new Date().toISOString() }).eq('order_ref', order_ref).eq('otp_verified', false).select('order_ref').single(); if (error || !data) return res.status(404).json({ error: 'This order cannot receive another code.' }); return res.status(200).json({ ok: true, ...(process.env.NODE_ENV !== 'production' ? { demo_otp: otp } : {}) }); }
  catch (error) { console.error('Resend OTP error:', error); return res.status(500).json({ error: 'Unable to resend the code right now.' }); }
}
