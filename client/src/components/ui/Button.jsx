import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-[var(--accent)] text-white hover:opacity-90',
  secondary: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:opacity-90',
  outline: 'border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
  ghost: 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}