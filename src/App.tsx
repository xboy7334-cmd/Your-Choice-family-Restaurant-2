import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import { I18nProvider, useI18n } from './lib/i18n';
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
function Loading() { const { t } = useI18n(); return <div className="loading-panel">{t.loading}</div>; }
export default function App() {
  return <I18nProvider><BrowserRouter><Suspense fallback={<Loading />}><Routes><Route element={<Shell />}><Route path="/" element={<Home />} /><Route path="/product/:id" element={<ProductDetail />} /><Route path="/checkout" element={<Checkout />} /><Route path="/verify/:reference" element={<VerifyOtp />} /><Route path="/track/:reference" element={<TrackOrder />} /><Route path="*" element={<Home />} /></Route></Routes></Suspense></BrowserRouter></I18nProvider>;
}
