import { HiExternalLink } from 'react-icons/hi';
import { useHdm } from '../../context/HdmContext';

export default function ProjectsSection() {
  const { projects } = useHdm();
  if (!projects.length) return null;

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Projects</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">Things we have shipped</p>
      </div>

      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {featured.map((p) => (
            <div key={p._id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 hover:shadow-md transition">
              <h3 className="font-semibold mb-2">⭐ {p.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {(p.technologies || []).map((t) => (
                  <span key={t} className="text-[10px] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[var(--accent)] text-xs mt-3 hover:underline">
                  View <HiExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rest.map((p) => (
            <div key={p._id} className="border border-[var(--border-color)] rounded-lg p-4 hover:border-[var(--accent)] transition">
              <h4 className="font-medium text-sm mb-1">{p.name}</h4>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}