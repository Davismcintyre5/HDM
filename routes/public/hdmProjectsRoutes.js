const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmProjectsController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/', limiter.publicRead, ctrl.list);
router.get('/featured', limiter.publicRead, ctrl.featured);

module.exports = router;