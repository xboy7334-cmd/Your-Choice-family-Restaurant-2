import supabase from '../db-client.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try { const id = req.query.id; const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single(); if (error || !product) return res.status(404).json({ error: 'Dish not found' }); const { data: related, error: relatedError } = await supabase.from('products').select('*').eq('category', product.category).eq('available', true).neq('id', id).order('sort_order', { ascending: true }).limit(4); if (relatedError) throw relatedError; return res.status(200).json({ product, related: related || [] }); }
  catch (error) { console.error('Product API error:', error); return res.status(500).json({ error: 'Unable to load this dish.' }); }
}
