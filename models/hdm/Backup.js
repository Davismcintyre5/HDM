const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  type: { type: String, enum: ['manual', 'auto', 'uploaded'], default: 'manual' },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  collections: [String],
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  errorMessage: { type: String, default: '' },
  emailSentTo: { type: String, default: '' },
  emailSentAt: { type: Date, default: null },
}, { timestamps: true, collection: 'hdm_backups' });

module.exports = mongoose.model('HdmBackup', backupSchema);