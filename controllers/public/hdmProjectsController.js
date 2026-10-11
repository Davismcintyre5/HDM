const HdmProject = require('../../models/hdm/Project');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const projects = await HdmProject.find({ isActive: true }).sort({ order: 1 }).lean();
  return ok(res, projects);
});

exports.featured = asyncHandler(async (req, res) => {
  const projects = await HdmProject.find({ isActive: true, featured: true }).lean();
  return ok(res, projects);
});