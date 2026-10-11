const router = require('express').Router();
const ctrl = require('../../controllers/public/smartgenSiteController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/', limiter.publicRead, ctrl.getConfig);

module.exports = router;