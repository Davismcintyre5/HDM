const HdmSettings = require('../../models/hdm/Settings');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');

exports.get = asyncHandler(async (req, res) => {
  let settings = await HdmSettings.findOne();
  if (!settings) settings = await HdmSettings.create({});
  return ok(res, settings);
});

exports.update = asyncHandler(async (req, res) => {
  let settings = await HdmSettings.findOne();
  if (!settings) settings = new HdmSettings();

  if (req.body.ai) {
    settings.ai = { ...settings.ai.toObject?.() ?? settings.ai, ...req.body.ai };
  }

  await settings.save();
  return ok(res, settings);
});