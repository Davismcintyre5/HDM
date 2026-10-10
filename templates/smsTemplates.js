const defaults = {
  name: 'HDM Technologies',
  smsSender: 'HDM',
};

const truncate = (text, max = 160) => {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
};

const contactAlert = ({ brand, name, phone, preview }) => {
  const b = { ...defaults, ...brand };
  const message = `${b.smsSender}: New contact from ${name} (${phone}) — ${preview}`;
  return {
    to: null,
    message: truncate(message, 160),
  };
};

const smartgenVerify = ({ brand, code }) => {
  const b = { ...defaults, ...brand };
  const message = `${b.smsSender}: Your verification code is ${code}. Valid 10 minutes. Do not share.`;
  return {
    to: null,
    message: truncate(message, 160),
  };
};

const smartgenReset = ({ brand, code }) => {
  const b = { ...defaults, ...brand };
  const message = `${b.smsSender}: Your password reset code is ${code}. Valid 10 minutes. Do not share.`;
  return {
    to: null,
    message: truncate(message, 160),
  };
};

const backupFailedAlert = ({ brand }) => {
  const b = { ...defaults, ...brand };
  const message = `${b.smsSender}: Automated backup FAILED. Check the admin panel.`;
  return {
    to: null,
    message: truncate(message, 160),
  };
};

const mongoStorageAlert = ({ brand, usedPercent }) => {
  const b = { ...defaults, ...brand };
  const message = `${b.smsSender}: MongoDB storage at ${usedPercent}%. Upgrade or archive soon.`;
  return {
    to: null,
    message: truncate(message, 160),
  };
};

module.exports = {
  contactAlert,
  smartgenVerify,
  smartgenReset,
  backupFailedAlert,
  mongoStorageAlert,
};