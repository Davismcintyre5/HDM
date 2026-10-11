const HdmCompany = require('../../models/hdm/Company');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.get = asyncHandler(async (req, res) => {
  const company = await HdmCompany.findOne().lean();
  if (!company) throw ApiError.notFound('Company info not available');
  return ok(res, company);
});