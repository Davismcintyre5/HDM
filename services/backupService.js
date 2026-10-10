const axios = require('axios');
const { getDB } = require('../config/db');
const cloudinaryService = require('./cloudinaryService');
const logger = require('../utils/logger');

const performBackup = async ({ BackupModel, name = 'hdm', type = 'auto' }) => {
  const db = getDB();
  const collections = await db.db.listCollections().toArray();
  const names = collections.map((c) => c.name).filter((n) => !n.startsWith('system.'));

  const data = {};
  for (const col of names) {
    data[col] = await db.db.collection(col).find({}).toArray();
  }

  const json = JSON.stringify(data, null, 2);
  const buffer = Buffer.from(json, 'utf8');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${type}_${timestamp}.json`;

  const upload = await cloudinaryService.uploadRaw(buffer, filename, 'backups');

  const backup = await BackupModel.create({
    type,
    fileName: filename,
    fileUrl: upload.secure_url,
    publicId: upload.public_id,
    fileSize: buffer.length,
    collections: names,
    status: 'completed',
  });

  logger.info(`Backup created: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return backup;
};

const cleanupOldBackups = async ({ BackupModel, maxBackups = 10, retentionDays = 30 }) => {
  try {
    const all = await BackupModel.find({ type: 'auto' }).sort({ createdAt: -1 });

    if (maxBackups > 0 && all.length > maxBackups) {
      const toDelete = all.slice(maxBackups);
      for (const b of toDelete) {
        await cloudinaryService.deleteFile(b.publicId, 'raw').catch(() => {});
        await b.deleteOne();
      }
      if (toDelete.length) logger.info(`Cleaned ${toDelete.length} backups (max count)`);
    }

    if (retentionDays > 0) {
      const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
      const expired = await BackupModel.find({ createdAt: { $lt: cutoff } });
      for (const b of expired) {
        await cloudinaryService.deleteFile(b.publicId, 'raw').catch(() => {});
        await b.deleteOne();
      }
      if (expired.length) logger.info(`Cleaned ${expired.length} backups (retention)`);
    }
  } catch (err) {
    logger.error(`Backup cleanup failed: ${err.message}`);
  }
};

const restoreBackup = async (backup) => {
  const db = getDB();

  const { data } = await axios.get(backup.fileUrl, { responseType: 'arraybuffer' });
  const parsed = JSON.parse(Buffer.from(data).toString('utf8'));

  for (const [col, docs] of Object.entries(parsed)) {
    if (!docs.length) continue;
    await db.db.collection(col).deleteMany({});
    await db.db.collection(col).insertMany(docs);
  }

  logger.info(`Backup restored: ${backup.fileName}`);
  return true;
};

module.exports = { performBackup, cleanupOldBackups, restoreBackup };