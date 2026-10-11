const router = require('express').Router();
const ctrl = require('../../controllers/public/mpesaCallbackController');
const limiter = require('../../middleware/global/rateLimiter');

router.post('/mpesa/callback', limiter.global, ctrl.handleCallback);

module.exports = router;