require('dotenv').config();

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'HDM_API_KEY',
  'HDM_API_URL',
  'HDM_FROM_EMAIL',
  'HDM_FROM_NAME',
  'HDM_AI_URL',
  'HDM_AI_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_SHORTCODE',
  'MPESA_PASSKEY',
  'MPESA_CALLBACK_URL',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const splitList = (v) =>
  String(v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,

  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  hdmUrl: process.env.HDM_URL || 'http://localhost:3000',
  smartgenUrl: process.env.SMARTGEN_URL || 'http://localhost:3000/smartgen',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',

  mongoUri: process.env.MONGODB_URI,
  mongoDatabases: splitList(process.env.MONGODB_DATABASES),
  mongoStorageLimitMB: Number(process.env.MONGODB_STORAGE_LIMIT_MB) || 512,
  mongoTier: process.env.MONGODB_TIER || 'M0',

  jwtSecret: process.env.JWT_SECRET,

  redisEnabled: process.env.REDIS_ENABLED === 'true',
  redisUrl: process.env.REDIS_URL || '',

  smsEnabled: process.env.SMS_ENABLED === 'true',

  keepAlive: {
    enabled: process.env.KEEP_ALIVE_ENABLED === 'true',
    verbose: process.env.KEEP_ALIVE_VERBOSE === 'true',
  },

  allowedOrigins: splitList(process.env.ALLOWED_ORIGINS),

  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPhone: process.env.ADMIN_PHONE || '',

  bridge: {
    apiKey: process.env.HDM_API_KEY,
    apiUrl: process.env.HDM_API_URL,
    fromEmail: process.env.HDM_FROM_EMAIL,
    fromName: process.env.HDM_FROM_NAME,
    smsSender: process.env.HDM_SMS_SENDER || 'HDM',
  },

  ai: {
    url: process.env.HDM_AI_URL,
    key: process.env.HDM_AI_KEY,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: 'hdm',
  },

  mpesa: {
    env: process.env.MPESA_ENV || 'sandbox',
    baseUrl:
      process.env.MPESA_ENV === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke',
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    shortcode: process.env.MPESA_SHORTCODE,
    tillNumber: process.env.MPESA_TILL_NUMBER || '',
    passkey: process.env.MPESA_PASSKEY,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
    transactionType:
      process.env.MPESA_TRANSACTION_TYPE || 'CustomerBuyGoodsOnline',
  },
};