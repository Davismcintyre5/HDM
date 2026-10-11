const router = require('express').Router();
const ctrl = require('../../controllers/public/hdmAppsController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/', limiter.publicRead, ctrl.list);
router.get('/featured', limiter.publicRead, ctrl.featured);
router.get('/categories', limiter.publicRead, ctrl.categories);
router.get('/:slug', limiter.publicRead, ctrl.getBySlug);
router.post('/:id/like', limiter.global, ctrl.like);

module.exports = router;