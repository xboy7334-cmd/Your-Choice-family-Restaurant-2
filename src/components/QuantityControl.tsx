import { Minus, Plus } from 'lucide-react';
import { useCart } from '../store/cart';
import type { Product } from '../types';

export default function QuantityControl({ product, compact = false }: { product: Product; compact?: boolean }) {
  const line = useCart((state) => state.lines.find((item) => item.product.id === product.id));
  const add = useCart((state) => state.add);
  const setQuantity = useCart((state) => state.setQuantity);
  if (!line) return <button className={`add-button ${compact ? 'compact' : ''}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); add(product); }}><Plus size={15} /> Add</button>;
  return <div className={`quantity-control ${compact ? 'compact' : ''}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}>
    <button aria-label="Decrease quantity" onClick={() => setQuantity(product.id, line.quantity - 1)}><Minus size={14} /></button><strong>{line.quantity}</strong><button aria-label="Increase quantity" onClick={() => setQuantity(product.id, line.quantity + 1)}><Plus size={14} /></button>
  </div>;
}
