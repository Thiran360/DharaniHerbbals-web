// Service for managing Product Bundles, Combo Offers, and Ad Campaign Links

const STORAGE_KEY = 'dharani_bundle_offers';

/**
 * Default sample bundle configuration (Herbal Hair Care Combo)
 * Uses genuine product IDs from Dharani Herbals database:
 * - 1255: Chemparuthi Herbal Shampoo (₹70)
 * - 1238: Hibiscus Herbal Hair Oil (₹115)
 * - 1233: Hibiscus Hair Wash Powder (₹70)
 * Combined Regular Price: ₹255 | Offer Price: ₹219 | Savings: ₹36 (14% OFF)
 */
export const DEFAULT_BUNDLES = [
  {
    id: 'bundle-haircare-combo-1',
    slug: 'herbal-hair-care-combo',
    name: 'Herbal Hair Care Combo',
    tamil_name: 'மூலிகை கூந்தல் பராமரிப்பு காம்போ',
    tagline: 'Complete 3-Step Ayurvedic Hair Care Routine',
    description: 'An all-natural daily hair wellness ritual featuring Chemparuthi Shampoo, Hibiscus Herbal Hair Oil, and Traditional Hair Wash Powder to nourish roots, eliminate dandruff, and promote lustrous hair growth.',
    badge: 'BEST VALUE',
    badgeColor: 'emerald',
    items: [
      {
        productId: 1255,
        productName: 'Chemparuthi Herbal Shampoo',
        quantity: 1,
        fallbackPrice: 70,
        fallbackImage: 'https://vedanmart.com/images//hair/Hibiscus%20Shampoo.jpg'
      },
      {
        productId: 1238,
        productName: 'Hibiscus Herbal Hair Oil',
        quantity: 1,
        fallbackPrice: 115,
        fallbackImage: 'https://vedanmart.com/images/hair/Hibiscus%20Oil.jpg'
      },
      {
        productId: 1233,
        productName: 'Hibiscus Hair Wash Powder',
        quantity: 1,
        fallbackPrice: 70,
        fallbackImage: 'https://vedanmart.com/images/hair/HIBISCUS%20HAIRWASH%20POWDER.jpg'
      }
    ],
    offerPrice: 219,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    campaign: {
      title: 'Herbal Hair Care Festival — Flat 14% Off Combo',
      promoText: 'Say goodbye to harsh chemical shampoos! Switch to pure Siddha hair rejuvenation with our bestselling 3-in-1 combo.',
      ctaLabel: 'Claim Combo Offer',
      utmSource: 'meta_ads',
      utmMedium: 'instagram_story',
      utmCampaign: 'summer_haircare_revival_2026',
      utmContent: 'haircare_trio_v1'
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

/**
 * Get all configured bundles from storage, falling back to defaults
 */
export function getStoredBundles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored bundles:', err);
  }
  // Initialize with default configuration if none exists
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BUNDLES));
  } catch (e) {
    console.warn('Could not save default bundles to localStorage:', e);
  }
  return DEFAULT_BUNDLES;
}

/**
 * Save bundles array to local storage
 */
export function saveBundlesToStorage(bundles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bundles));
    window.dispatchEvent(new CustomEvent('dharani-bundles-updated', { detail: bundles }));
    return true;
  } catch (err) {
    console.error('Failed to save bundles to storage:', err);
    return false;
  }
}

/**
 * Helper to extract numeric price from product object
 */
export function parseProductPrice(product, fallback = 0) {
  if (!product) return fallback;
  if (typeof product.price === 'number') return product.price;
  if (typeof product.price === 'string') {
    const clean = product.price.replace(/[^\d.]/g, '');
    const num = parseFloat(clean);
    return !isNaN(num) ? num : fallback;
  }
  if (product.customer_price) {
    const num = parseFloat(product.customer_price);
    return !isNaN(num) ? num : fallback;
  }
  return fallback;
}

/**
 * Calculate dynamic regular price, savings, and discount percent based on actual store products
 */
