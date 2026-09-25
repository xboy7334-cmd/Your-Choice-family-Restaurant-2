import supabase from './db-client.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try { const { data, error } = await supabase.from('products').select('*').eq('available', true).order('sort_order', { ascending: true }); if (error) throw error; return res.status(200).json(data || []); }
  catch (error) { console.error('Catalog API error:', error); return res.status(500).json({ error: 'Unable to load the menu right now.' }); }
}
