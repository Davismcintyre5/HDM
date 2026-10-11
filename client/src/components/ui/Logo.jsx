import { useHdm } from '../../context/HdmContext';

export default function Logo({ size = 36, className = '', variant = 'default' }) {
  const { company } = useHdm();

  const url =
    variant === 'dark'
      ? company?.logoDark || company?.logo
      : company?.logo;

  if (url) {
    return (
      <img
        src={url}
        alt={company?.name || 'HDM Technologies'}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        background: 'linear-gradient(135deg, #1e6ef0, #0a1628)',
      }}
    >
      H
    </div>
  );
}