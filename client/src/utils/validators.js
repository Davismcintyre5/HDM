export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));

export const isValidKenyanPhone = (phone) =>
  /^(?:\+254|0)[17]\d{8}$/.test(String(phone || ''));

export const normalizeKenyanPhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('+254')) return digits.slice(1);
  return digits;
};

export const passwordStrength = (pw) => {
  if (!pw) return { score: 0, label: 'weak', ok: false };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const label = score <= 1 ? 'weak' : score <= 3 ? 'fair' : 'strong';
  return { score, label, ok: pw.length >= 6 };
};

export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const cn = (...args) =>
  args.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();