import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { debounce } from '../../utils/debounce';

export default function SearchBar({ value, onChange, placeholder = 'Search...', debounceMs = 300, className = '' }) {
  const [local, setLocal] = useState(value || '');

  const debouncedChange = debounce(onChange, debounceMs);

  const handle = (v) => {
    setLocal(v);
    debouncedChange(v);
  };

  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
      <input
        value={local}
        onChange={(e) => handle(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm outline-none focus:border-[var(--accent)] transition"
      />
    </div>
  );
}