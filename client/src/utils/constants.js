export const APP_CATEGORIES = [
  'Web Apps', 'Mobile', 'Desktop', 'APIs',
  'Games', 'Open Source', 'Security', 'Other',
];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All', icon: '⬛' },
  { id: 'certificate', label: 'Certificates', icon: '🎓' },
  { id: 'letter', label: 'Letters', icon: '✉️' },
  { id: 'receipt', label: 'Receipts', icon: '🧾' },
  { id: 'legal', label: 'Legal / HR', icon: '📋' },
  { id: 'cv', label: 'CV / Resume', icon: '👤' },
  { id: 'finance', label: 'Finance', icon: '💰' },
];

export const STORAGE_KEYS = {
  TOKEN: 'smartgen_token',
  THEME: 'theme',
};