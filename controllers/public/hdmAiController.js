const HdmCompany = require('../../models/hdm/Company');
const HdmService = require('../../models/hdm/Service');
const HdmApp = require('../../models/hdm/App');
const HdmProject = require('../../models/hdm/Project');
const HdmSettings = require('../../models/hdm/Settings');
const aiService = require('../../services/aiService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.getConfig = asyncHandler(async (req, res) => {
  const settings = await HdmSettings.findOne().lean();
  return ok(res, {
    enabled: settings?.ai?.enabled || false,
    greeting: settings?.ai?.greeting || "Hi! I'm HDM AI. Ask me about our services, apps, or projects.",
    widgetColor: settings?.ai?.widgetColor || '#1e6ef0',
    widgetPosition: settings?.ai?.widgetPosition || 'right',
  });
});

exports.chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) throw ApiError.badRequest('Message is required');

  const settings = await HdmSettings.findOne().lean();
  if (!settings?.ai?.enabled) {
    throw ApiError.notFound('AI chat is not enabled');
  }

  const [company, services, apps, projects] = await Promise.all([
    HdmCompany.findOne().lean(),
    HdmService.find({ isActive: true }).lean(),
    HdmApp.find({ isActive: true }).lean(),
    HdmProject.find({ isActive: true }).lean(),
  ]);

  const systemPrompt = aiService.buildHdmSystemPrompt({
    company,
    services,
    apps,
    projects,
  });

  const result = await aiService.chat({
    message: message.trim(),
    systemPrompt,
  });

  if (!result.ok) {
    throw ApiError.internal(result.error || 'AI service error');
  }

  return ok(res, {
    reply: result.reply,
    model: result.model,
    tokensUsed: result.tokensUsed,
  });
});