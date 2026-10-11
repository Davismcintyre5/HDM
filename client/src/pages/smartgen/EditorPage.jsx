import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  HiPrinter,
  HiRefresh,
  HiSave,
  HiChevronLeft,
  HiEye,
  HiEyeOff,
  HiDocumentDownload,
} from 'react-icons/hi';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';
import {
  templates,
  getTemplateById,
  filterTemplates,
} from '../../utils/templates';
import DynamicForm from '../../components/smartgen/DynamicForm';
import LivePreview from '../../components/smartgen/LivePreview';
import CategoryFilter from '../../components/smartgen/CategoryFilter';
import Button from '../../components/ui/Button';
import smartgenApi from '../../api/smartgen';
import { useAuth } from '../../context/AuthContext';
import { exportElementToPdf } from '../../utils/pdfExport';

function initData(schema = []) {
  const d = {};
  schema.forEach((f) => {
    d[f.name] = f.default || '';
  });
  return d;
}

export default function EditorPage() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [previewOpen, setPreviewOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [captureData, setCaptureData] = useState(null);

  const printRef = useRef(null);
  const hiddenRef = useRef(null);

  useEffect(() => {
    if (editId && user) {
      smartgenApi
        .getDocument(editId)
        .then((doc) => {
          const tpl = getTemplateById(doc.templateId) || templates[0];
          setTemplate(tpl);
          setFormData(doc.formData || initData(tpl.schema));
        })
        .catch(() => navigate('/smartgen/documents'));
    } else {
      const found = getTemplateById(templateId) || templates[0];
      setTemplate(found);
      setFormData(initData(found.schema));
    }
  }, [templateId, editId, user, navigate]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: template?.name || 'Document',
  });

  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = () => {
    if (!template) return;
    setFormData(initData(template.schema));
    toast.success('Form reset');
  };

  const handleSave = async () => {
    if (!template) return;
    if (!user) {
      navigate('/smartgen/login');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await smartgenApi.updateDocument(editId, { formData });
        toast.success('Document updated');
      } else {
        await smartgenApi.createDocument({
          templateId: template.id,
          templateName: template.name,
          formData,
        });
        toast.success('Document saved');
      }
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = async () => {
    if (!template) return;
    setPdfLoading(true);
    setCaptureData({ template, formData });

    try {
      await new Promise((r) => setTimeout(r, 250));

      if (!hiddenRef.current) {
        throw new Error('Capture target not ready');
      }

      const safeName = (template.name || 'document').replace(
        /[^a-zA-Z0-9-_]/g,
        '_'
      );

      await exportElementToPdf(hiddenRef.current, `${safeName}.pdf`);
      toast.success('PDF downloaded');
    } catch (err) {
      toast.error(err.message || 'PDF export failed');
    } finally {
      setPdfLoading(false);
      setCaptureData(null);
    }
  };

  const selectTemplate = (tpl) => navigate(`/smartgen/editor/${tpl.id}`);

  const filtered = filterTemplates(templates, { category, search });

  return (
    <div className="animate-slide-up">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-5 no-print">
        <button
          onClick={() => navigate('/smartgen/templates')}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
          title="Back to templates"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-display font-semibold truncate">
            {template?.icon} {template?.name || 'Editor'}
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Fill fields · Preview · Print or Save
          </p>
        </div>
        <button
          onClick={() => setPreviewOpen((o) => !o)}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
          title={previewOpen ? 'Hide preview' : 'Show preview'}
        >
          {previewOpen ? (
            <HiEyeOff className="w-4 h-4" />
          ) : (
            <HiEye className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left — template picker */}
        <div className="lg:col-span-3 no-print space-y-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
              Category
            </p>
            <CategoryFilter active={category} onSelect={setCategory} />
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
              Templates
            </p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 mb-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs outline-none"
            />
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filtered.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => selectTemplate(tpl)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-sm transition ${
                    template?.id === tpl.id
                      ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)] font-medium'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <span className="text-lg shrink-0">{tpl.icon}</span>
                  <span className="truncate">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle — form + actions */}
        <div className="lg:col-span-5 no-print">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
              <h3 className="font-semibold">Fill Details</h3>
              <span className="text-xs bg-[var(--bg-tertiary)] px-2.5 py-1 rounded-full text-[var(--text-muted)]">
                {template?.category}
              </span>
            </div>

            <DynamicForm
              schema={template?.schema}
              formData={formData}
              onChange={updateField}
            />

            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[var(--border-color)]">
              <Button
                onClick={handleExportPdf}
                loading={pdfLoading}
                icon={<HiDocumentDownload className="w-4 h-4" />}
              >
                PDF
              </Button>
              <Button
                variant="secondary"
                onClick={handlePrint}
                icon={<HiPrinter className="w-4 h-4" />}
              >
                Print
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                loading={saving}
                icon={<HiSave className="w-4 h-4" />}
              >
                {editId ? 'Update' : 'Save'}
              </Button>
              <Button
                variant="secondary"
                onClick={resetForm}
                icon={<HiRefresh className="w-4 h-4" />}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Right — live preview */}
        {previewOpen && (
          <div className="lg:col-span-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden sticky top-6">
              <div className="px-4 py-2.5 border-b border-[var(--border-color)] flex items-center justify-between no-print">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Live Preview
                </span>
                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                  PDF-ready
                </span>
              </div>
              <div className="p-3 overflow-auto max-h-[80vh]">
                <LivePreview
                  ref={printRef}
                  template={template}
                  formData={formData}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden capture target — full-height render for PDF export */}
      {captureData && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '794px',
            opacity: 0.001,
            zIndex: -1,
            pointerEvents: 'none',
            overflow: 'visible',
            background: '#ffffff',
          }}
        >
          <div
            ref={hiddenRef}
            style={{ width: '794px', background: '#ffffff' }}
            dangerouslySetInnerHTML={{
              __html: captureData.template.render(captureData.formData),
            }}
          />
        </div>
      )}
    </div>
  );
}