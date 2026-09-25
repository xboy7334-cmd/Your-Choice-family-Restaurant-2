import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Leaf, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../types';
import { useI18n } from '../lib/i18n';
import ProductCard from '../components/ProductCard';
import QuantityControl from '../components/QuantityControl';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useI18n();
  useEffect(() => { setLoading(true); api.product(id).then((data) => { setProduct(data.product); setRelated(data.related || []); }).catch((err: Error) => setError(err.message)).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div className="loading-panel">{t.loading}</div>;
  if (error || !product) return <div className="inline-error">{error || 'Dish not found'} <Link to="/">{t.back}</Link></div>;
  return <div className="detail-page"><Link to="/" className="text-link"><ArrowLeft size={16} /> {t.back}</Link><section className="detail-card glass-card"><div className="detail-art"><span>{product.emoji}</span><div className="detail-stamp">YOUR CHOICE<br />FAMILY RESTAURANT</div></div><div className="detail-copy"><span className="eyebrow">{product.category} · HALDIA</span><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="detail-price">₹{product.price}<small> / serving</small></div><div className="detail-traits"><span><Clock3 size={15} /> Freshly prepared</span><span><Leaf size={15} /> Quality ingredients</span><span><ShieldCheck size={15} /> Made with care</span></div><h3>{t.details}</h3><p className="detail-long">{product.details || product.description}</p><div className="detail-actions"><QuantityControl product={product} /><span>₹40 delivery · Free pickup</span></div></div></section>{related.length > 0 && <section className="related-section"><div className="section-heading compact-heading"><div><span className="eyebrow">FROM THE SAME KITCHEN</span><h2>{t.related}</h2></div></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}</div>;
}
