const HdmPaymentRequest = require('../../models/hdm/PaymentRequest');
const mpesaService = require('../../services/mpesaService');
const invoiceNumberUtil = require('../../utils/invoiceNumber');
const { buildTablePDF } = require('../../services/pdfService');
const { getBrand } = require('../../utils/getBrand');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

/* ============================================================
   List — with filters and stats
   ============================================================ */
exports.list = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const requests = await HdmPaymentRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(200);

  const [total, pending, processing, success, failed, cancelled] =
    await Promise.all([
      HdmPaymentRequest.countDocuments(),
      HdmPaymentRequest.countDocuments({ status: 'pending' }),
      HdmPaymentRequest.countDocuments({ status: 'processing' }),
      HdmPaymentRequest.countDocuments({ status: 'success' }),
      HdmPaymentRequest.countDocuments({ status: 'failed' }),
      HdmPaymentRequest.countDocuments({ status: 'cancelled' }),
    ]);

  return ok(res, {
    requests,
    stats: { total, pending, processing, success, failed, cancelled },
  });
});

/* ============================================================
   Get one
   ============================================================ */
exports.get = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');
  return ok(res, request);
});

/* ============================================================
   Create — auto-assigns invoice number
   ============================================================ */
exports.create = asyncHandler(async (req, res) => {
  const { reference, description, phone, amount } = req.body;

  if (!phone || !amount) {
    throw ApiError.badRequest('phone and amount are required');
  }

  const amountNum = Number(amount);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    throw ApiError.badRequest('Amount must be greater than 0');
  }

  const invoiceNumber = await invoiceNumberUtil.generate();

  const request = await HdmPaymentRequest.create({
    invoiceNumber,
    reference: reference || invoiceNumber,
    description: description || '',
    phone: mpesaService.normalizePhone(phone),
    amount: amountNum,
    createdBy: req.userId,
    status: 'pending',
  });

  return created(res, request, `Created ${invoiceNumber}`);
});

/* ============================================================
   Initiate — sends STK Push
   ============================================================ */
exports.initiate = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');

  if (request.status === 'success') {
    throw ApiError.badRequest('Payment already completed');
  }

  const result = await mpesaService.initiateSTKPush({
    phone: request.phone,
    amount: request.amount,
    accountReference: request.invoiceNumber || request.reference,
    description: request.description || 'Payment',
  });

  if (!result.success) {
    request.status = 'failed';
    request.resultDesc = result.error?.errorMessage || 'STK Push failed';
    request.attempts += 1;
    request.lastAttemptAt = new Date();
    await request.save();
    throw ApiError.internal(request.resultDesc);
  }

  request.status = 'processing';
  request.merchantRequestId = result.merchantRequestId;
  request.checkoutRequestId = result.checkoutRequestId;
  request.attempts += 1;
  request.lastAttemptAt = new Date();
  request.raw = { ...request.raw, initiateResponse: result };
  await request.save();

  return ok(res, {
    message: 'STK Push sent. Customer will receive a prompt on their phone.',
    request,
  });
});

/* ============================================================
   Cancel
   ============================================================ */
exports.cancel = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');

  if (request.status === 'success') {
    throw ApiError.badRequest('Cannot cancel a completed payment');
  }

  request.status = 'cancelled';
  await request.save();
  return ok(res, request);
});

/* ============================================================
   Delete
   ============================================================ */
exports.remove = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findByIdAndDelete(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');
  return ok(res, { message: 'Payment request deleted' });
});

/* ============================================================
   PDF — Invoice (any status)
   ============================================================ */
exports.downloadInvoice = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');

  const brand = await getBrand();
  const invoiceNo = request.invoiceNumber || request.reference;
  const dateStr = new Date(request.createdAt).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const buffer = await buildTablePDF({
    title: 'INVOICE',
    meta: [
      { label: 'Invoice No', value: invoiceNo },
      { label: 'Date', value: dateStr },
      { label: 'Status', value: request.status.toUpperCase() },
    ],
    headers: [
      { key: 'description', label: 'Description', align: 'left' },
      { key: 'amount', label: 'Amount (KES)', align: 'right' },
    ],
    rows: [
      {
        description: request.description || 'Payment',
        amount: Number(request.amount).toLocaleString('en-KE', {
          minimumFractionDigits: 2,
        }),
      },
    ],
    brand,
    footerNote: `Invoice ${invoiceNo} · Issued ${dateStr}`,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${invoiceNo}.pdf"`);
  res.end(buffer);
});

/* ============================================================
   PDF — Receipt (success only)
   ============================================================ */
