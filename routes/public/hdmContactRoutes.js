const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmContactController');
const limiter = require('../../middleware/global/rateLimiter');

router.post('/', limiter.contact, ctrl.submit);

module.exports = router;