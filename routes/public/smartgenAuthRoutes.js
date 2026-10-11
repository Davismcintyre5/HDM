const router = require('express').Router();
const ctrl = require('../../controllers/public/smartgenAuthController');
const limiter = require('../../middleware/global/rateLimiter');

router.post('/register', limiter.auth, ctrl.register);
router.post('/login', limiter.auth, ctrl.login);
router.get('/verify', limiter.publicRead, ctrl.verifyEmail);
router.post('/forgot-password', limiter.auth, ctrl.forgotPassword);
router.post('/reset-password', limiter.auth, ctrl.resetPassword);

module.exports = router;