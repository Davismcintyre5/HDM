const HdmApp = require('../../models/hdm/App');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = { isActive: true };
  if (category && category !== 'All') filter.category = category;
  if (featured === 'true') filter.featured = true;

  const apps = await HdmApp.find(filter).sort({ createdAt: -1 }).lean();
  return ok(res, apps);
});

exports.featured = asyncHandler(async (req, res) => {
  const apps = await HdmApp.find({ isActive: true, featured: true }).lean();
  return ok(res, apps);
});

exports.categories = asyncHandler(async (req, res) => {
  const categories = await HdmApp.distinct('category', { isActive: true });
  return ok(res, ['All', ...categories]);
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const app = await HdmApp.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!app) throw ApiError.notFound('App not found');
  return ok(res, app);
});

exports.like = asyncHandler(async (req, res) => {
  const app = await HdmApp.findByIdAndUpdate(
    req.params.id,
    { $inc: { likeCount: 1 } },
    { new: true }
  ).select('likeCount');

  if (!app) throw ApiError.notFound('App not found');
  return ok(res, { likeCount: app.likeCount });
});