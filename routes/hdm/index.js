const router = require('express').Router();
const hdmAdminAuth = require('../../middleware/admin/hdmAdminAuth');
const authController = require('../../controllers/hdm/authController');

router.use('/auth', require('./authRoutes'));

router.use(hdmAdminAuth);

router.get('/auth/profile', authController.getProfile);
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/apps', require('./appsRoutes'));
router.use('/services', require('./servicesRoutes'));
router.use('/projects', require('./projectsRoutes'));
router.use('/photos', require('./photosRoutes'));
router.use('/contacts', require('./contactsRoutes'));
router.use('/company', require('./companyRoutes'));
router.use('/settings', require('./settingsRoutes'));
router.use('/backups', require('./backupRoutes'));
router.use('/cloudinary', require('./cloudinaryRoutes'));
router.use('/mongodb', require('./mongodbRoutes'));
router.use('/health', require('./healthRoutes'));
router.use('/smartgen-users', require('./smartgenUsersRoutes'));
router.use('/payment-requests', require('./paymentRequestsRoutes'));

module.exports = router;