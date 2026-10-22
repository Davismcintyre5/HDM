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

const handleAssetUpload = async (req, res, field) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');

  const folder =
    field === 'stampUrl' ? 'stamps' :
    field === 'sealUrl' ? 'seals' :
    'logos';

  const result = await cloudinaryService.uploadFile(
    req.file.buffer,
    req.file.originalname,
    folder
  );

  let company = await HdmCompany.findOne();
  if (!company) company = new HdmCompany();

  const publicIdField = field.replace('Url', 'PublicId');
  if (company[field] && company[publicIdField]) {
    await cloudinaryService.deleteFile(company[publicIdField]).catch(() => {});
  }

  company[field] = result.secure_url;
  company[publicIdField] = result.public_id;
  await company.save();

  invalidateBrandCache();
  return ok(res, { [field]: company[field] });
};

exports.uploadLogo = asyncHandler(async (req, res) =>
  handleAssetUpload(req, res, 'logo')
);
exports.uploadLogoDark = asyncHandler(async (req, res) =>
  handleAssetUpload(req, res, 'logoDark')
);
exports.uploadFavicon = asyncHandler(async (req, res) =>
  handleAssetUpload(req, res, 'favicon')
);
exports.uploadStamp = asyncHandler(async (req, res) =>
  handleAssetUpload(req, res, 'stampUrl')
);
exports.uploadSeal = asyncHandler(async (req, res) =>
  handleAssetUpload(req, res, 'sealUrl')
);