const HdmPaymentRequest = require('../../models/hdm/PaymentRequest');
const mpesaService = require('../../services/mpesaService');
const smsService = require('../../services/smsService');
const logger = require('../../utils/logger');

exports.handleCallback = async (req, res) => {
  try {
    const parsed = mpesaService.parseCallback(req.body);

    if (!parsed.checkoutRequestId) {
      logger.warn('[mpesa] callback missing checkoutRequestId');
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Ignored' });
    }

    if (mpesaService.isDuplicateCallback(parsed.checkoutRequestId)) {
      logger.info(`[mpesa] duplicate callback ignored: ${parsed.checkoutRequestId}`);
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Duplicate' });
    }

    const request = await HdmPaymentRequest.findOne({
      checkoutRequestId: parsed.checkoutRequestId,
    });

    if (!request) {
      logger.warn(`[mpesa] no payment request for ${parsed.checkoutRequestId}`);
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Unknown' });
    }

    if (request.status === 'success') {
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Already processed' });
    }

    request.raw = { ...request.raw, callback: req.body };

    if (parsed.success) {
      request.status = 'success';
      request.mpesaReceiptNumber = parsed.mpesaReceiptNumber || '';
      request.resultCode = parsed.resultCode;
      request.resultDesc = parsed.resultDesc;
      request.paidAt = new Date();
      await request.save();

      const label = request.invoiceNumber || request.reference;
      logger.info(`[mpesa] payment success ${label} — receipt ${request.mpesaReceiptNumber}`);

      smsService.send({
        to: request.phone,
        content: `Payment of KES ${request.amount} received. Ref: ${label}. Receipt: ${request.mpesaReceiptNumber}. Thank you.`,
      }).then((r) => {
        if (r.ok) {
          HdmPaymentRequest.updateOne(
            { _id: request._id },
            { smsReceiptSent: true }
          ).catch(() => {});
        }
      }).catch(() => {});
    } else {
      request.status = 'failed';
      request.resultCode = parsed.resultCode;
      request.resultDesc = parsed.resultDesc;
      await request.save();
      const label = request.invoiceNumber || request.reference;
      logger.warn(`[mpesa] payment failed ${label}: ${parsed.resultDesc}`);
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Received' });
  } catch (error) {
    logger.error(`[mpesa] callback error: ${error.message}`);
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Processed' });
  }
};