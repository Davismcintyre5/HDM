const router = require('express').Router();
const ctrl = require('../../controllers/hdm/paymentRequestsController');
const limiter = require('../../middleware/global/rateLimiter');

router.get('/statement.pdf', ctrl.downloadStatement);

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.get('/:id/invoice.pdf', ctrl.downloadInvoice);
router.get('/:id/receipt.pdf', ctrl.downloadReceipt);
router.post('/', ctrl.create);
router.post('/:id/initiate', limiter.mpesa, ctrl.initiate);
router.post('/:id/cancel', ctrl.cancel);
router.delete('/:id', ctrl.remove);

module.exports = router;