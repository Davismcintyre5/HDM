const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true, sparse: true, index: true },
  reference: { type: String, required: true, trim: true, index: true },
  description: { type: String, default: '' },
  phone: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 1 },

  status: {
    type: String,
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled'],
    default: 'pending',
    index: true,
  },

  merchantRequestId: { type: String, default: '' },
  checkoutRequestId: { type: String, default: '', index: true },
  mpesaReceiptNumber: { type: String, default: '' },
  resultCode: { type: String, default: '' },
  resultDesc: { type: String, default: '' },
  paidAt: { type: Date, default: null },

  attempts: { type: Number, default: 0 },
  lastAttemptAt: { type: Date, default: null },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HdmUser' },
  smsReceiptSent: { type: Boolean, default: false },

  raw: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, collection: 'hdm_payment_requests' });

paymentRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('HdmPaymentRequest', paymentRequestSchema);