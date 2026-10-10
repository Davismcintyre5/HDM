const HdmCompany = require('../models/hdm/Company');
const env = require('../config/env');

const defaults = {
  name: 'HDM Technologies',
  url: env.hdmUrl,
  logo: '',
  email: '',
  phone: '',
  whatsapp: '',
  primaryColor: '#0a1628',
  accentColor: '#1e6ef0',
};

let cache = null;
let cacheUntil = 0;
const TTL = 60 * 1000;

const getBrand = async (force = false) => {
  if (!force && cache && Date.now() < cacheUntil) return cache;

  const c = await HdmCompany.findOne().lean();

  cache = {
    ...defaults,
    name: c?.name || defaults.name,
    logo: c?.logo || '',
    email: c?.email || '',
    phone: c?.phone || '',
    whatsapp: c?.whatsapp || '',
  };
  cacheUntil = Date.now() + TTL;

  return cache;
};

const invalidateBrandCache = () => {
  cache = null;
  cacheUntil = 0;
};

module.exports = { getBrand, invalidateBrandCache };