const SmartGenUser = require('../../models/smartgen/User');
const SmartGenDocument = require('../../models/smartgen/Document');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.list = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status === 'active') filter.isActive = true;
  else if (status === 'suspended') filter.isActive = false;

  const users = await SmartGenUser.find(filter)
    .select('name email isActive createdAt lastLogin emailVerified role')
    .sort({ createdAt: -1 })
    .lean();

  const [total, active, suspended, verified] = await Promise.all([
    SmartGenUser.countDocuments(),
    SmartGenUser.countDocuments({ isActive: true }),
    SmartGenUser.countDocuments({ isActive: false }),
    SmartGenUser.countDocuments({ emailVerified: true }),
  ]);

  return ok(res, {
    users: users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      emailVerified: u.emailVerified,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin || null,
    })),
    stats: { total, active, suspended, verified },
  });
});

exports.suspend = asyncHandler(async (req, res) => {
  const user = await SmartGenUser.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  ).select('name email isActive');

  if (!user) throw ApiError.notFound('SmartGen user not found');
  return ok(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
  });
});

exports.activate = asyncHandler(async (req, res) => {
  const user = await SmartGenUser.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  ).select('name email isActive');

  if (!user) throw ApiError.notFound('SmartGen user not found');
  return ok(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const user = await SmartGenUser.findById(req.params.id).select('name email');
  if (!user) throw ApiError.notFound('SmartGen user not found');

  const deletedDocs = await SmartGenDocument.deleteMany({ user: user._id });
  await SmartGenUser.findByIdAndDelete(user._id);

  return ok(res, {
    message: `Deleted ${user.name} and ${deletedDocs.deletedCount} document(s)`,
    deletedDocuments: deletedDocs.deletedCount,
  });
});