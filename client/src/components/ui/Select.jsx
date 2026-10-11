export default function Select({ label, error, options = [], className = '', id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}