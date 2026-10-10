const HdmService = require('../../models/hdm/Service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const services = await HdmService.find().sort({ order: 1 });
  return ok(res, services);
});

exports.create = asyncHandler(async (req, res) => {
  const { title, description, icon, order, isActive } = req.body;
  if (!title) throw ApiError.badRequest('Title is required');

  const service = await HdmService.create({
    title,
    description: description || '',
    icon: icon || '⚡',
    order: Number(order) || 0,
    isActive: isActive !== false,
  });

  return created(res, service);
});

exports.update = asyncHandler(async (req, res) => {
  const service = await HdmService.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) throw ApiError.notFound('Service not found');
  return ok(res, service);
});

exports.remove = asyncHandler(async (req, res) => {
  const service = await HdmService.findByIdAndDelete(req.params.id);
  if (!service) throw ApiError.notFound('Service not found');
  return ok(res, { message: 'Service deleted' });
});