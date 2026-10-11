export default function Textarea({ label, error, hint, className = '', id, rows = 4, ...props }) {
  const inputId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition resize-y ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)] mt-1">{hint}</p>}
    </div>
  );
}