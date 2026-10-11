import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiDocumentText, HiPlus } from 'react-icons/hi';
import smartgenApi from '../../api/smartgen';
import { useAuth } from '../../context/AuthContext';
import DocumentCard from '../../components/smartgen/DocumentCard';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { templates, getTemplateById } from '../../utils/templates';
import { exportElementToPdf, printElement } from '../../utils/pdfExport';

export default function DocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, doc: null });
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [actionDoc, setActionDoc] = useState(null);
  const hiddenRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/smartgen/login');
      return;
    }
    smartgenApi
      .getDocuments()
      .then((data) => setDocs(Array.isArray(data) ? data : []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDelete = async () => {
    if (!confirm.doc) return;
    setDeleting(true);
    try {
      await smartgenApi.deleteDocument(confirm.doc._id);
      setDocs((d) => d.filter((x) => x._id !== confirm.doc._id));
      toast.success('Document deleted');
      setConfirm({ open: false, doc: null });
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const runAction = async (doc, action) => {
    setBusyId(doc._id);
    setActionDoc(doc);

    try {
      // Give React time to mount + browser time to layout + images time to start
      await new Promise((r) => setTimeout(r, 250));

      if (!hiddenRef.current) {
        throw new Error('Render failed');
      }

      // Diagnostic
      console.log('[DocumentsPage] hidden size:', {
        scrollW: hiddenRef.current.scrollWidth,
        scrollH: hiddenRef.current.scrollHeight,
        offsetW: hiddenRef.current.offsetWidth,
        offsetH: hiddenRef.current.offsetHeight,
      });

      const safeName = (doc.templateName || 'document').replace(
        /[^a-zA-Z0-9-_]/g,
        '_'
      );

      if (action === 'pdf') {
        await exportElementToPdf(hiddenRef.current, `${safeName}.pdf`);
        toast.success('PDF downloaded');
      } else if (action === 'print') {
        await printElement(hiddenRef.current);
        toast.success('Opening print dialog…');
      }
    } catch (err) {
      toast.error(err.message || `${action} failed`);
    } finally {
      setBusyId(null);
      setActionDoc(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const renderTemplate = actionDoc
    ? getTemplateById(actionDoc.templateId)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold">
            Saved Documents
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            All your previously saved documents
          </p>
        </div>
        <Button
          onClick={() => navigate('/smartgen/templates')}
          icon={<HiPlus className="w-4 h-4" />}
        >
          New
        </Button>
      </div>

      {!docs.length ? (
        <EmptyState
          icon={<HiDocumentText />}
          title="No saved documents yet"
          message="Generate a document and click Save to store it here."
          action={
            <Button onClick={() => navigate('/smartgen/templates')}>
              Browse Templates
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              busy={busyId === doc._id}
              onEdit={(d) =>
                navigate(`/smartgen/editor/${d.templateId}?edit=${d._id}`)
              }
              onDelete={(d) => setConfirm({ open: true, doc: d })}
              onPrint={(d) => runAction(d, 'print')}
              onPdf={(d) => runAction(d, 'pdf')}
            />
          ))}
        </div>
      )}

      {/* Hidden render target for print/pdf — on-screen but invisible so layout+images work */}
      {renderTemplate && (
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
              __html: renderTemplate.render(actionDoc.formData || {}),
            }}
          />
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, doc: null })}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Permanently delete "${confirm.doc?.templateName}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}