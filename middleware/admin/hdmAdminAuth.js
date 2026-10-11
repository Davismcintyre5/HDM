const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const HdmUser = require('../../models/hdm/User');

const hdmAdminAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ')
    ? header.split(' ')[1]
    : req.query.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await HdmUser.findById(decoded.id).select('-password');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, user not found' });
    }

    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized as admin' });
    }

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = hdmAdminAuth;