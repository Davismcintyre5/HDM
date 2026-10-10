const router = require('express').Router();
const dashboardController = require('../../controllers/hdm/dashboardController');

router.get('/', dashboardController.getStats);

module.exports = router;