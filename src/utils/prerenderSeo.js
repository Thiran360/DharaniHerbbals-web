/**
 * prerenderSeo.js
 * Generates static HTML files with pre-rendered SEO metadata, Open Graph tags,
 * and WhatsApp link preview tags for every verified product and static route.
 *
 * This guarantees that social crawlers (WhatsApp, Facebook, Twitter, Telegram,
 * LinkedIn) and search engine bots can instantly read the exact product name,
 * image, price, and canonical URL without executing client-side JavaScript.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProductSeo, SITE_DOMAIN, SITE_NAME } from './productSeo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const distDir = path.resolve(rootDir, 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');

// Helper to escape HTML attributes safely
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Injects meta tags and title into the base HTML template
 */
function injectMeta(htmlTemplate, seoData) {
  let html = htmlTemplate;

  // 1. Replace <title>
  if (seoData.title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seoData.title)}</title>`);
  }

  // 2. Build metadata snippet
  const metaSnippets = [];

  if (seoData.description) {
    metaSnippets.push(`  <meta name="description" content="${escapeHtml(seoData.description)}" />`);
  }

  if (seoData.canonicalUrl) {
    metaSnippets.push(`  <link rel="canonical" href="${escapeHtml(seoData.canonicalUrl)}" />`);
  }

  if (seoData.keywords && seoData.keywords.length > 0) {
    const kwStr = Array.isArray(seoData.keywords) ? seoData.keywords.join(', ') : seoData.keywords;
    metaSnippets.push(`  <meta name="keywords" content="${escapeHtml(kwStr)}" />`);
  }

  // Open Graph / WhatsApp Preview Tags
  if (seoData.openGraph) {
    const og = seoData.openGraph;
    metaSnippets.push(`  <meta property="og:type" content="${escapeHtml(og.type || 'website')}" />`);
    metaSnippets.push(`  <meta property="og:site_name" content="${escapeHtml(og.site_name || SITE_NAME)}" />`);
    metaSnippets.push(`  <meta property="og:title" content="${escapeHtml(og.title || seoData.title)}" />`);
    metaSnippets.push(`  <meta property="og:description" content="${escapeHtml(og.description || seoData.description)}" />`);
    metaSnippets.push(`  <meta property="og:url" content="${escapeHtml(og.url || seoData.canonicalUrl)}" />`);
    if (og.image) {
      const actualImg = og.image.replace(/([^:])\/\/+/g, '$1/');
      const ext = actualImg.split('?')[0].toLowerCase();
      const mime = ext.endsWith('.png') ? 'image/png' : 'image/jpeg';
      metaSnippets.push(`  <meta property="og:image" content="${escapeHtml(actualImg)}" />`);
      metaSnippets.push(`  <meta property="og:image:secure_url" content="${escapeHtml(actualImg)}" />`);
      metaSnippets.push(`  <meta property="og:image:type" content="${mime}" />`);
      metaSnippets.push(`  <meta property="og:image:width" content="800" />`);
      metaSnippets.push(`  <meta property="og:image:height" content="800" />`);
      metaSnippets.push(`  <meta property="og:image:alt" content="${escapeHtml(og.title || seoData.title)}" />`);
      metaSnippets.push(`  <link rel="image_src" href="${escapeHtml(actualImg)}" />`);
    }
    if (og.locale) {
      metaSnippets.push(`  <meta property="og:locale" content="${escapeHtml(og.locale)}" />`);
    }
    if (og.priceAmount) {
      metaSnippets.push(`  <meta property="product:price:amount" content="${escapeHtml(og.priceAmount)}" />`);
      metaSnippets.push(`  <meta property="product:price:currency" content="${escapeHtml(og.priceCurrency || 'INR')}" />`);
      metaSnippets.push(`  <meta property="og:price:amount" content="${escapeHtml(og.priceAmount)}" />`);
      metaSnippets.push(`  <meta property="og:price:currency" content="${escapeHtml(og.priceCurrency || 'INR')}" />`);
    }
  }

  // Twitter Card Tags
  if (seoData.twitter) {
    const tw = seoData.twitter;
    const actualTwImg = tw.image ? tw.image.replace(/([^:])\/\/+/g, '$1/') : null;
    metaSnippets.push(`  <meta name="twitter:card" content="${escapeHtml(tw.card || 'summary_large_image')}" />`);
    metaSnippets.push(`  <meta name="twitter:title" content="${escapeHtml(tw.title || seoData.title)}" />`);
    metaSnippets.push(`  <meta name="twitter:description" content="${escapeHtml(tw.description || seoData.description)}" />`);
    if (actualTwImg) {
      metaSnippets.push(`  <meta name="twitter:image" content="${escapeHtml(actualTwImg)}" />`);
    }
  }

  // JSON-LD Scripts
  if (seoData.productJsonLd) {
    metaSnippets.push(`  <script id="dh-schema-product" type="application/ld+json">${JSON.stringify(seoData.productJsonLd, null, 2)}</script>`);
  }
  if (seoData.breadcrumbJsonLd) {
    metaSnippets.push(`  <script id="dh-schema-breadcrumb" type="application/ld+json">${JSON.stringify(seoData.breadcrumbJsonLd, null, 2)}</script>`);
  }

  // 1. Strip default / boilerplate meta tags from base template
  html = html.replace(/<meta\s+name="description"[\s\S]*?>/gi, '');
  html = html.replace(/<link\s+rel="canonical"[\s\S]*?>/gi, '');
  html = html.replace(/<meta\s+property="og:[\s\S]*?>/gi, '');
  html = html.replace(/<meta\s+name="twitter:[\s\S]*?>/gi, '');
  html = html.replace(/<meta\s+property="product:[\s\S]*?>/gi, '');

  const newTitle = `<title>${escapeHtml(seoData.title)}</title>`;
  const topHeadBlock = `${newTitle}\n  <!-- Pre-rendered WhatsApp, Social Open Graph & Search Metadata -->\n${metaSnippets.join('\n')}`;

  // Place metadata right at the top of <head> where WhatsApp & Facebook scrapers look first
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, topHeadBlock);
  } else {
    html = html.replace(/<head>/i, `<head>\n  ${topHeadBlock}`);
  }

  return html;
}

export function prerenderAll() {
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found. Run "vite build" first.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Load product catalog cache
  const cachePath = path.resolve(rootDir, 'src/data/liveProductsCache.json');
  let products = [];
  if (fs.existsSync(cachePath)) {
    try {
      products = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch (e) {
      console.warn('Could not parse liveProductsCache.json:', e);
    }
  }

  let generatedCount = 0;

  // 1. Generate Static Pages
  const staticPages = [
    {
      route: 'shop',
      seo: {
        title: 'Shop All Authentic Herbal Products | Dharani Herbals',
        description: 'Browse our complete catalog of verified botanical hair care, skincare, baby care, traditional food, and pooja essentials.',
        canonicalUrl: `${SITE_DOMAIN}/shop`,
        openGraph: {
          title: 'Shop All Authentic Herbal Products | Dharani Herbals',
          description: 'Browse our complete catalog of verified botanical hair care, skincare, baby care, traditional food, and pooja essentials.',
          url: `${SITE_DOMAIN}/shop`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'about',
      seo: {
        title: 'About Us | Our Siddha Heritage & Mission | Dharani Herbals',
        description: 'Learn about Dharani Herbals, our dedication to traditional Siddha and Ayurvedic botanical heritage, pure ingredients, and natural wellness.',
        canonicalUrl: `${SITE_DOMAIN}/about`,
        openGraph: {
          title: 'About Us | Our Siddha Heritage & Mission | Dharani Herbals',
          description: 'Learn about Dharani Herbals, our dedication to traditional Siddha and Ayurvedic botanical heritage, pure ingredients, and natural wellness.',
          url: `${SITE_DOMAIN}/about`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'contact',
      seo: {
        title: 'Contact Us | Customer Support & Store Location | Dharani Herbals',
        description: 'Get in touch with Dharani Herbals for inquiries, customer support, orders, and botanical wellness guidance. Reach us via WhatsApp (+91 97881 22001) or email.',
        canonicalUrl: `${SITE_DOMAIN}/contact`,
        openGraph: {
          title: 'Contact Us | Customer Support & Store Location | Dharani Herbals',
          description: 'Get in touch with Dharani Herbals for inquiries, customer support, orders, and botanical wellness guidance. Reach us via WhatsApp (+91 97881 22001) or email.',
          url: `${SITE_DOMAIN}/contact`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'faqs',
      seo: {
        title: 'Frequently Asked Questions (FAQ) | Dharani Herbals',
        description: 'Find verified answers to common questions about Dharani Herbals products, 100% natural Siddha ingredients, delivery timelines, order tracking, and returns.',
        canonicalUrl: `${SITE_DOMAIN}/faqs`,
        openGraph: {
          title: 'Frequently Asked Questions (FAQ) | Dharani Herbals',
          description: 'Find verified answers to common questions about Dharani Herbals products, 100% natural Siddha ingredients, delivery timelines, order tracking, and returns.',
          url: `${SITE_DOMAIN}/faqs`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'privacy',
      seo: {
        title: 'Privacy Policy | Dharani Herbals',
        description: 'Official Dharani Herbals policy regarding customer privacy, personal data protection, and secure shopping.',
        canonicalUrl: `${SITE_DOMAIN}/privacy`,
        openGraph: {
          title: 'Privacy Policy | Dharani Herbals',
          description: 'Official Dharani Herbals policy regarding customer privacy, personal data protection, and secure shopping.',
          url: `${SITE_DOMAIN}/privacy`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'shipping',
      seo: {
        title: 'Shipping & Delivery Policy | Dharani Herbals',
        description: 'Review our pan-India delivery timelines, standard dispatch procedures, and free shipping eligibility on orders above ₹500.',
        canonicalUrl: `${SITE_DOMAIN}/shipping`,
        openGraph: {
          title: 'Shipping & Delivery Policy | Dharani Herbals',
          description: 'Review our pan-India delivery timelines, standard dispatch procedures, and free shipping eligibility on orders above ₹500.',
          url: `${SITE_DOMAIN}/shipping`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'refund',
      seo: {
        title: 'Refund & Returns Policy | Dharani Herbals',
        description: 'Official Dharani Herbals return guidelines, replacement terms for transit damages, and quick refund processing.',
        canonicalUrl: `${SITE_DOMAIN}/refund`,
        openGraph: {
          title: 'Refund & Returns Policy | Dharani Herbals',
          description: 'Official Dharani Herbals return guidelines, replacement terms for transit damages, and quick refund processing.',
          url: `${SITE_DOMAIN}/refund`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'terms',
      seo: {
        title: 'Terms and Conditions | Dharani Herbals',
        description: 'Review the terms and conditions governing the purchase and use of Dharani Herbals authentic products and services.',
        canonicalUrl: `${SITE_DOMAIN}/terms`,
        openGraph: {
          title: 'Terms and Conditions | Dharani Herbals',
          description: 'Review the terms and conditions governing the purchase and use of Dharani Herbals authentic products and services.',
          url: `${SITE_DOMAIN}/terms`,
          image: `${SITE_DOMAIN}/logo.png`,
          type: 'website'
        }
      }
    },
    {
      route: 'combo/bundle-haircare-combo-1',
      seo: {
        title: 'Herbal Hair Care Combo - ₹219 Special Offer | Dharani Herbals',
        description: 'Save ₹36 on the Herbal Hair Care Combo. Includes Chemparuthi Herbal Shampoo, Hibiscus Herbal Hair Oil, and Traditional Hair Wash Powder. 100% natural Siddha routine.',
        canonicalUrl: `${SITE_DOMAIN}/combo/bundle-haircare-combo-1`,
        openGraph: {
          title: 'Herbal Hair Care Combo - ₹219 | Dharani Herbals',
          description: 'Price: ₹219. Save ₹36 with this 3-in-1 Ayurvedic hair care routine. Verified 100% natural Siddha formulations.',
          url: `${SITE_DOMAIN}/combo/bundle-haircare-combo-1`,
          image: 'https://vedanmart.com/images/hair/Hibiscus%20Shampoo.jpg',
          type: 'product',
          priceAmount: '219.00',
          priceCurrency: 'INR'
        }
      }
    },
    {
      route: 'combo/herbal-hair-care-combo',
      seo: {
        title: 'Herbal Hair Care Combo - ₹219 Special Offer | Dharani Herbals',
        description: 'Save ₹36 on the Herbal Hair Care Combo. Includes Chemparuthi Herbal Shampoo, Hibiscus Herbal Hair Oil, and Traditional Hair Wash Powder. 100% natural Siddha routine.',
        canonicalUrl: `${SITE_DOMAIN}/combo/herbal-hair-care-combo`,
        openGraph: {
          title: 'Herbal Hair Care Combo - ₹219 | Dharani Herbals',
          description: 'Price: ₹219. Save ₹36 with this 3-in-1 Ayurvedic hair care routine. Verified 100% natural Siddha formulations.',
          url: `${SITE_DOMAIN}/combo/herbal-hair-care-combo`,
          image: 'https://vedanmart.com/images/hair/Hibiscus%20Shampoo.jpg',
          type: 'product',
          priceAmount: '219.00',
          priceCurrency: 'INR'
        }
      }
    }
  ];

  for (const page of staticPages) {
    const pageHtml = injectMeta(baseHtml, page.seo);
    const targetDir = path.resolve(distDir, page.route);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.resolve(targetDir, 'index.html'), pageHtml, 'utf-8');

    // Also write flat html file e.g. dist/shop.html, dist/about.html
    const parentDir = path.dirname(targetDir);
    const baseName = path.basename(page.route);
    fs.writeFileSync(path.resolve(parentDir, `${baseName}.html`), pageHtml, 'utf-8');
    generatedCount++;
  }

  // 2. Generate Product Pages
  for (const product of products) {
    if (!product || !product.id) continue;
    const seoData = generateProductSeo(product);
    const productHtml = injectMeta(baseHtml, seoData);

    // Write folder route: dist/product/:id/index.html
    const targetDir = path.resolve(distDir, `product/${product.id}`);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.resolve(targetDir, 'index.html'), productHtml, 'utf-8');

    // Also write flat file route: dist/product/:id.html
    fs.writeFileSync(path.resolve(distDir, `product/${product.id}.html`), productHtml, 'utf-8');
    generatedCount++;
  }

  console.log(`Pre-rendered ${generatedCount} static HTML pages in dist/ with full Open Graph and WhatsApp metadata.`);
}

// Run if called directly
prerenderAll();
