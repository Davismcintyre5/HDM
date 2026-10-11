const HdmService = require('../../models/hdm/Service');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const services = await HdmService.find({ isActive: true }).sort({ order: 1 }).lean();
  return ok(res, services);
});