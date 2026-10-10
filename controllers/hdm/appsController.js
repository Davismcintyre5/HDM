const HdmApp = require('../../models/hdm/App');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');
const { slugify } = require('../../utils/helpers');

const CATEGORIES = ['Web Apps', 'Mobile', 'Desktop', 'APIs', 'Games', 'Open Source', 'Security', 'Other'];

exports.list = asyncHandler(async (req, res) => {
  const apps = await HdmApp.find().sort({ createdAt: -1 });
  return ok(res, apps);
});

exports.get = asyncHandler(async (req, res) => {
  const app = await HdmApp.findById(req.params.id);
  if (!app) throw ApiError.notFound('App not found');
  return ok(res, app);
});

exports.create = asyncHandler(async (req, res) => {
  const { name, category, description, shortDescription, technologies, urls, features, featured, rating, version } = req.body;

  if (!name) throw ApiError.badRequest('Name is required');

  const app = await HdmApp.create({
    name,
    slug: slugify(name),
    category: CATEGORIES.includes(category) ? category : 'Web Apps',
    description: description || '',
    shortDescription: shortDescription || '',
    technologies: technologies || [],
    urls: urls || {},
    features: features || [],
    featured: !!featured,
    rating: Math.min(Math.max(Number(rating) || 0, 0), 5),
    version: version || '1.0.0',
  });

  return created(res, app);
});

exports.update = asyncHandler(async (req, res) => {
  const { name, category, rating, ...rest } = req.body;

  if (name) {
    rest.name = name;
    rest.slug = slugify(name);
  }
  if (category) rest.category = CATEGORIES.includes(category) ? category : 'Web Apps';
  if (rating !== undefined) rest.rating = Math.min(Math.max(Number(rating) || 0, 0), 5);

  const app = await HdmApp.findByIdAndUpdate(req.params.id, rest, { new: true });
  if (!app) throw ApiError.notFound('App not found');
  return ok(res, app);
});

exports.remove = asyncHandler(async (req, res) => {
  const app = await HdmApp.findByIdAndDelete(req.params.id);
  if (!app) throw ApiError.notFound('App not found');
  return ok(res, { message: 'App deleted' });
});