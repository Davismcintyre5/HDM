const router = require('express').Router();
const ctrl = require('../../controllers/hdm/communicationsController');
const { imageUpload } = require('../../middleware/global/upload');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.post('/:id/regenerate', ctrl.regenerateAdvert);
router.post('/:id/publish', ctrl.publish);
router.post('/:id/unpublish', ctrl.unpublish);
router.post('/:id/archive', ctrl.archive);

router.post('/:id/images', imageUpload.single('image'), ctrl.uploadImage);
router.delete('/:id/images/:publicId', ctrl.removeImage);

router.post('/:id/send-email', ctrl.sendEmail);
router.post('/:id/send-sms', ctrl.sendSms);

module.exports = router;