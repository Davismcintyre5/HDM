import { useMemo, useState } from 'react';
import { templates, filterTemplates } from '../../utils/templates';
import TemplateCard from './TemplateCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from '../ui/SearchBar';

export default function TemplateGallery() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => filterTemplates(templates, { category, search }),
    [category, search]
  );

  return (
    <div className="space-y-5">
      <SearchBar value={search} onChange={setSearch} placeholder="Search templates..." />
      <CategoryFilter active={category} onSelect={setCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
        {!filtered.length && (
          <p className="col-span-full text-center text-sm text-[var(--text-muted)] py-8">
            No templates found.
          </p>
        )}
      </div>
    </div>
  );
}