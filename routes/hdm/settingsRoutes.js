const router = require('express').Router();
const settingsController = require('../../controllers/hdm/settingsController');

router.get('/', settingsController.get);
router.put('/', settingsController.update);

module.exports = router;