const bridge = require('../config/hdmBridge');
const env = require('../config/env');
const logger = require('../utils/logger');
const tpl = require('../templates/smsTemplates');
const { getBrand } = require('../utils/getBrand');

const send = async ({ to, content, sender, type = 'transactional' }) => {
  if (!env.smsEnabled) {
    return { ok: false, skipped: true, reason: 'SMS disabled' };
  }

  if (!to || !content) {
    return { ok: false, error: 'Missing required fields (to, content)' };
  }

  try {
    const result = await bridge.sendSMS({ to, content, sender, type });
    logger.info(`SMS → ${to} [${result.messageId || 'sent'}]`);
    return {
      ok: true,
      messageId: result.messageId,
      status: result.status,
      creditsUsed: result.creditsUsed,
    };
  } catch (err) {
    const message = err.response?.data?.error || err.message;
    const code = err.response?.data?.code || 'SMS_SEND_FAILED';
    logger.error(`SMS failed → ${to}: ${message} (${code})`);
    return { ok: false, error: message, code };
  }
};

const contactAlert = async ({ to, data }) => {
  if (!env.smsEnabled) return { ok: false, skipped: true };
  const brand = await getBrand();
  const template = tpl.contactAlert({ brand, ...data });
  return send({ to, content: template.message });
};

const smartgenVerify = async ({ to, data }) => {
  if (!env.smsEnabled) return { ok: false, skipped: true };
  const brand = await getBrand();
  const template = tpl.smartgenVerify({ brand, ...data });
  return send({ to, content: template.message });
};

const smartgenReset = async ({ to, data }) => {
  if (!env.smsEnabled) return { ok: false, skipped: true };
  const brand = await getBrand();
  const template = tpl.smartgenReset({ brand, ...data });
  return send({ to, content: template.message });
};

const backupFailedAlert = async ({ to, data }) => {
  if (!env.smsEnabled) return { ok: false, skipped: true };
  const brand = await getBrand();
  const template = tpl.backupFailedAlert({ brand, ...data });
  return send({ to, content: template.message });
};

const mongoStorageAlert = async ({ to, data }) => {
  if (!env.smsEnabled) return { ok: false, skipped: true };
  const brand = await getBrand();
  const template = tpl.mongoStorageAlert({ brand, ...data });
  return send({ to, content: template.message });
};

module.exports = {
  send,
  contactAlert,
  smartgenVerify,
  smartgenReset,
  backupFailedAlert,
  mongoStorageAlert,
};