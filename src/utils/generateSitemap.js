/**
 * generateSitemap.js
 * Generates valid public/sitemap.xml including all verified product URLs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VERIFIED_PRODUCT_CATALOG } from '../data/productCatalogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.dharaniherbbals.in';

const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/shop', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/faqs', priority: '0.6', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { url: '/terms', priority: '0.4', changefreq: 'yearly' }
];

const CATEGORIES = [
  'Hair Care',
  'Skin Care',
  'Bath & Body',
  'Food & Health',
  'Beverages',
  'Baby Care',
  'Pooja'
];

export function buildSitemapXml() {
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static Routes
  for (const r of STATIC_ROUTES) {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${r.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
    xml += `    <priority>${r.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // Category Routes
  for (const cat of CATEGORIES) {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/shop?category=${encodeURIComponent(cat)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  // Product Routes
  const productIds = Object.keys(VERIFIED_PRODUCT_CATALOG);
  for (const id of productIds) {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/product/${id}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.85</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

// Generate file when executed directly
const targetPath = path.resolve(__dirname, '../../public/sitemap.xml');
const sitemapContent = buildSitemapXml();
try {
  fs.writeFileSync(targetPath, sitemapContent, 'utf-8');
  console.log(`Generated sitemap at ${targetPath} with ${Object.keys(VERIFIED_PRODUCT_CATALOG).length} products.`);
} catch (e) {
  console.warn(`Warning: Could not update sitemap at ${targetPath}: ${e.message}`);
}
