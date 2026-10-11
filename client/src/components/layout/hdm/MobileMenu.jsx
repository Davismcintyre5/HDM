import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/apps', label: 'Apps' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[var(--accent)] text-white shadow-lg"
        aria-label="Open menu"
      >
        <HiMenu className="w-6 h-6" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-72 bg-[var(--bg-primary)] z-50 p-5 animate-slide-in-right">
            <div className="flex justify-end mb-6">
              <button onClick={() => setOpen(false)}><HiX className="w-6 h-6" /></button>
            </div>
            <nav className="flex flex-col gap-3">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm hover:text-[var(--accent)]">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}