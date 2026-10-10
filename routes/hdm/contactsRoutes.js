const router = require('express').Router();
const contactsController = require('../../controllers/hdm/contactsController');

router.get('/', contactsController.list);
router.get('/:id', contactsController.get);
router.put('/:id/read', contactsController.markRead);
router.put('/:id/archive', contactsController.archive);
router.delete('/:id', contactsController.remove);

module.exports = router;