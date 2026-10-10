const router = require('express').Router();
const healthController = require('../../controllers/hdm/healthController');

router.get('/', healthController.getHealth);

module.exports = router;