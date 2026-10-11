import { useState } from 'react';
import {
  HiPencil,
  HiTrash,
  HiDocumentText,
  HiPrinter,
  HiDocumentDownload,
} from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';

export default function DocumentCard({ doc, onEdit, onDelete, onPrint, onPdf, busy }) {
  if (!doc) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent)] transition">
      <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
        <HiDocumentText className="w-5 h-5 text-[var(--text-muted)]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {doc.templateName || 'Untitled document'}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {formatDate(doc.createdAt)}
          {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
            <span className="ml-2">· edited {formatDate(doc.updatedAt)}</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPrint?.(doc)}
          disabled={busy}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition disabled:opacity-50"
          title="Print"
          aria-label="Print document"
        >
          <HiPrinter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onPdf?.(doc)}
          disabled={busy}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition disabled:opacity-50"
          title="Download PDF"
          aria-label="Download PDF"
        >
          <HiDocumentDownload className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onEdit?.(doc)}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition"
          title="Edit"
          aria-label="Edit document"
        >
          <HiPencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(doc)}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
          title="Delete"
          aria-label="Delete document"
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}