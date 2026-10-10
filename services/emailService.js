const bridge = require('../config/hdmBridge');
const logger = require('../utils/logger');
const tpl = require('../templates/emailTemplates');
const { getBrand } = require('../utils/getBrand');

const send = async ({ to, subject, html, text, replyTo, from, fromName }) => {
  if (!to || !subject || !html) {
    return { ok: false, error: 'Missing required fields (to, subject, html)' };
  }

  try {
    const result = await bridge.sendEmail({
      to,
      subject,
      htmlBody: html,
      textBody: text,
      replyTo,
      from,
      fromName,
    });

    logger.info(`Email → ${to} [${result.messageId || 'queued'}]`);
    return { ok: true, messageId: result.messageId, status: result.status };
  } catch (err) {
    const message = err.response?.data?.error || err.message;
    const code = err.response?.data?.code || 'EMAIL_SEND_FAILED';
    logger.error(`Email failed → ${to}: ${message} (${code})`);
    return { ok: false, error: message, code };
  }
};

const enqueue = async ({ type, to, payload }) => {
  const HdmEmailJob = require('../models/hdm/EmailJob');
  await HdmEmailJob.create({ type, to, payload, status: 'pending' });
  logger.info(`Email queued for retry → ${to} [${type}]`);
};

const sendOrQueue = async ({ to, template, type }) => {
  const payload = { to, ...template };
  const result = await send(payload);
  if (!result.ok) {
    await enqueue({ type, to, payload });
  }
  return result;
};

const contactAdminNotification = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.contactAdminNotification({ brand, ...data });
  return sendOrQueue({ to, template, type: 'contactAdminNotification' });
};

const contactAutoReply = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.contactAutoReply({ brand, ...data });
  return sendOrQueue({ to, template, type: 'contactAutoReply' });
};

const backupCompleted = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.backupCompleted({ brand, ...data });
  return sendOrQueue({ to, template, type: 'backupCompleted' });
};

const backupFailed = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.backupFailed({ brand, ...data });
  return sendOrQueue({ to, template, type: 'backupFailed' });
};

const mongoStorageAlert = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.mongoStorageAlert({ brand, ...data });
  return sendOrQueue({ to, template, type: 'mongoStorageAlert' });
};

const smartgenWelcomeVerify = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.smartgenWelcomeVerify({ brand, ...data });
  return sendOrQueue({ to, template, type: 'smartgenWelcomeVerify' });
};

const smartgenPasswordReset = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.smartgenPasswordReset({ brand, ...data });
  return sendOrQueue({ to, template, type: 'smartgenPasswordReset' });
};

const hdmAdminWelcome = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.hdmAdminWelcome({ brand, ...data });
  return sendOrQueue({ to, template, type: 'hdmAdminWelcome' });
};

const smartgenAdminWelcome = async ({ to, data }) => {
  const brand = await getBrand();
  const template = tpl.smartgenAdminWelcome({ brand, ...data });
  return sendOrQueue({ to, template, type: 'smartgenAdminWelcome' });
};

module.exports = {
  send,
  enqueue,
  sendOrQueue,
  contactAdminNotification,
  contactAutoReply,
  backupCompleted,
  backupFailed,
  mongoStorageAlert,
  smartgenWelcomeVerify,
  smartgenPasswordReset,
  hdmAdminWelcome,
  smartgenAdminWelcome,
};