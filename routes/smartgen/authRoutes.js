const router = require('express').Router();
const ctrl = require('../../controllers/public/smartgenAuthController');

router.get('/me', ctrl.getMe);
router.post('/resend-verification', ctrl.resendVerification);

module.exports = router;