export function calculateBundlePricing(bundleItems, allProducts = [], offerPrice = 0) {
  const productMap = new Map();
  (allProducts || []).forEach(p => {
    if (p && p.id !== undefined) {
      productMap.set(Number(p.id), p);
    }
  });

  let regularTotal = 0;
  const enrichedItems = (bundleItems || []).map(item => {
    const liveProd = productMap.get(Number(item.productId));
    const unitPrice = liveProd ? parseProductPrice(liveProd, item.fallbackPrice || 0) : (item.fallbackPrice || 0);
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const itemTotal = unitPrice * quantity;
    regularTotal += itemTotal;

    return {
      ...item,
      productId: Number(item.productId),
      name: liveProd?.name || item.productName || `Product #${item.productId}`,
      tamil_name: liveProd?.tamil_name || item.tamil_name || liveProd?.name || item.productName,
      image: liveProd?.image || item.fallbackImage || '',
      unitPrice,
      quantity,
      itemTotal
    };
  });

  const parsedOffer = Math.max(0, parseFloat(offerPrice) || 0);
  const savings = Math.max(0, regularTotal - parsedOffer);
  const discountPercent = regularTotal > 0 ? Math.round((savings / regularTotal) * 100) : 0;

  return {
    regularTotal: Math.round(regularTotal),
    offerPrice: Math.round(parsedOffer),
    savings: Math.round(savings),
    discountPercent,
    items: enrichedItems
  };
}

/**
 * Check whether a bundle is currently active according to its status and schedule dates
 */
export function isBundleActive(bundle) {
  if (!bundle || !bundle.isActive) return false;

  const todayStr = new Date().toISOString().split('T')[0];
  if (bundle.startDate && bundle.startDate > todayStr) {
    return false; // Not yet started
  }
  if (bundle.endDate && bundle.endDate < todayStr) {
    return false; // Expired
  }
  return true;
}

/**
 * Generate shareable advertising campaign URL with UTM tags
 */
export function generateCampaignUrl(bundle, customUtm = {}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.dharaniherbbals.in';
  const campaign = bundle.campaign || {};

  const utmSource = customUtm.utmSource || campaign.utmSource || 'meta_ads';
  const utmMedium = customUtm.utmMedium || campaign.utmMedium || 'instagram_story';
  const utmCampaign = customUtm.utmCampaign || campaign.utmCampaign || bundle.slug || 'combo_offer';
  const utmContent = customUtm.utmContent || campaign.utmContent || '';

  const params = new URLSearchParams();
  if (utmSource) params.set('utm_source', utmSource);
  if (utmMedium) params.set('utm_medium', utmMedium);
  if (utmCampaign) params.set('utm_campaign', utmCampaign);
  if (utmContent) params.set('utm_content', utmContent);

  const query = params.toString() ? `?${params.toString()}` : '';
  return `${origin}/combo/${bundle.id || bundle.slug}${query}`;
}

/**
 * Validate bundle creation / update input
 */
export function validateBundleInput(bundleData, allProducts = []) {
  const errors = [];

  if (!bundleData.name || !bundleData.name.trim()) {
    errors.push('Bundle name is required.');
  }

  if (!Array.isArray(bundleData.items) || bundleData.items.length < 2) {
    errors.push('A bundle must contain at least 2 distinct products.');
  }

  bundleData.items?.forEach((item, idx) => {
    if (!item.productId) {
      errors.push(`Item #${idx + 1} must have a selected product.`);
    }
    if (!item.quantity || item.quantity < 1) {
      errors.push(`Item #${idx + 1} quantity must be 1 or greater.`);
    }
  });

  const offerPrice = parseFloat(bundleData.offerPrice);
  if (isNaN(offerPrice) || offerPrice <= 0) {
    errors.push('Offer price must be greater than ₹0.');
  }

  const pricing = calculateBundlePricing(bundleData.items, allProducts, offerPrice);
  if (pricing.offerPrice >= pricing.regularTotal && pricing.regularTotal > 0) {
    errors.push(`Offer price (₹${pricing.offerPrice}) must be lower than the combined regular price (₹${pricing.regularTotal}) to constitute a combo discount.`);
  }

  if (bundleData.startDate && bundleData.endDate && bundleData.startDate > bundleData.endDate) {
    errors.push('Offer start date cannot be later than end date.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    pricing
  };
}
