const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmCompanyController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/', limiter.publicRead, ctrl.get);

module.exports = router;