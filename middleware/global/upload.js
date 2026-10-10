const multer = require('multer');

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const BACKUP_TYPES = [
  'application/json',
  'text/json',
  'text/plain',
  'application/octet-stream',
  '',
];

const makeUpload = (allowed, maxMB) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type. Allowed: ${allowed.join(', ')}`));
      }
      cb(null, true);
    },
  });

module.exports = {
  imageUpload: makeUpload(IMAGE_TYPES, 10),
  backupUpload: makeUpload(BACKUP_TYPES, 100),
};