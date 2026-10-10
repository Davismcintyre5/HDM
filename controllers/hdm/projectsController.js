const HdmProject = require('../../models/hdm/Project');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const projects = await HdmProject.find().sort({ order: 1 });
  return ok(res, projects);
});

exports.create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw ApiError.badRequest('Name is required');

  const project = await HdmProject.create(req.body);
  return created(res, project);
});

exports.update = asyncHandler(async (req, res) => {
  const project = await HdmProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) throw ApiError.notFound('Project not found');
  return ok(res, project);
});

exports.remove = asyncHandler(async (req, res) => {
  const project = await HdmProject.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Project not found');
  return ok(res, { message: 'Project deleted' });
});