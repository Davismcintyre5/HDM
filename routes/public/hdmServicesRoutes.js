const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmServicesController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/', limiter.publicRead, ctrl.list);

module.exports = router;