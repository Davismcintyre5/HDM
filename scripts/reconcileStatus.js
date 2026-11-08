require('./dnsSet');
require('../config/env');

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const HdmApp = require('../models/hdm/App');

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.db(`Connected → ${mongoose.connection.name}`);

  const apps = await HdmApp.find({});
  let fixed = 0;

  for (const app of apps) {
    const hasLive = !!(app.urls?.live && app.urls.live.trim());
    const nextStatus = hasLive ? 'live' : 'coming_soon';

    if (app.status !== nextStatus) {
      app.status = nextStatus;
      await app.save();
      console.log(`  ${app.name}: → ${nextStatus}`);
      fixed++;
    }
  }

  console.log(`\n  Reconciled ${fixed} of ${apps.length} apps`);
  await mongoose.disconnect();
};

main().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});