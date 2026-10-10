const HdmBackup = require('../../models/hdm/Backup');
const HdmBackupSettings = require('../../models/hdm/BackupSettings');
const backupService = require('../../services/backupService');
const cloudinaryService = require('../../services/cloudinaryService');
const emailService = require('../../services/emailService');
const backupScheduler = require('../../schedulers/backupScheduler');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const backups = await HdmBackup.find().sort({ createdAt: -1 });
  return ok(res, backups);
});

exports.create = asyncHandler(async (req, res) => {
  const backup = await backupScheduler.runBackup('manual');
  if (!backup) throw ApiError.internal('Backup failed');
  return created(res, backup);
});

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');

  const result = await cloudinaryService.uploadRaw(
    req.file.buffer,
    req.file.originalname,
    'backups'
  );

  const backup = await HdmBackup.create({
    type: 'uploaded',
    fileName: req.file.originalname,
    fileUrl: result.secure_url,
    publicId: result.public_id,
    fileSize: req.file.size,
    collections: [],
    status: 'completed',
  });

  return created(res, backup);
});

exports.download = asyncHandler(async (req, res) => {
  const backup = await HdmBackup.findById(req.params.id);
  if (!backup) throw ApiError.notFound('Backup not found');
  res.setHeader('Content-Disposition', `attachment; filename="${backup.fileName}"`);
  return res.redirect(backup.fileUrl);
});

exports.sendToEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw ApiError.badRequest('Email required');

  const backup = await HdmBackup.findById(req.params.id);
  if (!backup) throw ApiError.notFound('Backup not found');

  await emailService.send({
    to: email,
    subject: `Backup — ${backup.fileName}`,
    html: `<p>Your backup file is ready.</p><p><a href="${backup.fileUrl}">Download ${backup.fileName}</a></p>`,
    text: `Download your backup: ${backup.fileUrl}`,
  });

  backup.emailSentTo = email;
  backup.emailSentAt = new Date();
  await backup.save();

  return ok(res, { message: 'Backup sent', backup });
});

exports.restore = asyncHandler(async (req, res) => {
  const backup = await HdmBackup.findById(req.params.id);
  if (!backup) throw ApiError.notFound('Backup not found');

  await backupService.restoreBackup(backup);
  return ok(res, { message: 'Backup restored' });
});

exports.remove = asyncHandler(async (req, res) => {
  const backup = await HdmBackup.findById(req.params.id);
  if (!backup) throw ApiError.notFound('Backup not found');

  await cloudinaryService.deleteFile(backup.publicId, 'raw').catch(() => {});
  await backup.deleteOne();
  return ok(res, { message: 'Backup deleted' });
});

exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await HdmBackupSettings.findOne();
  if (!settings) settings = await HdmBackupSettings.create({});
  return ok(res, settings);
});

exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await HdmBackupSettings.findOne();
  if (!settings) settings = new HdmBackupSettings();

  const allowed = ['enabled', 'frequency', 'time', 'retentionDays', 'maxBackups', 'emailOnCompletion', 'emailRecipient'];
  allowed.forEach((f) => {
    if (req.body[f] !== undefined) settings[f] = req.body[f];
  });

  await settings.save();
  await backupScheduler.restart();

  return ok(res, settings);
});

exports.cleanupNow = asyncHandler(async (req, res) => {
  const settings = await HdmBackupSettings.findOne() || {};
  await backupService.cleanupOldBackups({
    BackupModel: HdmBackup,
    maxBackups: settings.maxBackups ?? 10,
    retentionDays: settings.retentionDays ?? 30,
  });
  return ok(res, { message: 'Cleanup complete' });
});