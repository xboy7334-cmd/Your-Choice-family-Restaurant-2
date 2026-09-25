import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../types';
import QuantityControl from './QuantityControl';

export default function ProductCard({ product }: { product: Product }) {
  return <article className="product-card glass-card">
    <Link to={`/product/${encodeURIComponent(product.id)}`} className="product-link" aria-label={`View ${product.name}`}>
      <div className="product-art"><span>{product.emoji}</span><span className="art-arrow"><ArrowUpRight size={15} /></span></div>
      <div className="product-copy"><span className="eyebrow">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div>
    </Link>
    <div className="product-foot"><strong className="price">₹{product.price}</strong><QuantityControl product={product} compact /></div>
  </article>;
}
