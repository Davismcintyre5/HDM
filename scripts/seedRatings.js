require('./dnsSet');
require('../config/env');

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const HdmApp = require('../models/hdm/App');

const ratings = {
  ProducePay: {
    rating: 3.9,
    ratingCount: 12,
    ratingSource: 'Play Store',
  },
  PharmaSys: {
    rating: 4.1,
    ratingCount: 8,
    ratingSource: 'Play Store',
  },
  DigitalSafaris: {
    rating: 4.5,
    ratingCount: 6,
    ratingSource: 'Play Store',
  },
  'HDM Bridge': {
    rating: 4.7,
    ratingCount: 15,
    ratingSource: 'Internal',
  },
  FarmVexa: {
    rating: 4.3,
    ratingCount: 5,
    ratingSource: 'Play Store',
  },
  'HDM AI': {
    rating: 4.4,
    ratingCount: 9,
    ratingSource: 'Play Store',
  },
  'BizHub KE': {
    rating: 4.0,
    ratingCount: 7,
    ratingSource: 'Web',
  },
  SmartPOS: {
    rating: 4.6,
    ratingCount: 11,
    ratingSource: 'Play Store',
  },
};

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.db(`Connected → ${mongoose.connection.name}`);

  let updated = 0;
  let missing = [];

  for (const [name, patch] of Object.entries(ratings)) {
    const result = await HdmApp.updateOne({ name }, { $set: patch });
    if (result.matchedCount) {
      updated++;
      console.log(`  ${name}: ★ ${patch.rating} (${patch.ratingCount}) — ${patch.ratingSource}`);
    } else {
      missing.push(name);
    }
  }

  console.log(`\n  Updated ${updated} of ${Object.keys(ratings).length} apps`);
  if (missing.length) {
    console.log(`  Not found: ${missing.join(', ')}`);
  }

  await mongoose.disconnect();
};

main().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});