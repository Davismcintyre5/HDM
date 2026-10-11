import TemplateGallery from '../../components/smartgen/TemplateGallery';

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold">Template Library</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Choose a template to start generating your document
        </p>
      </div>
      <TemplateGallery />
    </div>
  );
}