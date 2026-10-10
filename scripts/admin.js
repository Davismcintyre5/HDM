require('./dnsSet');
require('../config/env');

const readline = require('readline');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const HdmUser = require('../models/hdm/User');
const SmartGenUser = require('../models/smartgen/User');
const emailService = require('../services/emailService');
const env = require('../config/env');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
const clear = () => console.clear();

const banner = () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║     HDM Technologies Admin CLI       ║
  ╚══════════════════════════════════════╝
  `);
};

const menu = (title, options) => {
  console.log(`\n  ${title}`);
  console.log('  ───────────────────────────');
  options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
  console.log('  0. Back');
};

const listHdmAdmins = async () => {
  const admins = await HdmUser.find({ isAdmin: true }).select('-password');
  if (!admins.length) {
    console.log('  No HDM admins found.');
    return [];
  }
  console.log('\n  HDM Admins:');
  admins.forEach((a, i) => console.log(`  ${i + 1}. ${a.name} <${a.email}>`));
  return admins;
};

const listSmartGenAdmins = async () => {
  const admins = await SmartGenUser.find({ role: 'admin' }).select('-password');
  if (!admins.length) {
    console.log('  No SmartGen admins found.');
    return [];
  }
  console.log('\n  SmartGen Admins:');
  admins.forEach((a, i) => console.log(`  ${i + 1}. ${a.name} <${a.email}>`));
  return admins;
};

const createHdmAdmin = async () => {
  const name = await ask('  Name: ');
  const email = await ask('  Email: ');
  const password = await ask('  Password: ');

  const hashed = await bcrypt.hash(password, 10);
  const user = await HdmUser.create({
    name,
    email,
    password: hashed,
    isAdmin: true,
    isActive: true,
  });

  console.log(`  Created HDM admin: ${email}`);

  const sendEmail = await ask('  Send welcome email? (y/n): ');
  if (sendEmail.toLowerCase() === 'y') {
    const loginUrl = `${env.adminUrl}/portfolio/login`;
    const result = await emailService.hdmAdminWelcome({
      to: email,
      data: { name, email, password, loginUrl },
    });
    if (result.ok) {
      console.log(`  Welcome email sent → ${email}`);
    } else if (result.skipped) {
      console.log('  Email skipped');
    } else {
      console.log(`  Email failed: ${result.error} — queued for retry`);
    }
  }

  return user;
};

const createSmartGenAdmin = async () => {
  const name = await ask('  Name: ');
  const email = await ask('  Email: ');
  const password = await ask('  Password: ');

  const hashed = await bcrypt.hash(password, 10);
  const user = await SmartGenUser.create({
    name,
    email,
    password: hashed,
    role: 'admin',
    isActive: true,
  });

  console.log(`  Created SmartGen admin: ${email}`);

  const sendEmail = await ask('  Send welcome email? (y/n): ');
  if (sendEmail.toLowerCase() === 'y') {
    const loginUrl = `${env.smartgenUrl}/login`;
    const result = await emailService.smartgenAdminWelcome({
      to: email,
      data: { name, email, password, loginUrl },
    });
    if (result.ok) {
      console.log(`  Welcome email sent → ${email}`);
    } else if (result.skipped) {
      console.log('  Email skipped');
    } else {
      console.log(`  Email failed: ${result.error} — queued for retry`);
    }
  }

  return user;
};

const deleteHdmAdmin = async () => {
  const admins = await listHdmAdmins();
  if (!admins.length) return;
  const pick = await ask('\n  Number to delete (0 cancel): ');
  if (pick === '0') return;
  const user = admins[parseInt(pick, 10) - 1];
  if (!user) return console.log('  Invalid.');
  const ok = await ask(`  Delete "${user.name}"? (yes/no): `);
  if (ok.toLowerCase() !== 'yes') return console.log('  Cancelled.');
  await HdmUser.findByIdAndDelete(user._id);
  console.log('  Deleted.');
};

const deleteSmartGenAdmin = async () => {
  const admins = await listSmartGenAdmins();
  if (!admins.length) return;
  const pick = await ask('\n  Number to delete (0 cancel): ');
  if (pick === '0') return;
  const user = admins[parseInt(pick, 10) - 1];
  if (!user) return console.log('  Invalid.');
  const ok = await ask(`  Delete "${user.name}"? (yes/no): `);
  if (ok.toLowerCase() !== 'yes') return console.log('  Cancelled.');
  await SmartGenUser.findByIdAndDelete(user._id);
  console.log('  Deleted.');
};

const listCollections = async () => {
  const cols = await mongoose.connection.db.listCollections().toArray();
  if (!cols.length) {
    console.log('  No collections.');
    return [];
  }
  console.log('\n  Collections:');
  cols.forEach((c, i) => console.log(`  ${i + 1}. ${c.name}`));
  return cols;
};

const dropCollection = async () => {
  const cols = await listCollections();
  if (!cols.length) return;
  const pick = await ask('\n  Number to drop (0 cancel): ');
  if (pick === '0') return;
  const col = cols[parseInt(pick, 10) - 1];
  if (!col) return console.log('  Invalid.');
  const ok = await ask(`  Drop "${col.name}"? (yes/no): `);
  if (ok.toLowerCase() !== 'yes') return console.log('  Cancelled.');
  await mongoose.connection.db.dropCollection(col.name);
  console.log('  Dropped.');
};

const dropDatabase = async () => {
  const name = mongoose.connection.name;
  console.log(`  WARNING: deleting ALL data in "${name}"`);
  const confirm = await ask(`  Type "DELETE ${name}" to confirm: `);
  if (confirm !== `DELETE ${name}`) return console.log('  Cancelled.');
  await mongoose.connection.db.dropDatabase();
  console.log('  Database dropped.');
};

const hdmMenu = async () => {
  while (true) {
    clear();
    banner();
    menu('HDM Admin', [
      'List admins',
      'Create admin',
      'Delete admin',
      'List collections',
      'Drop collection',
      'Drop database',
    ]);
    const choice = await ask('\n  Choose: ');
    clear();
    banner();
    switch (choice) {
      case '1': await listHdmAdmins(); break;
      case '2': await createHdmAdmin(); break;
      case '3': await deleteHdmAdmin(); break;
      case '4': await listCollections(); break;
      case '5': await dropCollection(); break;
      case '6': await dropDatabase(); break;
      case '0': return;
      default: console.log('  Invalid.');
    }
    if (choice !== '0') await ask('\n  Press Enter...');
  }
};

const smartgenMenu = async () => {
  while (true) {
    clear();
    banner();
    menu('SmartGen Admin', ['List admins', 'Create admin', 'Delete admin']);
    const choice = await ask('\n  Choose: ');
    clear();
    banner();
    switch (choice) {
      case '1': await listSmartGenAdmins(); break;
      case '2': await createSmartGenAdmin(); break;
      case '3': await deleteSmartGenAdmin(); break;
      case '0': return;
      default: console.log('  Invalid.');
    }
    if (choice !== '0') await ask('\n  Press Enter...');
  }
};

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.db(`Connected → ${mongoose.connection.name}`);

  while (true) {
    clear();
    banner();
    menu('Main Menu', ['HDM Admin', 'SmartGen Admin', 'Collections', 'Drop database']);
    const choice = await ask('\n  Choose: ');
    switch (choice) {
      case '1': await hdmMenu(); break;
      case '2': await smartgenMenu(); break;
      case '3':
        await listCollections();
        await ask('\n  Press Enter...');
        break;
      case '4':
        clear();
        banner();
        await dropDatabase();
        await ask('\n  Press Enter...');
        break;
      case '0':
        await mongoose.disconnect();
        console.log('\n  Goodbye.\n');
        rl.close();
        process.exit(0);
      default:
        console.log('  Invalid.');
    }
  }
};

main().catch((err) => {
  logger.error(err.message);
  rl.close();
  process.exit(1);
});