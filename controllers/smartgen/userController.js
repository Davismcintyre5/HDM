const SmartGenUser = require('../../models/smartgen/User');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) throw ApiError.badRequest('Name is required');

  const user = await SmartGenUser.findByIdAndUpdate(
    req.userId,
    { name: name.trim() },
    { new: true }
  ).select('-password');

  if (!user) throw ApiError.notFound('User not found');
  return ok(res, user);
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw ApiError.badRequest('Current and new passwords are required');
  }
  if (newPassword.length < 6) {
    throw ApiError.badRequest('New password must be at least 6 characters');
  }

  const user = await SmartGenUser.findById(req.userId);
  if (!user) throw ApiError.notFound('User not found');

  const match = await user.comparePassword(oldPassword);
  if (!match) throw ApiError.badRequest('Current password is incorrect');

  user.password = newPassword;
  await user.save();

  return ok(res, { message: 'Password changed successfully' });
});