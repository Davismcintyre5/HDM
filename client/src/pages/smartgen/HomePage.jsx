import { Link } from 'react-router-dom';
import { HiSparkles, HiViewGrid, HiDocumentText, HiArrowRight } from 'react-icons/hi';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <div className="text-5xl mb-6">📄</div>
      <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
        Generate Documents with <span className="text-[var(--accent)]">AI</span>
      </h1>
      <p className="text-[var(--text-muted)] text-base mb-8 max-w-lg mx-auto">
        Choose from professional templates, fill in your details, and generate ready-to-print documents instantly.
      </p>

      <div className="flex gap-3 justify-center mb-12">
        <Link to="/smartgen/templates" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium">
          <HiSparkles className="w-4 h-4" /> Browse Templates
        </Link>
        <Link to="/smartgen/editor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-color)] text-sm">
          Start Blank <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-sm text-[var(--text-muted)]">
        {[
          { icon: HiViewGrid, text: 'Pick a template' },
          { icon: HiSparkles, text: 'Fill in the form' },
          { icon: HiDocumentText, text: 'Print or save as PDF' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2 justify-center p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
            <s.icon className="w-4 h-4 text-[var(--accent)]" /> {s.text}
          </div>
        ))}
      </div>
    </div>
  );
}