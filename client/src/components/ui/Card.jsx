export default function Card({ title, action, padding = true, className = '', children }) {
  return (
    <div className={`bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          {title && <h3 className="font-semibold text-sm">{title}</h3>}
          {action}
        </div>
      )}
      <div className={padding ? 'p-4' : ''}>{children}</div>
    </div>
  );
}