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

export default function Header() {
  const { company } = useHdm();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a1628] text-white shadow-lg border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {company?.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-8 w-8 object-contain rounded"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-[#1e6ef0] text-white font-bold flex items-center justify-center text-sm">
              H
            </div>
          )}
          <span className="font-bold text-lg">
            {company?.name || 'HDM Technologies'}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 text-white"
          aria-label="Open menu"
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}