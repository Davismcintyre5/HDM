const router = require('express').Router();
const smartgenAuth = require('../../middleware/client/smartgenAuth');

router.use(smartgenAuth);

router.use('/auth', require('./authRoutes'));
router.use('/documents', require('./documentRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;