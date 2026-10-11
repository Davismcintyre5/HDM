import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

export default function TemplateCard({ template }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/smartgen/editor/${template.id}`)}
      className="group flex items-start gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-left hover:border-[var(--accent)] hover:shadow-md transition"
    >
      <span className="text-2xl shrink-0">{template.icon}</span>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate">{template.name}</h4>
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">{template.description}</p>
        <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {template.category}
        </span>
      </div>
      <HiArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition mt-1 shrink-0" />
    </button>
  );
}