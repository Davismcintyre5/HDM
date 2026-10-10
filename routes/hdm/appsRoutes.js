const router = require('express').Router();
const appsController = require('../../controllers/hdm/appsController');

router.get('/', appsController.list);
router.get('/:id', appsController.get);
router.post('/', appsController.create);
router.put('/:id', appsController.update);
router.delete('/:id', appsController.remove);

module.exports = router;