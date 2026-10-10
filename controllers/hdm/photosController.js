const HdmPhoto = require('../../models/hdm/Photo');
const cloudinaryService = require('../../services/cloudinaryService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const photos = await HdmPhoto.find().sort({ createdAt: -1 });
  return ok(res, photos);
});

exports.create = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No photo uploaded');

  const result = await cloudinaryService.uploadFile(req.file.buffer, req.file.originalname, 'photos');

  const photo = await HdmPhoto.create({
    title: req.body.title || '',
    url: result.secure_url,
    publicId: result.public_id,
    category: req.body.category || 'General',
  });

  return created(res, photo);
});

exports.remove = asyncHandler(async (req, res) => {
  const photo = await HdmPhoto.findById(req.params.id);
  if (!photo) throw ApiError.notFound('Photo not found');

  if (photo.publicId) {
    await cloudinaryService.deleteFile(photo.publicId).catch(() => {});
  }

  await photo.deleteOne();
  return ok(res, { message: 'Photo deleted' });
});