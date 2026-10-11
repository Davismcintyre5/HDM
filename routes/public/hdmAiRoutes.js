const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmAiController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/config', limiter.publicRead, ctrl.getConfig);
router.post('/chat', limiter.ai, ctrl.chat);

module.exports = router;