const HdmCompany = require('../../models/hdm/Company');
const HdmSettings = require('../../models/hdm/Settings');
const aiService = require('../../services/aiService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.getConfig = asyncHandler(async (req, res) => {
  const settings = await HdmSettings.findOne().lean();
  return ok(res, {
    enabled: settings?.ai?.enabled || false,
    greeting: settings?.ai?.greeting || "Hi! I'm SmartGen AI. Ask me about templates, forms, or saving documents.",
    widgetColor: settings?.ai?.widgetColor || '#b45309',
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

  const company = await HdmCompany.findOne().lean();

  const systemPrompt = aiService.buildSmartGenSystemPrompt({ company });

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