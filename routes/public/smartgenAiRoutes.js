const router = require('express').Router();
const ctrl = require('../../controllers/public/smartgenAiController');
const rateLimiter = require('../../middleware/global/rateLimiter');

router.get('/config', rateLimiter.publicRead, ctrl.getConfig);
router.post('/chat', rateLimiter.ai, ctrl.chat);

module.exports = router;