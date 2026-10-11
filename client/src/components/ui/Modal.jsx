import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, size = 'md', footer, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-[var(--bg-secondary)] rounded-2xl shadow-xl w-full ${SIZES[size] || SIZES.md} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)]">
            <h2 className="font-semibold">{title}</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-[var(--border-color)] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}