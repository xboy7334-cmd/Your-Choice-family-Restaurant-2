import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Languages } from 'lucide-react';
import { useCart } from '../store/cart';
import { useI18n } from '../lib/i18n';

export default function Header() {
  const count = useCart((state) => state.count());
  const { locale, setLocale } = useI18n();
  const location = useLocation();
  const home = location.pathname === '/';
  return <header className="topbar"><div className="topbar-inner">
    {home ? <Link to="/" className="brand"><span className="brand-mark">YC</span><span><b>Your Choice</b><small>family Restaurant · Haldia</small></span></Link> : <button className="icon-button back-button" onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/')} aria-label="Go back"><ArrowLeft size={19} /></button>}
    <div className="topbar-actions"><button className="language-toggle" onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')} aria-label="Switch language"><Languages size={16} /><span>{locale === 'en' ? 'বাংলা' : 'English'}</span></button><Link to="/checkout" className="bag-link" aria-label={`Cart with ${count} items`}><ShoppingBag size={19} />{count > 0 && <span className="bag-count">{count}</span>}</Link></div>
  </div></header>;
}
