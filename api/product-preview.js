import fs from 'fs';
import path from 'path';

// Load live products cache
let cachedProducts = null;
function getProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const cachePath = path.join(process.cwd(), 'src/data/liveProductsCache.json');
    if (fs.existsSync(cachePath)) {
      const data = fs.readFileSync(cachePath, 'utf8');
      cachedProducts = JSON.parse(data);
      return cachedProducts;
    }
  } catch (err) {
    console.error('Failed to load liveProductsCache.json:', err.message);
  }
  return [];
}

function cleanDisplayName(name) {
  if (!name) return 'Herbal Product';
  return name
    .replace(/\bMulthani\s+Metti\b/gi, 'Multani Mitti')
    .replace(/\bMulthani\b/gi, 'Multani')
    .replace(/\bMetti\b/gi, 'Mitti')
    .replace(/\b(Orange|Lemon)\s+Peal\b/gi, '$1 Peel')
    .replace(/\s*\((?:GC|PO|JAR|NR|G|பா|பொ|ஜார்|பாக்கெட்)\)\s*/gi, ' ')
    .replace(/\s*\(PO\d*\)?\s*/gi, ' ')
    .replace(/\bJar\s*\(NR\)/gi, ' ')
    .replace(/\bJAR\s*(?=\()/gi, ' ')
    .replace(/\s+\(G\)$/i, '')
    .replace(/\s+(?:Nr|NR)$/i, '')
    .replace(/\s+பா$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanImageUrl(img) {
  if (!img) return '';
  let url = String(img).trim();
  if (url.includes(',')) url = url.split(',')[0].trim();
  url = url.replace(/([^:])\/\/+/g, '$1/');
  try {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname.split('/').map(part => {
      return encodeURIComponent(decodeURIComponent(part));
    }).join('/');
    return urlObj.toString();
  } catch {
    return url.replace(/ /g, '%20').replace(/&/g, '%26');
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const cleanId = String(id || '').replace(/[^0-9]/g, '');

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'dharani-herbals.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const siteUrl = `${proto}://${host}`;
  const defaultLogo = `${siteUrl}/logo.png`;

  let product = null;
  const products = getProducts();
  if (cleanId) {
    product = products.find(p => String(p.id) === cleanId);
  }

  // Fallback to API if not in local cache
  if (!product && cleanId) {
    try {
      const apiRes = await fetch(`http://179.197.251.47:30080/herbal/products/${cleanId}/`, {
        headers: { 'User-Agent': 'DharaniPreviewBot/1.0' },
        signal: AbortSignal.timeout(3000)
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.name) product = data;
      }
    } catch (e) {
      console.warn('API fallback error:', e.message);
    }
  }

  const siteName = 'Dharani Herbals';
  let title = `${siteName} | Authentic Siddha & Herbal Products`;
  let ogTitle = title;
  let description = 'Discover 100% authentic South Indian herbal products, botanical hair care, natural skincare, and traditional wellness formulations from Dharani Herbals.';
  let mainImage = defaultLogo;
  let numericPrice = '0.00';
  let formattedPrice = '';
  let pageUrl = cleanId ? `${siteUrl}/product/${cleanId}` : siteUrl;

  if (product) {
    const rawName = cleanDisplayName(product.name);
    const rawPrice = product.price ? parseFloat(String(product.price).replace(/[^0-9.]/g, '')) : 0;
    numericPrice = !isNaN(rawPrice) && rawPrice > 0 ? rawPrice.toFixed(2) : '0.00';
    formattedPrice = !isNaN(rawPrice) && rawPrice > 0 ? `₹${Math.round(rawPrice)}` : '';

    title = formattedPrice ? `${rawName} for Holistic Care | ${siteName}` : `${rawName} | ${siteName}`;
    ogTitle = formattedPrice ? `${rawName} - ${formattedPrice} | ${siteName}` : `${rawName} | ${siteName}`;

    let rawDesc = (product.description || '').replace(/_x000D_/g, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (rawDesc.length > 160) {
      rawDesc = rawDesc.slice(0, 157) + '...';
    }
    if (!rawDesc) {
      rawDesc = `Explore ${rawName} from Dharani Herbals. 100% authentic South Indian herbal formulation crafted with pure botanical ingredients.`;
    }

    description = formattedPrice ? `Price: ${formattedPrice}. ${rawDesc}` : rawDesc;
    if (product.image) {
      mainImage = cleanImageUrl(product.image);
    }
  }

  // Ensure absolute image URL
  if (mainImage && !mainImage.startsWith('http')) {
    mainImage = `${siteUrl}/${mainImage.replace(/^\/+/, '')}`;
  }

  // Open Graph Image: the actual product image's complete, publicly accessible HTTPS URL
  const actualImageUrl = mainImage;
  const imageExt = actualImageUrl.split('?')[0].toLowerCase();
  const imageMime = imageExt.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />

  <!-- Open Graph / WhatsApp Preview Tags -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:image" content="${escapeHtml(actualImageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(actualImageUrl)}" />
  <meta property="og:image:type" content="${imageMime}" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="${escapeHtml(ogTitle)}" />
  <link rel="image_src" href="${escapeHtml(actualImageUrl)}" />
  <meta property="og:locale" content="en_IN" />

  <!-- Product Pricing Metadata -->
  <meta property="product:price:amount" content="${numericPrice}" />
  <meta property="product:price:currency" content="INR" />
  <meta property="og:price:amount" content="${numericPrice}" />
  <meta property="og:price:currency" content="INR" />

  <!-- Twitter Card Metadata -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(ogTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(actualImageUrl)}" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ${JSON.stringify(product ? cleanDisplayName(product.name) : siteName)},
    "image": [${JSON.stringify(mainImage)}],
    "description": ${JSON.stringify(description)},
    "offers": {
      "@type": "Offer",
      "url": ${JSON.stringify(pageUrl)},
      "priceCurrency": "INR",
      "price": ${JSON.stringify(numericPrice)},
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": ${JSON.stringify(siteName)}
      }
    }
  }
  </script>

  <!-- Immediate Client Redirection for Human Browsers -->
  <meta http-equiv="refresh" content="0;url=/product/${cleanId}" />
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f9fafb; color: #111827;">
  <div style="text-align: center; padding: 24px;">
    <h2>${escapeHtml(ogTitle)}</h2>
    <p>${escapeHtml(description)}</p>
    <p><a href="/product/${cleanId}" style="display: inline-block; padding: 12px 24px; background: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">View Product</a></p>
  </div>
  <script>
    if (window.location.pathname !== '/product/${cleanId}') {
      window.location.replace('/product/${cleanId}');
    }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  return res.status(200).send(html);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
