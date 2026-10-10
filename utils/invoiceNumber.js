const HdmInvoiceCounter = require('../models/hdm/InvoiceCounter');

const pad = (n) => String(n).padStart(4, '0');

const monthYear = (date = new Date()) => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${m}${y}`;
};

const generate = async (date = new Date()) => {
  const suffix = monthYear(date);
  const seq = await HdmInvoiceCounter.nextFor(suffix);
  return `INV-${pad(seq)}-${suffix}`;
};

module.exports = { generate, monthYear, pad };