import { HiBadgeCheck, HiShieldCheck } from 'react-icons/hi';

const FEATURES = [
  { icon: HiBadgeCheck, title: 'Quality', desc: '100% authentic' },
  { icon: HiShieldCheck, title: 'Secure', desc: 'Safe payments' },
];

export default function Features() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 my-8">
      {FEATURES.map((f, i) => (
        <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-xl text-center">
          <f.icon className="w-7 h-7 mx-auto mb-1 text-[var(--accent)]" />
          <h3 className="font-semibold text-sm">{f.title}</h3>
          <p className="text-xs text-[var(--text-muted)]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}