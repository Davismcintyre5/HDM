const router = require('express').Router();

router.use('/hdm/api/admin', require('./hdm'));

router.use('/hdm/api/payments', require('./public/mpesaCallbackRoutes'));   // ← ADD THIS

router.use('/hdm/api/ai', require('./public/hdmAiRoutes'));
router.use('/hdm/api/apps', require('./public/hdmAppsRoutes'));
router.use('/hdm/api/company', require('./public/hdmCompanyRoutes'));
router.use('/hdm/api/contact', require('./public/hdmContactRoutes'));
router.use('/hdm/api/photos', require('./public/hdmPhotosRoutes'));
router.use('/hdm/api/projects', require('./public/hdmProjectsRoutes'));
router.use('/hdm/api/services', require('./public/hdmServicesRoutes'));

router.use('/smartgen/api/auth', require('./public/smartgenAuthRoutes'));
router.use('/smartgen/api/site', require('./public/smartgenSiteRoutes'));
router.use('/smartgen/api/ai', require('./public/smartgenAiRoutes'));

router.use('/smartgen/api', require('./smartgen'));

module.exports = router;