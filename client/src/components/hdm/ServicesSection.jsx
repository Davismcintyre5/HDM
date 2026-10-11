import { useHdm } from '../../context/HdmContext';
import Card from '../ui/Card';

export default function ServicesSection() {
  const { services } = useHdm();
  if (!services.length) return null;

  return (
    <section className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Our Services</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">What we do best</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <Card key={s._id} className="hover:shadow-md transition">
            <div className="text-3xl mb-3">{s.icon || '⚡'}</div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-[var(--text-muted)]">{s.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}