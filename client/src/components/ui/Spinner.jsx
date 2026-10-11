const SIZES = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${SIZES[size] || SIZES.md} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}