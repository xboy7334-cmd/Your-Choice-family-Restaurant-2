import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, Store, ShieldCheck } from 'lucide-react';
import CartSummary from '../components/CartSummary';
import { api } from '../lib/api';
import { useCart } from '../store/cart';
import { useI18n } from '../lib/i18n';
import type { Fulfillment } from '../types';

const DELIVERY_FEE = 40;
export default function Checkout() {
  const lines = useCart((state) => state.lines);
  const subtotal = useCart((state) => state.subtotal());
  const navigate = useNavigate();
  const { t } = useI18n();
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const deliveryCharge = fulfillment === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryCharge;
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const result = await api.createOrder({ customer_name: form.name.trim(), customer_email: form.email.trim(), customer_phone: form.phone.trim(), notes: form.notes.trim(), fulfillment, delivery_charge: deliveryCharge, subtotal, total, items: lines.map(({ product, quantity }) => ({ product_id: product.id, name: product.name, price: product.price, quantity })) });
      sessionStorage.setItem('yc_order_ref', result.order_ref);
      if (result.demo_otp) sessionStorage.setItem('yc_demo_otp', result.demo_otp);
      navigate(`/verify/${encodeURIComponent(result.order_ref)}`);
    } catch (err) { setError(err instanceof Error ? err.message : t.failed); } finally { setBusy(false); }
  }
  if (!lines.length) return <div className="checkout-page"><CartSummary /></div>;
  return <div className="checkout-page"><div className="page-title"><span className="eyebrow">ALMOST THERE</span><h1>Checkout</h1><p>Good food is just around the corner.</p></div><div className="checkout-layout"><form className="checkout-form glass-card" onSubmit={submit}><div className="form-section"><div className="form-section-head"><span className="step-number">01</span><div><h2>How would you like it?</h2><p>Choose the way that works for you.</p></div></div><div className="fulfillment-options"><button type="button" className={`fulfillment-card ${fulfillment === 'delivery' ? 'selected' : ''}`} onClick={() => setFulfillment('delivery')}><Bike size={20} /><b>{t.delivery}</b><small>₹40 flat fee</small><span className="choice-indicator" /></button><button type="button" className={`fulfillment-card ${fulfillment === 'pickup' ? 'selected' : ''}`} onClick={() => setFulfillment('pickup')}><Store size={20} /><b>{t.pickup}</b><small>Free · Haldia</small><span className="choice-indicator" /></button></div></div><div className="form-section"><div className="form-section-head"><span className="step-number">02</span><div><h2>Your details</h2><p>So we know where to send the deliciousness.</p></div></div><div className="form-grid"><label className="field full-field"><span>{t.name}</span><input required minLength={2} maxLength={90} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ananya Das" /></label><label className="field"><span>{t.email}</span><input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="field"><span>{t.phone}</span><input type="tel" required pattern="[+]?[0-9\s-]{10,15}" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></label><label className="field full-field"><span>{t.notes}</span><textarea rows={3} maxLength={400} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anything we should know?" /></label></div></div>{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button full" disabled={busy}>{busy ? 'Placing your order…' : t.placeOrder}<span>₹{total}</span></button><div className="secure-note"><ShieldCheck size={15} /> Your details are only used to fulfill this order.</div></form><aside className="order-summary glass-card"><div className="summary-heading"><span className="eyebrow">YOUR ORDER</span><h2>Order summary</h2></div><CartSummary embedded /><div className="summary-breakdown"><div><span>{t.subtotal}</span><b>₹{subtotal}</b></div><div><span>{t.deliveryFee}</span><b>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</b></div><div className="summary-total"><span>{t.total}</span><b>₹{total}</b></div></div><div className="summary-footnote">{fulfillment === 'delivery' ? 'Delivered fresh to your door in 30–40 minutes.' : 'Pick up your order directly from our Haldia restaurant.'}</div></aside></div></div>;
}
