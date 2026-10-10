const router = require('express').Router();
const ctrl = require('../../controllers/public/mpesaCallbackController');

router.post('/mpesa/callback', ctrl.handleCallback);

module.exports = router;