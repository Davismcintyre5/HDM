const mongoose = require('mongoose');

const backupSettingsSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  time: { type: String, default: '02:00' },
  retentionDays: { type: Number, default: 30 },
  maxBackups: { type: Number, default: 10 },
  lastAutoBackup: { type: Date, default: null },
}, { timestamps: true, collection: 'hdm_backup_settings' });

module.exports = mongoose.model('HdmBackupSettings', backupSettingsSchema);