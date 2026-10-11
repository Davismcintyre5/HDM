export default function Tabs({ tabs = [], active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 border-b border-[var(--border-color)] overflow-x-auto ${className}`}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${
            active === t.key
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}