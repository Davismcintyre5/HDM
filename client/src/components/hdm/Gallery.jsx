import { useState } from 'react';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useHdm } from '../../context/HdmContext';

export default function Gallery() {
  const { photos } = useHdm();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  if (!photos.length) return null;

  const categories = ['All', ...new Set(photos.map((p) => p.category || 'General'))];
  const filtered = filter === 'All' ? photos : photos.filter((p) => (p.category || 'General') === filter);

  const current = filtered.findIndex((p) => p._id === selected?._id);
  const prev = () => setSelected(filtered[current > 0 ? current - 1 : filtered.length - 1]);
  const next = () => setSelected(filtered[current < filtered.length - 1 ? current + 1 : 0]);

  return (
    <section className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Gallery</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">Moments from our work</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              filter === c ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div
            key={p._id}
            onClick={() => setSelected(p)}
            className="aspect-square rounded-xl overflow-hidden cursor-pointer bg-[var(--bg-tertiary)] group"
          >
            <img
              src={p.url}
              alt={p.title || 'Photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setSelected(null)}>
            <HiX className="w-8 h-8" />
          </button>
          <button className="absolute left-4 text-white" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <HiChevronLeft className="w-10 h-10" />
          </button>
          <img
            src={selected.url}
            alt={selected.title || 'Photo'}
            className="max-w-full max-h-[80vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute right-4 text-white" onClick={(e) => { e.stopPropagation(); next(); }}>
            <HiChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </section>
  );
}