import { forwardRef } from 'react';

const LivePreview = forwardRef(function LivePreview({ template, formData }, ref) {
  if (!template) {
    return (
      <div
        ref={ref}
        id="printable-area"
        className="preview-surface bg-white rounded-lg border border-[var(--border-color)] p-8 min-h-64 flex items-center justify-center"
      >
        <p className="text-sm text-[var(--text-muted)]">
          Select a template to see the preview
        </p>
      </div>
    );
  }

  let html = '';
  try {
    html = template.render(formData);
  } catch {
    html = '<p style="color:red;padding:1rem;">Preview error — check your fields</p>';
  }

  return (
    <div
      ref={ref}
      id="printable-area"
      className="preview-surface bg-white rounded-lg border border-[var(--border-color)] overflow-hidden"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'geometricPrecision',
        imageRendering: 'auto',
        transform: 'none',
        zoom: 1,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export default LivePreview;