exports.downloadReceipt = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');

  if (request.status !== 'success') {
    throw ApiError.badRequest('Only successful payments have receipts');
  }

  const brand = await getBrand();
  const invoiceNo = request.invoiceNumber || request.reference;
  const paidAtStr = request.paidAt
    ? new Date(request.paidAt).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const buffer = await buildTablePDF({
    title: 'OFFICIAL RECEIPT',
    meta: [
      { label: 'Receipt No', value: request.mpesaReceiptNumber || '—' },
      { label: 'Invoice', value: invoiceNo },
      { label: 'Paid On', value: paidAtStr },
    ],
    headers: [
      { key: 'description', label: 'Description', align: 'left' },
      { key: 'amount', label: 'Amount Paid (KES)', align: 'right' },
    ],
    rows: [
      {
        description: request.description || 'Payment',
        amount: Number(request.amount).toLocaleString('en-KE', {
          minimumFractionDigits: 2,
        }),
      },
    ],
    brand,
    footerNote: `Receipt ${request.mpesaReceiptNumber || '—'} · Invoice ${invoiceNo}`,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="Receipt-${request.mpesaReceiptNumber || invoiceNo}.pdf"`
  );
  res.end(buffer);
});

/* ============================================================
   PDF — Statement (filtered or full)

   Query params:
     from   YYYY-MM-DD   (inclusive)
     to     YYYY-MM-DD   (inclusive)
     month  YYYY-MM      (overrides from/to)
     status success|pending|processing|failed|cancelled
   ============================================================ */
exports.downloadStatement = asyncHandler(async (req, res) => {
  const { from, to, month, status } = req.query;

  const filter = {};
  const periodLabel = [];

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, 0, 23, 59, 59));
    filter.createdAt = { $gte: start, $lte: end };
    periodLabel.push(
      start.toLocaleString('en-KE', { month: 'long', year: 'numeric' })
    );
  } else {
    if (from) {
      const d = new Date(from);
      if (!isNaN(d)) {
        d.setUTCHours(0, 0, 0, 0);
        filter.createdAt = { ...filter.createdAt, $gte: d };
        periodLabel.push(`from ${d.toLocaleDateString('en-KE')}`);
      }
    }
    if (to) {
      const d = new Date(to);
      if (!isNaN(d)) {
        d.setUTCHours(23, 59, 59, 999);
        filter.createdAt = { ...filter.createdAt, $lte: d };
        periodLabel.push(`to ${d.toLocaleDateString('en-KE')}`);
      }
    }
  }

  if (status) filter.status = status;

  const requests = await HdmPaymentRequest.find(filter).sort({ createdAt: 1 });

  const brand = await getBrand();

  const rows = requests.map((r) => ({
    date: new Date(r.createdAt).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    invoice: r.invoiceNumber || r.reference || '—',
    description: r.description || '—',
    status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
    amount: Number(r.amount).toLocaleString('en-KE', {
      minimumFractionDigits: 2,
    }),
  }));

  const totalSuccess = requests
    .filter((r) => r.status === 'success')
    .reduce((s, r) => s + Number(r.amount), 0);
  const totalPending = requests
    .filter((r) => ['pending', 'processing'].includes(r.status))
    .reduce((s, r) => s + Number(r.amount), 0);
  const totalFailed = requests
    .filter((r) => ['failed', 'cancelled'].includes(r.status))
    .reduce((s, r) => s + Number(r.amount), 0);

  rows.push({ date: '', invoice: '', description: '', status: '', amount: '' });
  rows.push({
    date: '',
    invoice: '',
    description: 'Total collected (success)',
    status: '',
    amount: totalSuccess.toLocaleString('en-KE', { minimumFractionDigits: 2 }),
  });
  rows.push({
    date: '',
    invoice: '',
    description: 'Total pending',
    status: '',
    amount: totalPending.toLocaleString('en-KE', { minimumFractionDigits: 2 }),
  });
  if (totalFailed > 0) {
    rows.push({
      date: '',
      invoice: '',
      description: 'Total failed / cancelled',
      status: '',
      amount: totalFailed.toLocaleString('en-KE', {
        minimumFractionDigits: 2,
      }),
    });
  }

  const periodText = periodLabel.length
    ? periodLabel.join(' ')
    : 'Full history';
  const statusText = status ? `Status: ${status}` : 'All statuses';

  const buffer = await buildTablePDF({
    title: 'PAYMENT STATEMENT',
    meta: [
      { label: 'Period', value: periodText },
      { label: 'Filter', value: statusText },
      { label: 'Records', value: String(requests.length) },
    ],
    headers: [
      { key: 'date', label: 'Date', align: 'left' },
      { key: 'invoice', label: 'Invoice', align: 'left' },
      { key: 'description', label: 'Description', align: 'left' },
      { key: 'status', label: 'Status', align: 'left' },
      { key: 'amount', label: 'Amount (KES)', align: 'right' },
    ],
    rows,
    brand,
    footerNote: `Statement · ${requests.length} record(s) · ${periodText}`,
  });

  const filename = `Statement-${periodText.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.end(buffer);
});