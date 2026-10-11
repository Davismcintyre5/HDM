import { useState, useMemo } from 'react';
import { HiStar, HiEye, HiExternalLink } from 'react-icons/hi';
import { useHdm } from '../../context/HdmContext';

export default function AppsSection() {
  const { apps } = useHdm();
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(apps.map((a) => a.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [apps]);

  const filtered = useMemo(
    () => (filter === 'All' ? apps : apps.filter((a) => a.category === filter)),
    [apps, filter]
  );

  if (!apps.length) return null;

  return (
    <section className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Our Apps</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">Built by HDM Technologies</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              filter === c
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((app) => (
          <div key={app._id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 hover:shadow-md transition">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-2xl shrink-0">
                {app.icon || '📱'}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{app.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{app.category}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">
              {app.shortDescription || app.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(app.technologies || []).slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <HiStar className="w-3 h-3 text-yellow-500" /> {app.rating || 0}
              </span>
              <span className="flex items-center gap-1">
                <HiEye className="w-3 h-3" /> {app.viewCount || 0}
              </span>
              {app.urls?.live && (
                <a href={app.urls.live} target="_blank" rel="noreferrer" className="text-[var(--accent)] flex items-center gap-1">
                  Live <HiExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}