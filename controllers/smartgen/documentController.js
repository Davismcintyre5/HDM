const SmartGenDocument = require('../../models/smartgen/Document');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const docs = await SmartGenDocument.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .lean();
  return ok(res, docs);
});

exports.get = asyncHandler(async (req, res) => {
  const doc = await SmartGenDocument.findOne({
    _id: req.params.id,
    user: req.userId,
  });
  if (!doc) throw ApiError.notFound('Document not found');
  return ok(res, doc);
});

exports.create = asyncHandler(async (req, res) => {
  const { templateId, templateName, formData } = req.body;

  if (!templateId || !templateName) {
    throw ApiError.badRequest('templateId and templateName are required');
  }

  const doc = await SmartGenDocument.create({
    user: req.userId,
    templateId,
    templateName,
    formData: formData || {},
  });

  return created(res, doc);
});

exports.update = asyncHandler(async (req, res) => {
  const doc = await SmartGenDocument.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { formData: req.body.formData || {} },
    { new: true }
  );

  if (!doc) throw ApiError.notFound('Document not found');
  return ok(res, doc);
});

exports.remove = asyncHandler(async (req, res) => {
  const doc = await SmartGenDocument.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!doc) throw ApiError.notFound('Document not found');
  return ok(res, { message: 'Document deleted' });
});