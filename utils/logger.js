const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

const ts = () => new Date().toISOString();

const info = (message) =>
  console.log(`${colors.green}[INFO]${colors.reset} ${ts()} — ${message}`);

const warn = (message) =>
  console.warn(`${colors.yellow}[WARN]${colors.reset} ${ts()} — ${message}`);

const error = (message) =>
  console.error(`${colors.red}[ERROR]${colors.reset} ${ts()} — ${message}`);

const db = (message) =>
  console.log(`${colors.cyan}[DB]${colors.reset} ${ts()} — ${message}`);

const req = (method, url, status, ms) => {
  const color =
    status >= 500 ? colors.red :
    status >= 400 ? colors.yellow :
    colors.green;
  const time = ms !== undefined ? ` ${ms}ms` : '';
  console.log(
    `${colors.blue}[REQ]${colors.reset} ${ts()} — ${method} ${url} ${color}${status}${colors.reset}${time}`
  );
};

module.exports = { info, warn, error, db, req };