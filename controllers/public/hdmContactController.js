const HdmContact = require('../../models/hdm/Contact');
const HdmCompany = require('../../models/hdm/Company');
const emailService = require('../../services/emailService');
const smsService = require('../../services/smsService');
const env = require('../../config/env');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { created } = require('../../utils/apiResponse');
const { validateEmail } = require('../../utils/helpers');

exports.submit = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    throw ApiError.badRequest('All fields are required');
  }
  if (!validateEmail(email)) {
    throw ApiError.badRequest('Invalid email address');
  }

  const contact = await HdmContact.create({ name, email, message });

  const company = await HdmCompany.findOne().lean();
  const receivedAt = new Date().toISOString();

  emailService.contactAdminNotification({
    to: company?.email || env.adminEmail,
    data: {
      name,
      email,
      message,
      receivedAt,
      adminUrl: `${env.adminUrl}/contacts`,
    },
  }).catch(() => {});

  if (validateEmail(email)) {
    emailService.contactAutoReply({
      to: email,
      data: { name, message },
    }).catch(() => {});
  }

  if (env.smsEnabled && company?.phone) {
    smsService.contactAlert({
      to: company.phone,
      data: { name, phone: email, preview: message.slice(0, 80) },
    }).catch(() => {});
  }

  return created(res, { id: contact._id }, 'Message sent');
});