const HdmPhoto = require('../../models/hdm/Photo');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category && category !== 'All') filter.category = category;

  const photos = await HdmPhoto.find(filter).sort({ createdAt: -1 }).lean();
  return ok(res, photos);
});