import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import AiWidget from '../../smartgen/AiWidget';

export default function Layout() {
  const { pathname } = useLocation();
  const isEditor = pathname.startsWith('/smartgen/editor');

  return (
    <div className="theme-smartgen min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <div className="flex-1 flex gap-6 max-w-7xl mx-auto w-full px-4 py-6">
        {!isEditor && <Sidebar />}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      <AiWidget />
    </div>
  );
}