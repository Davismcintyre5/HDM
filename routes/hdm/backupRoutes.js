const router = require('express').Router();
const backupController = require('../../controllers/hdm/backupController');
const { backupUpload } = require('../../middleware/global/upload');

router.get('/settings', backupController.getSettings);
router.put('/settings', backupController.updateSettings);
router.post('/cleanup', backupController.cleanupNow);

router.get('/', backupController.list);
router.post('/', backupController.create);
router.post('/upload', backupUpload.single('file'), backupController.upload);
router.get('/:id/download', backupController.download);
router.post('/:id/send', backupController.sendToEmail);
router.post('/:id/restore', backupController.restore);
router.delete('/:id', backupController.remove);

module.exports = router;