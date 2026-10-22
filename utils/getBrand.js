const HdmCompany = require('../models/hdm/Company');
const env = require('../config/env');

const defaults = {
  name: 'HDM Technologies',
  tagline: 'Building Digital Solutions for Africa',
  url: env.hdmUrl,
  logo: '',
  logoDark: '',
  favicon: '',
  stampUrl: '',
  sealUrl: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  poBox: '',
  postalCode: '',
  city: '',
  country: 'Kenya',
  website: 'www.hdm.co.ke',
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
    name: c?.name || defaults.name,
    tagline: c?.tagline || defaults.tagline,
    url: c?.website || defaults.url,
    logo: c?.logo || defaults.logo,
    logoDark: c?.logoDark || defaults.logoDark,
    favicon: c?.favicon || defaults.favicon,
    stampUrl: c?.stampUrl || defaults.stampUrl,
    sealUrl: c?.sealUrl || defaults.sealUrl,
    email: c?.email || defaults.email,
    phone: c?.phone || defaults.phone,
    whatsapp: c?.whatsapp || defaults.whatsapp,

    address: c?.address || defaults.address,
    poBox: c?.poBox || defaults.poBox,
    postalCode: c?.postalCode || defaults.postalCode,
    city: c?.city || defaults.city,
    country: c?.country || defaults.country,
    website: c?.website || defaults.website,

    primaryColor: c?.primaryColor || defaults.primaryColor,
    accentColor: c?.accentColor || defaults.accentColor,
  };
  cacheUntil = Date.now() + TTL;

  return cache;
};

const invalidateBrandCache = () => {
  cache = null;
  cacheUntil = 0;
};

module.exports = { getBrand, invalidateBrandCache };