const router = require('express').Router();
const photosController = require('../../controllers/hdm/photosController');
const { imageUpload } = require('../../middleware/global/upload');

router.get('/', photosController.list);
router.post('/', imageUpload.single('photo'), photosController.create);
router.delete('/:id', photosController.remove);

module.exports = router;