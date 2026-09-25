import { Outlet } from 'react-router-dom';
import Header from './Header';
export default function Shell() { return <><Header /><main className="page-shell"><Outlet /></main><footer className="site-footer"><span className="brand-mark small">YC</span><span>Your Choice family Restaurant · Haldia</span><span>Made with care, served with love.</span></footer></>; }
