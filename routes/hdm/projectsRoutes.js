const router = require('express').Router();
const projectsController = require('../../controllers/hdm/projectsController');

router.get('/', projectsController.list);
router.post('/', projectsController.create);
router.put('/:id', projectsController.update);
router.delete('/:id', projectsController.remove);

module.exports = router;