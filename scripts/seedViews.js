require('./dnsSet');
require('../config/env');

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const HdmApp = require('../models/hdm/App');

const views = {
  ProducePay: { baseViews: 626, viewCount: 626 },
  PharmaSys: { baseViews: 177, viewCount: 177 },
  DigitalSafaris: { baseViews: 822, viewCount: 822 },
  'HDM Bridge': { baseViews: 1100, viewCount: 1100 },
  FarmVexa: { baseViews: 167, viewCount: 167 },
  'HDM AI': { baseViews: 1200, viewCount: 1200 },
  'BizHub KE': { baseViews: 469, viewCount: 469 },
  SmartPOS: { baseViews: 449, viewCount: 449 },
};

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.db(`Connected → ${mongoose.connection.name}`);

  let updated = 0;
  const missing = [];

  for (const [name, patch] of Object.entries(views)) {
    const result = await HdmApp.updateOne({ name }, { $set: patch });
    if (result.matchedCount) {
      updated++;
      console.log(`  ${name}: ${patch.viewCount}`);
    } else {
      missing.push(name);
    }
  }

  console.log(`\n  Updated views for ${updated} of ${Object.keys(views).length} apps`);
  if (missing.length) {
    console.log(`  Not found: ${missing.join(', ')}`);
  }

  await mongoose.disconnect();
};

main().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});