import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useHdm } from '../../../context/HdmContext';

export default function Footer() {
  const { company } = useHdm();
  const c = company || {};

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-bold mb-3">{c.name || 'HDM Technologies'}</h3>
          <p className="text-[var(--text-muted)]">{c.tagline || 'Building Digital Solutions for Africa'}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          {c.email && <p className="flex items-center gap-2 text-[var(--text-secondary)] mb-1"><HiMail className="w-4 h-4" /> {c.email}</p>}
          {c.phone && <p className="flex items-center gap-2 text-[var(--text-secondary)] mb-1"><HiPhone className="w-4 h-4" /> {c.phone}</p>}
          {c.address && <p className="flex items-center gap-2 text-[var(--text-secondary)]"><HiLocationMarker className="w-4 h-4" /> {c.address}</p>}
        </div>
        <div>
          <h3 className="font-semibold mb-3">Links</h3>
          <div className="flex flex-wrap gap-3 text-[var(--text-secondary)]">
            {c.social?.github?.url && <a href={c.social.github.url} target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)]">GitHub</a>}
            {c.social?.linkedin?.url && <a href={c.social.linkedin.url} target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)]">LinkedIn</a>}
            {c.social?.twitter?.url && <a href={c.social.twitter.url} target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)]">Twitter</a>}
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border-color)] text-center py-4 text-xs text-[var(--text-muted)]">
        © {new Date().getFullYear()} {c.name || 'HDM Technologies'}. All rights reserved.
      </div>
    </footer>
  );
}