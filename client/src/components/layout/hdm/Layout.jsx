import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import AiWidget from '../../hdm/AiWidget';

export default function Layout() {
  return (
    <div className="theme-hdm min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileMenu />
      <AiWidget />
    </div>
  );
}