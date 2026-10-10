const env = require('./env');
const logger = require('../utils/logger');

const FIRST_DELAY_MS = 60 * 1000;
const INTERVAL_MS = 10 * 60 * 1000;
const TIMEOUT_MS = 10 * 1000;

let firstTimer = null;
let intervalTimer = null;

const isEnabled = () => env.keepAlive.enabled;
const isVerbose = () => env.keepAlive.verbose;

async function ping(options = {}) {
  const { forceLog = false } = options;
  const base = env.baseUrl;
  if (!base) return;

  const url = base.replace(/\/+$/, '') + '/health';
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal });
    const ms = Date.now() - started;

    if (!res.ok) {
      logger.warn(`[keepAlive] GET /health → ${res.status} in ${ms}ms`);
      return;
    }

    if (isVerbose() || forceLog) {
      logger.info(`[keepAlive] GET /health → ${res.status} in ${ms}ms`);
    }
  } catch (err) {
    const ms = Date.now() - started;
    const msg = err.name === 'AbortError' ? `timeout after ${ms}ms` : err.message;
    logger.warn(`[keepAlive] GET /health failed: ${msg}`);
  } finally {
    clearTimeout(timer);
  }
}

function start() {
  if (!isEnabled()) {
    logger.info('[keepAlive] Disabled');
    return;
  }

  if (!env.baseUrl) {
    logger.warn('[keepAlive] BASE_URL not set — disabled');
    return;
  }

  if (firstTimer || intervalTimer) {
    logger.warn('[keepAlive] Already running');
    return;
  }

  logger.info(
    `[keepAlive] Enabled. First ping in 60s, then every 10m. Verbose ${isVerbose() ? 'on' : 'off'}`
  );

  firstTimer = setTimeout(() => {
    firstTimer = null;
    ping({ forceLog: true }).catch(() => {});

    intervalTimer = setInterval(() => {
      ping().catch(() => {});
    }, INTERVAL_MS);
  }, FIRST_DELAY_MS);
}

function stop() {
  if (firstTimer) {
    clearTimeout(firstTimer);
    firstTimer = null;
  }
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}

module.exports = { start, stop, ping };