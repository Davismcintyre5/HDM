export const formatCurrency = (amount, currency = 'KES') => {
  const n = Number(amount || 0);
  return `${currency} ${n.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
};

export const formatKES = (amount) => formatCurrency(amount, 'KES');

export const formatDate = (date, style = 'short') => {
  if (!date) return '';
  const d = new Date(date);
  if (style === 'full') {
    return d.toLocaleString('en-KE', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
  return d.toLocaleDateString('en-KE', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const relativeTime = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};

export const maskPhone = (phone) => {
  if (!phone) return '';
  const s = String(phone);
  if (s.length < 8) return s;
  return `${s.slice(0, 3)}***${s.slice(-4)}`;
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = Number(bytes);
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${units[i]}`;
};

export const truncate = (text, max = 100) => {
  if (!text || text.length <= max) return text || '';
  return text.slice(0, max) + '…';
};