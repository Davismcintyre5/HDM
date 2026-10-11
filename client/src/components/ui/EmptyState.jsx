export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      {icon && <div className="text-4xl text-[var(--text-muted)]">{icon}</div>}
      {title && <p className="text-sm font-medium">{title}</p>}
      {message && <p className="text-xs text-[var(--text-muted)] max-w-sm">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}