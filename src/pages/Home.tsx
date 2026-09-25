import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useCart } from '../store/cart';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { t } = useI18n();
  const count = useCart((state) => state.count());
  useEffect(() => { api.catalog().then((data) => setProducts(Array.isArray(data) ? data : [])).catch((err: Error) => setError(err.message)).finally(() => setLoading(false)); }, []);
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const filtered = useMemo(() => products.filter((product) => product.available !== false && (category === 'All' || product.category === category) && `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, category, query]);
  return <div className="home-page">
    <section className="hero-panel"><div className="hero-noise" /><div className="hero-content"><div className="status-pill"><span className="live-dot" /> OPEN · ORDER NOW</div><h1>Good food,<br /><em>good mood.</em></h1><p>{t.subtitle} Discover the best of Haldia, made fresh at Your Choice.</p><div className="hero-meta"><span>✦  Freshly prepared</span><span>◷  30–40 min delivery</span></div></div><div className="hero-plate" aria-hidden="true"><div className="plate-ring"><span>🍛</span></div><span className="float-spark spark-one">✦</span><span className="float-spark spark-two">✧</span><span className="plate-caption">A little joy<br />in every bite.</span></div><div className="hero-index">01 / THE MENU</div></section>
    <section className="menu-section"><div className="section-heading"><div><span className="eyebrow"><Sparkles size={13} /> MADE FRESH DAILY</span><h2>{t.menu}</h2><p>A table full of favorites, just a few taps away.</p></div><div className="delivery-chip"><span>₹</span><div><b>₹40 delivery</b><small>Free self-pickup</small></div></div></div>
      <div className="catalog-tools"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /><kbd>/</kbd></label><div className="filter-label"><SlidersHorizontal size={15} /> FILTER</div></div>
      <div className="category-row" role="group" aria-label="Filter by category">{categories.map((item) => <button key={item} className={`category-pill ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>{item === 'All' ? t.all : item}</button>)}</div>
      {loading ? <div className="product-grid">{Array.from({ length: 6 }).map((_, index) => <div className="skeleton-card" key={index}><div /><span /><span /></div>)}</div> : error ? <div className="inline-error">{error}<button onClick={() => window.location.reload()}>Retry</button></div> : filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-results"><span>☁️</span><h3>No dishes found</h3><p>Try another search or category.</p></div>}
    </section>
    {count > 0 && <Link to="/checkout" className="floating-cart"><span className="float-cart-count">{count}</span><span>View your cart</span><ArrowRight size={17} /></Link>}
  </div>;
}
