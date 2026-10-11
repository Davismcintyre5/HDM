import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiExternalLink, HiStar, HiEye } from 'react-icons/hi';
import hdmApi from '../../api/hdm';
import Spinner from '../../components/ui/Spinner';
import NotFoundPage from './NotFoundPage';

export default function AppDetailPage() {
  const { slug } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hdmApi
      .getAppBySlug(slug)
      .then(setApp)
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (!app) return <NotFoundPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/apps" className="inline-flex items-center gap-1 text-sm text-[var(--accent)] mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to apps
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-3xl shrink-0">
          {app.icon || '📱'}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{app.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">{app.category}</p>
          <div className="flex gap-4 text-xs text-[var(--text-muted)] mt-2">
            <span className="flex items-center gap-1"><HiStar className="w-3 h-3 text-yellow-500" /> {app.rating || 0}</span>
            <span className="flex items-center gap-1"><HiEye className="w-3 h-3" /> {app.viewCount || 0}</span>
          </div>
        </div>
      </div>

      <p className="text-[var(--text-secondary)] mb-6 whitespace-pre-wrap">
        {app.description || app.shortDescription}
      </p>

      {(app.technologies || []).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {app.technologies.map((t) => (
              <span key={t} className="text-xs bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      )}

      {app.urls?.live && (
        <a
          href={app.urls.live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm"
        >
          Visit Live Site <HiExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}