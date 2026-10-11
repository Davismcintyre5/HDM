import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { useHdm } from '../../../context/HdmContext';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/apps', label: 'Apps' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Header({ onOpenMobileMenu }) {
  const { company } = useHdm();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur border-b border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {company?.logo ? (
            <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-[var(--accent)] text-white font-bold flex items-center justify-center text-sm">
              H
            </div>
          )}
          <span className="font-bold text-lg">{company?.name || 'HDM Technologies'}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              {n.label}
            </Link>
          ))}
        </nav>

        <button onClick={onOpenMobileMenu || (() => setOpen(true))} className="md:hidden p-2">
          <HiMenu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}