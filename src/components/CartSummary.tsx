import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../store/cart';
import { useI18n } from '../lib/i18n';
import QuantityControl from './QuantityControl';

export default function CartSummary({ embedded = false }: { embedded?: boolean }) {
  const lines = useCart((state) => state.lines);
  const subtotal = useCart((state) => state.subtotal());
  const remove = useCart((state) => state.remove);
  const { t } = useI18n();
  if (!lines.length) return <div className="empty-state"><span className="empty-icon">🍽️</span><h2>{t.empty}</h2><p>Find something delicious to get started.</p><Link className="primary-button" to="/">{t.browse}</Link></div>;
  return <div className={embedded ? 'cart-lines embedded' : 'cart-lines'}>{lines.map(({ product, quantity }) => <div className="cart-line" key={product.id}><div className="cart-emoji">{product.emoji}</div><div className="cart-line-info"><b>{product.name}</b><small>₹{product.price} × {quantity}</small></div><QuantityControl product={product} compact /><strong>₹{product.price * quantity}</strong><button className="remove-button" aria-label={`Remove ${product.name}`} onClick={() => remove(product.id)}><Trash2 size={15} /></button></div>)}<div className="subtotal-row"><span>{t.subtotal}</span><strong>₹{subtotal}</strong></div>{!embedded && <Link to="/checkout" className="primary-button full">{t.checkout}<ArrowRight size={17} /></Link>}</div>;
}
