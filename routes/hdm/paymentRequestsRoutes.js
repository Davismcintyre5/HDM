const router = require('express').Router();
const ctrl = require('../../controllers/hdm/paymentRequestsController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.post('/:id/initiate', ctrl.initiate);
router.post('/:id/cancel', ctrl.cancel);
router.delete('/:id', ctrl.remove);

module.exports = router;