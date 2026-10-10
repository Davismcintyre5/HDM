const router = require('express').Router();
const servicesController = require('../../controllers/hdm/servicesController');

router.get('/', servicesController.list);
router.post('/', servicesController.create);
router.put('/:id', servicesController.update);
router.delete('/:id', servicesController.remove);

module.exports = router;