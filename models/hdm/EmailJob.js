const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  type: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  to: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  lastError: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'sending', 'sent', 'failed'], default: 'pending' },
  nextAttemptAt: { type: Date, default: Date.now },
}, { timestamps: true, collection: 'hdm_email_jobs' });

jobSchema.index({ status: 1, nextAttemptAt: 1 });

module.exports = mongoose.model('HdmEmailJob', jobSchema);