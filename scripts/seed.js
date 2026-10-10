require('./dnsSet');
require('../config/env');

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const Company = require('../models/hdm/Company');
const Settings = require('../models/hdm/Settings');
const BackupSettings = require('../models/hdm/BackupSettings');
const SmartGenSetting = require('../models/smartgen/Setting');

const seedCompany = async () => {
  const existing = await Company.findOne();
  if (existing) {
    logger.info('Company already seeded');
    return;
  }
  await Company.create({
    name: 'HDM Technologies',
    tagline: 'Building Digital Solutions for Africa',
    description: 'We build web apps, mobile apps, AI solutions and POS systems.',
    email: 'info@hdm.co.ke',
    phone: '+254768784909',
    whatsapp: '+254768784909',
    address: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
  });
  logger.info('Company seeded');
};

const seedSettings = async () => {
  const existing = await Settings.findOne();
  if (existing) {
    logger.info('Settings already seeded');
    return;
  }
  await Settings.create({
    ai: {
      enabled: false,
      greeting: 'Hi! Ask me about our services, apps, or projects.',
      widgetColor: '#1e6ef0',
      widgetPosition: 'right',
    },
  });
  logger.info('Settings seeded');
};

const seedBackupSettings = async () => {
  const existing = await BackupSettings.findOne();
  if (existing) {
    logger.info('BackupSettings already seeded');
    return;
  }
  await BackupSettings.create({
    enabled: false,
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    maxBackups: 10,
  });
  logger.info('BackupSettings seeded');
};

const seedSmartGenSetting = async () => {
  const existing = await SmartGenSetting.findOne();
  if (existing) {
    logger.info('SmartGenSetting already seeded');
    return;
  }
  await SmartGenSetting.create({
    theme: 'light',
    defaultCategory: '',
  });
  logger.info('SmartGenSetting seeded');
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.db(`Connected → ${mongoose.connection.name}`);

    await seedCompany();
    await seedSettings();
    await seedBackupSettings();
    await seedSmartGenSetting();

    logger.info('Seed complete');
  } catch (err) {
    logger.error(`Seed failed: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit(process.exitCode || 0);
  }
};

run();