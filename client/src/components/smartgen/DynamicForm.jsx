import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';

export default function DynamicForm({ schema, formData, onChange }) {
  if (!schema?.length) return null;

  return (
    <div className="space-y-4">
      {schema.map((field) => {
        const value = formData[field.name] ?? field.default ?? '';

        if (field.type === 'textarea') {
          return (
            <Textarea
              key={field.name}
              label={field.label}
              rows={field.rows || 4}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder || ''}
            />
          );
        }

        if (field.type === 'select') {
          return (
            <Select
              key={field.name}
              label={field.label}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              options={[
                { value: '', label: field.placeholder || 'Select...' },
                ...(field.options || []).map((o) => ({ value: o, label: o })),
              ]}
            />
          );
        }

        if (field.type === 'checkbox') {
          return (
            <label key={field.name} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange(field.name, e.target.checked)}
                className="w-4 h-4"
              />
              {field.placeholder || field.label}
            </label>
          );
        }

        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
          />
        );
      })}
    </div>
  );
}