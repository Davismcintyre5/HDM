import { NavLink } from 'react-router-dom';
import { HiViewGrid, HiDocumentText, HiCog, HiHome } from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

const LINKS = [
  { to: '/smartgen', end: true, icon: HiHome, label: 'Home' },
  { to: '/smartgen/templates', icon: HiViewGrid, label: 'Templates' },
  { to: '/smartgen/documents', icon: HiDocumentText, label: 'Saved Docs', auth: true },
  { to: '/smartgen/settings', icon: HiCog, label: 'Settings', auth: true },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <nav className="flex flex-col gap-1">
      {LINKS.filter((l) => !l.auth || user).map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              isActive ? 'bg-[var(--bg-tertiary)] font-medium text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`
          }
        >
          <l.icon className="w-4 h-4" />
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3">
          {content}
        </div>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-sm shadow-lg"
      >
        Menu
      </button>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-primary)] z-50 p-4 animate-slide-in-left">
            {content}
          </div>
        </>
      )}
    </>
  );
}