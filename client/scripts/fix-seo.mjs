import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

const SITE_URL = 'https://hdm.co.ke';

const ROUTES = [
  { path: '/', priority: '1.00' },
  { path: '/services', priority: '0.90' },
  { path: '/apps', priority: '0.90' },
  { path: '/apps/smartgen', priority: '0.80' },
  { path: '/apps/farmvexa', priority: '0.80' },
  { path: '/projects', priority: '0.80' },
  { path: '/gallery', priority: '0.70' },
  { path: '/contact', priority: '0.90' },
  { path: '/smartgen', priority: '0.90' },
  { path: '/smartgen/templates', priority: '0.80' },
  { path: '/smartgen/login', priority: '0.50' },
  { path: '/smartgen/register', priority: '0.50' },
];

const today = new Date().toISOString().split('T')[0];

const indexPath = resolve('dist/index.html');
if (!existsSync(indexPath)) {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

let html = readFileSync(indexPath, 'utf-8');

// Ensure viewport meta is present
if (!html.includes('name="viewport"')) {
  html = html.replace(
    /<head([^>]*)>/i,
    '<head$1>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
  );
}

// Remove plugin junk
html = html.replace(/<meta name="author" content="[^"]*"\s*\/?>\s*\n?/gi, '');
html = html.replace(/<meta name="keywords" content="[^"]*"\s*\/?>\s*\n?/gi, '');
html = html.replace(/<meta property="og:[^"]*"[^>]*>\s*\n?/gi, '');
html = html.replace(/<meta name="twitter:[^"]*"[^>]*>\s*\n?/gi, '');

// Fix broken inline favicon → real file
html = html.replace(
  /<link rel="icon" href="data:image\/svg\+xml[^>]*>/gi,
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
);

// Collapse blank lines
html = html.replace(/\n{3,}/g, '\n\n');

// Inject OG/Twitter block
const ogBlock = `
    <meta property="og:title" content="HDM Technologies — Building Digital Solutions" />
    <meta property="og:description" content="Web apps, mobile apps, AI solutions, and SmartGen document generation." />
    <meta property="og:image" content="https://hdm.co.ke/og-image.png" />
    <meta property="og:url" content="https://hdm.co.ke/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="HDM Technologies" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="HDM Technologies — Building Digital Solutions" />
    <meta name="twitter:description" content="Web apps, mobile apps, AI solutions, and SmartGen document generation." />
    <meta name="twitter:image" content="https://hdm.co.ke/og-image.png" />
`;

html = html.replace('</head>', ogBlock + '</head>');
writeFileSync(indexPath, html, 'utf-8');
console.log('✅ dist/index.html cleaned');

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry === 'index.html' && full !== indexPath) {
      let sub = readFileSync(full, 'utf-8');

      // Ensure viewport meta on every sub-route
      if (!sub.includes('name="viewport"')) {
        sub = sub.replace(
          /<head([^>]*)>/i,
          '<head$1>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'
        );
      }

      sub = sub.replace(
        /<link rel="icon" href="data:image\/svg\+xml[^>]*>/gi,
        '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
      );
      writeFileSync(full, sub, 'utf-8');
    }
  }
}
walk(resolve('dist'));

const urls = ROUTES.map(
  (r) => `    <url>
        <loc>${SITE_URL}${r.path}</loc>
        <lastmod>${today}</lastmod>
        <priority>${r.priority}</priority>
    </url>`
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(resolve('dist/sitemap.xml'), sitemap, 'utf-8');
console.log(`✅ dist/sitemap.xml written (${ROUTES.length} URLs)`);