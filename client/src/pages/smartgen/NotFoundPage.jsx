import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold text-[var(--accent)] mb-2">404</h1>
      <p className="text-lg font-medium mb-1">Page not found</p>
      <p className="text-sm text-[var(--text-muted)] mb-6">This SmartGen page does not exist.</p>
      <Link to="/smartgen" className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-sm">
        Back to SmartGen
      </Link>
    </div>
  );
}