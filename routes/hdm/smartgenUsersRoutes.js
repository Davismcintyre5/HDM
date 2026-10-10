const router = require('express').Router();
const smartgenUsersController = require('../../controllers/hdm/smartgenUsersController');

router.get('/', smartgenUsersController.list);
router.put('/:id/suspend', smartgenUsersController.suspend);
router.put('/:id/activate', smartgenUsersController.activate);
router.delete('/:id', smartgenUsersController.remove);

module.exports = router;