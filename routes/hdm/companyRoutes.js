const router = require('express').Router();
const companyController = require('../../controllers/hdm/companyController');
const { imageUpload } = require('../../middleware/global/upload');

router.get('/', companyController.get);
router.put('/', companyController.update);

router.post('/logo', imageUpload.single('logo'), companyController.uploadLogo);
router.post('/logo-dark', imageUpload.single('logo'), companyController.uploadLogoDark);
router.post('/favicon', imageUpload.single('icon'), companyController.uploadFavicon);
router.post('/stamp', imageUpload.single('stamp'), companyController.uploadStamp);
router.post('/seal', imageUpload.single('seal'), companyController.uploadSeal);

module.exports = router;