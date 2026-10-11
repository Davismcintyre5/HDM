const crypto = require('crypto');
const SmartGenUser = require('../../models/smartgen/User');
const emailService = require('../../services/emailService');
const env = require('../../config/env');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok, created } = require('../../utils/apiResponse');
const { generateToken } = require('../../utils/generateToken');
const { validateEmail } = require('../../utils/helpers');

const VERIFY_EXPIRY_HOURS = 24;
const RESET_EXPIRY_HOURS = 1;

const makeToken = () => crypto.randomBytes(32).toString('hex');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw ApiError.badRequest('Name, email and password are required');
  }
  if (!validateEmail(email)) {
    throw ApiError.badRequest('Invalid email address');
  }
  if (password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters');
  }

  const exists = await SmartGenUser.findOne({ email: email.toLowerCase() });
  if (exists) throw ApiError.conflict('Email already registered');

  const verifyToken = makeToken();
  const verifyExpires = new Date(Date.now() + VERIFY_EXPIRY_HOURS * 60 * 60 * 1000);

  const user = await SmartGenUser.create({
    name,
    email,
    password,
    role: 'user',
    isActive: true,
    emailVerified: false,
    emailVerifyToken: verifyToken,
    emailVerifyExpires: verifyExpires,
  });

  const verifyUrl = `${env.smartgenUrl}/verify?token=${verifyToken}`;

  emailService.smartgenWelcomeVerify({
    to: email,
    data: { name, verifyUrl, expiresInHours: VERIFY_EXPIRY_HOURS },
  }).catch(() => {});

  const token = generateToken({ id: user._id });

  return created(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const user = await SmartGenUser.findOne({ email: email.toLowerCase() });
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw ApiError.unauthorized('Invalid credentials');
  if (!user.isActive) throw ApiError.forbidden('Account is deactivated');

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({ id: user._id });

  return ok(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await SmartGenUser.findById(req.userId).select('-password');
  return ok(res, user);
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw ApiError.badRequest('Token required');

  const user = await SmartGenUser.findOne({
    emailVerifyToken: token,
    emailVerifyExpires: { $gt: new Date() },
  });

  if (!user) throw ApiError.badRequest('Invalid or expired verification link');

  user.emailVerified = true;
  user.emailVerifyToken = null;
  user.emailVerifyExpires = null;
  await user.save();

  return ok(res, { message: 'Email verified successfully' });
});

exports.resendVerification = asyncHandler(async (req, res) => {
  const user = await SmartGenUser.findById(req.userId);
  if (!user) throw ApiError.notFound('User not found');
  if (user.emailVerified) throw ApiError.badRequest('Email already verified');

  const verifyToken = makeToken();
  const verifyExpires = new Date(Date.now() + VERIFY_EXPIRY_HOURS * 60 * 60 * 1000);

  user.emailVerifyToken = verifyToken;
  user.emailVerifyExpires = verifyExpires;
  await user.save();

  const verifyUrl = `${env.smartgenUrl}/verify?token=${verifyToken}`;

  await emailService.smartgenWelcomeVerify({
    to: user.email,
    data: { name: user.name, verifyUrl, expiresInHours: VERIFY_EXPIRY_HOURS },
  });

  return ok(res, { message: 'Verification email sent' });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw ApiError.badRequest('Email required');

  const user = await SmartGenUser.findOne({ email: email.toLowerCase() });

  if (user) {
    const resetToken = makeToken();
    const resetExpires = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await user.save();

    const resetUrl = `${env.smartgenUrl}/reset?token=${resetToken}`;

    emailService.smartgenPasswordReset({
      to: user.email,
      data: { name: user.name, resetUrl, expiresInHours: RESET_EXPIRY_HOURS },
    }).catch(() => {});
  }

  return ok(res, {
    message: 'If that email exists, a reset link has been sent.',
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw ApiError.badRequest('Token and new password are required');
  }
  if (password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters');
  }

  const user = await SmartGenUser.findOne({
    resetToken: token,
    resetExpires: { $gt: new Date() },
  });

  if (!user) throw ApiError.badRequest('Invalid or expired reset link');

  user.password = password;
  user.resetToken = null;
  user.resetExpires = null;
  await user.save();

  return ok(res, { message: 'Password reset successfully' });
});