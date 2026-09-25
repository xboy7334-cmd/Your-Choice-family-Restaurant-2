import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Clock3, PackageCheck, Bike, CreditCard, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import type { Order, OrderStatus } from '../types';
import Confetti from '../components/Confetti';

const steps: { status: OrderStatus; title: string; description: string; icon: typeof Check }[] = [
  { status: 'Verified', title: 'Verified', description: 'Your details are confirmed.', icon: Check },
  { status: 'Accepted', title: 'Accepted', description: 'The kitchen is preparing your order.', icon: Clock3 },
  { status: 'Paid', title: 'Paid', description: 'Payment received securely.', icon: CreditCard },
  { status: 'Shipped', title: 'Shipped', description: 'Your order is on its way.', icon: Bike },
  { status: 'Delivered', title: 'Delivered', description: 'Enjoy every bite!', icon: PackageCheck },
];
const rank: Record<OrderStatus, number> = { Pending: -1, Verified: 0, Accepted: 1, Paid: 2, Shipped: 3, Delivered: 4 };
export default function TrackOrder() {
  const { reference = '' } = useParams();
  const { t } = useI18n();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const fetchOrder = useCallback(() => { setLoading(true); api.track(reference).then(setOrder).catch((err: Error) => setError(err.message)).finally(() => setLoading(false)); }, [reference]);
  useEffect(() => { fetchOrder(); }, [fetchOrder]);
  async function pay() { setPaying(true); setError(''); try { const result = await api.pay(reference); setOrder(result); setConfetti(true); window.setTimeout(() => setConfetti(false), 4500); } catch (err) { setError(err instanceof Error ? err.message : t.failed); } finally { setPaying(false); } }
  if (loading) return <div className="loading-panel">Loading your order…</div>;
  if (error && !order) return <div className="inline-error">{error}<button onClick={fetchOrder}><RefreshCw size={15} /> Retry</button></div>;
  if (!order) return null;
  const current = rank[order.status] ?? -1;
  return <div className="tracking-page">{confetti && <Confetti />}<div className="tracking-head"><div><span className="eyebrow">{t.orderPlaced.toUpperCase()}</span><h1>{t.tracking}</h1><p>We’ll keep you posted as your meal makes its way to you.</p></div><button className="icon-button refresh-button" onClick={fetchOrder} aria-label="Refresh order status"><RefreshCw size={17} /></button></div><div className="tracking-layout"><section className="timeline-card glass-card"><div className="tracking-ref"><div><small>{t.trackingCode}</small><b>{order.order_ref}</b></div><span className="status-pill"><span className="live-dot" /> {order.status}</span></div><div className="timeline">{steps.map((step, index) => { const done = current >= index; const active = current === index; const Icon = step.icon; return <div key={step.status} className={`timeline-step ${done ? 'done' : ''} ${active ? 'current' : ''}`}><div className="timeline-marker"><Icon size={16} /></div><div className="timeline-copy"><b>{step.title}</b><span>{step.description}</span></div>{active && <span className="step-live">IN PROGRESS</span>}</div>; })}</div>{order.status === 'Accepted' && order.payment_status !== 'paid' && <div className="payment-callout"><div><b>Ready to make it official?</b><span>Complete payment to get your order on its way.</span></div><button className="primary-button" onClick={pay} disabled={paying}>{paying ? 'Processing…' : t.pay}<span>₹{order.total}</span></button></div>}{order.status === 'Shipped' && <div className="shipping-callout"><Bike size={19} /><div><b>Your order is on its way</b><span>{order.shipping_info || 'Our delivery partner is heading your way.'}</span></div></div>}{error && <div className="form-error" role="alert">{error}</div>}</section><aside className="tracking-summary glass-card"><span className="eyebrow">ORDER SUMMARY</span><h2>Made fresh for you</h2><div className="track-total"><span>Total paid</span><b>₹{order.total}</b></div><div className="summary-breakdown"><div><span>Items</span><b>₹{order.subtotal}</b></div><div><span>{order.fulfillment === 'pickup' ? 'Self-pickup' : 'Delivery'}</span><b>{order.delivery_charge ? `₹${order.delivery_charge}` : 'FREE'}</b></div><div><span>Payment</span><b className={order.payment_status === 'paid' ? 'success-text' : ''}>{order.payment_status === 'paid' ? 'PAID' : 'DUE'}</b></div></div><div className="customer-note"><small>{order.fulfillment === 'pickup' ? 'PICKUP' : 'DELIVERING TO'}</small><b>{order.customer_name}</b><span>{order.customer_phone}</span>{order.customer_email && <span>{order.customer_email}</span>}</div><Link className="text-link" to="/">← {t.browse}</Link></aside></div></div>;
}
