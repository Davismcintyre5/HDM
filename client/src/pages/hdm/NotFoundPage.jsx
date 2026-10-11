import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-[var(--accent)] mb-2">404</h1>
      <p className="text-lg font-medium mb-2">Page not found</p>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-sm">
        Back to Home
      </Link>
    </div>
  );
}