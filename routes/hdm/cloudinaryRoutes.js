const router = require('express').Router();
const cloudinaryController = require('../../controllers/hdm/cloudinaryController');
const { imageUpload } = require('../../middleware/global/upload');

router.get('/stats', cloudinaryController.stats);
router.get('/folders', cloudinaryController.folders);
router.get('/folders/*', cloudinaryController.folderContents);
router.get('/file', cloudinaryController.file);
router.delete('/file', cloudinaryController.deleteFile);
router.post('/upload', imageUpload.single('file'), cloudinaryController.upload);
router.post('/folder', cloudinaryController.createFolder);
router.delete('/folder', cloudinaryController.deleteFolder);
router.post('/rename', cloudinaryController.rename);

module.exports = router;