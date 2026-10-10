const mongoose = require('mongoose');
const env = require('../../config/env');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/apiError');
const { ok } = require('../../utils/apiResponse');

exports.stats = asyncHandler(async (req, res) => {
  const client = mongoose.connection.client;
  const [server, mainStats] = await Promise.all([
    client.db().admin().serverStatus(),
    client.db().stats().catch(() => ({})),
  ]);

  const limitBytes = env.mongoStorageLimitMB * 1024 * 1024;
  const used = mainStats.storageSize || 0;
  const usedPercent = Number(((used / limitBytes) * 100).toFixed(2));

  return ok(res, {
    version: server.version,
    uptime: server.uptime,
    connections: server.connections,
    tier: env.mongoTier,
    storage: {
      used,
      usedFormatted: `${(used / 1024 / 1024).toFixed(1)} MB`,
      limitFormatted: `${env.mongoStorageLimitMB} MB`,
      usedPercent,
      collections: mainStats.collections || 0,
      objects: mainStats.objects || 0,
    },
    host: server.host,
  });
});

exports.databases = asyncHandler(async (req, res) => {
  const client = mongoose.connection.client;

  const result = await Promise.all(
    env.mongoDatabases.map(async (name) => {
      try {
        const db = client.db(name);
        const stats = await db.stats();
        return {
          name,
          collections: stats.collections || 0,
          dataSize: stats.dataSize || 0,
          storageSize: stats.storageSize || 0,
          objects: stats.objects || 0,
        };
      } catch {
        return {
          name,
          collections: 0,
          dataSize: 0,
          storageSize: 0,
          objects: 0,
          error: 'Not accessible',
        };
      }
    })
  );

  return ok(res, result);
});

exports.collections = asyncHandler(async (req, res) => {
  const db = mongoose.connection.client.db(req.params.db);
  const cols = await db.listCollections().toArray();

  const result = await Promise.all(
    cols.map(async (c) => {
      const stats = await db.command({ collStats: c.name }).catch(() => ({}));
      return {
        name: c.name,
        type: c.type,
        documents: stats.count || 0,
        size: stats.size || 0,
        indexes: stats.nindexes || 0,
      };
    })
  );
  return ok(res, result);
});

exports.collection = asyncHandler(async (req, res) => {
  const { db: dbName, col } = req.params;
  const db = mongoose.connection.client.db(dbName);
  const collection = db.collection(col);

  const [stats, docs, indexes] = await Promise.all([
    db.command({ collStats: col }).catch(() => ({})),
    collection.find({}).limit(20).toArray(),
    collection.indexes().catch(() => []),
  ]);

  return ok(res, {
    stats: {
      count: stats.count || 0,
      size: stats.size || 0,
      storageSize: stats.storageSize || 0,
      indexes: stats.nindexes || 0,
    },
    indexes,
    sample: docs,
  });
});

exports.query = asyncHandler(async (req, res) => {
  const { db: dbName, col } = req.params;
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const limit = Number(req.query.limit) || 50;
  const skip = Number(req.query.skip) || 0;
  const sort = req.query.sort ? JSON.parse(req.query.sort) : { _id: -1 };

  const db = mongoose.connection.client.db(dbName);
  const collection = db.collection(col);

  const [docs, total] = await Promise.all([
    collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return ok(res, { documents: docs, total, limit, skip, filter });
});

exports.dropCollection = asyncHandler(async (req, res) => {
  const { db: dbName, col } = req.params;
  if (!dbName || !col) throw ApiError.badRequest('db and col required');
  const db = mongoose.connection.client.db(dbName);
  await db.collection(col).drop();
  return ok(res, { message: `Dropped ${dbName}.${col}` });
});

exports.dropDatabase = asyncHandler(async (req, res) => {
  const dbName = req.params.db;
  if (!dbName) throw ApiError.badRequest('db required');
  const db = mongoose.connection.client.db(dbName);
  await db.dropDatabase();
  return ok(res, { message: `Dropped database ${dbName}` });
});