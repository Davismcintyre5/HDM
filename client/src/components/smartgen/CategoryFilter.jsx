import { TEMPLATE_CATEGORIES } from '../../utils/constants';

export default function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATE_CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            active === c.id
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
          }`}
        >
          <span className="mr-1">{c.icon}</span>
          {c.label}
        </button>
      ))}
    </div>
  );
}