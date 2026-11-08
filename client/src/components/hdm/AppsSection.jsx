import { useState, useMemo } from 'react';
import { HiStar, HiEye, HiExternalLink } from 'react-icons/hi';
import { useHdm } from '../../context/HdmContext';
import hdmApi from '../../api/hdm';

function formatViews(n) {
  if (!n || n < 1) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function StatusBadge({ status }) {
  if (!status) return null;
  const map = {
    live: { label: 'Live', dot: 'bg-green-500', cls: 'text-green-600' },
    development: { label: 'In development', dot: 'bg-amber-500', cls: 'text-amber-600' },
    coming_soon: { label: 'Coming soon', dot: 'bg-gray-400', cls: 'text-gray-500' },
  };
  const s = map[status] || map.coming_soon;
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

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
        {filtered.map((app) => {
          const views = formatViews(app.viewCount);
          return (
            <div
              key={app._id}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 hover:shadow-md transition flex flex-col"
            >
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
                  <span
                    key={t}
                    className="text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  {app.rating > 0 && app.ratingCount > 0 && (
                    <span className="flex items-center gap-1">
                      <HiStar className="w-3 h-3 text-yellow-500" />
                      {Number(app.rating).toFixed(1)}
                      <span className="text-[10px]">({app.ratingCount})</span>
                    </span>
                  )}
                  {views && (
                    <span className="flex items-center gap-1">
                      <HiEye className="w-3 h-3" />
                      {views}
                    </span>
                  )}
                </div>

                {app.urls?.live && (
                  <a
                    href={app.urls.live}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      hdmApi.incrementAppView(app._id).catch(() => {});
                    }}
                    className="text-[var(--accent)] flex items-center gap-1 hover:underline"
                  >
                    Open <HiExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}