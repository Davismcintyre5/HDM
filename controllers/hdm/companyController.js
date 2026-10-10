const HdmCompany = require('../../models/hdm/Company');
const cloudinaryService = require('../../services/cloudinaryService');
const { invalidateBrandCache } = require('../../utils/getBrand');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.get = asyncHandler(async (req, res) => {
  let company = await HdmCompany.findOne();
  if (!company) company = await HdmCompany.create({});
  return ok(res, company);
});

exports.update = asyncHandler(async (req, res) => {
  let company = await HdmCompany.findOne();
  if (!company) company = new HdmCompany();

  Object.assign(company, req.body);
  await company.save();

  invalidateBrandCache();
  return ok(res, company);
});

const handleLogo = async (req, res, field) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');

  const result = await cloudinaryService.uploadFile(req.file.buffer, req.file.originalname, 'logos');

  let company = await HdmCompany.findOne();
  if (!company) company = new HdmCompany();

  if (company[field] && company[`${field}PublicId`]) {
    await cloudinaryService.deleteFile(company[`${field}PublicId`]).catch(() => {});
  }

  company[field] = result.secure_url;
  await company.save();

  invalidateBrandCache();
  return ok(res, { [field]: company[field] });
};

exports.uploadLogo = asyncHandler(async (req, res) => handleLogo(req, res, 'logo'));
exports.uploadLogoDark = asyncHandler(async (req, res) => handleLogo(req, res, 'logoDark'));
exports.uploadFavicon = asyncHandler(async (req, res) => handleLogo(req, res, 'favicon'));