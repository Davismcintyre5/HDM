const axios = require('axios');
const env = require('./env');

const client = axios.create({
  baseURL: env.bridge.apiUrl,
  headers: {
    Authorization: `Bearer ${env.bridge.apiKey}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const sendEmail = async ({ to, subject, htmlBody, textBody, replyTo, from, fromName }) => {
  const { data } = await client.post('/emails/send', {
    from: from || env.bridge.fromEmail,
    fromName: fromName || env.bridge.fromName,
    to,
    subject,
    htmlBody,
    textBody,
    replyTo,
  });
  return data;
};

const sendSMS = async ({ to, content, sender, type = 'transactional' }) => {
  const { data } = await client.post('/sms/send', {
    to,
    content,
    sender: sender || env.bridge.smsSender,
    type,
  });
  return data;
};

module.exports = { sendEmail, sendSMS };