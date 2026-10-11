const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmPhotosController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/', limiter.publicRead, ctrl.list);

module.exports = router;