import ContactForm from '../../components/hdm/ContactForm';
import { useHdm } from '../../context/HdmContext';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function ContactPage() {
  const { company } = useHdm();
  const c = company || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Get in Touch</h1>
      <p className="text-center text-[var(--text-muted)] mb-10">
        We typically respond within 24 hours
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4 text-sm">
          {c.email && (
            <p className="flex items-center gap-2">
              <HiMail className="w-4 h-4 text-[var(--accent)]" /> {c.email}
            </p>
          )}
          {c.phone && (
            <p className="flex items-center gap-2">
              <HiPhone className="w-4 h-4 text-[var(--accent)]" /> {c.phone}
            </p>
          )}
          {c.address && (
            <p className="flex items-center gap-2">
              <HiLocationMarker className="w-4 h-4 text-[var(--accent)]" /> {c.address}
            </p>
          )}
          {c.whatsapp && (
            <a
              href={`https://wa.me/${String(c.whatsapp).replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm mt-2"
            >
              💬 WhatsApp us
            </a>
          )}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}