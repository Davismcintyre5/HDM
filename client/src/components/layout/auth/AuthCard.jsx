export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">✨</div>
        <h1 className="text-xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-muted)]">
          {footer}
        </div>
      )}
    </div>
  );
}