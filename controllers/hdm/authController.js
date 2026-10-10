const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const HdmUser = require('../../models/hdm/User');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw ApiError.badRequest('Email and password required');

  const user = await HdmUser.findOne({ email: email.toLowerCase() });
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw ApiError.unauthorized('Invalid credentials');
  if (!user.isActive) throw ApiError.forbidden('Account is deactivated');
  if (!user.isAdmin) throw ApiError.forbidden('Not authorized as admin');

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '7d' });

  return ok(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  return ok(res, req.user);
});