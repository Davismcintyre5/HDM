const HdmCompany = require('../../models/hdm/Company');
const HdmSettings = require('../../models/hdm/Settings');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');

exports.getConfig = asyncHandler(async (req, res) => {
  const [company, settings] = await Promise.all([
    HdmCompany.findOne().lean(),
    HdmSettings.findOne().lean(),
  ]);

  return ok(res, {
    support: {
      email: company?.email || '',
      phone: company?.phone || '',
      whatsapp: company?.whatsapp || '',
    },
    ai: {
      enabled: settings?.ai?.enabled || false,
      greeting: settings?.ai?.greeting || '',
      widgetColor: settings?.ai?.widgetColor || '#1e6ef0',
    },
    brand: {
      name: company?.name || 'HDM Technologies',
      logo: company?.logo || '',
    },
  });
});