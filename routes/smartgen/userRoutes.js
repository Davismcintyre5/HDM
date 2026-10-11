const router = require('express').Router();
const ctrl = require('../../controllers/smartgen/userController');

router.put('/profile', ctrl.updateProfile);
router.put('/password', ctrl.changePassword);

module.exports = router;