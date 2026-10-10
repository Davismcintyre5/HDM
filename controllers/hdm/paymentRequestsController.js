const HdmPaymentRequest = require('../../models/hdm/PaymentRequest');
const mpesaService = require('../../services/mpesaService');
const smsService = require('../../services/smsService');
const invoiceNumberUtil = require('../../utils/invoiceNumber');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const requests = await HdmPaymentRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(200);

  const [total, pending, success, failed] = await Promise.all([
    HdmPaymentRequest.countDocuments(),
    HdmPaymentRequest.countDocuments({ status: 'pending' }),
    HdmPaymentRequest.countDocuments({ status: 'success' }),
    HdmPaymentRequest.countDocuments({ status: 'failed' }),
  ]);

  return ok(res, {
    requests,
    stats: { total, pending, success, failed },
  });
});

exports.get = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');
  return ok(res, request);
});

exports.create = asyncHandler(async (req, res) => {
  const { reference, description, phone, amount } = req.body;

  if (!phone || !amount) {
    throw ApiError.badRequest('phone and amount are required');
  }

  const invoiceNumber = await invoiceNumberUtil.generate();

  const request = await HdmPaymentRequest.create({
    invoiceNumber,
    reference: reference || invoiceNumber,
    description: description || '',
    phone: mpesaService.normalizePhone(phone),
    amount: Number(amount),
    createdBy: req.userId,
    status: 'pending',
  });

  return created(res, request, `Created ${invoiceNumber}`);
});

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

exports.remove = asyncHandler(async (req, res) => {
  const request = await HdmPaymentRequest.findByIdAndDelete(req.params.id);
  if (!request) throw ApiError.notFound('Payment request not found');
  return ok(res, { message: 'Payment request deleted' });
});